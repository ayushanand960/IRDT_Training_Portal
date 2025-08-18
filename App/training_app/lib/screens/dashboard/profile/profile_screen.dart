import 'dart:io';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../../core/services/api_service.dart';
import 'profile_widgets.dart';
import 'package:image_picker/image_picker.dart';
import '../../../core/constants.dart';

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
                  padding: const EdgeInsets.only(top: 60, bottom: 24),
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
                            if (entry.key == "Name" || entry.key == "Photo") {
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
                  ),
                ),
              ],
            ),
    );
  }
}
