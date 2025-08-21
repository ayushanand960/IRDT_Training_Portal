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
    await prefs.setString('name', data['name'] ?? data['name'] ?? '');
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

  Future<bool> updateUser(
    String ehrmsCode,
    Map<String, dynamic> updates,
  ) async {
    try {
      final url = Uri.parse("${baseUrl}login/users/$ehrmsCode/");
      final response = await _client.put(
        url,
        headers: _headers(withCookies: true), // send cookies for auth
        body: jsonEncode(updates),
      );

      if (response.statusCode == 200) {
        // Optionally update locally stored user data if keys match
        final data = jsonDecode(response.body) as Map<String, dynamic>;
        await _saveUserData(data);
        return true;
      } else {
        final errorData = jsonDecode(response.body);
        print("Update user failed: $errorData");
        return false;
      }
    } catch (e) {
      print("Update user error: $e");
      return false;
    }
  }
}
