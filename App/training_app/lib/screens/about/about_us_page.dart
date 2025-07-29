import 'package:flutter/material.dart';

class AboutUsPage extends StatelessWidget {
  const AboutUsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("About Us",
          style: TextStyle(
            fontWeight: FontWeight.bold,
            color: Colors.black, // Dark black color
          ),
        ),
        backgroundColor: Colors.blueAccent,
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            _buildCard(
              title: "Organization Structure",
              content: const [
                "• Shri F.R. Khan, Director",
                "• Dr. A.P. Singh, Deputy Director",
                "• Shri Shyam Lal, Text Book Officer",
                "• Shri Vikas Kulshrestha, Assistant Professor",
                "• Shri Gaurav Kishor Kanaujiya, Assistant Professor",
                "• Shri Sambhaskar Singh, Assistant Professor (On Study Leave)",
              ],
            ),
            const SizedBox(height: 16),
            _buildCard(
              title: "Contact Us",
              content: const [
                "📍 Address:\nI.R.D.T. (Govt. Polytechnic Campus), Vikas Nagar, Kanpur (U.P.) - 208002",
                "📞 Telephone: 0512-2580360",
                "✉️ Emails:",
                "   • director_irdt@rediffmail.com",
                "   • director.irdt@gmail.com",
              ],
            ),
            const SizedBox(height: 16),
            _buildCard(
              title: "Functional Cells",
              content: const [
                "1. Curriculum Development Cell",
                "2. Learning Resource Development Cell",
                "3. Staff Development Cell",
              ],
            ),
            const SizedBox(height: 16),
            _buildCard(
              title: "Main Functions",
              content: const [
                "A. Curriculum Development / Updating",
                "B. Learning Resource Development",
                "C. Training of Polytechnic Staff",
                "D. Computer awareness and training",
                "E. Educational research and development",
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCard({
    required String title,
    required List<String> content,
  }) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Column(
                children: [
                  Text(
                    title,
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w900,
                      color: Colors.black,
                      letterSpacing: 0.5,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Container(
                    width: 60,
                    height: 2,
                    color: Colors.black,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            ...content.map((line) => Padding(
              padding: const EdgeInsets.symmetric(vertical: 4),
              child: Text(
                line,
                style: const TextStyle(fontSize: 15),
              ),
            )),
          ],
        ),
      ),
    );
  }
}
