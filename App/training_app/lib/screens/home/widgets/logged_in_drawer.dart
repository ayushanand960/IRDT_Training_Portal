import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../../core/services/api_service.dart';
import '../../../core/constants.dart';
import '../../about/about_us_page.dart';
import '../widgets/theme_switcher_sheet.dart';
import '../../dashboard/profile/profile_screen.dart';
import '../../notifications/notification_screen.dart';
import '../../dashboard/login_home_page.dart';
import 'package:provider/provider.dart';
import '../../../providers/theme_provider.dart';

class LoggedInDrawer extends StatefulWidget {
  final VoidCallback? onNotificationsChanged;
  const LoggedInDrawer({super.key, this.onNotificationsChanged});
  // final bool hasUnreadNotifications;

  // const LoggedInDrawer({
  //   Key? key,
  //   this.onNotificationsChanged,
  //   this.hasUnreadNotifications = false,
  // }) : super(key: key);

  @override
  State<LoggedInDrawer> createState() => _LoggedInDrawerState();
}

class _LoggedInDrawerState extends State<LoggedInDrawer> {
  String fullname = 'User';
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
      fullname = prefs.getString('name') ?? 'User';
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
      final themeProvider = Provider.of<ThemeProvider>(context, listen: false);
      themeProvider.toggleTheme(false);
      if (!mounted) return;
      Navigator.pushNamedAndRemoveUntil(context, '/login', (route) => false);
    }
  }

  @override
  Widget build(BuildContext context) {
    ImageProvider avatarImage;
    if (profilePhotoUrl != null && profilePhotoUrl!.isNotEmpty) {
      final fullUrl = profilePhotoUrl!.startsWith("http")
          ? profilePhotoUrl!
          : "$baseUrl$profilePhotoUrl";
      avatarImage = NetworkImage(fullUrl);
    } else {
      avatarImage = NetworkImage("$baseUrl/media/profile_pictures/default.jpg");
    }

    return Drawer(
      child: ListView(
        children: [
          UserAccountsDrawerHeader(
            accountName: Text(fullname, style: const TextStyle(fontSize: 18)),
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
            leading: const Icon(Icons.notifications),
            title: const Text("Notifications"),
            // trailing: widget.hasUnreadNotifications
            //     ? Container(
            //         width: 12,
            //         height: 12,
            //         decoration: BoxDecoration(
            //           color: Colors.red,
            //           shape: BoxShape.circle,
            //         ),
            //       )
            //     : null,
            onTap: () async {
              Navigator.pop(context);
              await Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const NotificationScreen()),
              );
              if (widget.onNotificationsChanged != null) {
                widget.onNotificationsChanged!();
              }
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
