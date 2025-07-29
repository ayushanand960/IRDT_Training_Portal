// import 'dart:convert';
// import 'package:http/http.dart' as http;
// import '../constants.dart';
// import 'package:shared_preferences/shared_preferences.dart';
//
// class ApiService {
//   /// POST request
//   static Future<http.Response> post(String endpoint, Map<String, dynamic> data) async {
//     final url = Uri.parse(baseUrl + endpoint);
//     return await http.post(
//       url,
//       headers: {"Content-Type": "application/json"},
//       body: jsonEncode(data),
//     );
//   }
//
//   /// GET request without token
//   static Future<http.Response> get(String endpoint) async {
//     final url = Uri.parse(baseUrl + endpoint);
//     return await http.get(
//       url,
//       headers: {"Content-Type": "application/json"},
//     );
//   }
//
//   /// GET with token and auto-refresh if expired
//   static Future<http.Response> getWithAuth(String endpoint) async {
//     final prefs = await SharedPreferences.getInstance();
//     String? accessToken = prefs.getString('access_Token');
//
//     if (accessToken == null) throw Exception('Access token missing');
//
//     final url = Uri.parse(baseUrl + endpoint);
//     http.Response response = await http.get(
//       url,
//       headers: {
//         'Authorization': 'Bearer $accessToken',
//         'Content-Type': 'application/json',
//       },
//     );
//
//     // If unauthorized, try refreshing token
//     if (response.statusCode == 401) {
//       final refreshed = await refreshAccessToken();
//       if (refreshed != null) {
//         accessToken = refreshed;
//         response = await http.get(
//           url,
//           headers: {
//             'Authorization': 'Bearer $accessToken',
//             'Content-Type': 'application/json',
//           },
//         );
//       }
//     }
//
//     return response;
//   }
//
//   /// Refresh token logic
//   static Future<String?> refreshAccessToken() async {
//     final prefs = await SharedPreferences.getInstance();
//     final refreshToken = prefs.getString('refreshToken');
//     if (refreshToken == null) return null;
//
//     final url = Uri.parse(baseUrl + 'token/refresh/'); // <-- adjust path if needed
//     final response = await http.post(
//       url,
//       headers: {'Content-Type': 'application/json'},
//       body: jsonEncode({'refresh': refreshToken}),
//     );
//
//     if (response.statusCode == 200) {
//       final data = jsonDecode(response.body);
//       final newAccess = data['access'];
//       await prefs.setString('access_Token', newAccess);
//       return newAccess;
//     }
//
//     return null;
//   }
//
//
//   static Future<List<dynamic>> fetchFilteredTrainings({String? venue, String? mode}) async {
//     final prefs = await SharedPreferences.getInstance();
//     final token = prefs.getString('access_Token'); // stored during login
//
//     final queryParameters = {
//       if (venue != null && venue.isNotEmpty) 'venue': venue,
//       if (mode != null && mode.isNotEmpty) 'mode': mode,
//     };
//
//     final uri = Uri.parse(baseUrl + 'trainings/').replace(queryParameters: queryParameters);
//
//     final response = await http.get(
//       uri,
//       headers: {
//         'Authorization': 'Bearer $token',
//         'Content-Type': 'application/json',
//       },
//     );
//
//     if (response.statusCode == 200) {
//       return jsonDecode(response.body);
//     } else {
//       throw Exception('Failed to load trainings');
//     }
//   }
//
//   static Future<String?> fetchSecurityQuestion(String ehrmsCode) async {
//     final url = Uri.parse('$baseUrl/api/get-security-question/$ehrmsCode/');
//     final response = await http.get(url);
//     if (response.statusCode == 200) {
//       final data = jsonDecode(response.body);
//       return data['security_question'];
//     } else {
//       return null;
//     }
//   }
//
//   static Future<bool> verifySecurityAnswer(String ehrmsCode, String answer) async {
//     final url = Uri.parse('$baseUrl/api/verify-security/');
//     final response = await http.post(
//       url,
//       headers: {'Content-Type': 'application/json'},
//       body: jsonEncode({
//         'ehrms_code': ehrmsCode,
//         'security_answer': answer,
//       }),
//     );
//     return response.statusCode == 200;
//   }
//
//   static Future<bool> resetPassword(String ehrmsCode, String newPassword) async {
//     final url = Uri.parse('$baseUrl/reset-password/');
//     final response = await http.post(
//       url,
//       headers: {'Content-Type': 'application/json'},
//       body: jsonEncode({
//         'ehrms_code': ehrmsCode,
//         'new_password': newPassword,
//       }),
//     );
//     return response.statusCode == 200;
//   }
//
// }
//
//
//

