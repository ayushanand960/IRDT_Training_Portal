import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../../../core/constants.dart';
import 'profile_widgets.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({Key? key}) : super(key: key);

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
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
    "Designation": ""
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
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('access');
    final ehrms = prefs.getString('ehrms_code');
    if (token == null) {
      Navigator.pushReplacementNamed(context, '/login-home');
      return;
    }

    final response = await http.get(
      Uri.parse('$baseUrl/profile/$ehrms/'),
      headers: {'Authorization': 'Bearer $token'},
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body);

      setState(() {
        userDetails = {
          "Name": data['full_Name'] ?? "",
          "EHRMS Code": data['ehrms_code'] ?? "",
          "Institute": data['institute_name'] ?? "",
          "Email": data['email'] ?? "",
          "Mobile": data['mobile_number'] ?? "",
          "Branch": data['branch'] ?? "",
          "Gender": data['gender'] ?? "",
          "Designation": data['designation'] ?? "",
        };

        if (data['photo'] != null && data['photo'].toString().isNotEmpty) {
          _profileImage = null; // Image will load from network, not file
          userDetails['photo'] = data['photo'];
        }

        isLoading = false;
      });
    } else {
      Navigator.pushReplacementNamed(context, '/login');
    }
  }


  Future<void> removePhoto() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('access');
    if (token == null) return;

    final response = await http.delete(
      Uri.parse('$baseUrl/profile/remove-photo/'),
      headers: {'Authorization': 'Bearer $token'},
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      setState(() {
        userDetails['photo'] = data['photo']; // backend returns default
        _profileImage = null;
      });
      await prefs.setString('profile_photo_url', data['photo']);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Photo removed successfully')),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Failed to remove photo')),
      );
      // Navigator.pop(context, true);
    }
  }


  Future<void> uploadPhoto() async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(source: ImageSource.gallery);
    if (pickedFile == null) return;

    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('access');
    if (token == null) return;

    final request = http.MultipartRequest(
      'POST',
      Uri.parse('$baseUrl/profile/upload-photo/'),
    );
    request.headers['Authorization'] = 'Bearer $token';
    request.files.add(await http.MultipartFile.fromPath('photo', pickedFile.path));

    final response = await request.send();

    if (response.statusCode == 200) {
      final respStr = await response.stream.bytesToString();
      final data = json.decode(respStr);
      final photoUrl = data['photo']; // must match backend response

      setState(() {
        _profileImage = File(pickedFile.path);
        userDetails['photo'] = photoUrl;
      });

      //  Save to SharedPreferences
      await prefs.setString('profile_photo_url', photoUrl);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Photo uploaded successfully')),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Photo upload failed')),
      );
      // Navigator.pop(context, true);
    }
  }

  @override
  Widget build(BuildContext context) {
    final themeColor = const Color(0xFF004D79);
    final cardColor = Colors.white;
    print("Profile screen opened");

    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context,true),
        ),
        backgroundColor: const Color(0xFF004D79),
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
            padding: const EdgeInsets.only(top: 60, bottom: 24),
            child: Column(
              children: [
                ProfileAvatar(
                  imageFile: _profileImage,
                  networkUrl: (userDetails['photo'] != null && userDetails['photo'].toString().isNotEmpty)
                      ? userDetails['photo']
                      : null,
                  // onTap: uploadPhoto,
                  onTap: () async {
                    final choice = await showMenu<String>(
                      context: context,
                      position: const RelativeRect.fromLTRB(100, 100, 0, 0),
                      items: [
                        const PopupMenuItem<String>(value: 'change', child: Text('Change Photo')),
                        const PopupMenuItem<String>(value: 'remove', child: Text('Remove Photo')),
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
                const SizedBox(height: 12),
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
              child: Card(
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                elevation: 4,
                color: cardColor,
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
                  child: Column(
                    children: userDetails.entries.map((entry) {
                      if (entry.key == "Name" || entry.key == "photo") return const SizedBox.shrink();
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
            ),
          ),
        ],
      ),
    );
  }
}
