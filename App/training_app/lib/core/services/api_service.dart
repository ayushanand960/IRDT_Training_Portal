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
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:cookie_jar/cookie_jar.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../constants.dart';

class ApiService {
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();

  final http.Client _client = http.Client();
  final CookieJar _cookieJar = CookieJar();

  /// ---------------- INIT & COOKIE PERSIST ----------------
  Future<void> init() async {
    final prefs = await SharedPreferences.getInstance();
    final cookies = prefs.getStringList('cookies') ?? [];
    final uri = Uri.parse(baseUrl);
    for (var c in cookies) {
      try {
        _cookieJar.saveFromResponse(uri, [Cookie.fromSetCookieValue(c)]);
      } catch (_) {}
    }
  }

  Future<void> _saveCookies(Uri uri) async {
    final cookies = await _cookieJar.loadForRequest(uri);
    final prefs = await SharedPreferences.getInstance();
    await prefs.setStringList('cookies', cookies.map((c) => c.toString()).toList());
  }

  Future<void> _forceLogout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
    _cookieJar.deleteAll();
  }

  /// ---------------- HANDLE RESPONSE ----------------
  Future<dynamic> _handleResponse(http.Response response, Uri uri) async {
    if (response.statusCode == 401) {
      // Try auto-refresh
      final refreshed = await _refreshToken();
      if (refreshed) {
        // Retry the same request after refreshing
        throw Exception("_retry"); // Special signal to retry
      } else {
        await _forceLogout();
        throw Exception("Session expired. Please login again.");
      }
    }
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

  /// ---------------- AUTO REFRESH TOKEN ----------------
  Future<bool> _refreshToken() async {
    final url = Uri.parse('$baseUrl/login/token/refresh/');
    try {
      final response = await _sendWithCookies(() => _client.post(url), url, save: true);
      if (response.statusCode == 200) {
        return true;
      }
    } catch (_) {}
    return false;
  }

  /// ---------------- SEND REQUEST WITH COOKIES ----------------
  Future<http.Response> _sendWithCookies(
      Future<http.Response> Function() request, Uri uri, {bool save = true}) async {
    // Load saved cookies
    final cookies = await _cookieJar.loadForRequest(uri);
    final cookieHeader = cookies.map((c) => '${c.name}=${c.value}').join('; ');

    final response = await request().then((res) async {
      if (res.headers['set-cookie'] != null && save) {
        _cookieJar.saveFromResponse(uri, [Cookie.fromSetCookieValue(res.headers['set-cookie']!)]);
        await _saveCookies(uri);
      }
      return res;
    });
    return response;
  }

  /// Generic wrapper: handles retry after refresh
  Future<dynamic> _requestWithRetry(Future<http.Response> Function() request, Uri uri) async {
    try {
      final response = await _sendWithCookies(request, uri);
      return await _handleResponse(response, uri);
    } catch (e) {
      if (e.toString() == "_retry") {
        final response2 = await _sendWithCookies(request, uri);
        return await _handleResponse(response2, uri);
      } else {
        rethrow;
      }
    }
  }

  /// ---------------- AUTH ----------------
  Future<void> login(String ehrmsCode, String password) async {
    final url = Uri.parse('$baseUrl/login/token/');
    await _requestWithRetry(
          () => _client.post(
        url,
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({'ehrms_code': ehrmsCode, 'password': password}),
      ),
      url,
    );
  }

  Future<void> logout() async {
    final url = Uri.parse('$baseUrl/login/logout/');
    await _sendWithCookies(() => _client.post(url), url);
    await _forceLogout();
  }

  Future<Map<String, dynamic>> fetchProfile() async {
    final url = Uri.parse('$baseUrl/login/user/profile/');
    return await _requestWithRetry(() => _client.get(url), url);
  }

  Future<bool> isLoggedIn() async {
    try {
      final url = Uri.parse('$baseUrl/login/auth/check/');
      final response = await _sendWithCookies(() => _client.get(url), url);
      return response.statusCode == 200;
    } catch (_) {
      return false;
    }
  }

  /// ---------------- REGISTRATION ----------------
  Future<void> registerUser(Map<String, dynamic> data) async {
    final url = Uri.parse('$baseUrl/register/');
    await _requestWithRetry(
          () => _client.post(
        url,
        headers: {"Content-Type": "application/json"},
        body: jsonEncode(data),
      ),
      url,
    );
  }

  /// ---------------- SECURITY ----------------
  Future<String?> fetchSecurityQuestion(String ehrmsCode) async {
    final url = Uri.parse('$baseUrl/login/get-security-question/');
    final data = await _requestWithRetry(
          () => _client.post(
        url,
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({'ehrms_code': ehrmsCode}),
      ),
      url,
    );
    return data['security_question'];
  }

  Future<bool> verifySecurityAnswer(String ehrmsCode, String answer) async {
    final url = Uri.parse('$baseUrl/login/verify-security/');
    await _requestWithRetry(
          () => _client.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'ehrms_code': ehrmsCode, 'security_answer': answer}),
      ),
      url,
    );
    return true;
  }

  Future<bool> resetPassword(String ehrmsCode, String newPassword) async {
    final url = Uri.parse('$baseUrl/login/reset-password/');
    final response = await _sendWithCookies(
          () => _client.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'ehrms_code': ehrmsCode, 'new_password': newPassword}),
      ),
      url,
    );
    return response.statusCode == 200;
  }

  /// ---------------- TRAININGS ----------------
  Future<List<dynamic>> fetchTrainings({String? venue, String? mode}) async {
    final queryParams = {
      if (venue != null && venue.isNotEmpty) 'venue': venue,
      if (mode != null && mode.isNotEmpty) 'mode': mode,
    };
    final uri = Uri.parse('$baseUrl/training/training-programs/')
        .replace(queryParameters: queryParams);
    return await _requestWithRetry(() => _client.get(uri), uri);
  }

  Future<void> enrollInTraining(String trainingCode) async {
    final url = Uri.parse('$baseUrl/enrollment/enroll/');
    await _requestWithRetry(
          () => _client.post(
        url,
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({'training_code': trainingCode}),
      ),
      url,
    );
  }

  Future<List<dynamic>> fetchMyEnrollments() async {
    final url = Uri.parse('$baseUrl/enrollment/my-enrollments/');
    return await _requestWithRetry(() => _client.get(url), url);
  }

  Future<List<dynamic>> fetchMyCertificates() async {
    final url = Uri.parse('$baseUrl/certificate/my-certificates/');
    return await _requestWithRetry(() => _client.get(url), url);
  }

  Future<http.Response> downloadCertificate(String trainingCode) async {
    final url = Uri.parse('$baseUrl/certificate/download/$trainingCode/');
    return await _sendWithCookies(() => _client.get(url), url);
  }
}
