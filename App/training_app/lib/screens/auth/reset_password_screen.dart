// import 'package:flutter/material.dart';
// import '../../core/services/api_service.dart';
// import '../../core/utils.dart';
// import '../../widgets/ui_helpers.dart';
//
// class ResetPasswordScreen extends StatefulWidget {
//   final String ehrmsCode;
//   final String securityAnswer;
//
//   ResetPasswordScreen({required this.ehrmsCode, required this.securityAnswer});
//
//   @override
//   State<ResetPasswordScreen> createState() => _ResetPasswordScreenState();
// }
//
// class _ResetPasswordScreenState extends State<ResetPasswordScreen> {
//   final newPasswordController = TextEditingController();
//   final confirmPasswordController = TextEditingController();
//   final _formKey = GlobalKey<FormState>();
//
//   void saveNewPassword() async {
//     if (!_formKey.currentState!.validate()) return;
//
//     final success = await ApiService.resetPassword(
//       widget.ehrmsCode,
//       newPasswordController.text.trim(),
//     );
//
//     if (success) {
//       showSnackBar(context, "Password reset successful!", color: Colors.green);
//       Navigator.pushReplacementNamed(context, '/login');
//     } else {
//       showSnackBar(context, "Reset failed! Please try again.");
//     }
//   }
//
//
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(title: Text("Reset Password")),
//       // backgroundColor: Color(0xFFC1E4F9),
//       backgroundColor: Theme.of(context).scaffoldBackgroundColor,
//
//       body: Padding(
//         padding: const EdgeInsets.all(16.0),
//         child: Form(
//           key: _formKey,
//           child: Column(
//             children: [
//               TextFormField(
//                 controller: newPasswordController,
//                 obscureText: true,
//                 decoration: fieldDecoration('New Password', required: true),
//                 validator: (value) {
//                   if (value == null || value.isEmpty)
//                     return 'Enter a new password';
//                   if (value.length < 6 ||
//                       !RegExp(r'[A-Z]').hasMatch(value) ||
//                       !RegExp(r'[0-9]').hasMatch(value))
//                     return 'Must be 6+ chars with uppercase & number';
//                   return null;
//                 },
//               ),
//               SizedBox(height: 16),
//               TextFormField(
//                 controller: confirmPasswordController,
//                 obscureText: true,
//                 decoration: fieldDecoration('Confirm Password', required: true),
//                 validator: (value) {
//                   if (value != newPasswordController.text)
//                     return 'Passwords do not match';
//                   return null;
//                 },
//               ),
//               SizedBox(height: 24),
//               ElevatedButton(
//                 onPressed: saveNewPassword,
//                 child: Text("Reset Password"),
//               )
//             ],
//           ),
//         ),
//       ),
//     );
//   }
// }



import 'package:flutter/material.dart';
import '../../core/services/api_service.dart';
import '../../core/utils.dart';
import '../../widgets/ui_helpers.dart';

class ResetPasswordScreen extends StatefulWidget {
  final String ehrmsCode;
  final String securityAnswer;

  const ResetPasswordScreen({super.key, required this.ehrmsCode, required this.securityAnswer});

  @override
  State<ResetPasswordScreen> createState() => _ResetPasswordScreenState();
}

class _ResetPasswordScreenState extends State<ResetPasswordScreen> {
  final newPasswordController = TextEditingController();
  final confirmPasswordController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  final ApiService _api = ApiService();

  void saveNewPassword() async {
    if (!_formKey.currentState!.validate()) return;

    try {
      final success = await _api.resetPassword(
        widget.ehrmsCode,
        newPasswordController.text.trim(),
      );

      if (success) {
        showSnackBar(context, "Password reset successful!", color: Colors.green);
        Navigator.pushReplacementNamed(context, '/login');
      } else {
        showSnackBar(context, "Reset failed! Please try again.");
      }
    } catch (e) {
      showSnackBar(context, "Error: ${e.toString()}");
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Reset Password")),
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              TextFormField(
                controller: newPasswordController,
                obscureText: true,
                decoration: fieldDecoration('New Password', required: true),
                validator: (value) {
                  if (value == null || value.isEmpty) return 'Enter a new password';
                  if (value.length < 6 ||
                      !RegExp(r'[A-Z]').hasMatch(value) ||
                      !RegExp(r'[0-9]').hasMatch(value)) {
                    return 'Must be 6+ chars with uppercase & number';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: confirmPasswordController,
                obscureText: true,
                decoration: fieldDecoration('Confirm Password', required: true),
                validator: (value) =>
                value != newPasswordController.text ? 'Passwords do not match' : null,
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: saveNewPassword,
                child: const Text("Reset Password"),
              )
            ],
          ),
        ),
      ),
    );
  }
}
