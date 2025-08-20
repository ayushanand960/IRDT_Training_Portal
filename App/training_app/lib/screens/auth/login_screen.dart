import 'package:flutter/material.dart';
import '../../widgets/ui_helpers.dart';
import 'reset_password_screen.dart';
import 'access_code_popup.dart';
import '../../core/services/api_service.dart';
import 'package:provider/provider.dart';
import '../../../providers/theme_provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:shared_preferences/shared_preferences.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final ehrmsController = TextEditingController();
  final passwordController = TextEditingController();
  final ApiService _api = ApiService();

  bool _obscurePassword = true;

  @override
  void initState() {
    super.initState();
    _checkSession(); // Auto-login if session is still valid
  }

  /// **Check if already logged in**
  /// - Calls `/auth/check/` (cookie-based)
  /// - If valid → fetch profile & navigate to home
  void _checkSession() async {
    try {
      final loggedIn = await _api.checkAuth(); // Correct API call
      if (loggedIn) {
        final profile = await _api.getProfile();
        if (profile != null) {
          await _saveProfileToPrefs(profile);
          _navigateToHome(profile);
        }
      }
    } catch (_) {
      // Ignore error silently (not logged in / expired session)
    }
  }

  /// **Save profile info to SharedPreferences**
  /// - Saves EHRMS code, name & photo for Drawer/Profile usage
  Future<void> _saveProfileToPrefs(Map<String, dynamic> profile) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('ehrms_code', profile['ehrms_code'] ?? '');
    await prefs.setString('name', profile['name'] ?? 'User');
    await prefs.setString(
      'profile_photo_url',
      profile['profile_picture'] ?? '',
    );
  }

  /// **Navigate to LoginHomePage**
  void _navigateToHome(Map<String, dynamic> profile) {
    Navigator.pushReplacementNamed(
      context,
      '/login-home',
      arguments: {'ehrms_code': profile['ehrms_code'], 'name': profile['name']},
    );
  }

  /// **Login Function**
  /// - Calls `/login/token/` → cookies auto-stored
  /// - Fetches profile & stores it → Navigates to Home
  void loginUser() async {
    final ehrms = ehrmsController.text.trim();
    final password = passwordController.text.trim();

    if (ehrms.isEmpty || password.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Please enter both EHRMS Code and Password"),
        ),
      );
      return;
    }

    try {
      final success = await _api.login(ehrms, password);
      if (!success) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(const SnackBar(content: Text("Invalid credentials")));
        return;
      }
      final profile = await _api.getProfile();
      if (profile != null) {
        await _saveProfileToPrefs(profile);
        _navigateToHome(profile);
      }
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text("Login failed: ${e.toString()}")));
    }
  }

  /// **Forgot Password Flow**
  /// - Step 1: Enter EHRMS code
  /// - Step 2: Show security question
  /// - Step 3: Verify answer
  /// - Step 4: Navigate to ResetPasswordScreen
  void forgotPassword() async {
    final ehrms = ehrmsController.text.trim();
    if (ehrms.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Enter your EHRMS Code first")),
      );
      return;
    }

    try {
      final question = await _api.getSecurityQuestion(ehrms);
      if (question == null) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(const SnackBar(content: Text("EHRMS Code not found")));
        return;
      }

      String userAnswer = '';
      bool answerConfirmed = false;

      // **Dialog to ask security answer**
      await showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: const Text("Security Question"),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(question),
              const SizedBox(height: 10),
              TextField(
                decoration: const InputDecoration(labelText: "Your Answer"),
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
              child: const Text(
                "Submit",
                style: TextStyle(color: Colors.indigo),
              ),
            ),
          ],
        ),
      );

      if (!answerConfirmed) return;

      final verified = await _api.verifySecurityAnswer(
        ehrms,
        userAnswer.trim(),
      );
      if (verified) {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => ResetPasswordScreen(
              ehrmsCode: ehrms,
              securityAnswer: userAnswer.trim(),
            ),
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Incorrect security answer")),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text("Error: ${e.toString()}")));
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      appBar: AppBar(
        title: const Text("Login"),
        backgroundColor: Colors.indigo,
      ),
      body: Stack(
        children: [
          // **Background watermark logo**
          Opacity(
            opacity: 0.08,
            child: Center(
              child: Image.asset(
                'assets/images/bg_logo.png',
                width: MediaQuery.of(context).size.width * 0.7,
                fit: BoxFit.contain,
              ),
            ),
          ),
          Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Card(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20),
                ),
                elevation: 8,
                color: Colors.white.withOpacity(0.9),
                child: Padding(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        "Welcome Back!",
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: Colors.indigo[900],
                        ),
                      ),
                      const SizedBox(height: 20),
                      TextField(
                        controller: ehrmsController,
                        decoration: fieldDecoration(
                          'EHRMS Code',
                          required: true,
                        ),
                      ),
                      const SizedBox(height: 16),
                      // TextField(
                      //   controller: passwordController,
                      //   decoration: fieldDecoration('Password', required: true),
                      //   obscureText: true,
                      // ),
                      TextField(
                        controller: passwordController,
                        obscureText: _obscurePassword,
                        decoration: fieldDecoration('Password', required: true)
                            .copyWith(
                              suffixIcon: IconButton(
                                icon: Icon(
                                  _obscurePassword
                                      ? Icons.visibility_off
                                      : Icons.visibility,
                                ),
                                onPressed: () {
                                  setState(() {
                                    _obscurePassword = !_obscurePassword;
                                  });
                                },
                              ),
                            ),
                      ),
                      const SizedBox(height: 24),
                      ElevatedButton(
                        onPressed: loginUser,
                        child: const Text("Login"),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.indigo,
                          minimumSize: const Size(double.infinity, 50),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                      ),
                      const SizedBox(height: 12),
                      TextButton(
                        // onPressed: () =>
                        //     Navigator.pushNamed(context, '/access-code'),
                        onPressed: () {
                          AccessCodePopup.show(context);
                        },
                        child: RichText(
                          text: const TextSpan(
                            children: [
                              TextSpan(
                                text: "Don't have an account? ",
                                style: TextStyle(color: Colors.black87),
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
                        child: const Text(
                          "Forgot Password?",
                          style: TextStyle(color: Colors.indigo),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
