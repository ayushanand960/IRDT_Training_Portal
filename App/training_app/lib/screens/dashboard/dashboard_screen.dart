import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../core/services/api_service.dart';
import '../../core/utils.dart';
import 'dart:convert';
import '../training/training_list_screen.dart';

class DashboardScreen extends StatefulWidget {
  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  Map<String, dynamic>? userProfile;
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    fetchUserProfile();
  }



  Future<void> fetchUserProfile() async {
    final prefs = await SharedPreferences.getInstance();
    final ehrmsCode = prefs.getString('ehrms_code');

    if (ehrmsCode == null) {
      Navigator.pushReplacementNamed(context, '/login');
      return;
    }

    final response = await ApiService.getWithAuth('/profile/'); // ✅ Correct token-protected route

    print('STATUS: ${response.statusCode}');
    print('BODY: ${response.body}');

    if (response.statusCode == 200) {
      setState(() {
        userProfile = json.decode(response.body); // ✅ FIXED: decode JSON response
        isLoading = false;
      });
    } else {
      showSnackBar(context, "Failed to fetch profile");
      Navigator.pushReplacementNamed(context, '/login');
    }
  }


  void logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
    Navigator.pushReplacementNamed(context, '/login');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Dashboard"),
        actions: [
          IconButton(
            icon: Icon(Icons.logout),
            onPressed: logout,
          )
        ],
      ),
      body: isLoading
          ? Center(child: CircularProgressIndicator())
          : userProfile == null
          ? Center(child: Text("No user data"))
          : Padding(
        padding: const EdgeInsets.all(16.0),
        child: ListView(
          children: [
            Center(
              child: Text(
                "Welcome, ${userProfile!['full_name'] ?? 'User'}!",
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              ),
            ),
            SizedBox(height: 24),
            profileField("EHRMS Code", userProfile!['ehrms_code']),
            profileField("Email", userProfile!['email']),
            profileField("Mobile Number", userProfile!['mobile_number']),
            profileField("Gender", userProfile!['gender']),
            profileField("Institute", userProfile!['institute_name']),
            profileField("Branch", userProfile!['branch']),
            profileField("Designation", userProfile!['designation']),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              icon: Icon(Icons.list_alt),
              label: Text("View Trainings"),
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => TrainingListScreen()),
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget profileField(String label, String? value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        children: [
          Text("$label: ", style: TextStyle(fontWeight: FontWeight.bold)),
          Expanded(child: Text(value ?? "N/A")),
        ],
      ),
    );
  }
}
