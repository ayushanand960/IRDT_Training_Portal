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
// import 'dart:convert';
// import 'dart:io';
// import 'package:http/http.dart' as http;
// import 'package:cookie_jar/cookie_jar.dart';
// import 'package:shared_preferences/shared_preferences.dart';
// import '../constants.dart';

// class ApiService {
//   static final ApiService _instance = ApiService._internal();
//   factory ApiService() => _instance;
//   ApiService._internal();

//   final http.Client _client = http.Client();
//   final CookieJar _cookieJar = CookieJar();

//   /// ---------------- INIT & COOKIE PERSIST ----------------
//   Future<void> init() async {
//     final prefs = await SharedPreferences.getInstance();
//     final cookies = prefs.getStringList('cookies') ?? [];
//     final uri = Uri.parse(baseUrl);
//     for (var c in cookies) {
//       try {
//         _cookieJar.saveFromResponse(uri, [Cookie.fromSetCookieValue(c)]);
//       } catch (_) {}
//     }
//   }

//   Future<void> _saveCookies(Uri uri) async {
//     final cookies = await _cookieJar.loadForRequest(uri);
//     final prefs = await SharedPreferences.getInstance();
//     await prefs.setStringList('cookies', cookies.map((c) => c.toString()).toList());
//   }

//   Future<void> _forceLogout() async {
//     final prefs = await SharedPreferences.getInstance();
//     await prefs.clear();
//     _cookieJar.deleteAll();
//   }

//   /// ---------------- HANDLE RESPONSE ----------------
//   Future<dynamic> _handleResponse(http.Response response, Uri uri) async {
//     if (response.statusCode == 401) {
//       // Try auto-refresh
//       final refreshed = await _refreshToken();
//       if (refreshed) {
//         // Retry the same request after refreshing
//         throw Exception("_retry"); // Special signal to retry
//       } else {
//         await _forceLogout();
//         throw Exception("Session expired. Please login again.");
//       }
//     }
//     if (response.statusCode >= 200 && response.statusCode < 300) {
//       return response.body.isNotEmpty ? jsonDecode(response.body) : null;
//     } else {
//       try {
//         final error = jsonDecode(response.body);
//         throw Exception(error['error'] ?? 'Something went wrong');
//       } catch (_) {
//         throw Exception('Error: ${response.statusCode}');
//       }
//     }
//   }

//   /// ---------------- AUTO REFRESH TOKEN ----------------
//   Future<bool> _refreshToken() async {
//     final url = Uri.parse('$baseUrl/login/token/refresh/');
//     try {
//       final response = await _sendWithCookies(() => _client.post(url), url, save: true);
//       if (response.statusCode == 200) {
//         return true;
//       }
//     } catch (_) {}
//     return false;
//   }

//   /// ---------------- SEND REQUEST WITH COOKIES ----------------
//   Future<http.Response> _sendWithCookies(
//       Future<http.Response> Function() request, Uri uri, {bool save = true}) async {
//     // Load saved cookies
//     final cookies = await _cookieJar.loadForRequest(uri);
//     final cookieHeader = cookies.map((c) => '${c.name}=${c.value}').join('; ');

//     final response = await request().then((res) async {
//       if (res.headers['set-cookie'] != null && save) {
//         _cookieJar.saveFromResponse(uri, [Cookie.fromSetCookieValue(res.headers['set-cookie']!)]);
//         await _saveCookies(uri);
//       }
//       return res;
//     });
//     return response;
//   }

//   /// Generic wrapper: handles retry after refresh
//   Future<dynamic> _requestWithRetry(Future<http.Response> Function() request, Uri uri) async {
//     try {
//       final response = await _sendWithCookies(request, uri);
//       return await _handleResponse(response, uri);
//     } catch (e) {
//       if (e.toString() == "_retry") {
//         final response2 = await _sendWithCookies(request, uri);
//         return await _handleResponse(response2, uri);
//       } else {
//         rethrow;
//       }
//     }
//   }

//   /// ---------------- AUTH ----------------
//   Future<void> login(String ehrmsCode, String password) async {
//     final url = Uri.parse('$baseUrl/login/token/');
//     await _requestWithRetry(
//           () => _client.post(
//         url,
//         headers: {"Content-Type": "application/json"},
//         body: jsonEncode({'ehrms_code': ehrmsCode, 'password': password}),
//       ),
//       url,
//     );
//   }

