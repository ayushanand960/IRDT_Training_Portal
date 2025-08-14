// import 'dart:convert';
// import 'package:flutter/material.dart';
// import '../../data/polytechnic_list.dart';
// import '../../data/branch_list.dart';
// import '../../widgets/ui_helpers.dart';
// import '../../widgets/dropdown_item_box.dart';
// import '../../core/services/api_service.dart';

// class RegisterScreen extends StatefulWidget {
//   const RegisterScreen({super.key});
//   @override
//   State<RegisterScreen> createState() => _RegisterScreenState();
// }

// class _RegisterScreenState extends State<RegisterScreen> {
//   static const allowedEmailDomains = [
//     "gmail",
//     "yahoo",
//     "outlook",
//     "hotmail",
//     "rediffmail",
//     "icloud",
//     "protonmail",
//     "zoho",
//     "aol",
//     "yandex",
//     "mail",
//     "gmx",
//     "nic",
//     "gov",
//     "edu",
//   ];

//   static const allowedEmailTLDs = [
//     "com",
//     "in",
//     "org",
//     "net",
//     "edu",
//     "gov",
//     "mil",
//     "co",
//     "info",
//     "biz",
//     "io",
//     "me",
//   ];

//   final _formKey = GlobalKey<FormState>();
//   final _scrollController = ScrollController();

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

//   final FocusNode ehrmsFocus = FocusNode();
//   final FocusNode firstNameFocus = FocusNode();
//   final FocusNode middleNameFocus = FocusNode();
//   final FocusNode lastNameFocus = FocusNode();
//   final FocusNode emailFocus = FocusNode();
//   final FocusNode phoneFocus = FocusNode();
//   final FocusNode passwordFocus = FocusNode();
//   final FocusNode confirmPasswordFocus = FocusNode();
//   final FocusNode securityAnswerFocus = FocusNode();
//   final FocusNode otherDesignationFocus = FocusNode();

//   String? selectedGender;
//   String? selectedPolytechnic;
//   String? selectedBranch;
//   String? selectedCategory;
//   String? selectedDesignation;
//   String? selectedSecurityQuestion;

//   final genderOptions = ['Male', 'Female', 'Transgender'];
//   final securityQuestions = {
//     'pet_name': 'What is the name of your first pet?',
//     'school_name': 'What is the name of your first school?',
//     'birth_city': 'In which city were you born?',
//     'best_friend': 'What is the name of your childhood best friend?',
//     'favorite_food': 'What is your favorite food?',
//     'favorite_book': 'What is your favorite book?',
//     'nickname': 'What was your childhood nickname?',
//   };

//   Map<String, List<String>> designationMap = {
//     'Group A': ['HOD', 'Principal'],
//     'Group B': ['Lecturer', 'Librarian', 'Workshop Superintendent'],
//     'Group C': [
//       'Workshop Instructor',
//       'Office Employee',
//       'Computer Instructor',
//       'Computer Operator',
//       'Other',
//     ],
//   };

//   List<String> designationOptions = [];

//   void onCategoryChanged(String? value) {
//     setState(() {
//       selectedCategory = value;
//       selectedDesignation = null;
//       designationOptions = designationMap[value] ?? [];
//     });
//   }

//   void scrollToField(FocusNode focusNode) {
//     final context = focusNode.context;
//     if (context != null) {
//       Scrollable.ensureVisible(
//         context,
//         duration: const Duration(milliseconds: 300),
//         curve: Curves.easeInOut,
//         alignment:
//             0.3, // aligns field slightly above center for better visibility
//       );
//     }
//   }

//   void scrollToFirstError() {
//     _scrollController.animateTo(
//       0,
//       duration: const Duration(milliseconds: 300),
//       curve: Curves.easeIn,
//     );
//   }

//   /// ------------------- REGISTER -------------------
//   final ApiService _api = ApiService();

//   // void registerUser() async {
//   //   if (!_formKey.currentState!.validate()) {
//   //     scrollToFirstError();
//   //     return;
//   //   }

//   void registerUser() async {
//     if (!_formKey.currentState!.validate()) {
//       // Instead of just scrollToFirstError, focus on first invalid field and scroll to it

