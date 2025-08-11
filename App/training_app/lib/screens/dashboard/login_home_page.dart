// import 'package:flutter/material.dart';
// import '../home/widgets/logged_in_drawer.dart';
// import '../home/widgets/feature_card.dart';

// class LoginHomePage extends StatelessWidget {
//   const LoginHomePage({super.key});

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       backgroundColor: Theme.of(context).scaffoldBackgroundColor,
//       drawer: const LoggedInDrawer(),
//       appBar: AppBar(
//         backgroundColor: Theme.of(context).colorScheme.surface,
//         elevation: 1,
//         iconTheme: const IconThemeData(color: Colors.blue),
//         title: const Text(
//           "IRDT Portal",
//           style: TextStyle(color: Colors.blue, fontWeight: FontWeight.bold),
//         )
//       ),
//       body: LayoutBuilder(
//         builder: (context, constraints) => SingleChildScrollView(
//           padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
//           child: ConstrainedBox(
//             constraints: BoxConstraints(minHeight: constraints.maxHeight),
//             child: Column(
//               crossAxisAlignment: CrossAxisAlignment.center,
//               children: [
//                 Image.asset(
//                   'assets/images/irdt_logo.png',
//                   height: 120,
//                   width: 120,
//                 ),
//                 const SizedBox(height: 10),
//                 const Text(
//                   "Institute of Research Development & Training",
//                   textAlign: TextAlign.center,
//                   style: TextStyle(
//                     fontSize: 26,
//                     fontWeight: FontWeight.bold,
//                     color: Color(0xFF2196F3),
//                   ),
//                 ),
//                 const SizedBox(height: 8),
//                 const Text(
//                   "Empowering teaching excellence across 147 Govt. Polytechnics in U.P.",
//                   textAlign: TextAlign.center,
//                   style: TextStyle(fontSize: 16),
//                 ),
//                 const SizedBox(height: 32),
//                 const Text(
//                   "Comprehensive Training Management",
//                   style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
//                 ),
//                 const SizedBox(height: 20),
//                 const FeatureCard(
//                   title: "Multi-Role Access",
//                   subtitle: "Access modules for all roles.",
//                   icon: Icons.group,
//                 ),
//                 const SizedBox(height: 16),
//                 const FeatureCard(
//                   title: "Smart Scheduling",
//                   subtitle: "AI-powered session planning.",
//                   icon: Icons.schedule,
//                 ),
//                 const SizedBox(height: 16),
//                 const FeatureCard(
//                   title: "Certificate Management",
//                   subtitle: "Instant certificate access.",
//                   icon: Icons.verified,
//                 ),
//                 const SizedBox(height: 40),
//                 const Text(
//                   "Training Partners",
//                   style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
//                 ),
//                 const SizedBox(height: 10),
//                 const Text(
//                   "IRDT Campus\nNITTTR Chandigarh\nNITTTR Bhopal",
//                   textAlign: TextAlign.center,
//                   style: TextStyle(fontSize: 16),
//                 ),
//                 const SizedBox(height: 40),
//                 Container(
//                   width: double.infinity,
//                   padding: const EdgeInsets.all(16),
//                   color: Colors.blue,
//                   child: const Text(
//                     "© 2025 Institute of Research, Development & Training. All rights reserved.",
//                     textAlign: TextAlign.center,
//                     style: TextStyle(color: Colors.white),
//                   ),
//                 )
//               ],
//             ),
//           ),
//         ),
//       ),
//     );
//   }
// }

// import 'package:flutter/material.dart';
// import '../home/widgets/logged_in_drawer.dart';
// import '../home/widgets/feature_card.dart';
// import '../../core/services/api_service.dart';
// import '../notifications/notification_screen.dart';

// class LoginHomePage extends StatefulWidget {
//   const LoginHomePage({super.key});

//   @override
//   State<LoginHomePage> createState() => _LoginHomePageState();
// }

// class _LoginHomePageState extends State<LoginHomePage> {
//   int unreadCount = 0;
//   bool isLoadingCount = true;

//   @override
//   void initState() {
//     super.initState();
//     fetchUnreadCount();
//   }

//   Future<void> fetchUnreadCount() async {
//     try {
//       final notifications = await ApiService().getRejectionNotifications();
//       final count = notifications
//           .where((n) => n['is_read'] == false)
//           .length;