import 'dart:convert';
import 'package:http/http.dart' as http;
import '../constants.dart';

class ApiService {
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();

  final http.Client _client = http.Client(); // persistent client for cookies

  dynamic _handleResponse(http.Response response) {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return response.body.isNotEmpty ? jsonDecode(response.body) : null;
    } else {
      try {
        final error = jsonDecode(response.body);
        throw Exception(error['error'] ?? 'Something went wrong');
      } catch (_) {
        throw Exception('Error: ${response.statusCode}');
      }
    }
  }

  /// ------------------- AUTH -------------------
  Future<Map<String, dynamic>> login(String ehrmsCode, String password) async {
    final url = Uri.parse('$baseUrl/login/token/');
    final response = await _client.post(
      url,
      headers: {"Content-Type": "application/json"},
      body: jsonEncode({'ehrms_code': ehrmsCode, 'password': password}),
    );
    return _handleResponse(response); // returns decoded Map
  }

  Future<void> logout() async {
    final url = Uri.parse('$baseUrl/login/logout/');
    final response = await _client.post(url);
    _handleResponse(response);
  }

  Future<Map<String, dynamic>> fetchProfile() async {
    final url = Uri.parse('$baseUrl/login/user/profile/');
    final response = await _client.get(url);
    return _handleResponse(response);
  }

  /// Check if user is logged in (session still valid)
  Future<bool> isLoggedIn() async {
    try {
      final url = Uri.parse('$baseUrl/login/user/profile/');
      final response = await _client.get(url);
      return response.statusCode == 200;
    } catch (_) {
      return false;
    }
  }

  /// ------------------- REGISTRATION -------------------
  Future<void> registerUser(Map<String, dynamic> data) async {
    final url = Uri.parse('$baseUrl/register/');
    final response = await _client.post(
      url,
      headers: {"Content-Type": "application/json"},
      body: jsonEncode(data),
    );
    _handleResponse(response);

  }

  /// ------------------- SECURITY -------------------
  Future<String?> fetchSecurityQuestion(String ehrmsCode) async {
    final url = Uri.parse('$baseUrl/login/get-security-question/?ehrms_code=$ehrmsCode');
    final response = await _client.get(url);
    final data = _handleResponse(response);
    return data['security_question'];
  }

  Future<bool> verifySecurityAnswer(String ehrmsCode, String answer) async {
    final url = Uri.parse('$baseUrl/login/verify-security/');
    final response = await _client.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'ehrms_code': ehrmsCode, 'security_answer': answer}),
    );
    _handleResponse(response);
    return true; // if no exception, it's verified
  }

  Future<bool> resetPassword(String ehrmsCode, String newPassword) async {
    final url = Uri.parse('$baseUrl/login/reset-password/');
    final response = await _client.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'ehrms_code': ehrmsCode, 'new_password': newPassword}),
    );
    _handleResponse(response);  // throws if not 2xx
    return response.statusCode == 200;
  }


  /// ------------------- TRAININGS -------------------
  Future<List<dynamic>> fetchTrainings({String? venue, String? mode}) async {
    final queryParams = {
      if (venue != null && venue.isNotEmpty) 'venue': venue,
      if (mode != null && mode.isNotEmpty) 'mode': mode,
    };
    final uri = Uri.parse('$baseUrl/training/training-programs/').replace(queryParameters: queryParams);
    final response = await _client.get(uri);
    return _handleResponse(response);
  }

  Future<void> enrollInTraining(String trainingCode) async {
    final url = Uri.parse('$baseUrl/enrollment/enroll/');
    final response = await _client.post(
      url,
      headers: {"Content-Type": "application/json"},
      body: jsonEncode({'training_code': trainingCode}),
    );
    _handleResponse(response);
  }

  Future<List<dynamic>> fetchMyEnrollments() async {
    final url = Uri.parse('$baseUrl/enrollment/my-enrollments/');
    final response = await _client.get(url);
    return _handleResponse(response);
  }

  Future<List<dynamic>> fetchMyCertificates() async {
    final url = Uri.parse('$baseUrl/certificate/my-certificates/');
    final response = await _client.get(url);
    return _handleResponse(response);
  }

  Future<http.Response> downloadCertificate(String trainingCode) async {
    final url = Uri.parse('$baseUrl/certificate/download/$trainingCode/');
    return await _client.get(url); // binary file
  }
}