//       if (ehrmsController.text.isEmpty ||
//           !RegExp(r'^\d{6,7}$').hasMatch(ehrmsController.text)) {
//         FocusScope.of(context).requestFocus(ehrmsFocus);
//         scrollToField(ehrmsFocus);
//         return;
//       }
//       if (firstNameController.text.isEmpty ||
//           !RegExp(r'^[a-zA-Z]+$').hasMatch(firstNameController.text)) {
//         FocusScope.of(context).requestFocus(firstNameFocus);
//         scrollToField(firstNameFocus);
//         return;
//       }
//       if (middleNameController.text.isNotEmpty &&
//           !RegExp(r'^[a-zA-Z]+$').hasMatch(middleNameController.text)) {
//         FocusScope.of(context).requestFocus(middleNameFocus);
//         scrollToField(middleNameFocus);
//         return;
//       }
//       if (lastNameController.text.isNotEmpty &&
//           !RegExp(r'^[a-zA-Z]+$').hasMatch(lastNameController.text)) {
//         FocusScope.of(context).requestFocus(lastNameFocus);
//         scrollToField(lastNameFocus);
//         return;
//       }
//       // Email with stricter domain check:
//       if (emailController.text.isEmpty) {
//         FocusScope.of(context).requestFocus(emailFocus);
//         scrollToField(emailFocus);
//         return;
//       }
//       if (phoneController.text.isEmpty ||
//           !RegExp(r'^[6-9][0-9]{9}$').hasMatch(phoneController.text)) {
//         FocusScope.of(context).requestFocus(phoneFocus);
//         scrollToField(phoneFocus);
//         return;
//       }
//       if (selectedGender == null) {
//         // For dropdowns without FocusNode, just scroll top or to approximate offset
//         _scrollController.animateTo(
//           // scroll near gender dropdown
//           300, // adjust offset as needed based on layout
//           duration: const Duration(milliseconds: 300),
//           curve: Curves.easeInOut,
//         );
//         return;
//       }
//       if (selectedPolytechnic == null) {
//         _scrollController.animateTo(
//           350,
//           duration: const Duration(milliseconds: 300),
//           curve: Curves.easeInOut,
//         );
//         return;
//       }
//       if (selectedBranch == null) {
//         _scrollController.animateTo(
//           400,
//           duration: const Duration(milliseconds: 300),
//           curve: Curves.easeInOut,
//         );
//         return;
//       }
//       if (selectedCategory == null) {
//         _scrollController.animateTo(
//           450,
//           duration: const Duration(milliseconds: 300),
//           curve: Curves.easeInOut,
//         );
//         return;
//       }
//       if (selectedDesignation == null) {
//         _scrollController.animateTo(
//           500,
//           duration: const Duration(milliseconds: 300),
//           curve: Curves.easeInOut,
//         );
//         return;
//       }
//       if (selectedDesignation == 'Other' &&
//           (otherDesignationController.text.isEmpty)) {
//         FocusScope.of(context).requestFocus(otherDesignationFocus);
//         scrollToField(otherDesignationFocus);
//         return;
//       }
//       if (passwordController.text.isEmpty ||
//           passwordController.text.length < 6) {
//         FocusScope.of(context).requestFocus(passwordFocus);
//         scrollToField(passwordFocus);
//         return;
//       }
//       if (confirmPasswordController.text != passwordController.text) {
//         FocusScope.of(context).requestFocus(confirmPasswordFocus);
//         scrollToField(confirmPasswordFocus);
//         return;
//       }
//       if (selectedSecurityQuestion == null) {
//         _scrollController.animateTo(
//           600,
//           duration: const Duration(milliseconds: 300),
//           curve: Curves.easeInOut,
//         );
//         return;
//       }
//       if (securityAnswerController.text.isEmpty) {
//         FocusScope.of(context).requestFocus(securityAnswerFocus);
//         scrollToField(securityAnswerFocus);
//         return;
//       }

//       return; // stop here if any error found
//     }

//     final payload = {
//       "ehrms_code": ehrmsController.text.trim(),
//       "first_name": firstNameController.text.trim(),
//       "middle_name": middleNameController.text.trim(),
//       "last_name": lastNameController.text.trim(),
//       "email": emailController.text.trim(),
//       "mobile_number": phoneController.text.trim(),
//       "gender": selectedGender,
//       "institute_name": selectedPolytechnic,
//       "branch": selectedBranch,
//       "designation": selectedDesignation == 'Other'
//           ? otherDesignationController.text.trim()
//           : selectedDesignation,
//       "category": selectedCategory,
//       "password": passwordController.text,
//       "security_question": selectedSecurityQuestion,
//       "security_answer": securityAnswerController.text.trim(),
//     };

//     try {
//       await _api.registerUser(payload); // <- Now using the instance method
//       ScaffoldMessenger.of(context).showSnackBar(
//         const SnackBar(content: Text("Registration successful! Please login.")),
//       );
//       Navigator.pushReplacementNamed(context, '/login');
//     } catch (e) {
//       ScaffoldMessenger.of(context).showSnackBar(
//         // SnackBar(content: Text("Error: ${e.toString()}")));
//         SnackBar(content: Text(e.toString().replaceAll('Exception: ', ''))),
//       );
//     }
//   }

//   @override
//   void dispose() {
//     ehrmsFocus.dispose();
//     firstNameFocus.dispose();
//     middleNameFocus.dispose();
//     lastNameFocus.dispose();
//     middleNameFocus.dispose();
//     emailFocus.dispose();
//     phoneFocus.dispose();
//     passwordFocus.dispose();
//     confirmPasswordFocus.dispose();
//     securityAnswerFocus.dispose();
//     otherDesignationFocus.dispose();
//     super.dispose();
//   }

//   /// ------------------- UI -------------------
//   @override
//   Widget build(BuildContext context) {
//     final theme = Theme.of(context);

//     return Scaffold(
//       body: Stack(
//         children: [
//           // Watermark Background
//           Positioned.fill(
//             child: Opacity(
//               opacity: 0.08,
//               child: Image.asset(
//                 'assets/images/bg_logo.png',
//                 fit: BoxFit.cover,
//               ),
//             ),
//           ),
//           // Form Card
//           Center(
//             child: SingleChildScrollView(
//               controller: _scrollController,
//               padding: const EdgeInsets.all(16),
//               child: Card(
//                 shape: RoundedRectangleBorder(
//                   borderRadius: BorderRadius.circular(16),
//                 ),
//                 elevation: 6,
//                 child: Padding(
//                   padding: const EdgeInsets.all(20),
//                   child: Form(
//                     key: _formKey,
//                     child: Column(
//                       children: [
//                         const Text(
//                           "Register",
//                           style: TextStyle(
//                             fontSize: 28,
//                             fontWeight: FontWeight.bold,
//                             color: Colors.indigo,
//                           ),
//                         ),
//                         const SizedBox(height: 20),

//                         /// ===== Personal Details =====
//                         Align(
//                           alignment: Alignment.centerLeft,
//                           child: Text(
//                             "Personal Details",
//                             style: theme.textTheme.titleMedium?.copyWith(
//                               fontWeight: FontWeight.bold,
//                               color: Colors.indigo,
//                             ),
//                           ),
//                         ),
//                         const SizedBox(height: 10),

//                         // EHRMS Code
//                         TextFormField(
//                           controller: ehrmsController,
//                           focusNode: ehrmsFocus,
//                           keyboardType: TextInputType.number,
//                           decoration: fieldDecoration(
//                             'EHRMS Code',
//                             required: true,
//                           ),
//                           autovalidateMode: AutovalidateMode.onUserInteraction,
//                           validator: (value) => value == null || value.isEmpty
//                               ? 'Enter EHRMS Code'
//                               : (!RegExp(r'^\d{6,7}$').hasMatch(value)
//                                     ? 'Enter a valid 6 or 7 digit EHRMS Code (digits only)'
//                                     : null),
//                         ),

