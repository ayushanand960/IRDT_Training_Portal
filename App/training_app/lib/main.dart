import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/theme_provider.dart';
import 'screens/auth/login_screen.dart';
import 'screens/auth/register_screen.dart';
import 'screens/dashboard/login_home_page.dart';
import 'screens/dashboard/profile/profile_screen.dart';
import 'screens/training/training_list_screen.dart';

void main() {
  runApp(const TrainingApp());
}

class TrainingApp extends StatelessWidget {
  const TrainingApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => ThemeProvider()),
      ],
      child: Consumer<ThemeProvider>(
        builder: (context, themeProvider, _) {
          return MaterialApp(
            title: 'IRDT Training App',
            themeMode: themeProvider.themeMode,
            theme: ThemeData(
              primaryColor: const Color(0xFFC1E4F9),
              scaffoldBackgroundColor: const Color(0xFFC1E4F9),
              colorScheme: ColorScheme.fromSeed(
                seedColor: const Color(0xFFC1E4F9),
                primary: const Color(0xFFC1E4F9),
              ),
              inputDecorationTheme: const InputDecorationTheme(
                filled: true,
                fillColor: Colors.white,
                border: OutlineInputBorder(),
                labelStyle: TextStyle(color: Colors.black),
                floatingLabelStyle: TextStyle(color: Colors.black),
              ),
              elevatedButtonTheme: ElevatedButtonThemeData(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.indigo,
                  foregroundColor: Colors.white,
                ),
              ),
              textButtonTheme: TextButtonThemeData(
                style: TextButton.styleFrom(
                  foregroundColor: Colors.white,
                ),
              ),
              appBarTheme: const AppBarTheme(
                backgroundColor: Colors.indigo,
                foregroundColor: Colors.white,
              ),
            ),
            darkTheme: ThemeData.dark(), // optional: add a custom dark theme
            debugShowCheckedModeBanner: false,
            initialRoute: '/login',
            routes: {
              '/login': (context) => const LoginScreen(),
              '/register': (context) =>  RegisterScreen(),
              '/login-home': (context) => const LoginHomePage(),
              '/profile': (context) => const ProfileScreen(), // replace with ProfilePage()
              '/trainings': (context) => const Placeholder(), // replace with TrainingsPage()
              '/certificate': (context) => const Placeholder(), // replace with CertificatePage()
              '/training-list': (context) => const TrainingListScreen(),
            },
          );
        },
      ),
    );
  }
}
