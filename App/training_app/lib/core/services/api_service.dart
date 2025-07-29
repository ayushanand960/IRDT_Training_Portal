import 'dart:convert';
import 'package:http/http.dart' as http;
import '../constants.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  /// POST request
  static Future<http.Response> post(String endpoint, Map<String, dynamic> data) async {
    final url = Uri.parse(baseUrl + endpoint);
    return await http.post(
      url,
      headers: {"Content-Type": "application/json"},
      body: jsonEncode(data),
    );
  }

  /// GET request without token
  static Future<http.Response> get(String endpoint) async {
    final url = Uri.parse(baseUrl + endpoint);
    return await http.get(
      url,
      headers: {"Content-Type": "application/json"},
    );
  }

  /// GET with token and auto-refresh if expired
  static Future<http.Response> getWithAuth(String endpoint) async {
    final prefs = await SharedPreferences.getInstance();
    String? accessToken = prefs.getString('access_Token');

    if (accessToken == null) throw Exception('Access token missing');

    final url = Uri.parse(baseUrl + endpoint);
    http.Response response = await http.get(
      url,
      headers: {
        'Authorization': 'Bearer $accessToken',
        'Content-Type': 'application/json',
      },
    );

    // If unauthorized, try refreshing token
    if (response.statusCode == 401) {
      final refreshed = await refreshAccessToken();
      if (refreshed != null) {
        accessToken = refreshed;
        response = await http.get(
          url,
          headers: {
            'Authorization': 'Bearer $accessToken',
            'Content-Type': 'application/json',
          },
        );
      }
    }

    return response;
  }

  /// Refresh token logic
  static Future<String?> refreshAccessToken() async {
    final prefs = await SharedPreferences.getInstance();
    final refreshToken = prefs.getString('refreshToken');
    if (refreshToken == null) return null;

    final url = Uri.parse(baseUrl + 'token/refresh/'); // <-- adjust path if needed
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'refresh': refreshToken}),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      final newAccess = data['access'];
      await prefs.setString('access_Token', newAccess);
      return newAccess;
    }

    return null;
  }


  static Future<List<dynamic>> fetchFilteredTrainings({String? venue, String? mode}) async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('access_Token'); // stored during login

    final queryParameters = {
      if (venue != null && venue.isNotEmpty) 'venue': venue,
      if (mode != null && mode.isNotEmpty) 'mode': mode,
    };

    final uri = Uri.parse(baseUrl + 'trainings/').replace(queryParameters: queryParameters);

    final response = await http.get(
      uri,
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to load trainings');
    }
  }

  static Future<String?> fetchSecurityQuestion(String ehrmsCode) async {
    final url = Uri.parse('$baseUrl/api/get-security-question/$ehrmsCode/');
    final response = await http.get(url);
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['security_question'];
    } else {
      return null;
    }
  }

  static Future<bool> verifySecurityAnswer(String ehrmsCode, String answer) async {
    final url = Uri.parse('$baseUrl/api/verify-security/');
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'ehrms_code': ehrmsCode,
        'security_answer': answer,
      }),
    );
    return response.statusCode == 200;
  }

  static Future<bool> resetPassword(String ehrmsCode, String newPassword) async {
    final url = Uri.parse('$baseUrl/reset-password/');
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'ehrms_code': ehrmsCode,
        'new_password': newPassword,
      }),
    );
    return response.statusCode == 200;
  }

}



