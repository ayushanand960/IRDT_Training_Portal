// import 'package:flutter/material.dart';
// import 'package:provider/provider.dart';
// import 'providers/theme_provider.dart';
// import 'screens/auth/login_screen.dart';
// import 'screens/auth/register_screen.dart';
// import 'screens/dashboard/login_home_page.dart';
// import 'screens/dashboard/profile/profile_screen.dart';
// import 'screens/training/training_list_screen.dart';
// import 'package:training_app/core/services/api_service.dart';

// void main() async {
//   WidgetsFlutterBinding.ensureInitialized();
//   await ApiService().init();
//   runApp(const TrainingApp());
// }

// class TrainingApp extends StatelessWidget {
//   const TrainingApp({super.key});

//   @override
//   Widget build(BuildContext context) {
//     return MultiProvider(
//       providers: [ChangeNotifierProvider(create: (_) => ThemeProvider())],
//       child: Consumer<ThemeProvider>(
//         builder: (context, themeProvider, _) {
//           return MaterialApp(
//             title: 'IRDT Training App',
//             themeMode: themeProvider.themeMode,
//             theme: ThemeData(
//               primaryColor: const Color(0xFFC1E4F9),
//               scaffoldBackgroundColor: const Color(0xFFC1E4F9),
//               colorScheme: ColorScheme.fromSeed(
//                 seedColor: const Color(0xFFC1E4F9),
//                 primary: const Color(0xFFC1E4F9),
//               ),
//               inputDecorationTheme: const InputDecorationTheme(
//                 filled: true,
//                 fillColor: Colors.white,
//                 border: OutlineInputBorder(),
//                 labelStyle: TextStyle(color: Colors.black),
//                 floatingLabelStyle: TextStyle(color: Colors.black),
//               ),
//               elevatedButtonTheme: ElevatedButtonThemeData(
//                 style: ElevatedButton.styleFrom(
//                   backgroundColor: Colors.indigo,
//                   foregroundColor: Colors.white,
//                 ),
//               ),
//               textButtonTheme: TextButtonThemeData(
//                 style: TextButton.styleFrom(foregroundColor: Colors.white),
//               ),
//               appBarTheme: const AppBarTheme(
//                 backgroundColor: Colors.indigo,
//                 foregroundColor: Colors.white,
//               ),
//             ),
//             darkTheme: ThemeData.dark(), // optional: add a custom dark theme
//             debugShowCheckedModeBanner: false,
//             initialRoute: '/login',
//             routes: {
//               '/login': (context) => const LoginScreen(),
//               '/register': (context) => RegisterScreen(),
//               '/login-home': (context) => const LoginHomePage(),
//               '/profile': (context) =>
//                   const ProfileScreen(),
//               '/trainings': (context) =>
//                   const Placeholder(), // replace with TrainingsPage()
//               '/certificate': (context) =>
//                   const Placeholder(), // replace with CertificatePage()
//               '/training-list': (context) => const TrainingListScreen(),
//             },
//           );
//         },
//       ),
//     );
//   }
// }

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/theme_provider.dart';
import 'screens/auth/login_screen.dart';
import 'screens/auth/register_screen.dart';
import 'screens/auth/access_code_screen.dart';
import 'screens/dashboard/login_home_page.dart';
import 'screens/dashboard/profile/profile_screen.dart';
import 'screens/training/training_list_screen.dart';
import 'screens/certificates/certificate_screen.dart';
import 'screens/notifications/notification_screen.dart';
import 'package:training_app/core/services/api_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const TrainingApp());
}

class TrainingApp extends StatelessWidget {
  const TrainingApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [ChangeNotifierProvider(create: (_) => ThemeProvider())],
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
                style: TextButton.styleFrom(foregroundColor: Colors.white),
              ),
              appBarTheme: const AppBarTheme(
                backgroundColor: Colors.indigo,
                foregroundColor: Colors.white,
              ),
            ),
            darkTheme: ThemeData.dark(),
            debugShowCheckedModeBanner: false,
            // Start from SplashScreen
            initialRoute: '/splash',
            routes: {
              '/splash': (context) => const SplashScreen(),
              '/login': (context) => const LoginScreen(),
              '/access-code': (context) => const AccessCodePage(),
              '/register': (context) => RegisterScreen(),
              '/login-home': (context) => const LoginHomePage(),
              '/profile': (context) => const ProfileScreen(),
              '/notifications': (context) => const NotificationScreen(),
              '/certificates': (context) => const CertificateScreen(),
              '/training-list': (context) => const TrainingListScreen(),
            },
          );
        },
      ),
    );
  }
}

/// --- SplashScreen to check session before showing Login ---
class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});
  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  final ApiService _api = ApiService();

  @override
  void initState() {
    super.initState();
    // _checkSession();
    _initApi();
  }

  Future<void> _initApi() async {
    await _api.loadCookies(); // <-- Add this to ApiService
    _checkSession();
  }

  Future<void> _checkSession() async {
    await Future.delayed(const Duration(seconds: 1)); // show splash briefly
    try {
      final loggedIn = await _api.checkAuth();
      if (loggedIn) {
        final profile = await _api.getProfile();
        if (profile != null) {
          Navigator.pushReplacementNamed(
            context,
            '/login-home',
            arguments: {
              'ehrms_code': profile['ehrms_code'],
              'full_name': profile['full_name'],
            },
          );
          return;
        }
      }
    } catch (_) {}
    Navigator.pushReplacementNamed(context, '/login'); // fallback
  }

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      backgroundColor: Color(0xFFC1E4F9),
      body: Center(child: CircularProgressIndicator(color: Colors.indigo)),
    );
  }
}