//                         const SizedBox(height: 16),

//                         // First Name
//                         TextFormField(
//                           controller: firstNameController,
//                           focusNode: firstNameFocus,
//                           decoration: fieldDecoration(
//                             'First Name',
//                             required: true,
//                           ),
//                           autovalidateMode: AutovalidateMode.onUserInteraction,
//                           validator: (value) => value == null || value.isEmpty
//                               ? 'Enter first name'
//                               : (!RegExp(r'^[a-zA-Z]+$').hasMatch(value)
//                                     ? 'Only alphabets allowed'
//                                     : null),
//                         ),
//                         const SizedBox(height: 16),

//                         // Middle Name
//                         TextFormField(
//                           controller: middleNameController,
//                           focusNode: middleNameFocus,
//                           decoration: fieldDecoration('Middle Name'),
//                           autovalidateMode: AutovalidateMode.onUserInteraction,
//                           validator: (value) =>
//                               (value != null &&
//                                   value.isNotEmpty &&
//                                   !RegExp(r'^[a-zA-Z]+$').hasMatch(value))
//                               ? 'Only alphabets allowed'
//                               : null,
//                         ),
//                         const SizedBox(height: 16),

//                         // Last Name
//                         TextFormField(
//                           controller: lastNameController,
//                           focusNode: lastNameFocus,
//                           decoration: fieldDecoration('Last Name'),
//                           autovalidateMode: AutovalidateMode.onUserInteraction,
//                           validator: (value) =>
//                               (value != null &&
//                                   value.isNotEmpty &&
//                                   !RegExp(r'^[a-zA-Z]+$').hasMatch(value))
//                               ? 'Only alphabets allowed'
//                               : null,
//                         ),
//                         const SizedBox(height: 16),

//                         // Email
//                         TextFormField(
//                           controller: emailController,
//                           focusNode: emailFocus,
//                           decoration: fieldDecoration(
//                             'Email ID',
//                             required: true,
//                           ),
//                           keyboardType: TextInputType.emailAddress,
//                           autovalidateMode: AutovalidateMode.onUserInteraction,
//                           validator: (value) {
//                             if (value == null || value.isEmpty) {
//                               return 'Enter email';
//                             }

//                             final emailRegex = RegExp(r'^[^@]+@[^@]+\.[^@]+$');
//                             if (!emailRegex.hasMatch(value)) {
//                               return 'Enter a valid email address';
//                             }

//                             try {
//                               // Extract parts
//                               final parts = value.split('@');
//                               final domainPart = parts[1]; // e.g., yahoo.in

//                               final domainSplit = domainPart.split('.');
//                               final baseDomain = domainSplit.first; // yahoo
//                               final tld = domainSplit.last; // in

//                               // Check base domain
//                               if (!allowedEmailDomains.contains(baseDomain)) {
//                                 return 'Email domain not allowed';
//                               }

//                               // Check TLD
//                               if (!allowedEmailTLDs.contains(tld)) {
//                                 return 'Email TLD not allowed';
//                               }
//                             } catch (e) {
//                               return 'Invalid email format';
//                             }

//                             return null; // valid
//                           },
//                         ),
//                         const SizedBox(height: 16),

//                         // Phone
//                         TextFormField(
//                           controller: phoneController,
//                           focusNode: phoneFocus,
//                           keyboardType: TextInputType.phone,
//                           decoration: fieldDecoration(
//                             'Mobile No.',
//                             required: true,
//                           ),
//                           autovalidateMode: AutovalidateMode.onUserInteraction,
//                           validator: (value) => value == null || value.isEmpty
//                               ? 'Enter mobile number'
//                               : (!RegExp(r'^[6-9][0-9]{9}$').hasMatch(value)
//                                     ? 'Enter a valid 10-digit mobile number'
//                                     : null),
//                         ),
//                         const SizedBox(height: 16),

//                         // Gender
//                         DropdownButtonFormField<String>(
//                           decoration: fieldDecoration('Gender', required: true),
//                           value: selectedGender,
//                           isExpanded: true,
//                           items: genderOptions
//                               .map(
//                                 (g) => DropdownMenuItem(
//                                   value: g,
//                                   child: buildBoxedDropdownItem(g, context),
//                                 ),
//                               )
//                               .toList(),
//                           selectedItemBuilder: (context) => genderOptions
//                               .map((g) => buildSelectedItem(g))
//                               .toList(),
//                           onChanged: (val) =>
//                               setState(() => selectedGender = val),
//                           validator: (value) =>
//                               value == null ? 'Select gender' : null,
//                         ),
//                         const SizedBox(height: 16),

//                         // Polytechnic
//                         DropdownButtonFormField<String>(
//                           isExpanded: true,
//                           decoration: fieldDecoration(
//                             'Select Polytechnic',
//                             required: true,
//                           ),
//                           value: selectedPolytechnic,
//                           items: polytechnicOptions
//                               .map(
//                                 (p) => DropdownMenuItem(
//                                   value: p,
//                                   child: buildBoxedDropdownItem(p, context),
//                                 ),
//                               )
//                               .toList(),
//                           selectedItemBuilder: (context) => polytechnicOptions
//                               .map((p) => buildSelectedItem(p))
//                               .toList(),
//                           onChanged: (val) =>
//                               setState(() => selectedPolytechnic = val),
//                           validator: (value) =>
//                               value == null ? 'Select polytechnic' : null,
//                         ),
//                         const SizedBox(height: 16),

//                         // Branch
//                         DropdownButtonFormField<String>(
//                           isExpanded: true,
//                           decoration: fieldDecoration('Branch', required: true),
//                           value: selectedBranch,
//                           items: branchOptions
//                               .map(
//                                 (b) => DropdownMenuItem(
//                                   value: b,
//                                   child: buildBoxedDropdownItem(b, context),
//                                 ),
//                               )
//                               .toList(),
//                           selectedItemBuilder: (context) => branchOptions
//                               .map((b) => buildSelectedItem(b))
//                               .toList(),
//                           onChanged: (val) =>
//                               setState(() => selectedBranch = val),
//                           validator: (value) =>
//                               value == null ? 'Select branch' : null,
//                         ),
//                         const SizedBox(height: 16),