//   Future<void> logout() async {
//     final url = Uri.parse('$baseUrl/login/logout/');
//     await _sendWithCookies(() => _client.post(url), url);
//     await _forceLogout();
//   }

//   Future<Map<String, dynamic>> fetchProfile() async {
//     final url = Uri.parse('$baseUrl/login/user/profile/');
//     return await _requestWithRetry(() => _client.get(url), url);
//   }

//   Future<bool> isLoggedIn() async {
//     try {
//       final url = Uri.parse('$baseUrl/login/auth/check/');
//       final response = await _sendWithCookies(() => _client.get(url), url);
//       return response.statusCode == 200;
//     } catch (_) {
//       return false;
//     }
//   }

//   /// ---------------- REGISTRATION ----------------
//   Future<void> registerUser(Map<String, dynamic> data) async {
//     final url = Uri.parse('$baseUrl/register/');
//     await _requestWithRetry(
//           () => _client.post(
//         url,
//         headers: {"Content-Type": "application/json"},
//         body: jsonEncode(data),
//       ),
//       url,
//     );
//   }

//   /// ---------------- SECURITY ----------------
//   Future<String?> fetchSecurityQuestion(String ehrmsCode) async {
//     final url = Uri.parse('$baseUrl/login/get-security-question/');
//     final data = await _requestWithRetry(
//           () => _client.post(
//         url,
//         headers: {"Content-Type": "application/json"},
//         body: jsonEncode({'ehrms_code': ehrmsCode}),
//       ),
//       url,
//     );
//     return data['security_question'];
//   }

//   Future<bool> verifySecurityAnswer(String ehrmsCode, String answer) async {
//     final url = Uri.parse('$baseUrl/login/verify-security/');
//     await _requestWithRetry(
//           () => _client.post(
//         url,
//         headers: {'Content-Type': 'application/json'},
//         body: jsonEncode({'ehrms_code': ehrmsCode, 'security_answer': answer}),
//       ),
//       url,
//     );
//     return true;
//   }

//   Future<bool> resetPassword(String ehrmsCode, String newPassword) async {
//     final url = Uri.parse('$baseUrl/login/reset-password/');
//     final response = await _sendWithCookies(
//           () => _client.post(
//         url,
//         headers: {'Content-Type': 'application/json'},
//         body: jsonEncode({'ehrms_code': ehrmsCode, 'new_password': newPassword}),
//       ),
//       url,
//     );
//     return response.statusCode == 200;
//   }

//   /// ---------------- TRAININGS ----------------
//   Future<List<dynamic>> fetchTrainings({String? venue, String? mode}) async {
//     final queryParams = {
//       if (venue != null && venue.isNotEmpty) 'venue': venue,
//       if (mode != null && mode.isNotEmpty) 'mode': mode,
//     };
//     final uri = Uri.parse('$baseUrl/training/training-programs/')
//         .replace(queryParameters: queryParams);
//     return await _requestWithRetry(() => _client.get(uri), uri);
//   }

//   Future<void> enrollInTraining(String trainingCode) async {
//     final url = Uri.parse('$baseUrl/enrollment/enroll/');
//     await _requestWithRetry(
//           () => _client.post(
//         url,
//         headers: {"Content-Type": "application/json"},
//         body: jsonEncode({'training_code': trainingCode}),
//       ),
//       url,
//     );
//   }

//   Future<List<dynamic>> fetchMyEnrollments() async {
//     final url = Uri.parse('$baseUrl/enrollment/my-enrollments/');
//     return await _requestWithRetry(() => _client.get(url), url);
//   }

//   Future<List<dynamic>> fetchMyCertificates() async {
//     final url = Uri.parse('$baseUrl/certificate/my-certificates/');
//     return await _requestWithRetry(() => _client.get(url), url);
//   }

//   Future<http.Response> downloadCertificate(String trainingCode) async {
//     final url = Uri.parse('$baseUrl/certificate/download/$trainingCode/');
//     return await _sendWithCookies(() => _client.get(url), url);
//   }
// }

import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:path_provider/path_provider.dart';
import '../constants.dart';

class ApiService {
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal() {
    _loadCookies();
  }

  final http.Client _client = http.Client();
  Map<String, String> _cookies = {};

