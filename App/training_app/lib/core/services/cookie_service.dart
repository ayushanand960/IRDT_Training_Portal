import 'package:http/http.dart' as http;

class CookieService {
  static String? sessionId;
  static String? csrfToken;

  static Map<String, String> get headers {
    final h = <String, String>{};
    if (sessionId != null) h['Cookie'] = 'sessionid=$sessionId; csrftoken=$csrfToken';
    if (csrfToken != null) h['X-CSRFToken'] = csrfToken!;
    return h;
  }

  static Future<http.Response> get(Uri url) async {
    return await http.get(url, headers: headers);
  }

  static Future<http.Response> post(Uri url, {Map<String, String>? body}) async {
    return await http.post(url, headers: headers, body: body);
  }

  static void saveCookies(http.Response response) {
    final rawCookie = response.headers['set-cookie'];
    if (rawCookie != null) {
      final cookies = rawCookie.split(';');
      for (var cookie in cookies) {
        if (cookie.trim().startsWith('sessionid=')) {
          sessionId = cookie.trim().split('=')[1];
        } else if (cookie.trim().startsWith('csrftoken=')) {
          csrfToken = cookie.trim().split('=')[1];
        }
      }
    }
  }
}
