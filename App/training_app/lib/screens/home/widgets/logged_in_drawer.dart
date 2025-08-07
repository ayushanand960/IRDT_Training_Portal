import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../../core/services/api_service.dart';
import '../../about/about_us_page.dart';
import '../widgets/theme_switcher_sheet.dart';
import '../../dashboard/profile/profile_screen.dart';

class LoggedInDrawer extends StatefulWidget {
  const LoggedInDrawer({super.key});

  @override
  State<LoggedInDrawer> createState() => _LoggedInDrawerState();
}

class _LoggedInDrawerState extends State<LoggedInDrawer> {
  String fullName = 'User';
  String? profilePhotoUrl;
  final ApiService _api = ApiService();

  @override
  void initState() {
    super.initState();
    loadUserData();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    loadUserData(); // <-- Reload every time drawer is opened
  }

  Future<void> loadUserData() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      fullName = prefs.getString('full_name') ?? 'User';
      profilePhotoUrl = prefs.getString('profile_photo_url');
    });
  }

  Future<void> _logout(BuildContext context) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text("Log Out"),
        content: const Text("Are you sure you want to log out?"),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text("Cancel", style: TextStyle(color: Colors.black)),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text("Log Out", style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );

    if (confirm == true) {
      await _api.logout();
      final prefs = await SharedPreferences.getInstance();
      await prefs.clear();
      if (!mounted) return;
      Navigator.pushNamedAndRemoveUntil(context, '/login', (route) => false);
    }
  }

  @override
  Widget build(BuildContext context) {
    ImageProvider avatarImage;
    if (profilePhotoUrl != null && profilePhotoUrl!.isNotEmpty) {
      avatarImage = NetworkImage(profilePhotoUrl!);
    } else {
      avatarImage = const AssetImage('assets/images/default_profile.jpg');
    }

    return Drawer(
      child: ListView(
        children: [
          UserAccountsDrawerHeader(
            accountName: Text(fullName, style: const TextStyle(fontSize: 18)),
            accountEmail: null,
            currentAccountPicture: CircleAvatar(
              backgroundImage: avatarImage,
              onBackgroundImageError: (_, __) {
                setState(() => profilePhotoUrl = null); // fallback on error
              },
            ),
            decoration: const BoxDecoration(color: Colors.blue),
          ),
          ListTile(
            leading: const Icon(Icons.home),
            title: const Text("Home"),
            onTap: () => Navigator.pushReplacementNamed(context, '/login-home'),
          ),
          ListTile(
            leading: const Icon(Icons.person),
            title: const Text("Profile"),
            onTap: () async {
              Navigator.pop(context);
              await Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => ProfileScreen(
                    onProfileUpdated: () async {
                      await loadUserData();
                      if (mounted) setState(() {});
                    },
                  ),
                ),
              );
            },
          ),
          ListTile(
            leading: const Icon(Icons.school),
            title: const Text("Trainings"),
            onTap: () => Navigator.pushNamed(context, '/training-list'),
          ),
          ListTile(
            leading: const Icon(Icons.picture_as_pdf),
            title: const Text("Certificates"),
            onTap: () {
              Navigator.pushNamed(context, '/certificates');
            },
          ),
          ListTile(
            leading: const Icon(Icons.info),
            title: const Text("About Us"),
            onTap: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const AboutUsPage()),
            ),
          ),
          ListTile(
            leading: const Icon(Icons.settings),
            title: const Text("Settings"),
            onTap: () => showModalBottomSheet(
              context: context,
              builder: (_) => const ThemeSwitcherSheet(),
            ),
          ),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.logout),
            title: const Text("Log Out"),
            onTap: () => _logout(context),
          ),
        ],
      ),
    );
  }
}

// import 'package:flutter/material.dart';
// import 'package:shared_preferences/shared_preferences.dart';
// import '../../../core/services/api_service.dart';
// import '../../about/about_us_page.dart';
// import '../widgets/theme_switcher_sheet.dart';
// import '../../dashboard/profile/profile_screen.dart';

// class LoggedInDrawer extends StatefulWidget {
//   const LoggedInDrawer({super.key});

