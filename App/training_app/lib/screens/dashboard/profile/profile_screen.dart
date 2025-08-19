import 'dart:io';
import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../../core/services/api_service.dart';
import 'profile_widgets.dart';
import 'package:image_picker/image_picker.dart';
import '../../../core/constants.dart';
import '../../../core/validators.dart';
import '../../../data/polytechnic_list.dart';
import '../../../data/branch_list.dart';
import '../../../widgets/dropdown_item_box.dart';
import '../../../widgets/ui_helpers.dart';

class ProfileScreen extends StatefulWidget {
  final VoidCallback? onProfileUpdated;
  const ProfileScreen({Key? key, this.onProfileUpdated}) : super(key: key);
  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final ApiService _api = ApiService();
  File? _profileImage;
  bool isLoading = true;

  Map<String, dynamic> userDetails = {
    "Name": "",
    "EHRMS Code": "",
    "Institute": "",
    "Email": "",
    "Mobile": "",
    "Branch": "",
    "Gender": "",
    "Designation": "",
    "Photo": "",
  };

  final Map<String, IconData> iconMap = {
    "EHRMS Code": Icons.badge,
    "Institute": Icons.school,
    "Email": Icons.email,
    "Mobile": Icons.phone,
    "Branch": Icons.account_tree,
    "Gender": Icons.person,
    "Designation": Icons.work_outline,
  };

  @override
  void initState() {
    super.initState();
    fetchProfile();
  }

  Future<void> fetchProfile() async {
    setState(() => isLoading = true);
    final data = await _api.getProfile();
    if (data != null) {
      final prefs = await SharedPreferences.getInstance();
      final photoUrl = data['profile_picture'] ?? "";
      await prefs.setString('profile_photo_url', photoUrl);
      await prefs.setString('name', data['name'] ?? "");

      setState(() {
        userDetails = {
          "Name": data['name'] ?? "",
          "EHRMS Code": data['ehrms_code'] ?? "",
          "Institute": data['institute_name'] ?? "",
          "Email": data['email'] ?? "",
          "Mobile": data['mobile_number'] ?? "",
          "Branch": data['branch'] ?? "",
          "Gender": data['gender'] ?? "",
          "Designation": data['designation'] ?? "",
          "Photo": photoUrl,
        };
        _profileImage = null;
        isLoading = false;
      });
    } else {
      Navigator.pushReplacementNamed(context, '/login');
    }
  }

  Future<void> uploadPhoto() async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(source: ImageSource.gallery);
    if (pickedFile == null) return;