//                         // Category
//                         DropdownButtonFormField<String>(
//                           isExpanded: true,
//                           decoration: fieldDecoration(
//                             'Category of Employee',
//                             required: true,
//                           ),
//                           value: selectedCategory,
//                           items: ['Group A', 'Group B', 'Group C']
//                               .map(
//                                 (g) => DropdownMenuItem(
//                                   value: g,
//                                   child: buildBoxedDropdownItem(g, context),
//                                 ),
//                               )
//                               .toList(),
//                           selectedItemBuilder: (context) => [
//                             'Group A',
//                             'Group B',
//                             'Group C',
//                           ].map((g) => buildSelectedItem(g)).toList(),
//                           onChanged: onCategoryChanged,
//                           validator: (value) =>
//                               value == null ? 'Select category' : null,
//                         ),
//                         const SizedBox(height: 16),

//                         // Designation
//                         DropdownButtonFormField<String>(
//                           isExpanded: true,
//                           decoration: fieldDecoration(
//                             'Designation',
//                             required: true,
//                           ),
//                           value: selectedDesignation,
//                           items: designationOptions
//                               .map(
//                                 (d) => DropdownMenuItem(
//                                   value: d,
//                                   child: buildBoxedDropdownItem(d, context),
//                                 ),
//                               )
//                               .toList(),
//                           selectedItemBuilder: (context) => designationOptions
//                               .map((d) => buildSelectedItem(d))
//                               .toList(),
//                           onChanged: (val) =>
//                               setState(() => selectedDesignation = val),
//                           validator: (value) =>
//                               value == null ? 'Select designation' : null,
//                         ),
//                         if (selectedDesignation == 'Other') ...[
//                           const SizedBox(height: 16),
//                           TextFormField(
//                             controller: otherDesignationController,
//                             focusNode: otherDesignationFocus,
//                             decoration: fieldDecoration(
//                               'Enter Other Designation',
//                               required: true,
//                             ),
//                             autovalidateMode:
//                                 AutovalidateMode.onUserInteraction,
//                             validator: (value) => value == null || value.isEmpty
//                                 ? 'Enter designation'
//                                 : null,
//                           ),
//                         ],

//                         const SizedBox(height: 25),

//                         /// ===== Login Details =====
//                         Align(
//                           alignment: Alignment.centerLeft,
//                           child: Text(
//                             "Login Details",
//                             style: theme.textTheme.titleMedium?.copyWith(
//                               fontWeight: FontWeight.bold,
//                               color: Colors.indigo,
//                             ),
//                           ),
//                         ),
//                         const SizedBox(height: 10),

//                         // Password
//                         TextFormField(
//                           controller: passwordController,
//                           focusNode: passwordFocus,
//                           obscureText: true,
//                           decoration: fieldDecoration(
//                             'Password',
//                             required: true,
//                           ),
//                           autovalidateMode: AutovalidateMode.onUserInteraction,
//                           validator: (value) {
//                             if (value == null || value.isEmpty)
//                               return 'Enter password';
//                             if (value.length < 6 ||
//                                 !RegExp(r'[A-Z]').hasMatch(value) ||
//                                 !RegExp(r'[0-9]').hasMatch(value)) {
//                               return 'Password must be 6+ chars, include uppercase & number';
//                             }
//                             return null;
//                           },
//                         ),
//                         const SizedBox(height: 16),

//                         // Confirm Password
//                         TextFormField(
//                           controller: confirmPasswordController,
//                           focusNode: confirmPasswordFocus,
//                           obscureText: true,
//                           decoration: fieldDecoration(
//                             'Confirm Password',
//                             required: true,
//                           ),
//                           autovalidateMode: AutovalidateMode.onUserInteraction,
//                           validator: (value) => value != passwordController.text
//                               ? 'Passwords do not match'
//                               : null,
//                         ),

//                         const SizedBox(height: 25),

//                         /// ===== Security =====
//                         Align(
//                           alignment: Alignment.centerLeft,
//                           child: Text(
//                             "Security",
//                             style: theme.textTheme.titleMedium?.copyWith(
//                               fontWeight: FontWeight.bold,
//                               color: Colors.indigo,
//                             ),
//                           ),
//                         ),
//                         const SizedBox(height: 10),

//                         // Security Question
//                         DropdownButtonFormField<String>(
//                           isExpanded: true,
//                           decoration: fieldDecoration(
//                             'Security Question',
//                             required: true,
//                           ),
//                           value: selectedSecurityQuestion,
//                           items: securityQuestions.entries
//                               .map(
//                                 (entry) => DropdownMenuItem(
//                                   value: entry.key,
//                                   child: buildBoxedDropdownItem(
//                                     entry.value,
//                                     context,
//                                   ),
//                                 ),
//                               )
//                               .toList(),
//                           selectedItemBuilder: (context) => securityQuestions
//                               .entries
//                               .map((entry) => buildSelectedItem(entry.value))
//                               .toList(),
//                           onChanged: (val) =>
//                               setState(() => selectedSecurityQuestion = val),
//                           validator: (value) =>
//                               value == null ? 'Select a question' : null,
//                         ),
//                         const SizedBox(height: 16),

//                         // Security Answer
//                         TextFormField(
//                           controller: securityAnswerController,
//                           focusNode: securityAnswerFocus,
//                           decoration: fieldDecoration(
//                             'Security Answer',
//                             required: true,
//                           ),
//                           autovalidateMode: AutovalidateMode.onUserInteraction,
//                           validator: (value) => value == null || value.isEmpty
//                               ? 'Enter answer'
//                               : null,
//                         ),

//                         const SizedBox(height: 24),

