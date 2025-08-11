import 'package:flutter/material.dart';
import '../../core/services/api_service.dart';

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

  Future<void> _showNotificationDialog(Map<String, dynamic> notif) async {
    final id = notif['id'];

    // Mark as read when popup is shown
    try {
      await ApiService().markRejectionAsRead(id);
    } catch (_) {}

    await showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(notif['training_name'] ?? 'Training'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text("Rejected by: ${notif['coordinator_name'] ?? 'Unknown'}"),
            const SizedBox(height: 8),
            Text("Reason: ${notif['reason'] ?? 'No reason provided'}"),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            // child: const Text("Close"),
            child: const Text("Close", style: TextStyle(color: Colors.black)),
          ),
        ],
      ),
    );

    // Delete after popup closes
    try {
      await ApiService().deleteRejectionNotification(id);
      setState(() {
        notifications.removeWhere((n) => n['id'] == id);
      });
    } catch (_) {}

    // await fetchNotifications();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Notifications')),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : notifications.isEmpty
          ? const Center(child: Text('No notifications available.'))
          : RefreshIndicator(
              onRefresh: fetchNotifications,
              child: ListView.builder(
                itemCount: notifications.length,
                itemBuilder: (context, index) {
                  final notif = notifications[index];
                  return Card(
                    margin: const EdgeInsets.symmetric(
                      vertical: 8,
                      horizontal: 12,
                    ),
                    child: ListTile(
                      title: Text(
                        notif['training_name'] ?? '',
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                      subtitle: Text(
                        "Rejected by ${notif['coordinator_name'] ?? ''}",
                      ),
                      onTap: () => _showNotificationDialog(notif),
                    ),
                  );
                },
              ),
            ),
    );
  }
}
