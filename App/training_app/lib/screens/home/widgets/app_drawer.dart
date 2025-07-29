import 'package:flutter/material.dart';
import '../../about/about_us_page.dart';
import 'theme_switcher_sheet.dart';


class AppDrawer extends StatelessWidget {
  const AppDrawer({super.key});

  void _showToast(BuildContext context, String message) {
    ScaffoldMessenger.of(context)
        .showSnackBar(SnackBar(content: Text(message)));
  }

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        children: [
          const UserAccountsDrawerHeader(
            accountName: Text("Guest User"),
            accountEmail: Text("guest@example.com"),
            currentAccountPicture: CircleAvatar(
              backgroundColor: Colors.white,
              child: Icon(Icons.person, size: 40, color: Colors.blue),
            ),
            decoration: BoxDecoration(color: Colors.blue),
          ),
          ListTile(
            leading: const Icon(Icons.home),
            title: const Text("Home"),
            onTap: () => Navigator.pop(context),
          ),
          ListTile(
            leading: const Icon(Icons.info),
            title: const Text("About Us"),
            onTap: () {
              Navigator.pop(context);
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const AboutUsPage()),
              );
            },
          ),
          ListTile(
            leading: const Icon(Icons.book),
            title: const Text("Courses"),
            onTap: () {
              Navigator.pop(context);
              _showToast(context, "Courses page coming soon!");
            },
          ),
          ListTile(
            leading: const Icon(Icons.contact_mail),
            title: const Text("Contact Us"),
            onTap: () {
              Navigator.pop(context);
              _showToast(context, "Contact Us page coming soon!");
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
          // const Divider(),
          // ListTile(
          //   leading: const Icon(Icons.logout),
          //   title: const Text("Logout"),
          //   onTap: () {
          //     Navigator.pop(context);
          //     _showToast(context, "Logged out (demo)");
          //   },
          // ),
        ],
      ),
    );
  }
}