//       setState(() {
//         unreadCount = count;
//         isLoadingCount = false;
//       });
//     } catch (e) {
//       setState(() => isLoadingCount = false);
//     }
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       backgroundColor: Theme.of(context).scaffoldBackgroundColor,
//       drawer: LoggedInDrawer(
//         onNotificationsTap: () async {
//           await Navigator.push(
//             context,
//             MaterialPageRoute(builder: (_) => const NotificationScreen()),
//           );
//           fetchUnreadCount(); // Refresh count after viewing notifications
//         },
//       ),
//       appBar: AppBar(
//         backgroundColor: Theme.of(context).colorScheme.surface,
//         elevation: 1,
//         iconTheme: const IconThemeData(color: Colors.blue),
//         title: const Text(
//           "IRDT Portal",
//           style: TextStyle(color: Colors.blue, fontWeight: FontWeight.bold),
//         ),
//         actions: [
//           IconButton(
//             icon: Stack(
//               children: [
//                 const Icon(Icons.notifications, color: Colors.blue),
//                 if (unreadCount > 0)
//                   Positioned(
//                     right: 0,
//                     child: Container(
//                       padding: const EdgeInsets.all(2),
//                       decoration: BoxDecoration(
//                         color: Colors.red,
//                         borderRadius: BorderRadius.circular(10),
//                       ),
//                       constraints: const BoxConstraints(
//                         minWidth: 16,
//                         minHeight: 16,
//                       ),
//                       child: Text(
//                         '$unreadCount',
//                         style: const TextStyle(
//                           color: Colors.white,
//                           fontSize: 10,
//                         ),
//                         textAlign: TextAlign.center,
//                       ),
//                     ),
//                   ),
//               ],
//             ),
//             onPressed: () async {
//               await Navigator.push(
//                 context,
//                 MaterialPageRoute(builder: (_) => const NotificationScreen()),
//               );
//               fetchUnreadCount();
//             },
//           ),
//         ],
//       ),
//       body: LayoutBuilder(
//         builder: (context, constraints) => SingleChildScrollView(
//           padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
//           child: ConstrainedBox(
//             constraints: BoxConstraints(minHeight: constraints.maxHeight),
//             child: Column(
//               crossAxisAlignment: CrossAxisAlignment.center,
//               children: [
//                 Image.asset(
//                   'assets/images/irdt_logo.png',
//                   height: 120,
//                   width: 120,
//                 ),
//                 const SizedBox(height: 10),
//                 const Text(
//                   "Institute of Research Development & Training",
//                   textAlign: TextAlign.center,
//                   style: TextStyle(
//                     fontSize: 26,
//                     fontWeight: FontWeight.bold,
//                     color: Color(0xFF2196F3),
//                   ),
//                 ),
//                 const SizedBox(height: 8),
//                 const Text(
//                   "Empowering teaching excellence across 147 Govt. Polytechnics in U.P.",
//                   textAlign: TextAlign.center,
//                   style: TextStyle(fontSize: 16),
//                 ),
//                 const SizedBox(height: 32),
//                 const Text(
//                   "Comprehensive Training Management",
//                   style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
//                 ),
//                 const SizedBox(height: 20),
//                 const FeatureCard(
//                   title: "Multi-Role Access",
//                   subtitle: "Access modules for all roles.",
//                   icon: Icons.group,
//                 ),
//                 const SizedBox(height: 16),
//                 const FeatureCard(
//                   title: "Smart Scheduling",
//                   subtitle: "AI-powered session planning.",
//                   icon: Icons.schedule,
//                 ),
//                 const SizedBox(height: 16),
//                 const FeatureCard(
//                   title: "Certificate Management",
//                   subtitle: "Instant certificate access.",
//                   icon: Icons.verified,
//                 ),
//                 const SizedBox(height: 40),
//                 const Text(
//                   "Training Partners",
//                   style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
//                 ),
//                 const SizedBox(height: 10),
//                 const Text(
//                   "IRDT Campus\nNITTTR Chandigarh\nNITTTR Bhopal",
//                   textAlign: TextAlign.center,
//                   style: TextStyle(fontSize: 16),
//                 ),
//                 const SizedBox(height: 40),
//                 Container(
//                   width: double.infinity,
//                   padding: const EdgeInsets.all(16),
//                   color: Colors.blue,
//                   child: const Text(
//                     "© 2025 Institute of Research, Development & Training. All rights reserved.",
//                     textAlign: TextAlign.center,
//                     style: TextStyle(color: Colors.white),
//                   ),
//                 )
//               ],
//             ),
//           ),
//         ),
//       ),
//     );
//   }
// }

