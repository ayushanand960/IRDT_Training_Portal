import 'package:flutter/material.dart';
import '../home/widgets/logged_in_drawer.dart';
import '../home/widgets/feature_card.dart';

class LoginHomePage extends StatelessWidget {
  const LoginHomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      drawer: const LoggedInDrawer(),
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.surface,
        elevation: 1,
        iconTheme: const IconThemeData(color: Colors.blue),
        title: const Text(
          "IRDT Portal",
          style: TextStyle(color: Colors.blue, fontWeight: FontWeight.bold),
        )
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
                )
              ],
            ),
          ),
        ),
      ),
    );
  }
}
