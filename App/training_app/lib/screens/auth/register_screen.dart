// import 'dart:convert';
// import 'package:flutter/material.dart';
// import '../../data/polytechnic_list.dart';
// import '../../data/branch_list.dart';
// import '../../widgets/ui_helpers.dart';
// import '../../widgets/dropdown_item_box.dart';
// import '../../core/services/api_service.dart'; // <- import your ApiService
//
// class RegisterScreen extends StatefulWidget {
//
//   @override
//   State<RegisterScreen> createState() => _RegisterScreenState();
// }
//
// class _RegisterScreenState extends State<RegisterScreen> {
//   final _formKey = GlobalKey<FormState>();
//   final _scrollController = ScrollController();
//
//   final ehrmsController = TextEditingController();
//   final firstNameController = TextEditingController();
//   final middleNameController = TextEditingController();
//   final lastNameController = TextEditingController();
//   final emailController = TextEditingController();
//   final phoneController = TextEditingController();
//   final passwordController = TextEditingController();
//   final confirmPasswordController = TextEditingController();
//   final securityAnswerController = TextEditingController();
//   final otherDesignationController = TextEditingController();
//
//   final ehrmsFocus = FocusNode();
//   final firstNameFocus = FocusNode();
//   final lastNameFocus = FocusNode();
//   final emailFocus = FocusNode();
//   final phoneFocus = FocusNode();
//   final passwordFocus = FocusNode();
//   final confirmPasswordFocus = FocusNode();
//   final securityAnswerFocus = FocusNode();
//   final otherDesignationFocus = FocusNode();
//
//   String? selectedGender;
//   String? selectedPolytechnic;
//   String? selectedBranch;
//   String? selectedCategory;
//   String? selectedDesignation;
//   String? selectedSecurityQuestion;
//
//   final genderOptions = ['Male', 'Female', 'Transgender'];
//
//   final securityQuestions = {
//     'pet_name': 'What is the name of your first pet?',
//     'school_name': 'What is the name of your first school?',
//     'birth_city': 'In which city were you born?',
//     'best_friend': 'What is the name of your childhood best friend?',
//     'favorite_food': 'What is your favorite food?',
//     'favorite_book': 'What is your favorite book?',
//     'nickname': 'What was your childhood nickname?'
//   };
//
//   Map<String, List<String>> designationMap = {
//     'Group A': ['HOD', 'Principal'],
//     'Group B': ['Lecturer', 'Librarian', 'Workshop Superintendent'],
//     'Group C': [
//       'Workshop Instructor',
//       'Office Employee',
//       'Computer Instructor',
//       'Computer Operator',
//       'Other'
//     ],
//   };
//
//   List<String> designationOptions = [];
//
//   void onCategoryChanged(String? value) {
//     setState(() {
//       selectedCategory = value;
//       selectedDesignation = null;
//       designationOptions = designationMap[value] ?? [];
//     });
//   }
//
//   void scrollToFirstError() {
//     _scrollController.animateTo(
//       0,
//       duration: Duration(milliseconds: 300),
//       curve: Curves.easeIn,
//     );
//   }
//
//   void registerUser() async {
//     if (_formKey.currentState!.validate()) {
//       final response = await ApiService.post('/register/', {
//         "ehrms_code": ehrmsController.text,
//         "first_name": firstNameController.text,
//         "middle_name": middleNameController.text,
//         "last_name": lastNameController.text,
//         "email": emailController.text,
//         "mobile_number": phoneController.text,
//         "gender": selectedGender,
//         "institute_name": selectedPolytechnic,
//         "branch": selectedBranch,
//         "designation": selectedDesignation == 'Other'
//             ? otherDesignationController.text
//             : selectedDesignation,
//         "category": selectedCategory,
//         "password": passwordController.text,
//         "security_question": selectedSecurityQuestion,
//         "security_answer": securityAnswerController.text,
//       });
//
//       if (response.statusCode == 201) {
//         ScaffoldMessenger.of(context).showSnackBar(
//           SnackBar(content: Text("Registration successful!")),
//         );
//         Navigator.pushReplacementNamed(context, '/login');
//       } else {
//         final message = jsonDecode(response.body)['error'] ?? 'Registration failed.';
//         ScaffoldMessenger.of(context).showSnackBar(
//           SnackBar(content: Text(message)),
//         );
//       }
//     } else {
//       scrollToFirstError();
//     }
//   }
//
//   @override
//   void dispose() {
//     ehrmsController.dispose();
//     firstNameController.dispose();
//     middleNameController.dispose();
//     lastNameController.dispose();
//     emailController.dispose();
//     phoneController.dispose();
//     passwordController.dispose();
//     confirmPasswordController.dispose();
//     securityAnswerController.dispose();
//     otherDesignationController.dispose();
//
//     ehrmsFocus.dispose();
//     firstNameFocus.dispose();
//     lastNameFocus.dispose();
//     emailFocus.dispose();
//     phoneFocus.dispose();
//     passwordFocus.dispose();
//     confirmPasswordFocus.dispose();
//     securityAnswerFocus.dispose();
//     otherDesignationFocus.dispose();
//     _scrollController.dispose();
//
//     super.dispose();
//   }
//
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       backgroundColor: Color(0xFFC1E4F9),
//       appBar: AppBar(title: Text("Register")),
//       body: SingleChildScrollView(
//         controller: _scrollController,
//         padding: EdgeInsets.all(16),
//         child: Form(
//           key: _formKey,
//           child: Column(
//             children: [
//               TextFormField(
//                 controller: ehrmsController,
//                 focusNode: ehrmsFocus,
//                 keyboardType: TextInputType.number,
//                 decoration: fieldDecoration('EHRMS Code', required: true),
//                 validator: (value) {
//                   if (value == null || value.length < 6 || value.length > 7) {
//                     ehrmsFocus.requestFocus();
//                     return 'Enter a valid 6 or 7 digit EHRMS Code';
//                   }
//                   return null;
//                 },
//               ),
//               SizedBox(height: 16),
//               TextFormField(
//                 controller: firstNameController,
//                 focusNode: firstNameFocus,
//                 decoration: fieldDecoration('First Name', required: true),
//                 validator: (value) {
//                   if (value == null || value.isEmpty) {
//                     firstNameFocus.requestFocus();
//                     return 'Enter first name';
//                   }
//                   return null;
//                 },
//               ),
//               SizedBox(height: 16),
//               TextFormField(
//                 controller: middleNameController,
//                 decoration: fieldDecoration('Middle Name'),
//               ),
//               SizedBox(height: 16),
//               TextFormField(
//                 controller: lastNameController,
//                 focusNode: lastNameFocus,
//                 decoration: fieldDecoration('Last Name', required: true),
//                 validator: (value) {
//                   if (value == null || value.isEmpty) {
//                     lastNameFocus.requestFocus();
//                     return 'Enter last name';
//                   }
//                   return null;
//                 },
//               ),
//               SizedBox(height: 16),
//               TextFormField(
//                 controller: emailController,
//                 focusNode: emailFocus,
//                 decoration: fieldDecoration('Email ID', required: true),
//                 keyboardType: TextInputType.emailAddress,
//                 validator: (value) {
//                   if (value == null || value.isEmpty) {
//                     emailFocus.requestFocus();
//                     return 'Enter email';
//                   }
//                   final emailRegex = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
//                   if (!emailRegex.hasMatch(value)) {
//                     emailFocus.requestFocus();
//                     return 'Enter a valid email address';
//                   }
//                   return null;
//                 },
//               ),
//               SizedBox(height: 16),
//               TextFormField(
//                 controller: phoneController,
//                 focusNode: phoneFocus,
//                 keyboardType: TextInputType.phone,
//                 decoration: fieldDecoration('Mobile No.', required: true),
//                 validator: (value) {
//                   if (value == null || value.length != 10) {
//                     phoneFocus.requestFocus();
//                     return 'Enter a valid 10-digit mobile number';
//                   }
//                   return null;
//                 },
//               ),
//
//               SizedBox(height: 16),
//               DropdownButtonFormField<String>(
//                 decoration: fieldDecoration('Gender', required: true),
//                 value: selectedGender,
//                 isExpanded: true,
//                 items: genderOptions.map((g) => DropdownMenuItem(
//                   value: g,
//                   child: buildBoxedDropdownItem(g, context),
//                 )).toList(),
//                 selectedItemBuilder: (context) => genderOptions.map((g) =>
//                     buildSelectedItem(g),
//                 ).toList(),
//                 onChanged: (val) => setState(() => selectedGender = val),
//                 validator: (value) => value == null ? 'Select gender' : null,
//               ),
//
//               SizedBox(height: 16),
//               DropdownButtonFormField<String>(
//                 isExpanded: true,
//                 decoration: fieldDecoration('Select Polytechnic', required: true),
//                 value: selectedPolytechnic,
//                 items: polytechnicOptions.map((p) =>
//                     DropdownMenuItem(
//                       value: p,
//                       child: buildBoxedDropdownItem(p, context), // shows in dropdown list
//                     ),
//                 ).toList(),
//                 selectedItemBuilder: (context) => polytechnicOptions.map((p) =>
//                     buildSelectedItem(p), // shows in selected field
//                 ).toList(),
//                 onChanged: (val) => setState(() => selectedPolytechnic = val),
//                 validator: (value) => value == null ? 'Select polytechnic' : null,
//               ),
//
//               SizedBox(height: 16),
//               DropdownButtonFormField<String>(
//                 isExpanded: true,
//                 decoration: fieldDecoration('Branch', required: true),
//                 value: selectedBranch,
//                 items: branchOptions.map((b) => DropdownMenuItem(
//                   value: b,
//                   child: buildBoxedDropdownItem(b, context), // for dropdown list
//                 )).toList(),
//                 selectedItemBuilder: (context) => branchOptions.map((b) =>
//                     buildSelectedItem(b) // for selected display
//                 ).toList(),
//                 onChanged: (val) => setState(() => selectedBranch = val),
//                 validator: (value) => value == null ? 'Select branch' : null,
//               ),
//
//
//               SizedBox(height: 16),
//               DropdownButtonFormField<String>(
//                 isExpanded: true,
//                 decoration: fieldDecoration('Category of Employee', required: true),
//                 value: selectedCategory,
//                 items: ['Group A', 'Group B', 'Group C']
//                     .map((g) => DropdownMenuItem(
//                   value: g,
//                   child: buildBoxedDropdownItem(g, context),
//                 ))
//                     .toList(),
//                 selectedItemBuilder: (context) => ['Group A', 'Group B', 'Group C']
//                     .map((g) => buildSelectedItem(g))
//                     .toList(),
//                 onChanged: onCategoryChanged,
//                 validator: (value) => value == null ? 'Select category' : null,
//               ),
//
//
//               SizedBox(height: 16),
//               DropdownButtonFormField<String>(
//                 isExpanded: true,
//                 decoration: fieldDecoration('Designation', required: true),
//                 value: selectedDesignation,
//                 items: designationOptions.map((d) => DropdownMenuItem(
//                   value: d,
//                   child: buildBoxedDropdownItem(d, context),
//                 )).toList(),
//                 selectedItemBuilder: (context) => designationOptions.map((d) => buildSelectedItem(d)).toList(),
//                 onChanged: (val) => setState(() => selectedDesignation = val),
//                 validator: (value) => value == null ? 'Select designation' : null,
//               ),
//
//               if (selectedDesignation == 'Other') ...[
//                 SizedBox(height: 16),
//                 TextFormField(
//                   controller: otherDesignationController,
//                   focusNode: otherDesignationFocus,
//                   decoration: fieldDecoration('Enter Other Designation', required: true),
//                   validator: (value) {
//                     if (value == null || value.isEmpty) {
//                       otherDesignationFocus.requestFocus();
//                       return 'Enter designation';
//                     }
//                     return null;
//                   },
//                 ),
//               ],
//               SizedBox(height: 16),
//               TextFormField(
//                 controller: passwordController,
//                 focusNode: passwordFocus,
//                 decoration: fieldDecoration('Password', required: true),
//                 obscureText: true,
//                 validator: (value) {
//                   if (value == null || value.isEmpty) {
//                     passwordFocus.requestFocus();
//                     return 'Enter password';
//                   }
//                   if (value.length < 6 ||
//                       !RegExp(r'[A-Z]').hasMatch(value) ||
//                       !RegExp(r'[0-9]').hasMatch(value)) {
//                     passwordFocus.requestFocus();
//                     return 'Password must be 6+ chars, include uppercase & number';
//                   }
//                   return null;
//                 },
//               ),
//               SizedBox(height: 16),
//               TextFormField(
//                 controller: confirmPasswordController,
//                 focusNode: confirmPasswordFocus,
//                 decoration: fieldDecoration('Confirm Password', required: true),
//                 obscureText: true,
//                 validator: (value) {
//                   if (value != passwordController.text) {
//                     confirmPasswordFocus.requestFocus();
//                     return 'Passwords do not match';
//                   }
//                   return null;
//                 },
//               ),
//
//               SizedBox(height: 16),
//               DropdownButtonFormField<String>(
//                 isExpanded: true,
//                 decoration: fieldDecoration('Security Question', required: true),
//                 value: selectedSecurityQuestion,
//                 items: securityQuestions.entries.map((entry) =>
//                     DropdownMenuItem(
//                       value: entry.key,
//                       child: buildBoxedDropdownItem(entry.value, context),
//                     ),
//                 ).toList(),
//                 selectedItemBuilder: (context) => securityQuestions.entries.map(
//                       (entry) => buildSelectedItem(entry.value),
//                 ).toList(),
//                 onChanged: (val) => setState(() => selectedSecurityQuestion = val),
//                 validator: (value) => value == null ? 'Select a question' : null,
//               ),
//
//
//
//               SizedBox(height: 16),
//               TextFormField(
//                 controller: securityAnswerController,
//                 focusNode: securityAnswerFocus,
//                 decoration: fieldDecoration('Security Answer', required: true),
//                 validator: (value) {
//                   if (value == null || value.isEmpty) {
//
//                     securityAnswerFocus.requestFocus();
//                     return 'Enter answer';
//                   }
//                   return null;
//                 },
//               ),
//               SizedBox(height: 24),
//               ElevatedButton(onPressed: registerUser, child: Text("Register")),
//               SizedBox(height: 12),
//               TextButton(
//                 onPressed: () => Navigator.pushNamed(context, '/login'),
//                 child: RichText(
//                   text: TextSpan(
//                     children: [
//                       TextSpan(
//                         text: "Already registered? ",
//                         style: TextStyle(color: Colors.white),
//                       ),
//                       TextSpan(
//                         text: "Login here",
//                         style: TextStyle(color: Colors.indigo),
//                       ),
//                     ],
//                   ),
//                 ),
//               ),
//             ],
//           ),
//         ),
//       ),
//     );
//   }
// }