    final newUrl = await _api.uploadPhoto(File(pickedFile.path));
    if (newUrl != null) {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('profile_photo_url', newUrl);

      setState(() {
        _profileImage = File(pickedFile.path);
        userDetails['Photo'] = newUrl.isNotEmpty
            ? newUrl
            : userDetails['Photo'];
      });

      widget.onProfileUpdated?.call();
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Photo uploaded successfully')),
      );
    } else {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Photo upload failed')));
    }
  }

  Future<void> removePhoto() async {
    final newUrl = await _api.removePhoto();
    if (newUrl != null) {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('profile_photo_url', newUrl);

      setState(() {
        userDetails['Photo'] = newUrl.isNotEmpty
            ? newUrl
            : userDetails['Photo'];
        _profileImage = null;
      });

      widget.onProfileUpdated?.call();
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Photo removed successfully')),
      );
    } else {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Failed to remove photo')));
    }
  }

  // void _openEditDialog() {
  //   final emailController = TextEditingController(text: userDetails["Email"]);
  //   final mobileController = TextEditingController(text: userDetails["Mobile"]);
  //   final customDesignationController = TextEditingController();

  //   final institutes = polytechnicOptions;
  //   final branches = branchOptions;

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
  //   List<String> allDesignations = designationMap.values
  //       .expand((list) => list)
  //       .toList();

  //   String? selectedInstitute = institutes.contains(userDetails["Institute"])
  //       ? userDetails["Institute"]
  //       : null;

  //   String? selectedBranch = branches.contains(userDetails["Branch"])
  //       ? userDetails["Branch"]
  //       : null;
  //   String? selectedDesignation =
  //       allDesignations.contains(userDetails["Designation"])
  //       ? userDetails["Designation"]
  //       : null;

  //   final _formKey = GlobalKey<FormState>();

  //   showDialog(
  //     context: context,
  //     builder: (context) {
  //       // Wrap content in StatefulBuilder to allow setState inside dialog
  //       return StatefulBuilder(
  //         builder: (context, setState) {
  //           return Dialog(
  //             shape: RoundedRectangleBorder(
  //               borderRadius: BorderRadius.circular(16),
  //             ),
  //             child: SingleChildScrollView(
  //               padding: const EdgeInsets.all(20),
  //               child: Form(
  //                 key: _formKey,
  //                 child: Column(
  //                   mainAxisSize: MainAxisSize.min,
  //                   crossAxisAlignment: CrossAxisAlignment.start,
  //                   children: [
  //                     const Text(
  //                       "Edit Profile",
  //                       style: TextStyle(
  //                         fontSize: 20,
  //                         fontWeight: FontWeight.bold,
  //                       ),
  //                     ),
  //                     const SizedBox(height: 20),

  //                     // Email
  //                     TextFormField(
  //                       controller: emailController,
  //                       decoration: InputDecoration(
  //                         labelText: "Email",
  //                         border: OutlineInputBorder(
  //                           borderRadius: BorderRadius.circular(8),
  //                         ),
  //                       ),
  //                       autovalidateMode: AutovalidateMode.onUserInteraction,
  //                       validator: (value) => validateEmailValue(
  //                         value,
  //                         allowedEmailDomains,
  //                         allowedEmailTLDs,
  //                       ), // imported from register page
  //                     ),
  //                     const SizedBox(height: 15),

  //                     // Mobile
  //                     TextFormField(
  //                       controller: mobileController,
  //                       keyboardType: TextInputType.phone,
  //                       decoration: InputDecoration(
  //                         labelText: "Mobile",
  //                         border: OutlineInputBorder(
  //                           borderRadius: BorderRadius.circular(8),
  //                         ),
  //                       ),
  //                       autovalidateMode: AutovalidateMode.onUserInteraction,
  //                       validator:
  //                           validateMobileNumber, // imported from register
  //                     ),
  //                     const SizedBox(height: 15),

  //                     // Institute Dropdown
  //                     DropdownButtonFormField<String>(
  //                       isExpanded: true,
  //                       value: selectedInstitute, // <-- default selected value
  //                       items: institutes
  //                           .map(
  //                             (inst) => DropdownMenuItem(
  //                               value: inst,
  //                               child: buildBoxedDropdownItem(inst, context),
  //                             ),
  //                           )
  //                           .toList(),
  //                       selectedItemBuilder: (context) => institutes
  //                           .map((inst) => buildSelectedItem(inst))
  //                           .toList(),
  //                       onChanged: (val) =>
  //                           setState(() => selectedInstitute = val),
  //                       validator: (val) =>
  //                           val == null ? 'Select Institute' : null,
  //                       decoration: fieldDecoration(
  //                         'Select Institute',
  //                         required: true,
  //                       ),
  //                     ),
  //                     const SizedBox(height: 15),

  //                     // Branch Dropdown
  //                     DropdownButtonFormField<String>(
  //                       isExpanded: true,
  //                       value: selectedBranch, // <-- default selected value
  //                       items: branches
  //                           .map(
  //                             (branch) => DropdownMenuItem(
  //                               value: branch,
  //                               child: buildBoxedDropdownItem(branch, context),
  //                             ),
  //                           )
  //                           .toList(),
  //                       selectedItemBuilder: (context) => branches
  //                           .map((branch) => buildSelectedItem(branch))
  //                           .toList(),
  //                       onChanged: (val) =>
  //                           setState(() => selectedBranch = val),
  //                       validator: (val) =>
  //                           val == null ? 'Select Branch' : null,
  //                       decoration: fieldDecoration(
  //                         'Select Branch',
  //                         required: true,
  //                       ),
  //                     ),
  //                     const SizedBox(height: 15),

  //                     // Designation Dropdown
  //                     DropdownButtonFormField<String>(
  //                       isExpanded: true,
  //                       value:
  //                           selectedDesignation, // <-- default selected value
  //                       items: allDesignations
  //                           .map(
  //                             (des) => DropdownMenuItem(
  //                               value: des,
  //                               child: buildBoxedDropdownItem(des, context),
  //                             ),
  //                           )
  //                           .toList(),
  //                       selectedItemBuilder: (context) => allDesignations
  //                           .map((des) => buildSelectedItem(des))
  //                           .toList(),
  //                       onChanged: (val) => setState(() {
  //                         selectedDesignation = val;
  //                         if (val != 'Other')
  //                           customDesignationController.clear();
  //                       }),
  //                       validator: (val) =>
  //                           val == null ? 'Select Designation' : null,
  //                       decoration: fieldDecoration(
  //                         'Select Designation',
  //                         required: true,
  //                       ),
  //                     ),

  //                     // Custom Designation TextField
  //                     if (selectedDesignation == 'Other') ...[
  //                       const SizedBox(height: 15),
  //                       TextFormField(
  //                         controller: customDesignationController,
  //                         decoration: InputDecoration(
  //                           labelText: "Enter Designation",
  //                           border: OutlineInputBorder(
  //                             borderRadius: BorderRadius.circular(8),
  //                           ),
  //                         ),
  //                         validator: (val) {
  //                           if (selectedDesignation == 'Other' &&
  //                               (val == null || val.isEmpty)) {
  //                             return 'Enter designation';
  //                           }
  //                           return null;
  //                         },
  //                       ),
  //                     ],

  //                     const SizedBox(height: 25),

  //                     // Buttons
  //                     Row(
  //                       mainAxisAlignment: MainAxisAlignment.end,
  //                       children: [
  //                         TextButton(
  //                           onPressed: () => Navigator.pop(context),
  //                           child: const Text(
  //                             "Cancel",
  //                             style: TextStyle(color: Colors.black),
  //                           ),
  //                         ),
  //                         const SizedBox(width: 10),
  //                         ElevatedButton(
  //                           onPressed: () async {
  //                             if (!_formKey.currentState!.validate()) return;

  //                             final updates = {
  //                               "email": emailController.text,
  //                               "mobile_number": mobileController.text,
  //                               "institute_name": selectedInstitute,
  //                               "branch": selectedBranch,
  //                               "designation": selectedDesignation == 'Other'
  //                                   ? customDesignationController.text
  //                                   : selectedDesignation,
  //                             };

  //                             final ehrmsCode = userDetails["EHRMS Code"];
  //                             final success = await _api.updateUser(
  //                               ehrmsCode,
  //                               updates,
  //                             );

  //                             if (success) {
  //                               Navigator.pop(context);
  //                               await fetchProfile();
  //                               widget.onProfileUpdated?.call();
  //                               ScaffoldMessenger.of(context).showSnackBar(
  //                                 const SnackBar(
  //                                   content: Text(
  //                                     "Profile updated successfully",
  //                                   ),
  //                                 ),
  //                               );
  //                             } else {
  //                               ScaffoldMessenger.of(context).showSnackBar(
  //                                 const SnackBar(
  //                                   content: Text("Failed to update profile"),
  //                                 ),
  //                               );
  //                             }
  //                           },
  //                           child: const Text("Save"),
  //                         ),
  //                       ],
  //                     ),
  //                   ],
  //                 ),
  //               ),
  //             ),
  //           );
  //         },
  //       );
  //     },
  //   );
  // }

  void _openEditDialog() {
    final emailController = TextEditingController(text: userDetails["Email"]);
    final mobileController = TextEditingController(text: userDetails["Mobile"]);
    final customDesignationController = TextEditingController();

    final institutes = polytechnicOptions;
    final branches = branchOptions;

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
    List<String> allDesignations = designationMap.values
        .expand((list) => list)
        .toList();

    String? selectedInstitute = institutes.contains(userDetails["Institute"])
        ? userDetails["Institute"]
        : null;

    String? selectedBranch = branches.contains(userDetails["Branch"])
        ? userDetails["Branch"]
        : null;
    String? selectedDesignation =
        allDesignations.contains(userDetails["Designation"])
        ? userDetails["Designation"]
        : null;

    final _formKey = GlobalKey<FormState>();

    showDialog(
      context: context,
      barrierDismissible: false, // force user to interact
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setState) {
            return BackdropFilter(
              filter: ImageFilter.blur(sigmaX: 5, sigmaY: 5),
              child: Dialog(
                backgroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20),
                ),
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(20),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          "Edit Profile",
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 20),

                        // Email
                        TextFormField(
                          controller: emailController,
                          decoration: InputDecoration(
                            labelText: "Email",
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                          autovalidateMode: AutovalidateMode.onUserInteraction,
                          validator: (value) => validateEmailValue(
                            value,
                            allowedEmailDomains,
                            allowedEmailTLDs,
                          ),
                        ),
                        const SizedBox(height: 15),

                        // Mobile
                        TextFormField(
                          controller: mobileController,
                          keyboardType: TextInputType.phone,
                          decoration: InputDecoration(
                            labelText: "Mobile",
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                          autovalidateMode: AutovalidateMode.onUserInteraction,
                          validator: validateMobileNumber,
                        ),
                        const SizedBox(height: 15),

                        // Institute Dropdown
                        DropdownButtonFormField<String>(
                          isExpanded: true,
                          value: selectedInstitute,
                          items: institutes
                              .map(
                                (inst) => DropdownMenuItem(
                                  value: inst,
                                  child: buildBoxedDropdownItem(inst, context),
                                ),
                              )
                              .toList(),
                          selectedItemBuilder: (context) => institutes
                              .map((inst) => buildSelectedItem(inst))
                              .toList(),
                          onChanged: (val) =>
                              setState(() => selectedInstitute = val),
                          validator: (val) =>
                              val == null ? 'Select Institute' : null,
                          decoration: fieldDecoration(
                            'Select Institute',
                            required: true,
                          ),
                        ),
                        const SizedBox(height: 15),

                        // Branch Dropdown
                        DropdownButtonFormField<String>(
                          isExpanded: true,
                          value: selectedBranch,
                          items: branches
                              .map(
                                (branch) => DropdownMenuItem(
                                  value: branch,
                                  child: buildBoxedDropdownItem(
                                    branch,
                                    context,
                                  ),
                                ),
                              )
                              .toList(),
                          selectedItemBuilder: (context) => branches
                              .map((branch) => buildSelectedItem(branch))
                              .toList(),
                          onChanged: (val) =>
                              setState(() => selectedBranch = val),
                          validator: (val) =>
                              val == null ? 'Select Branch' : null,
                          decoration: fieldDecoration(
                            'Select Branch',
                            required: true,
                          ),
                        ),
                        const SizedBox(height: 15),

                        // Designation Dropdown
                        DropdownButtonFormField<String>(
                          isExpanded: true,
                          value: selectedDesignation,
                          items: allDesignations
                              .map(
                                (des) => DropdownMenuItem(
                                  value: des,
                                  child: buildBoxedDropdownItem(des, context),
                                ),
                              )
                              .toList(),
                          selectedItemBuilder: (context) => allDesignations
                              .map((des) => buildSelectedItem(des))
                              .toList(),
                          onChanged: (val) => setState(() {
                            selectedDesignation = val;
                            if (val != 'Other')
                              customDesignationController.clear();
                          }),
                          validator: (val) =>
                              val == null ? 'Select Designation' : null,
                          decoration: fieldDecoration(
                            'Select Designation',
                            required: true,
                          ),
                        ),

                        // Custom Designation
                        if (selectedDesignation == 'Other') ...[
                          const SizedBox(height: 15),
                          TextFormField(
                            controller: customDesignationController,
                            decoration: InputDecoration(
                              labelText: "Enter Designation",
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(8),
                              ),
                            ),
                            validator: (val) {
                              if (selectedDesignation == 'Other' &&
                                  (val == null || val.isEmpty)) {
                                return 'Enter designation';
                              }
                              return null;
                            },
                          ),
                        ],

                        const SizedBox(height: 25),

                        // Buttons
                        Row(
                          mainAxisAlignment: MainAxisAlignment.end,
                          children: [
                            TextButton(
                              onPressed: () => Navigator.pop(context),
                              child: const Text(
                                "Cancel",
                                style: TextStyle(color: Colors.black),
                              ),
                            ),
                            const SizedBox(width: 10),
                            ElevatedButton(
                              onPressed: () async {
                                if (!_formKey.currentState!.validate()) return;

                                final updates = {
                                  "email": emailController.text,
                                  "mobile_number": mobileController.text,
                                  "institute_name": selectedInstitute,
                                  "branch": selectedBranch,
                                  "designation": selectedDesignation == 'Other'
                                      ? customDesignationController.text
                                      : selectedDesignation,
                                };

                                final ehrmsCode = userDetails["EHRMS Code"];
                                final success = await _api.updateUser(
                                  ehrmsCode,
                                  updates,
                                );

                                if (success) {
                                  Navigator.pop(context);
                                  await fetchProfile();
                                  widget.onProfileUpdated?.call();
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(
                                      content: Text(
                                        "Profile updated successfully",
                                      ),
                                    ),
                                  );
                                } else {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(
                                      content: Text("Failed to update profile"),
                                    ),
                                  );
                                }
                              },
                              child: const Text("Save"),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final themeColor = const Color(0xFF004D79);
    final cardColor = Colors.white;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context, true),
        ),
        backgroundColor: themeColor,
      ),
      backgroundColor: const Color(0xFFF2F9FF),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : Column(
              children: [
                Container(
                  width: double.infinity,
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(
                      colors: [Color(0xFF00B4DB), Color(0xFF0083B0)],
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                    ),
                    borderRadius: BorderRadius.only(
                      bottomLeft: Radius.circular(24),
                      bottomRight: Radius.circular(24),
                    ),
                  ),
                  padding: const EdgeInsets.only(top: 30, bottom: 16),
                  child: Column(
                    children: [
                      ProfileAvatar(
                        imageFile: _profileImage,
                        networkUrl: (userDetails['Photo'] as String).isNotEmpty
                            ? (userDetails['Photo'].startsWith('http')
                                  ? userDetails['Photo']
                                  : "$baseUrl${userDetails['Photo']}")
                            : "$baseUrl/media/profile_pictures/default.jpg",

                        onTap: () async {
                          final choice = await showMenu<String>(
                            context: context,
                            position: const RelativeRect.fromLTRB(
                              100,
                              100,
                              0,
                              0,
                            ),
                            items: [
                              const PopupMenuItem(
                                value: 'change',
                                child: Text('Change Photo'),
                              ),
                              const PopupMenuItem(
                                value: 'remove',
                                child: Text('Remove Photo'),
                              ),
                            ],
                          );
                          if (choice == 'change') {
                            await uploadPhoto();
                            await fetchProfile();
                          } else if (choice == 'remove') {
                            await removePhoto();
                            await fetchProfile();
                          }
                        },
                        editIconColor: themeColor,
                      ),
                      const SizedBox(height: 10),
                      Text(
                        userDetails["Name"] ?? "",
                        style: const TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                          letterSpacing: 1.2,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                Expanded(
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      // <-- changed: wrap Card + Edit button in Column
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Card(
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                          elevation: 4,
                          color: cardColor,
                          child: Padding(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 16,
                              vertical: 24,
                            ),
                            child: Column(
                              children: userDetails.entries.map((entry) {
                                if (entry.key == "Name" ||
                                    entry.key == "Photo") {
                                  return const SizedBox.shrink();
                                }
                                return userInfoRow(
                                  label: entry.key,
                                  value: entry.value ?? "",
                                  icon: iconMap[entry.key] ?? Icons.info,
                                  iconColor: themeColor,
                                );
                              }).toList(),
                            ),
                          ),
                        ),
                        const SizedBox(height: 20), // spacing before button

                        ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: themeColor,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            padding: const EdgeInsets.symmetric(vertical: 14),
                          ),
                          onPressed: _openEditDialog,
                          child: const Text(
                            "Edit",
                            style: TextStyle(fontSize: 18, color: Colors.white),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
    );
  }
}
