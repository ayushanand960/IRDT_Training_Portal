import 'package:flutter/material.dart';
import 'dart:io';

class ProfileAvatar extends StatelessWidget {
  final File? imageFile;
  final String? networkUrl;
  final VoidCallback onTap;
  final Color editIconColor;

  const ProfileAvatar({
    super.key,
    required this.imageFile,
    required this.onTap,
    required this.editIconColor,
    this.networkUrl,
  });

  @override
  Widget build(BuildContext context) {
    ImageProvider imageProvider;

    if (imageFile != null) {
      imageProvider = FileImage(imageFile!);
    } else if (networkUrl != null && networkUrl!.isNotEmpty) {
      imageProvider = NetworkImage(networkUrl!);
    } else {
      imageProvider = const AssetImage('assets/images/default_profile.jpg');
    }

    return GestureDetector(
      onTap: onTap,
      child: Stack(
        children: [
          CircleAvatar(
            radius: 60,
            backgroundImage: imageProvider,
          ),
          Positioned(
            bottom: 0,
            right: 4,
            child: CircleAvatar(
              radius: 18,
              backgroundColor: Colors.white,
              child: Icon(Icons.edit, color: editIconColor, size: 20),
            ),
          ),
        ],
      ),
    );
  }
}

Widget userInfoRow({
  required String label,
  required String value,
  required IconData icon,
  required Color iconColor,
}) {
  return Padding(
    padding: const EdgeInsets.symmetric(vertical: 12.0),
    child: Row(
      children: [
        Icon(icon, color: iconColor),
        const SizedBox(width: 16),
        Expanded(
          flex: 3,
          child: Text(
            "$label:",
            style: const TextStyle(
              fontWeight: FontWeight.w600,
              fontSize: 16,
            ),
          ),
        ),
        Expanded(
          flex: 5,
          child: Text(
            value.isNotEmpty ? value : "Not available",
            style: const TextStyle(fontSize: 16),
            textAlign: TextAlign.right,
          ),
        ),
      ],
    ),
  );
}
