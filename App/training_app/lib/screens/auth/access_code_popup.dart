import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:training_app/core/constants.dart';

class AccessCodePopup {
  static Future<void> show(BuildContext context) async {
    final TextEditingController _codeController = TextEditingController();
    bool _isLoading = false;

    void _showMessage(
      String title,
      String message, {
      bool goBackLogin = false,
    }) {
      showDialog(
        context: context,
        builder: (_) => BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 5, sigmaY: 5),
          child: AlertDialog(
            backgroundColor: Colors.white,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(20),
            ),
            title: Text(
              title,
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
            content: Text(message),
            actions: [
              TextButton(
                style: TextButton.styleFrom(
                  backgroundColor: Colors.red[50],
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                  padding: const EdgeInsets.symmetric(
                    horizontal: 20,
                    vertical: 10,
                  ),
                ),
                onPressed: () {
                  Navigator.pop(context);
                  if (goBackLogin)
                    Navigator.pushReplacementNamed(context, '/login');
                },
                child: const Text(
                  "Close",
                  style: TextStyle(
                    color: Colors.red,
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
              ),
            ],
          ),
        ),
      );
    }

    await showDialog(
      context: context,
      barrierDismissible: false, // user must verify or close
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setState) {
            Future<void> _verifyAccessCode() async {
              final code = _codeController.text.trim();
              if (code.isEmpty) {
                _showMessage("Error", "Please enter the access code");
                return;
              }

              setState(() => _isLoading = true);

              try {
                final response = await http.post(
                  Uri.parse('${baseUrl}login/check-access-code/'),
                  headers: {"Content-Type": "application/json"},
                  body: jsonEncode({"access_code": code}),
                );

                if (response.statusCode == 200) {
                  final data = jsonDecode(response.body);
                  if (data['valid'] == true) {
                    Navigator.pop(context); // close popup
                    Navigator.pushReplacementNamed(context, '/register');
                  } else {
                    _showMessage(
                      "Invalid Code",
                      "The access code is incorrect",
                      goBackLogin: true,
                    );
                  }
                } else {
                  _showMessage(
                    "Invalid Code",
                    "The access code is incorrect",
                    goBackLogin: true,
                  );
                }
              } catch (e) {
                _showMessage("Error", "Error: $e");
              } finally {
                setState(() => _isLoading = false);
              }
            }

            return BackdropFilter(
              filter: ImageFilter.blur(sigmaX: 5, sigmaY: 5),
              child: Dialog(
                backgroundColor: Colors.transparent,
                child: Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Text(
                        "Enter Access Code",
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 20),
                      TextField(
                        controller: _codeController,
                        textAlign: TextAlign.center,
                        decoration: InputDecoration(
                          hintText: "Access Code",
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          contentPadding: const EdgeInsets.symmetric(
                            vertical: 15,
                          ),
                        ),
                      ),
                      const SizedBox(height: 20),
                      _isLoading
                          ? const CircularProgressIndicator()
                          : SizedBox(
                              width: double.infinity,
                              child: ElevatedButton(
                                onPressed: _verifyAccessCode,
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.blueAccent,
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  padding: const EdgeInsets.symmetric(
                                    vertical: 14,
                                  ),
                                ),
                                child: const Text(
                                  "Verify",
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                            ),
                    ],
                  ),
                ),
              ),
            );
          },
        );
      },
    );
  }
}