//                         ElevatedButton(
//                           onPressed: registerUser,
//                           style: ElevatedButton.styleFrom(
//                             backgroundColor: Colors.indigo,
//                             minimumSize: const Size(double.infinity, 50),
//                           ),
//                           child: const Text("Register"),
//                         ),
//                         const SizedBox(height: 12),
//                         TextButton(
//                           onPressed: () =>
//                               Navigator.pushNamed(context, '/login'),
//                           child: const Text(
//                             "Already registered? Login here",
//                             style: TextStyle(color: Colors.indigo),
//                           ),
//                         ),
//                       ],
//                     ),
//                   ),
//                 ),
//               ),
//             ),
//           ),
//         ],
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
  static const allowedEmailDomains = [
    "gmail",
    "yahoo",
    "outlook",
    "hotmail",
    "rediffmail",
    "icloud",
    "protonmail",
    "zoho",
    "aol",
    "yandex",
    "mail",
    "gmx",
    "nic",
    "gov",
    "edu",
    "irdt",
    "ramauniversity",
  ];

  static const allowedEmailTLDs = [
    // Single-part TLDs
    "com",
    "in",
    "org",
    "net",
    "edu",
    "gov",
    "mil",
    "co",
    "info",
    "biz",
    "io",
    "me",

    // Common multi-part TLDs
    "co.in",
    "ac.in",
    "gov.in",
    "edu.in",
    "res.in",
    "nic.in",
  ];

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

  final FocusNode ehrmsFocus = FocusNode();
  final FocusNode firstNameFocus = FocusNode();
  final FocusNode middleNameFocus = FocusNode();
  final FocusNode lastNameFocus = FocusNode();
  final FocusNode emailFocus = FocusNode();
  final FocusNode phoneFocus = FocusNode();
  final FocusNode passwordFocus = FocusNode();
  final FocusNode confirmPasswordFocus = FocusNode();
  final FocusNode securityAnswerFocus = FocusNode();
  final FocusNode securityQuestionFocus = FocusNode();
  final FocusNode polytechnicFocus = FocusNode();
  final FocusNode branchFocus = FocusNode();
  final FocusNode categoryFocus = FocusNode();
  final FocusNode designationFocus = FocusNode();

  final FocusNode otherDesignationFocus = FocusNode();

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
    'nickname': 'What was your childhood nickname?',
  };

  Map<String, List<String>> designationMap = {
    'Group A': ['HOD', 'Principal'],
    'Group B': ['Lecturer', 'Librarian', 'Workshop Superintendent'],
    'Group C': [
      'Workshop Instructor',
      'Office Employee',
      'Computer Instructor',
      'Computer Operator',
      'Other',
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

  void scrollToField(FocusNode focusNode) {
    final context = focusNode.context;
    if (context != null) {
      Scrollable.ensureVisible(
        context,
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
        alignment:
            0.3, // aligns field slightly above center for better visibility
      );
    }
  }

  void scrollToFirstError() {
    _scrollController.animateTo(
      0,
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeIn,
    );
  }

  String? validateEmailValue(
    String? value,
    List<String> allowedEmailDomains,
    List<String> allowedEmailTLDs,
  ) {
    if (value == null || value.isEmpty) {
      return 'Enter email';
    }

    final emailRegex = RegExp(r'^[^@]+@[^@]+\.[^@]+$');
    if (!emailRegex.hasMatch(value)) {
      return 'Enter a valid email address';
    }

    try {
      final parts = value.split('@');
      final domainSplit = parts[1].split('.');

      final baseDomain = domainSplit.first.toLowerCase();
      final tld = domainSplit.length > 2
          ? '${domainSplit[domainSplit.length - 2]}.${domainSplit.last}'
                .toLowerCase()
          : domainSplit.last.toLowerCase();

      if (!allowedEmailDomains.contains(baseDomain)) {
        return 'Email domain not allowed';
      }
      if (!allowedEmailTLDs.contains(tld)) {
        return 'Email TLD not allowed';
      }
    } catch (_) {
      return 'Invalid email format';
    }

    return null; // valid
  }

  /// ------------------- REGISTER -------------------
  final ApiService _api = ApiService();

  void registerUser() async {
    if (!_validatePage3()) {
      _goNext();
      return;
    }

    // Build payload
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
          : selectedDesignation ?? '',
      "category": selectedCategory,
      "password": passwordController.text,
      "security_question": selectedSecurityQuestion,
      "security_answer": securityAnswerController.text.trim(),
    };

    // Call API
    try {
      await _api.registerUser(payload);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Registration successful! Please login.")),
      );
      Navigator.pushReplacementNamed(context, '/login');
    } catch (e) {
      final message = e.toString().replaceAll('Exception: ', '');
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text(message)));
    }
  }

  // --- Paging state ---
  final PageController _pageController = PageController();
  int _currentPage = 0;

  void _goNext() {
    if (_currentPage == 0) {
      // Validate Page 1 before moving to Page 2
      if (_validatePage1()) {
        setState(() => _currentPage = 1);
        _pageController.animateToPage(
          1,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeInOut,
        );
      }
    } else if (_currentPage == 1) {
      // Validate Page 2 before moving to Page 3
      if (_validatePage2()) {
        setState(() => _currentPage = 2);
        _pageController.animateToPage(
          2,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeInOut,
        );
      }
    }
  }

  void _goBack() {
    if (_currentPage == 2) {
      setState(() => _currentPage = 1);
      _pageController.animateToPage(
        1,
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    } else if (_currentPage == 1) {
      setState(() => _currentPage = 0);
      _pageController.animateToPage(
        0,
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    }
  }

  /// Validate only the "Personal Details" fields (Page 1).
  /// Triggers autovalidation visuals and focuses the first invalid field.
  bool _validatePage1() {
    // Trigger field validators so UI shows errors
    _formKey.currentState?.validate();

    // First invalid → focus & scroll (same style as your registerUser logic)
    if (firstNameController.text.isEmpty ||
        !RegExp(r'^[a-zA-Z]+$').hasMatch(firstNameController.text)) {
      FocusScope.of(context).requestFocus(firstNameFocus);
      scrollToField(firstNameFocus);
      return false;
    }

    if (middleNameController.text.isNotEmpty &&
        !RegExp(r'^[a-zA-Z]+$').hasMatch(middleNameController.text)) {
      FocusScope.of(context).requestFocus(middleNameFocus);
      scrollToField(middleNameFocus);
      return false;
    }

    if (lastNameController.text.isNotEmpty &&
        !RegExp(r'^[a-zA-Z]+$').hasMatch(lastNameController.text)) {
      FocusScope.of(context).requestFocus(lastNameFocus);
      scrollToField(lastNameFocus);
      return false;
    }

    // Email (with your domain/tld checks)
    final emailError = validateEmailValue(
      emailController.text,
      allowedEmailDomains,
      allowedEmailTLDs,
    );
    if (emailError != null) {
      FocusScope.of(context).requestFocus(emailFocus);
      scrollToField(emailFocus);
      return false;
    }

    if (phoneController.text.isEmpty ||
        !RegExp(r'^[6-9][0-9]{9}$').hasMatch(phoneController.text)) {
      FocusScope.of(context).requestFocus(phoneFocus);
      scrollToField(phoneFocus);
      return false;
    }

    if (selectedGender == null) {
      _scrollController.animateTo(
        300,
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
      return false;
    }

    return true;
  }

  /// Validate only the "Professional Details" fields (Page 2)
  bool _validatePage2() {
    // Trigger field validators
    _formKey.currentState?.validate();

    // Polytechnic
    if (selectedPolytechnic == null) {
      // Focus the dropdown by temporarily giving it a FocusNode
      FocusScope.of(context).requestFocus(FocusNode());
      scrollToField(
        ehrmsFocus,
      ); // or create a dedicated FocusNode for polytechnic if needed
      return false;
    }

    // Branch
    if (selectedBranch == null) {
      FocusScope.of(context).requestFocus(FocusNode());
      scrollToField(
        ehrmsFocus,
      ); // same as above, ideally a FocusNode for branch
      return false;
    }

    // Category
    if (selectedCategory == null) {
      FocusScope.of(context).requestFocus(FocusNode());
      scrollToField(ehrmsFocus);
      return false;
    }

    // Designation
    if (selectedDesignation == null) {
      FocusScope.of(context).requestFocus(FocusNode());
      scrollToField(ehrmsFocus);
      return false;
    }

    // Other designation
    if (selectedDesignation == 'Other' &&
        (otherDesignationController.text.isEmpty)) {
      FocusScope.of(context).requestFocus(otherDesignationFocus);
      scrollToField(otherDesignationFocus);
      return false;
    }

    return true;
  }

  /// Validate only the "Login & Security Details" fields (Page 3)
  bool _validatePage3() {
    _formKey.currentState?.validate(); // show field error messages

    // EHRMS Code
    if (ehrmsController.text.isEmpty ||
        !RegExp(r'^\d{6,7}$').hasMatch(ehrmsController.text)) {
      FocusScope.of(context).requestFocus(ehrmsFocus);
      scrollToField(ehrmsFocus);
      return false;
    }

    // Password: at least 6 chars, 1 uppercase, 1 lowercase, 1 number
    final password = passwordController.text;
    if (password.isEmpty ||
        password.length < 6 ||
        !RegExp(r'[A-Z]').hasMatch(password) ||
        !RegExp(r'[a-z]').hasMatch(password) ||
        !RegExp(r'[0-9]').hasMatch(password)) {
      FocusScope.of(context).requestFocus(passwordFocus);
      scrollToField(passwordFocus);
      return false;
    }

    // Confirm Password
    if (confirmPasswordController.text != passwordController.text) {
      FocusScope.of(context).requestFocus(confirmPasswordFocus);
      scrollToField(confirmPasswordFocus);
      return false;
    }

    // Security Question
    if (selectedSecurityQuestion == null) {
      FocusScope.of(context).requestFocus(securityQuestionFocus);
      scrollToField(securityQuestionFocus);
      return false;
    }

    // Security Answer
    if (securityAnswerController.text.isEmpty) {
      FocusScope.of(context).requestFocus(securityAnswerFocus);
      scrollToField(securityAnswerFocus);
      return false;
    }

    return true;
  }

  @override
  @override
  void dispose() {
    // Text Field FocusNodes
    ehrmsFocus.dispose();
    firstNameFocus.dispose();
    middleNameFocus.dispose();
    lastNameFocus.dispose();
    emailFocus.dispose();
    phoneFocus.dispose();
    passwordFocus.dispose();
    confirmPasswordFocus.dispose();
    securityAnswerFocus.dispose();
    otherDesignationFocus.dispose();

    // Dropdown FocusNodes (for better Page 2 scrolling)
    polytechnicFocus.dispose();
    branchFocus.dispose();
    categoryFocus.dispose();
    designationFocus.dispose();

    // Controllers
    ehrmsController.dispose();
    firstNameController.dispose();
    middleNameController.dispose();
    lastNameController.dispose();
    emailController.dispose();
    phoneController.dispose();
    passwordController.dispose();
    confirmPasswordController.dispose();
    securityAnswerController.dispose();
    otherDesignationController.dispose();

    // Page controller
    _pageController.dispose();
    _scrollController.dispose();

    super.dispose();
  }

  // ---------- Page 1: Personal Details ----------
  Widget _buildPersonalDetails(ThemeData theme) {
    return SingleChildScrollView(
      padding: const EdgeInsets.only(bottom: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            "Personal Details",
            style: theme.textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.bold,
              color: Colors.indigo,
            ),
          ),
          const SizedBox(height: 10),

          // First Name
          TextFormField(
            controller: firstNameController,
            focusNode: firstNameFocus,
            decoration: fieldDecoration('First Name', required: true),
            autovalidateMode: AutovalidateMode.onUserInteraction,
            validator: (value) => value == null || value.isEmpty
                ? 'Enter first name'
                : (!RegExp(r'^[a-zA-Z]+$').hasMatch(value)
                      ? 'Only alphabets allowed'
                      : null),
          ),
          const SizedBox(height: 16),

          // Middle Name
          TextFormField(
            controller: middleNameController,
            focusNode: middleNameFocus,
            decoration: fieldDecoration('Middle Name'),
            autovalidateMode: AutovalidateMode.onUserInteraction,
            validator: (value) =>
                (value != null &&
                    value.isNotEmpty &&
                    !RegExp(r'^[a-zA-Z]+$').hasMatch(value))
                ? 'Only alphabets allowed'
                : null,
          ),
          const SizedBox(height: 16),

          // Last Name
          TextFormField(
            controller: lastNameController,
            focusNode: lastNameFocus,
            decoration: fieldDecoration('Last Name'),
            autovalidateMode: AutovalidateMode.onUserInteraction,
            validator: (value) =>
                (value != null &&
                    value.isNotEmpty &&
                    !RegExp(r'^[a-zA-Z]+$').hasMatch(value))
                ? 'Only alphabets allowed'
                : null,
          ),
          const SizedBox(height: 16),

          // Email
          TextFormField(
            controller: emailController,
            focusNode: emailFocus,
            decoration: fieldDecoration('Email ID', required: true),
            keyboardType: TextInputType.emailAddress,
            autovalidateMode: AutovalidateMode.onUserInteraction,
            validator: (value) => validateEmailValue(
              value,
              allowedEmailDomains,
              allowedEmailTLDs,
            ),
          ),
          const SizedBox(height: 16),

          // Phone
          TextFormField(
            controller: phoneController,
            focusNode: phoneFocus,
            keyboardType: TextInputType.phone,
            decoration: fieldDecoration('Mobile No.', required: true),
            autovalidateMode: AutovalidateMode.onUserInteraction,
            validator: (value) => value == null || value.isEmpty
                ? 'Enter mobile number'
                : (!RegExp(r'^[6-9][0-9]{9}$').hasMatch(value)
                      ? 'Enter a valid 10-digit mobile number'
                      : null),
          ),
          const SizedBox(height: 16),

          // Gender
          DropdownButtonFormField<String>(
            decoration: fieldDecoration('Gender', required: true),
            autovalidateMode: AutovalidateMode.onUserInteraction,
            value: selectedGender,
            isExpanded: true,
            items: genderOptions
                .map(
                  (g) => DropdownMenuItem(
                    value: g,
                    child: buildBoxedDropdownItem(g, context),
                  ),
                )
                .toList(),
            selectedItemBuilder: (context) =>
                genderOptions.map((g) => buildSelectedItem(g)).toList(),
            onChanged: (val) => setState(() => selectedGender = val),
            validator: (value) => value == null ? 'Select gender' : null,
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }

  //  ---------- Page 2: Professional Details ----------
  Widget _buildProfessionalDetails(ThemeData theme) {
    return SingleChildScrollView(
      padding: const EdgeInsets.only(bottom: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            "Professional Details",
            style: theme.textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.bold,
              color: Colors.indigo,
            ),
          ),
          const SizedBox(height: 10),

          // Polytechnic
          DropdownButtonFormField<String>(
            isExpanded: true,
            focusNode: polytechnicFocus,
            decoration: fieldDecoration('Select Polytechnic', required: true),
            autovalidateMode: AutovalidateMode.onUserInteraction,
            value: selectedPolytechnic,
            items: polytechnicOptions
                .map(
                  (p) => DropdownMenuItem(
                    value: p,
                    child: buildBoxedDropdownItem(p, context),
                  ),
                )
                .toList(),
            selectedItemBuilder: (context) =>
                polytechnicOptions.map((p) => buildSelectedItem(p)).toList(),
            onChanged: (val) => setState(() => selectedPolytechnic = val),
            validator: (value) => value == null ? 'Select polytechnic' : null,
          ),
          const SizedBox(height: 16),

          // Branch
          DropdownButtonFormField<String>(
            isExpanded: true,
            focusNode: branchFocus,
            decoration: fieldDecoration('Branch', required: true),
            autovalidateMode: AutovalidateMode.onUserInteraction,
            value: selectedBranch,
            items: branchOptions
                .map(
                  (b) => DropdownMenuItem(
                    value: b,
                    child: buildBoxedDropdownItem(b, context),
                  ),
                )
                .toList(),
            selectedItemBuilder: (context) =>
                branchOptions.map((b) => buildSelectedItem(b)).toList(),
            onChanged: (val) => setState(() => selectedBranch = val),
            validator: (value) => value == null ? 'Select branch' : null,
          ),
          const SizedBox(height: 16),

          // Category
          DropdownButtonFormField<String>(
            isExpanded: true,
            focusNode: categoryFocus,
            decoration: fieldDecoration('Category of Employee', required: true),
            autovalidateMode: AutovalidateMode.onUserInteraction,
            value: selectedCategory,
            items: ['Group A', 'Group B', 'Group C']
                .map(
                  (g) => DropdownMenuItem(
                    value: g,
                    child: buildBoxedDropdownItem(g, context),
                  ),
                )
                .toList(),
            selectedItemBuilder: (context) => [
              'Group A',
              'Group B',
              'Group C',
            ].map((g) => buildSelectedItem(g)).toList(),
            onChanged: onCategoryChanged,
            validator: (value) => value == null ? 'Select category' : null,
          ),
          const SizedBox(height: 16),

          // Designation
          DropdownButtonFormField<String>(
            isExpanded: true,
            focusNode: designationFocus,
            decoration: fieldDecoration('Designation', required: true),
            autovalidateMode: AutovalidateMode.onUserInteraction,
            value: selectedDesignation,
            items: designationOptions
                .map(
                  (d) => DropdownMenuItem(
                    value: d,
                    child: buildBoxedDropdownItem(d, context),
                  ),
                )
                .toList(),
            selectedItemBuilder: (context) =>
                designationOptions.map((d) => buildSelectedItem(d)).toList(),
            onChanged: (val) => setState(() => selectedDesignation = val),
            validator: (value) => value == null ? 'Select designation' : null,
          ),
          if (selectedDesignation == 'Other') ...[
            const SizedBox(height: 16),
            TextFormField(
              controller: otherDesignationController,
              focusNode: otherDesignationFocus,
              decoration: fieldDecoration(
                'Enter Other Designation',
                required: true,
              ),
              autovalidateMode: AutovalidateMode.onUserInteraction,
              validator: (value) =>
                  value == null || value.isEmpty ? 'Enter designation' : null,
            ),
          ],
        ],
      ),
    );
  }

  // ---------- Page 3: Login & Security ----------
  Widget _buildLoginSecurity(ThemeData theme) {
    return SingleChildScrollView(
      padding: const EdgeInsets.only(bottom: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            "Login Details",
            style: theme.textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.bold,
              color: Colors.indigo,
            ),
          ),
          const SizedBox(height: 10),

          TextFormField(
            controller: ehrmsController,
            focusNode: ehrmsFocus,
            keyboardType: TextInputType.number,
            decoration: fieldDecoration('EHRMS Code', required: true),
            autovalidateMode: AutovalidateMode.onUserInteraction,
            validator: (value) => value == null || value.isEmpty
                ? 'Enter EHRMS Code'
                : (!RegExp(r'^\d{6,7}$').hasMatch(value)
                      ? 'Enter a valid 6 or 7 digit EHRMS Code (digits only)'
                      : null),
          ),
          const SizedBox(height: 16),

          // Password
          TextFormField(
            controller: passwordController,
            focusNode: passwordFocus,
            obscureText: true,
            decoration: fieldDecoration('Password', required: true),
            autovalidateMode: AutovalidateMode.onUserInteraction,
            validator: (value) {
              if (value == null || value.isEmpty) return 'Enter password';
              if (value.length < 6 ||
                  !RegExp(r'[A-Z]').hasMatch(value) || // uppercase
                  !RegExp(r'[a-z]').hasMatch(value) || // lowercase
                  !RegExp(r'[0-9]').hasMatch(value)) {
                // number
                return 'Password must be 6+ chars, include uppercase, lowercase & number';
              }
              return null;
            },
          ),
          const SizedBox(height: 16),

          // Confirm Password
          TextFormField(
            controller: confirmPasswordController,
            focusNode: confirmPasswordFocus,
            obscureText: true,
            decoration: fieldDecoration('Confirm Password', required: true),
            autovalidateMode: AutovalidateMode.onUserInteraction,
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Confirm your password';
              }
              if (value != passwordController.text) {
                return 'Passwords do not match';
              }
              return null;
            },
          ),

          const SizedBox(height: 25),

          Text(
            "Security",
            style: theme.textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.bold,
              color: Colors.indigo,
            ),
          ),
          const SizedBox(height: 10),

          // Security Question
          DropdownButtonFormField<String>(
            isExpanded: true,
            decoration: fieldDecoration('Security Question', required: true),
            autovalidateMode: AutovalidateMode.onUserInteraction,
            value: selectedSecurityQuestion,
            items: securityQuestions.entries
                .map(
                  (entry) => DropdownMenuItem(
                    value: entry.key,
                    child: buildBoxedDropdownItem(entry.value, context),
                  ),
                )
                .toList(),
            selectedItemBuilder: (context) => securityQuestions.entries
                .map((entry) => buildSelectedItem(entry.value))
                .toList(),
            onChanged: (val) => setState(() => selectedSecurityQuestion = val),
            validator: (value) => value == null ? 'Select a question' : null,
          ),
          const SizedBox(height: 16),

          // Security Answer
          TextFormField(
            controller: securityAnswerController,
            focusNode: securityAnswerFocus,
            decoration: fieldDecoration('Security Answer', required: true),
            autovalidateMode: AutovalidateMode.onUserInteraction,
            validator: (value) =>
                value == null || value.isEmpty ? 'Enter answer' : null,
          ),

          const SizedBox(height: 12),
        ],
      ),
    );
  }

  /// ------------------- UI -------------------
  /// ------------------- UI -------------------
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isSmall =
        MediaQuery.of(context).size.width < 360; // tiny screen tweak

    return Scaffold(
      body: Stack(
        children: [
          // Watermark Background
          Positioned.fill(
            child: Opacity(
              opacity: 0.08,
              child: Image.asset(
                'assets/images/bg_logo.png',
                fit: BoxFit.cover,
              ),
            ),
          ),

          // Form Card
          Center(
            child: SingleChildScrollView(
              controller: _scrollController,
              padding: const EdgeInsets.all(16),
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 640),
                child: Card(
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                  elevation: 6,
                  child: Padding(
                    padding: EdgeInsets.all(isSmall ? 16 : 20),
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

                          // --------- PAGER (2 steps) ----------
                          SizedBox(
                            height: // keep the page tall enough for most content
                                MediaQuery.of(context).size.height * 0.70,
                            child: PageView(
                              controller: _pageController,
                              physics: const NeverScrollableScrollPhysics(),
                              children: [
                                // ---------- Page 1: Personal Details ----------
                                _buildPersonalDetails(theme),
                                // --------- Page 2: Professional Details -----------
                                _buildProfessionalDetails(theme),
                                // ---------- Page 3: Login & Security ----------
                                _buildLoginSecurity(theme),
                              ],
                            ),
                          ),

                          const SizedBox(height: 16),

                          // --------- Navigation row ----------
                          Row(
                            children: [
                              if (_currentPage > 0)
                                OutlinedButton(
                                  onPressed: _goBack,
                                  style: OutlinedButton.styleFrom(
                                    minimumSize: const Size(100, 48),
                                  ),
                                  child: const Text(
                                    "Back",
                                    style: TextStyle(color: Colors.black),
                                  ),
                                )
                              else
                                const SizedBox(width: 0, height: 0),

                              const Spacer(),

                              if (_currentPage < 2)
                                ElevatedButton(
                                  onPressed: _goNext,
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.indigo,
                                    minimumSize: const Size(120, 48),
                                  ),
                                  child: const Text("Next"),
                                )
                              else
                                ElevatedButton(
                                  onPressed: registerUser,
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.indigo,
                                    minimumSize: const Size(140, 48),
                                  ),
                                  child: const Text("Register"),
                                ),
                            ],
                          ),
                        ],
                      ),
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
