import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../../widgets/ui_helpers.dart';
import 'reset_password_screen.dart';
import '../../core/constants.dart';
import 'package:shared_preferences/shared_preferences.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});
  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final ehrmsController = TextEditingController();
  final passwordController = TextEditingController();

  void loginUser() async {
    final ehrms = ehrmsController.text.trim();
    final password = passwordController.text.trim();

    if (ehrms.isEmpty || password.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Please enter both EHRMS Code and Password")),
      );
      return;
    }

    final response = await http.post(
      Uri.parse("$baseUrl/login/"),
      headers: {"Content-Type": "application/json"},
      body: jsonEncode({"ehrms_code": ehrms, "password": password}),
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      final token = data['access'];
      final refreshToken = data['refresh'];
      final fullName = data['full_name'];
      final ehrmsCode = data['ehrms_code'];
      // final photoUrl=data['profile_photo_url'];

      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('access', token);
      await prefs.setString('refresh', refreshToken);
      await prefs.setString('ehrms_code', ehrmsCode);
      await prefs.setString('full_Name', fullName);
      // await prefs.setString('profile_photo_url', photoUrl);

      //  Fetch profile using token and store name/photo/email
      final profileResponse = await http.get(
        Uri.parse('$baseUrl/profile/$ehrmsCode/'),
        headers: {'Authorization': 'Bearer $token'},
      );

      if (profileResponse.statusCode == 200) {
        final profile = json.decode(profileResponse.body);
        final fullName = profile['full_name'];
        final photoUrl = profile['photo']; // 📷 URL from backend

        await prefs.setString('full_Name', fullName);
        await prefs.setString('profile_photo_url', photoUrl ?? '');
      } else {
        await prefs.setString('full_Name', 'User');
        await prefs.setString('profile_photo_url', '');

      }
      print("Saved token after login: $token");
      // TODO: Store token securely for future API calls
      // You can use SharedPreferences or a state management approach

      Navigator.pushReplacementNamed(
        context,
        '/login-home',
        arguments: {
          'token': token,
          'ehrms_code': ehrmsCode,
          'full_name': fullName,
        },
      );
    } else {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text("Invalid EHRMS Code or password")));
    }
  }

  void forgotPassword() async {
    final ehrms = ehrmsController.text.trim();

    if (ehrms.isEmpty) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text("Enter your EHRMS Code first")));
      return;
    }

    final response = await http.get(
      Uri.parse("$baseUrl/get-security-question/$ehrms/"),
    );

    if (response.statusCode == 200) {
      final question = json.decode(response.body)['security_question'];

      String userAnswer = '';
      bool answerConfirmed = false;

      await showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: Text("Security Question"),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(question ?? "No security question found"),
              SizedBox(height: 10),
              TextField(
                decoration: InputDecoration(labelText: "Your Answer"),
                onChanged: (val) => userAnswer = val,
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () {
                answerConfirmed = true;
                Navigator.pop(context);
              },
              child: Text("Submit", style: TextStyle(color: Colors.indigo)),
            ),
          ],
        ),
      );

      if (!answerConfirmed) return;

      final verifyResponse = await http.post(
        Uri.parse("$baseUrl/verify-security/"),
        body: {"ehrms_code": ehrms, "security_answer": userAnswer.trim()},
      );

      if (verifyResponse.statusCode == 200) {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => ResetPasswordScreen(
              ehrmsCode: ehrms,
              securityAnswer: userAnswer.trim(), // <-- pass it here
            ),
          ),
        );
      } else {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text("Incorrect security answer")));
      }
    } else {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text("EHRMS Code not found")));
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context); //  get theme for dynamic colors
    // final isDark = theme.brightness == Brightness.dark;
    return Scaffold(
      // backgroundColor: Color(0xFFC1E4F9),
      backgroundColor: theme.scaffoldBackgroundColor,
      appBar: AppBar(title: Text("Login"), backgroundColor: Colors.indigo),
      body: Padding(
        padding: EdgeInsets.all(20),
        child: SingleChildScrollView(
          child: Column(
            children: [
              SizedBox(height: 16),
              TextField(
                controller: ehrmsController,
                decoration: fieldDecoration('EHRMS Code', required: true),
              ),
              SizedBox(height: 16),
              TextField(
                controller: passwordController,
                decoration: fieldDecoration('Password', required: true),
                obscureText: true,
              ),
              SizedBox(height: 24),
              ElevatedButton(
                onPressed: loginUser,
                child: Text("Login"),
                style: ElevatedButton.styleFrom(backgroundColor: Colors.indigo),
              ),
              SizedBox(height: 12),
              TextButton(
                onPressed: () => Navigator.pushNamed(context, '/register'),
                child: RichText(
                  text: TextSpan(
                    children: [
                      TextSpan(
                        text: "Don't have an account? ",
                        style: TextStyle(color: Colors.white),
                      ),
                      TextSpan(
                        text: "Register",
                        style: TextStyle(color: Colors.indigo),
                      ),
                    ],
                  ),
                ),
              ),
              TextButton(
                onPressed: forgotPassword,
                child: Text(
                  "Forgot Password?",
                  style: TextStyle(color: Colors.indigo),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
