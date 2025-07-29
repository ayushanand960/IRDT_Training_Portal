import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../providers/theme_provider.dart';

class ThemeSwitcherSheet extends StatelessWidget {
  const ThemeSwitcherSheet({super.key});

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);
    return Container(
      padding: const EdgeInsets.all(20),
      height: 180,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text("Settings",
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
          const Divider(),
          SwitchListTile(
            title: const Text("Dark Mode"),
            value: themeProvider.isDarkMode,
            onChanged: (value) {
              themeProvider.toggleTheme(value);
            },
            secondary: Icon(
              themeProvider.isDarkMode ? Icons.dark_mode : Icons.light_mode,
            ),
          ),
        ],
      ),
    );
  }
}