import 'dart:convert';
import 'package:flutter/material.dart';
import '../../data/polytechnic_list.dart';
import '../../data/branch_list.dart';
import '../../widgets/ui_helpers.dart';
import '../../widgets/dropdown_item_box.dart';
import '../../core/services/api_service.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});
  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _scrollController = ScrollController();

  final ehrmsController = TextEditingController();
  final firstNameController = TextEditingController();
  final middleNameController = TextEditingController();
  final lastNameController = TextEditingController();
  final emailController = TextEditingController();
  final phoneController = TextEditingController();
  final passwordController = TextEditingController();
  final confirmPasswordController = TextEditingController();
  final securityAnswerController = TextEditingController();
  final otherDesignationController = TextEditingController();

  String? selectedGender;
  String? selectedPolytechnic;
  String? selectedBranch;
  String? selectedCategory;
  String? selectedDesignation;
  String? selectedSecurityQuestion;

  final genderOptions = ['Male', 'Female', 'Transgender'];
  final securityQuestions = {
    'pet_name': 'What is the name of your first pet?',
    'school_name': 'What is the name of your first school?',
    'birth_city': 'In which city were you born?',
    'best_friend': 'What is the name of your childhood best friend?',
    'favorite_food': 'What is your favorite food?',
    'favorite_book': 'What is your favorite book?',
    'nickname': 'What was your childhood nickname?'
  };

  Map<String, List<String>> designationMap = {
    'Group A': ['HOD', 'Principal'],
    'Group B': ['Lecturer', 'Librarian', 'Workshop Superintendent'],
    'Group C': [
      'Workshop Instructor',
      'Office Employee',
      'Computer Instructor',
      'Computer Operator',
      'Other'
    ],
  };
  List<String> designationOptions = [];

  void onCategoryChanged(String? value) {
    setState(() {
      selectedCategory = value;
      selectedDesignation = null;
      designationOptions = designationMap[value] ?? [];
    });
  }

  void scrollToFirstError() {
    _scrollController.animateTo(
      0,
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeIn,
    );
  }

  /// ------------------- REGISTER -------------------
  final ApiService _api = ApiService();

  void registerUser() async {
    if (!_formKey.currentState!.validate()) {
      scrollToFirstError();
      return;
    }

    final payload = {
      "ehrms_code": ehrmsController.text.trim(),
      "first_name": firstNameController.text.trim(),
      "middle_name": middleNameController.text.trim(),
      "last_name": lastNameController.text.trim(),
      "email": emailController.text.trim(),
      "mobile_number": phoneController.text.trim(),
      "gender": selectedGender,
      "institute_name": selectedPolytechnic,
      "branch": selectedBranch,
      "designation": selectedDesignation == 'Other'
          ? otherDesignationController.text.trim()
          : selectedDesignation,
      "category": selectedCategory,
      "password": passwordController.text,
      "security_question": selectedSecurityQuestion,
      "security_answer": securityAnswerController.text.trim(),
    };

    try {
      await _api.registerUser(payload); // <- Now using the instance method
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Registration successful! Please login.")),
      );
      Navigator.pushReplacementNamed(context, '/login');
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Error: ${e.toString()}")),
      );
    }
  }


  /// ------------------- UI -------------------
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      body: Stack(
        children: [
          // Watermark Background
          Positioned.fill(
            child: Opacity(
              opacity: 0.08,
              child: Image.asset(
                'assets/images/watermark_logo.png',
                fit: BoxFit.cover,
              ),
            ),
          ),
          // Form Card
          Center(
            child: SingleChildScrollView(
              controller: _scrollController,
              padding: const EdgeInsets.all(16),
              child: Card(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
                elevation: 6,
                child: Padding(
                  padding: const EdgeInsets.all(20),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      children: [
                        const Text(
                          "Register",
                          style: TextStyle(
                            fontSize: 28,
                            fontWeight: FontWeight.bold,
                            color: Colors.indigo,
                          ),
                        ),
                        const SizedBox(height: 20),

                        /// ===== Personal Details =====
                        Align(
                          alignment: Alignment.centerLeft,
                          child: Text(
                            "Personal Details",
                            style: theme.textTheme.titleMedium?.copyWith(
                              fontWeight: FontWeight.bold,
                              color: Colors.indigo,
                            ),
                          ),
                        ),
                        const SizedBox(height: 10),

                        // EHRMS Code
                        TextFormField(
                          controller: ehrmsController,
                          keyboardType: TextInputType.number,
                          decoration: fieldDecoration('EHRMS Code', required: true),
                          validator: (value) {
                            if (value == null || value.length < 6 || value.length > 7) {
                              return 'Enter a valid 6 or 7 digit EHRMS Code';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 16),

                        // First Name
                        TextFormField(
                          controller: firstNameController,
                          decoration: fieldDecoration('First Name', required: true),
                          validator: (value) =>
                          value == null || value.isEmpty ? 'Enter first name' : null,
                        ),
                        const SizedBox(height: 16),

                        // Middle Name
                        TextFormField(
                          controller: middleNameController,
                          decoration: fieldDecoration('Middle Name'),
                        ),
                        const SizedBox(height: 16),

                        // Last Name
                        TextFormField(
                          controller: lastNameController,
                          decoration: fieldDecoration('Last Name', required: true),
                          validator: (value) =>
                          value == null || value.isEmpty ? 'Enter last name' : null,
                        ),
                        const SizedBox(height: 16),

                        // Email
                        TextFormField(
                          controller: emailController,
                          decoration: fieldDecoration('Email ID', required: true),
                          keyboardType: TextInputType.emailAddress,
                          validator: (value) {
                            if (value == null || value.isEmpty) return 'Enter email';
                            final emailRegex =
                            RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
                            if (!emailRegex.hasMatch(value)) return 'Enter a valid email';
                            return null;
                          },
                        ),
                        const SizedBox(height: 16),

                        // Phone
                        TextFormField(
                          controller: phoneController,
                          keyboardType: TextInputType.phone,
                          decoration: fieldDecoration('Mobile No.', required: true),
                          validator: (value) =>
                          value == null || value.length != 10
                              ? 'Enter a valid 10-digit mobile number'
                              : null,
                        ),
                        const SizedBox(height: 16),

                        // Gender
                        DropdownButtonFormField<String>(
                          decoration: fieldDecoration('Gender', required: true),
                          value: selectedGender,
                          isExpanded: true,
                          items: genderOptions
                              .map((g) => DropdownMenuItem(
                              value: g, child: buildBoxedDropdownItem(g, context)))
                              .toList(),
                          onChanged: (val) => setState(() => selectedGender = val),
                          validator: (value) =>
                          value == null ? 'Select gender' : null,
                        ),
                        const SizedBox(height: 16),

                        // Polytechnic
                        DropdownButtonFormField<String>(
                          isExpanded: true,
                          decoration: fieldDecoration('Select Polytechnic', required: true),
                          value: selectedPolytechnic,
                          items: polytechnicOptions
                              .map((p) => DropdownMenuItem(
                              value: p, child: buildBoxedDropdownItem(p, context)))
                              .toList(),
                          onChanged: (val) => setState(() => selectedPolytechnic = val),
                          validator: (value) =>
                          value == null ? 'Select polytechnic' : null,
                        ),
                        const SizedBox(height: 16),

                        // Branch
                        DropdownButtonFormField<String>(
                          isExpanded: true,
                          decoration: fieldDecoration('Branch', required: true),
                          value: selectedBranch,
                          items: branchOptions
                              .map((b) => DropdownMenuItem(
                              value: b, child: buildBoxedDropdownItem(b, context)))
                              .toList(),
                          onChanged: (val) => setState(() => selectedBranch = val),
                          validator: (value) => value == null ? 'Select branch' : null,
                        ),
                        const SizedBox(height: 16),

                        // Category
                        DropdownButtonFormField<String>(
                          isExpanded: true,
                          decoration: fieldDecoration('Category of Employee', required: true),
                          value: selectedCategory,
                          items: ['Group A', 'Group B', 'Group C']
                              .map((g) => DropdownMenuItem(
                              value: g, child: buildBoxedDropdownItem(g, context)))
                              .toList(),
                          onChanged: onCategoryChanged,
                          validator: (value) => value == null ? 'Select category' : null,
                        ),
                        const SizedBox(height: 16),

                        // Designation
                        DropdownButtonFormField<String>(
                          isExpanded: true,
                          decoration: fieldDecoration('Designation', required: true),
                          value: selectedDesignation,
                          items: designationOptions
                              .map((d) => DropdownMenuItem(
                              value: d, child: buildBoxedDropdownItem(d, context)))
                              .toList(),
                          onChanged: (val) => setState(() => selectedDesignation = val),
                          validator: (value) =>
                          value == null ? 'Select designation' : null,
                        ),
                        if (selectedDesignation == 'Other') ...[
                          const SizedBox(height: 16),
                          TextFormField(
                            controller: otherDesignationController,
                            decoration: fieldDecoration('Enter Other Designation', required: true),
                            validator: (value) =>
                            value == null || value.isEmpty ? 'Enter designation' : null,
                          ),
                        ],

                        const SizedBox(height: 25),

                        /// ===== Login Details =====
                        Align(
                          alignment: Alignment.centerLeft,
                          child: Text(
                            "Login Details",
                            style: theme.textTheme.titleMedium?.copyWith(
                              fontWeight: FontWeight.bold,
                              color: Colors.indigo,
                            ),
                          ),
                        ),
                        const SizedBox(height: 10),

                        // Password
                        TextFormField(
                          controller: passwordController,
                          obscureText: true,
                          decoration: fieldDecoration('Password', required: true),
                          validator: (value) {
                            if (value == null || value.isEmpty) return 'Enter password';
                            if (value.length < 6 ||
                                !RegExp(r'[A-Z]').hasMatch(value) ||
                                !RegExp(r'[0-9]').hasMatch(value)) {
                              return 'Password must be 6+ chars, include uppercase & number';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 16),

                        // Confirm Password
                        TextFormField(
                          controller: confirmPasswordController,
                          obscureText: true,
                          decoration: fieldDecoration('Confirm Password', required: true),
                          validator: (value) =>
                          value != passwordController.text ? 'Passwords do not match' : null,
                        ),

                        const SizedBox(height: 25),

                        /// ===== Security =====
                        Align(
                          alignment: Alignment.centerLeft,
                          child: Text(
                            "Security",
                            style: theme.textTheme.titleMedium?.copyWith(
                              fontWeight: FontWeight.bold,
                              color: Colors.indigo,
                            ),
                          ),
                        ),
                        const SizedBox(height: 10),

                        // Security Question
                        DropdownButtonFormField<String>(
                          isExpanded: true,
                          decoration: fieldDecoration('Security Question', required: true),
                          value: selectedSecurityQuestion,
                          items: securityQuestions.entries
                              .map((entry) => DropdownMenuItem(
                            value: entry.key,
                            child: buildBoxedDropdownItem(entry.value, context),
                          ))
                              .toList(),
                          onChanged: (val) =>
                              setState(() => selectedSecurityQuestion = val),
                          validator: (value) =>
                          value == null ? 'Select a question' : null,
                        ),
                        const SizedBox(height: 16),

                        // Security Answer
                        TextFormField(
                          controller: securityAnswerController,
                          decoration: fieldDecoration('Security Answer', required: true),
                          validator: (value) =>
                          value == null || value.isEmpty ? 'Enter answer' : null,
                        ),

                        const SizedBox(height: 24),

                        ElevatedButton(
                          onPressed: registerUser,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.indigo,
                            minimumSize: const Size(double.infinity, 50),
                          ),
                          child: const Text("Register"),
                        ),
                        const SizedBox(height: 12),
                        TextButton(
                          onPressed: () => Navigator.pushNamed(context, '/login'),
                          child: const Text(
                            "Already registered? Login here",
                            style: TextStyle(color: Colors.indigo),
                          ),
                        ),
                      ],
                    ),
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