import 'package:flutter/material.dart';
import '../home/widgets/logged_in_drawer.dart';
import '../home/widgets/feature_card.dart';
import '../../core/services/api_service.dart';

class LoginHomePage extends StatefulWidget {
  const LoginHomePage({super.key});

  @override
  State<LoginHomePage> createState() => LoginHomePageState();
}

class LoginHomePageState extends State<LoginHomePage> {
  final ApiService _api = ApiService();
  int unreadCount = 0;

  @override
  void initState() {
    super.initState();
    loadUnreadCount();
  }

  Future<void> loadUnreadCount() async {
    try {
      final notifications = await _api.getRejectionNotifications();
      final count = notifications.where((n) => n['is_read'] == false).length;
      setState(() => unreadCount = count);
    } catch (e) {
      debugPrint("Failed to load notifications: $e");
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      drawer: LoggedInDrawer(onNotificationsChanged: loadUnreadCount),

      // drawer: LoggedInDrawer(
      //   onNotificationsChanged: loadUnreadCount,
      //   hasUnreadNotifications: unreadCount > 0,
      // ),
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.surface,
        elevation: 1,
        iconTheme: const IconThemeData(color: Colors.blue),
        title: const Text(
          "IRDT Portal",
          style: TextStyle(color: Colors.blue, fontWeight: FontWeight.bold),
        ),
        actions: [
          InkWell(
            borderRadius: BorderRadius.circular(50),
            onTap: () async {
              await Navigator.pushNamed(context, '/notifications');
              loadUnreadCount(); // Refresh after returning
            },
            child: Stack(
              clipBehavior: Clip.none,
              children: [
                const Padding(
                  padding: EdgeInsets.all(8.0),
                  child: Icon(
                    Icons.notifications,
                    color: Colors.blue,
                    size: 28,
                  ),
                ),
                if (unreadCount > 0)
                  Positioned(
                    right: 6,
                    top: 6,
                    child: Container(
                      padding: const EdgeInsets.all(4),
                      decoration: BoxDecoration(
                        color: Colors.red,
                        borderRadius: BorderRadius.circular(10),
                      ),
                      constraints: const BoxConstraints(
                        minWidth: 18,
                        minHeight: 18,
                      ),
                      child: Text(
                        unreadCount.toString(),
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ],
      ),
      body: LayoutBuilder(
        builder: (context, constraints) => SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
          child: ConstrainedBox(
            constraints: BoxConstraints(minHeight: constraints.maxHeight),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Image.asset(
                  'assets/images/irdt_logo.png',
                  height: 120,
                  width: 120,
                ),
                const SizedBox(height: 10),
                const Text(
                  "Institute of Research Development & Training",
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 26,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF2196F3),
                  ),
                ),
                const SizedBox(height: 8),
                const Text(
                  "Empowering teaching excellence across 147 Govt. Polytechnics in U.P.",
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 16),
                ),
                const SizedBox(height: 32),
                const Text(
                  "Comprehensive Training Management",
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 20),
                const FeatureCard(
                  title: "Multi-Role Access",
                  subtitle: "Access modules for all roles.",
                  icon: Icons.group,
                ),
                const SizedBox(height: 16),
                const FeatureCard(
                  title: "Smart Scheduling",
                  subtitle: "AI-powered session planning.",
                  icon: Icons.schedule,
                ),
                const SizedBox(height: 16),
                const FeatureCard(
                  title: "Certificate Management",
                  subtitle: "Instant certificate access.",
                  icon: Icons.verified,
                ),
                const SizedBox(height: 40),
                const Text(
                  "Training Partners",
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 10),
                const Text(
                  "IRDT Campus\nNITTTR Chandigarh\nNITTTR Bhopal",
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 16),
                ),
                const SizedBox(height: 40),
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(16),
                  color: Colors.blue,
                  child: const Text(
                    "© 2025 Institute of Research, Development & Training. All rights reserved.",
                    textAlign: TextAlign.center,
                    style: TextStyle(color: Colors.white),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