  /// Explicitly load cookies (call this on app start)
  Future<void> loadCookies() async {
    final prefs = await SharedPreferences.getInstance();
    final stored = prefs.getString('cookies');
    if (stored != null) {
      _cookies = Map<String, String>.from(jsonDecode(stored));
    }
  }

  /// Load cookies from storage
  Future<void> _loadCookies() async {
    final prefs = await SharedPreferences.getInstance();
    final stored = prefs.getString('cookies');
    if (stored != null) {
      _cookies = Map<String, String>.from(jsonDecode(stored));
    }
  }

  /// Save cookies to storage
  Future<void> _saveCookies() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('cookies', jsonEncode(_cookies));
  }

  /// Update cookies from Set-Cookie header
  Future<void> _updateCookies(http.Response response) async {
    final rawCookies = response.headers['set-cookie'];
    if (rawCookies != null) {
      final cookies = rawCookies.split(RegExp(r',(?! )')); // split safely
      for (var cookie in cookies) {
        var parts = cookie.split(';')[0].split('=');
        if (parts.length == 2) {
          _cookies[parts[0].trim()] = parts[1];
        }
      }
      await _saveCookies();
    }
  }

  /// Add cookies to request headers
  Map<String, String> _headers({bool withCookies = false, bool isJson = true}) {
    final headers = <String, String>{};
    if (isJson) headers['Content-Type'] = 'application/json';
    if (withCookies && _cookies.isNotEmpty) {
      headers['Cookie'] = _cookies.entries
          .map((e) => "${e.key}=${e.value}")
          .join('; ');
    }
    return headers;
  }

  /// Save user details locally
  Future<void> _saveUserData(Map<String, dynamic> data) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('ehrms_code', data['ehrms_code'] ?? '');
    await prefs.setString('name', data['first_name'] ?? '');
    await prefs.setBool('is_superuser', data['is_superuser'] ?? false);
    await prefs.setBool('is_coordinator', data['is_coordinator'] ?? false);
    if (data.containsKey('profile_picture')) {
      await prefs.setString('profile_photo_url', data['profile_picture'] ?? '');
    }
  }

  /// Clear user data + cookies
  Future<void> _clearUserData() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
    _cookies.clear();
  }

  // ==================== AUTH ====================

  Future<bool> login(String ehrmsCode, String password) async {
    final url = Uri.parse("${baseUrl}login/token/");
    final response = await _client.post(
      url,
      headers: _headers(),
      body: jsonEncode({"ehrms_code": ehrmsCode, "password": password}),
    );

    if (response.statusCode == 200) {
      await _updateCookies(response);
      final responseData = jsonDecode(response.body);
      responseData['ehrms_code'] = ehrmsCode;
      await _saveUserData(responseData);
      return true;
    }
    return false;
  }

  Future<void> logout() async {
    final url = Uri.parse("${baseUrl}login/logout/");
    if (_cookies.isNotEmpty) {
      try {
        await _client.post(url, headers: _headers(withCookies: true));
      } catch (e) {
        // optional: log error or ignore
      }
    }
    await _clearUserData(); // always clear local data
  }

  Future<bool> checkAuth() async {
    final url = Uri.parse("${baseUrl}login/auth/check/");
    final response = await _client.get(
      url,
      headers: _headers(withCookies: true),
    );
    return response.statusCode == 200;
  }

  // ==================== PROFILE ====================

  Future<Map<String, dynamic>?> getProfile() async {
    final url = Uri.parse("${baseUrl}login/user/profile/");
    final response = await _client.get(
      url,
      headers: _headers(withCookies: true),
    );
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }
    return null;
  }

  // Future<String?> uploadPhoto(File photo) async {
  //   final url = Uri.parse("${baseUrl}login/profile/upload-photo/");
  //   final request = http.MultipartRequest('POST', url);
  //   request.headers.addAll(_headers(withCookies: true, isJson: false));
  //   request.files.add(await http.MultipartFile.fromPath('photo', photo.path));

  //   final streamedResponse = await request.send();
  //   final response = await http.Response.fromStream(streamedResponse);

  //   if (response.statusCode == 200) {
  //     final data = jsonDecode(response.body);
  //     final prefs = await SharedPreferences.getInstance();
  //     await prefs.setString('profile_photo_url', data['photo']);
  //     return data['photo'];
  //   }
  //   return null;
  // }

  // Future<String?> removePhoto() async {
  //   final url = Uri.parse("${baseUrl}login/profile/remove-photo/");
  //   final response = await _client.delete(
  //     url,
  //     headers: _headers(withCookies: true),
  //   );
  //   if (response.statusCode == 200) {
  //     final data = jsonDecode(response.body);
  //     final prefs = await SharedPreferences.getInstance();
  //     await prefs.setString('profile_photo_url', data['photo']);
  //     return data['photo'];
  //   }
  //   return null;
  // }

  Future<String?> uploadPhoto(File photo) async {
    final url = Uri.parse("${baseUrl}login/upload-profile-picture/");
    final request = http.MultipartRequest('PUT', url);
    request.headers.addAll(_headers(withCookies: true, isJson: false));
    request.files.add(
      await http.MultipartFile.fromPath('profile_picture', photo.path),
    );

    final streamedResponse = await request.send();
    final response = await http.Response.fromStream(streamedResponse);

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      final newUrl = (data['url'] as String?) ?? '';
      if (newUrl.isNotEmpty) {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('profile_photo_url', newUrl);
        return newUrl;
      }
    }
    return null;
  }

  Future<String?> removePhoto() async {
    final url = Uri.parse("${baseUrl}login/remove-profile-picture/");
    final response = await _client.delete(
      url,
      headers: _headers(withCookies: true),
    );
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      final newUrl = (data['url'] as String?) ?? '';
      if (newUrl.isNotEmpty) {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('profile_photo_url', newUrl);
        return newUrl;
      }
    }
    return null;
  }

  // ==================== PASSWORD RESET ====================

  Future<bool> resetPassword(String ehrmsCode, String newPassword) async {
    final url = Uri.parse("${baseUrl}login/reset-password/");
    final response = await _client.post(
      url,
      headers: _headers(),
      body: jsonEncode({"ehrms_code": ehrmsCode, "new_password": newPassword}),
    );
    return response.statusCode == 200;
  }

  Future<String?> getSecurityQuestion(String ehrmsCode) async {
    final url = Uri.parse("${baseUrl}login/get-security-question/");
    final response = await _client.post(
      url,
      headers: _headers(),
      body: jsonEncode({"ehrms_code": ehrmsCode}),
    );
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['security_question'];
    }
    return null;
  }

  Future<bool> verifySecurityAnswer(String ehrmsCode, String answer) async {
    final url = Uri.parse("${baseUrl}login/verify-security/");
    final response = await _client.post(
      url,
      headers: _headers(withCookies: false), //
      body: jsonEncode({"ehrms_code": ehrmsCode, "security_answer": answer}),
    );
    return response.statusCode == 200;
  }

  // ==================== REGISTER ====================

  Future<void> registerUser(Map<String, dynamic> payload) async {
    final url = Uri.parse("${baseUrl}login/register/");
    final response = await _client.post(
      url,
      headers: _headers(),
      body: jsonEncode(payload),
    );

    // if (response.statusCode != 200 && response.statusCode != 201) {
    //   try {
    //     final errorData = jsonDecode(response.body);
    //     throw Exception(errorData['detail'] ?? "Registration failed");
    //   } catch (_) {
    //     throw Exception("Registration failed. Please try again.");
    //   }
    // }

    if (response.statusCode != 200 && response.statusCode != 201) {
      try {
        final errorData = jsonDecode(response.body);

        if (errorData is Map<String, dynamic>) {
          // If backend sends field-specific errors as lists
          final errors = errorData.entries
              .where((entry) => entry.value is List)
              .map((entry) => (entry.value as List).join(', '))
              .join('\n');

          if (errors.isNotEmpty) {
            throw Exception(errors);
          } else if (errorData.containsKey('detail')) {
            throw Exception(errorData['detail']);
          }
        } else if (errorData is String) {
          throw Exception(errorData);
        }

        throw Exception("Registration failed");
      } catch (_) {
        throw Exception("Registration failed. Please try again.");
      }
    }
  }

  // ==================== TRAINING ENROLLMENT ====================

  Future<List<dynamic>> getTrainings() async {
    final url = Uri.parse("${baseUrl}training/training-programs/");
    final response = await _client.get(
      url,
      headers: _headers(withCookies: true),
    );
    if (response.statusCode == 200) {
      return jsonDecode(response.body) as List;
    } else if (response.statusCode == 401) {
      throw Exception("Unauthorized: Please log in again.");
    }
    throw Exception("Failed to fetch trainings");
  }

  Future<List<String>> getMyEnrollments() async {
    final url = Uri.parse("${baseUrl}enrollment/my-enrollments/");
    final response = await _client.get(
      url,
      headers: _headers(withCookies: true),
    );
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body) as List;
      // Extract training codes
      return data.map((e) => e['training'].toString()).toList();
    }
    throw Exception("Failed to load enrollments");
  }

  Future<bool> enrollTraining(String ehrmsCode, String trainingCode) async {
    final url = Uri.parse("${baseUrl}enrollment/enroll/");
    final response = await _client.post(
      url,
      headers: _headers(withCookies: true),
      body: jsonEncode({"trainee": ehrmsCode, "training": trainingCode}),
    );

    if (response.statusCode == 201) {
      return true;
    } else {
      try {
        final error = jsonDecode(response.body);

        String message = '';
        if (error is Map) {
          if (error.containsKey('non_field_errors')) {
            message = (error['non_field_errors'] as List).join('\n');
          } else if (error.containsKey('detail')) {
            message = error['detail'];
          } else {
            // Combine all field errors
            message = error.values
                .map((e) => e is List ? e.join(', ') : e.toString())
                .join('\n');
          }
        } else if (error is List) {
          message = error.join('\n');
        } else {
          message = "Enrollment failed";
        }

        throw Exception(message);
      } catch (_) {
        throw Exception("Enrollment failed. Please try again.");
      }
    }
  }

  // ==================== CERTIFICATES ====================

  /// Fetch logged-in user's certificates
  Future<List<dynamic>> getCertificates() async {
    final url = Uri.parse("${baseUrl}certificate/my-certificates/");
    final response = await _client.get(
      url,
      headers: _headers(withCookies: true),
    );
    if (response.statusCode == 200) {
      return jsonDecode(response.body) as List;
    } else if (response.statusCode == 401) {
      throw Exception("Unauthorized: Please log in again.");
    }
    throw Exception("Failed to fetch certificates");
  }

  /// Download a certificate PDF by training code
  Future<File> downloadCertificate(
    String trainingCode,
    String saveFileName,
  ) async {
    final url = Uri.parse("${baseUrl}certificate/download/$trainingCode/");
    final request = await _client.get(
      url,
      headers: _headers(
        withCookies: true,
        isJson: false,
      ), // PDF download, no JSON header
    );

    if (request.statusCode == 200) {
      final bytes = request.bodyBytes;
      final dir = await getApplicationDocumentsDirectory();
      final file = File('${dir.path}/$saveFileName');
      await file.writeAsBytes(bytes);
      return file;
    } else if (request.statusCode == 404) {
      throw Exception("Certificate not found.");
    } else if (request.statusCode == 401) {
      throw Exception("Unauthorized: Please log in again.");
    }
    throw Exception("Failed to download certificate");
  }

  /// Fetch all rejection notifications for the logged-in user
  Future<List<dynamic>> getRejectionNotifications() async {
    final url = Uri.parse('$baseUrl/training/notification/rejections/');
    final response = await _client.get(
      url,
      headers: _headers(withCookies: true),
    );

    await _updateCookies(response);

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to load notifications');
    }
  }

  /// Mark a specific rejection notification as read
  Future<void> markRejectionAsRead(int id) async {
    final url = Uri.parse(
      '$baseUrl/training/notification/rejections/$id/read/',
    );
    final response = await _client.post(
      url,
      headers: _headers(withCookies: true),
    );

    await _updateCookies(response);

    if (response.statusCode != 200) {
      throw Exception('Failed to mark notification as read');
    }
  }

  /// Delete a specific rejection notification
  Future<void> deleteRejectionNotification(int id) async {
    final url = Uri.parse(
      '$baseUrl/training/notification/rejections/$id/delete/',
    );
    final response = await _client.delete(
      url,
      headers: _headers(withCookies: true),
    );

    await _updateCookies(response);

    if (response.statusCode != 200 && response.statusCode != 204) {
      throw Exception('Failed to delete notification');
    }
  }
}
