// import 'package:flutter/material.dart';
// import '../../core/services/api_service.dart';
// import 'dart:ui';

// class NotificationScreen extends StatefulWidget {
//   const NotificationScreen({Key? key}) : super(key: key);

//   @override
//   State<NotificationScreen> createState() => _NotificationScreenState();
// }

// class _NotificationScreenState extends State<NotificationScreen> {
//   bool isLoading = true;
//   List<dynamic> notifications = [];

//   @override
//   void initState() {
//     super.initState();
//     fetchNotifications();
//   }

//   Future<void> fetchNotifications() async {
//     try {
//       final response = await ApiService().getRejectionNotifications();
//       setState(() {
//         notifications = response;
//         isLoading = false;
//       });
//     } catch (e) {
//       setState(() => isLoading = false);
//       ScaffoldMessenger.of(context).showSnackBar(
//         const SnackBar(content: Text("Failed to fetch notifications")),
//       );
//     }
//   }

//   Future<void> _showNotificationDialog(Map<String, dynamic> notif) async {
//     final id = notif['id'];

//     // Mark as read when popup is shown
//     try {
//       await ApiService().markRejectionAsRead(id);
//     } catch (_) {}

//     await showDialog(
//       context: context,
//       builder: (context) => BackdropFilter(
//         filter: ImageFilter.blur(sigmaX: 5, sigmaY: 5), // blur intensity
//         child: AlertDialog(
//           backgroundColor: Colors.white,
//           shape: RoundedRectangleBorder(
//             borderRadius: BorderRadius.circular(20),
//           ),
//           title: const Text(
//             "Rejection Notification",
//             style: TextStyle(
//               fontWeight: FontWeight.bold,
//               fontSize: 20,
//               color: Colors.black87,
//             ),
//           ),
//           content: SingleChildScrollView(
//             child: Column(
//               crossAxisAlignment: CrossAxisAlignment.start,
//               mainAxisSize: MainAxisSize.min,
//               children: [
//                 Divider(color: Colors.grey[300], thickness: 1),
//                 const SizedBox(height: 12),
//                 const Text(
//                   "Training Name:",
//                   style: TextStyle(
//                     fontWeight: FontWeight.bold,
//                     fontSize: 16,
//                     color: Colors.black87,
//                   ),
//                 ),
//                 Text(
//                   notif['training_name'] ?? 'Training',
//                   style: const TextStyle(fontSize: 15, color: Colors.black87),
//                 ),
//                 const SizedBox(height: 14),
//                 const Text(
//                   "Rejected By:",
//                   style: TextStyle(
//                     fontWeight: FontWeight.bold,
//                     fontSize: 16,
//                     color: Colors.black87,
//                   ),
//                 ),
//                 Text(
//                   notif['coordinator_name'] ?? 'Unknown',
//                   style: const TextStyle(fontSize: 15, color: Colors.black87),
//                 ),
//                 const SizedBox(height: 14),
//                 const Text(
//                   "Reason:",
//                   style: TextStyle(
//                     fontWeight: FontWeight.bold,
//                     fontSize: 16,
//                     color: Colors.black87,
//                   ),
//                 ),
//                 Text(
//                   notif['reason'] ?? 'No reason provided',
//                   style: const TextStyle(fontSize: 15, color: Colors.black87),
//                 ),
//               ],
//             ),
//           ),
//           actions: [
//             TextButton(
//               style: TextButton.styleFrom(
//                 backgroundColor: Colors.red[50],
//                 shape: RoundedRectangleBorder(
//                   borderRadius: BorderRadius.circular(8),
//                 ),
//                 padding: const EdgeInsets.symmetric(
//                   horizontal: 20,
//                   vertical: 10,
//                 ),
//               ),
//               onPressed: () => Navigator.pop(context),
//               child: const Text(
//                 "Close",
//                 style: TextStyle(
//                   color: Colors.red,
//                   fontWeight: FontWeight.bold,
//                   fontSize: 16,
//                 ),
//               ),
//             ),
//           ],
//         ),
//       ),
//     );

//     // Delete after popup closes
//     try {
//       await ApiService().deleteRejectionNotification(id);
//       setState(() {
//         notifications.removeWhere((n) => n['id'] == id);
//       });
//     } catch (_) {}

//     // await fetchNotifications();
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(title: const Text('Notifications')),
//       body: isLoading
//           ? const Center(child: CircularProgressIndicator())
//           : notifications.isEmpty
//           ? const Center(child: Text('No notifications available.'))
//           : RefreshIndicator(
//               onRefresh: fetchNotifications,
//               child: ListView.builder(
//                 itemCount: notifications.length,
//                 itemBuilder: (context, index) {
//                   final notif = notifications[index];
//                   return Card(
//                     margin: const EdgeInsets.symmetric(
//                       vertical: 8,
//                       horizontal: 12,
//                     ),
//                     child: ListTile(
//                       title: Text(
//                         notif['training_name'] ?? '',
//                         style: const TextStyle(fontWeight: FontWeight.bold),
//                       ),
//                       subtitle: Text(
//                         "Rejected by ${notif['coordinator_name'] ?? ''}",
//                       ),
//                       onTap: () => _showNotificationDialog(notif),
//                     ),
//                   );
//                 },
//               ),
//             ),
//     );
//   }
// }

