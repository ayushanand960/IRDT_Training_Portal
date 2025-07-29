import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../about/about_us_page.dart';
import '../widgets/theme_switcher_sheet.dart';
import '../../dashboard/profile/profile_screen.dart';
import '../../../core/user_notifier.dart';

// class LoggedInDrawer extends StatefulWidget {
//   const LoggedInDrawer({super.key});
class LoggedInDrawer extends StatefulWidget {
  const LoggedInDrawer({super.key});

  @override
  State<LoggedInDrawer> createState() => _LoggedInDrawerState();
}

class _LoggedInDrawerState extends State<LoggedInDrawer> {
  String fullName = 'User';
  String? profilePhotoUrl;


  @override
  void initState() {
    super.initState();
    loadUserData();
  }
  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // Reload user data every time drawer is opened
    loadUserData();
  }

  Future<void> loadUserData() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      fullName = prefs.getString('full_Name') ?? 'User';
      profilePhotoUrl = prefs.getString('profile_photo_url'); //  Load photo
    });
  }

  void _logout(BuildContext context) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();

    if (!context.mounted) return;

    Navigator.pushNamedAndRemoveUntil(
      context,
      '/home', 
          (Route<dynamic> route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    // WidgetsBinding.instance.addPostFrameCallback((_) {
    //   loadUserData();
    // });
    return Drawer(
      child: ListView(
        children: [
          UserAccountsDrawerHeader(
            accountName: Text(fullName), //  Shows full_name
            accountEmail: null,
            currentAccountPicture: (profilePhotoUrl != null && profilePhotoUrl!.isNotEmpty)
                ? CircleAvatar(
              backgroundImage: NetworkImage(profilePhotoUrl!),
            )
                : const CircleAvatar(
              backgroundColor: Colors.white,
              child: Icon(Icons.person, size: 40, color: Colors.blue),
            ),
            decoration: const BoxDecoration(color: Colors.blue),
          ),

          ListTile(
            leading: const Icon(Icons.home),
            title: const Text("Home"),
            onTap: () {
              Navigator.pop(context);
              Navigator.pushReplacementNamed(context, '/login-home');
            },
          ),
          ListTile(
            leading: const Icon(Icons.person),
            title: const Text("Profile"),
            onTap: () async {
              Navigator.pop(context);
              final updated = await Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const ProfileScreen()),
              );
              if (updated == true) {
                loadUserData(); // <-- Reload updated photo after returning
              }
            },
          ),

          ListTile(
            leading: const Icon(Icons.school),
            title: const Text("Trainings"),
            onTap: () {
              Navigator.pop(context);
              Navigator.pushNamed(context, '/trainings');
            },
          ),
          ListTile(
            leading: const Icon(Icons.verified),
            title: const Text("Certificate"),
            onTap: () {
              Navigator.pop(context);
              Navigator.pushNamed(context, '/certificate');
            },
          ),
          ListTile(
            leading: const Icon(Icons.info),
            title: const Text("About Us"),
            onTap: () {
              Navigator.pop(context);
              Navigator.push(context, MaterialPageRoute(builder: (_) => const AboutUsPage()));
            },
          ),
          ListTile(
            leading: const Icon(Icons.settings),
            title: const Text("Settings"),
            onTap: () {
              Navigator.pop(context);
              showModalBottomSheet(
                context: context,
                builder: (_) => const ThemeSwitcherSheet(),
              );
            },
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