//   @override
//   State<LoggedInDrawer> createState() => _LoggedInDrawerState();
// }

// class _LoggedInDrawerState extends State<LoggedInDrawer> {
//   String fullName = 'User';
//   String? profilePhotoUrl;
//   final ApiService _api = ApiService();

//   @override
//   void initState() {
//     super.initState();
//     loadUserData();
//   }

//   /// Load user name & profile photo from SharedPreferences
//   Future<void> loadUserData() async {
//     final prefs = await SharedPreferences.getInstance();
//     setState(() {
//       // Use same key as profile API response
//       fullName = prefs.getString('full_Name') ?? 'User';
//       profilePhotoUrl = prefs.getString('profile_photo_url');
//     });
//   }

//   /// Logout with confirmation
//   Future<void> _logout(BuildContext context) async {
//     final confirm = await showDialog<bool>(
//       context: context,
//       builder: (context) => AlertDialog(
//         title: const Text("Log Out"),
//         content: const Text("Are you sure you want to log out?"),
//         actions: [
//           TextButton(
//             onPressed: () => Navigator.pop(context, false),
//             child: const Text("Cancel", style: TextStyle(color: Colors.black)),
//           ),
//           TextButton(
//             onPressed: () => Navigator.pop(context, true),
//             child: const Text("Log Out", style: TextStyle(color: Colors.red)),
//           ),
//         ],
//       ),
//     );

//     if (confirm == true) {
//       await _api.logout(); // Calls your logout API & clears cookies
//       final prefs = await SharedPreferences.getInstance();
//       await prefs.clear();
//       if (!mounted) return;
//       Navigator.pushNamedAndRemoveUntil(context, '/login', (route) => false);
//     }
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Drawer(
//       child: ListView(
//         children: [
//           UserAccountsDrawerHeader(
//             accountName: Text(fullName, style: const TextStyle(fontSize: 18)),
//             accountEmail: null,
//             currentAccountPicture:
//                 (profilePhotoUrl != null && profilePhotoUrl!.isNotEmpty)
//                 ? CircleAvatar(backgroundImage: NetworkImage(profilePhotoUrl!))
//                 : const CircleAvatar(
//                     backgroundColor: Colors.white,
//                     child: Icon(Icons.person, size: 40, color: Colors.blue),
//                   ),
//             decoration: const BoxDecoration(color: Colors.blue),
//           ),
//           ListTile(
//             leading: const Icon(Icons.home),
//             title: const Text("Home"),
//             onTap: () => Navigator.pushReplacementNamed(context, '/login-home'),
//           ),
//           ListTile(
//             leading: const Icon(Icons.person),
//             title: const Text("Profile"),
//             onTap: () async {
//               Navigator.pop(context);
//               await Navigator.push(
//                 context,
//                 MaterialPageRoute(
//                   builder: (context) => ProfileScreen(
//                     onProfileUpdated: () async {
//                       await loadUserData(); // Reload prefs
//                       if (mounted) setState(() {}); // Force rebuild instantly
//                     },
//                   ),
//                 ),
//               );
//             },
//           ),

//           ListTile(
//             leading: const Icon(Icons.school),
//             title: const Text("Trainings"),
//             onTap: () => Navigator.pushNamed(context, '/training-list'),
//           ),
//           ListTile(
//             leading: const Icon(Icons.verified),
//             title: const Text("Certificate"),
//             onTap: () => Navigator.pushNamed(context, '/certificate'),
//           ),
//           ListTile(
//             leading: const Icon(Icons.info),
//             title: const Text("About Us"),
//             onTap: () => Navigator.push(
//               context,
//               MaterialPageRoute(builder: (_) => const AboutUsPage()),
//             ),
//           ),
//           ListTile(
//             leading: const Icon(Icons.settings),
//             title: const Text("Settings"),
//             onTap: () => showModalBottomSheet(
//               context: context,
//               builder: (_) => const ThemeSwitcherSheet(),
//             ),
//           ),
//           const Divider(),
//           ListTile(
//             leading: const Icon(Icons.logout),
//             title: const Text("Log Out"),
//             onTap: () => _logout(context),
//           ),
//         ],
//       ),
//     );
//   }
// }