import 'package:flutter/material.dart';
import 'package:intl/intl.dart'; // Added for date formatting
import 'package:timeago/timeago.dart' as timeago; // Added for "x days ago"
import '../../core/services/api_service.dart';
import 'dart:ui';

class NotificationScreen extends StatefulWidget {
  const NotificationScreen({Key? key}) : super(key: key);

  @override
  State<NotificationScreen> createState() => _NotificationScreenState();
}

class _NotificationScreenState extends State<NotificationScreen> {
  bool isLoading = true;
  List<dynamic> notifications = [];

  @override
  void initState() {
    super.initState();
    fetchNotifications();
  }

  Future<void> fetchNotifications() async {
    try {
      final response = await ApiService().getRejectionNotifications();
      setState(() {
        notifications = response;
        isLoading = false;
      });
    } catch (e) {
      setState(() => isLoading = false);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Failed to fetch notifications")),
      );
    }
  }

  String formatNotificationTime(String dateTime) {
    // ✅ Formats timestamp to "2 days ago" style
    try {
      final date = DateTime.parse(dateTime);
      return timeago.format(date);
    } catch (_) {
      return '';
    }
  }

  Future<void> _showNotificationDialog(Map<String, dynamic> notif) async {
    final id = notif['id'];

    try {
      await ApiService().markRejectionAsRead(id);
    } catch (_) {}

    await showDialog(
      context: context,
      builder: (context) => BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 5, sigmaY: 5),
        child: AlertDialog(
          backgroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
          title: const Text(
            "Rejection Notification",
            style: TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 20,
              color: Colors.black87,
            ),
          ),
          content: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Divider(color: Colors.grey[300], thickness: 1),
                const SizedBox(height: 12),
                const Text(
                  "Training Name:",
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                    color: Colors.black87,
                  ),
                ),
                Text(
                  notif['training_name'] ?? 'Training',
                  style: const TextStyle(fontSize: 15, color: Colors.black87),
                ),
                const SizedBox(height: 14),
                const Text(
                  "Rejected By:",
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                    color: Colors.black87,
                  ),
                ),
                Text(
                  notif['coordinator_name'] ?? 'Unknown',
                  style: const TextStyle(fontSize: 15, color: Colors.black87),
                ),
                const SizedBox(height: 14),
                const Text(
                  "Reason:",
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                    color: Colors.black87,
                  ),
                ),
                Text(
                  notif['reason'] ?? 'No reason provided',
                  style: const TextStyle(fontSize: 15, color: Colors.black87),
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              style: TextButton.styleFrom(
                backgroundColor: Colors.red[50],
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
                padding: const EdgeInsets.symmetric(
                  horizontal: 20,
                  vertical: 10,
                ),
              ),
              onPressed: () => Navigator.pop(context),
              child: const Text(
                "Close",
                style: TextStyle(
                  color: Colors.red,
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                ),
              ),
            ),
          ],
        ),
      ),
    );

    try {
      await ApiService().deleteRejectionNotification(id);
      setState(() {
        notifications.removeWhere((n) => n['id'] == id);
      });
    } catch (_) {}
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Notifications')),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : notifications.isEmpty
          ? Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.inbox,
                  size: 100,
                  color: Colors.grey[400],
                ), // Empty state illustration
                const SizedBox(height: 16),
                const Text(
                  "You’re all caught up!",
                  style: TextStyle(fontSize: 18, color: Colors.grey),
                ),
              ],
            )
          : RefreshIndicator(
              onRefresh: fetchNotifications,
              child: ListView.builder(
                itemCount: notifications.length,
                itemBuilder: (context, index) {
                  final notif = notifications[index];
                  return Padding(
                    //  Added padding between cards
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 6,
                    ),
                    child: InkWell(
                      //  Ripple effect
                      borderRadius: BorderRadius.circular(12),
                      onTap: () => _showNotificationDialog(notif),
                      child: Card(
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(
                            12,
                          ), //  Rounded corners
                        ),
                        elevation: 3, //  Added elevation
                        child: Padding(
                          padding: const EdgeInsets.all(12.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                notif['training_name'] ?? '',
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 18, //  Increased font size
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                "Rejected by ${notif['coordinator_name'] ?? ''}",
                                style: const TextStyle(
                                  fontSize: 14,
                                  color: Colors.black54,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                notif['created_at'] != null
                                    ? formatNotificationTime(
                                        notif['created_at'],
                                      ) //  Time ago
                                    : '',
                                style: const TextStyle(
                                  fontSize: 12,
                                  color: Colors.grey,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
    );
  }
}
