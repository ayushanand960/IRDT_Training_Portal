// import 'dart:io';
// import 'package:dio/dio.dart';
// import 'package:flutter/material.dart';
// import 'package:path_provider/path_provider.dart';
// import 'package:open_file/open_file.dart';
// import '../../core/services/api_service.dart';

// class CertificateScreen extends StatefulWidget {
//   const CertificateScreen({Key? key}) : super(key: key);

//   @override
//   _CertificateScreenState createState() => _CertificateScreenState();
// }

// class _CertificateScreenState extends State<CertificateScreen> {
//   bool isLoading = true;
//   List<dynamic> certificates = [];

//   @override
//   void initState() {
//     super.initState();
//     fetchCertificates();
//   }

//   Future<void> fetchCertificates() async {
//     try {
//       final response = await ApiService().get('/certificate/my-certificates/');
//       setState(() {
//         certificates = response;
//         isLoading = false;
//       });
//     } catch (e) {
//       setState(() => isLoading = false);
//       ScaffoldMessenger.of(
//         context,
//       ).showSnackBar(SnackBar(content: Text("Failed to fetch certificates")));
//     }
//   }

//   Future<void> downloadAndOpenCertificate(
//     String trainingCode,
//     String fileName,
//   ) async {
//     try {
//       final dir = await getApplicationDocumentsDirectory();
//       final filePath = '${dir.path}/$fileName';

//       // If already downloaded → open directly
//       if (File(filePath).existsSync()) {
//         OpenFile.open(filePath);
//         return;
//       }

//       final dio = Dio(
//         BaseOptions(
//           headers: await ApiService().getAuthHeaders(),
//           responseType: ResponseType.bytes,
//         ),
//       );
//       final response = await dio.get(
//         '${ApiService.baseUrl}/certificate/download/$trainingCode/',
//         options: Options(responseType: ResponseType.bytes),
//       );

//       final file = File(filePath);
//       await file.writeAsBytes(response.data);

//       OpenFile.open(filePath);
//     } catch (e) {
//       ScaffoldMessenger.of(
//         context,
//       ).showSnackBar(SnackBar(content: Text("Failed to download certificate")));
//     }
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(title: const Text('My Certificates')),
//       body: isLoading
//           ? const Center(child: CircularProgressIndicator())
//           : certificates.isEmpty
//           ? const Center(child: Text('No certificates available.'))
//           : ListView.builder(
//               itemCount: certificates.length,
//               itemBuilder: (context, index) {
//                 final cert = certificates[index];
//                 final trainingCode = cert['training_code'];
//                 final title = cert['training_title'] ?? 'Certificate';
//                 final issueDate = cert['issue_date'] ?? '';

//                 return Card(
//                   margin: const EdgeInsets.symmetric(
//                     vertical: 8,
//                     horizontal: 12,
//                   ),
//                   child: ListTile(
//                     title: Text(
//                       title,
//                       style: const TextStyle(fontWeight: FontWeight.bold),
//                     ),
//                     subtitle: Text("Issued on: $issueDate"),
//                     trailing: IconButton(
//                       icon: const Icon(Icons.download),
//                       onPressed: () => downloadAndOpenCertificate(
//                         trainingCode,
//                         '$trainingCode.pdf',
//                       ),
//                     ),
//                   ),
//                 );
//               },
//             ),
//     );
//   }
// }

import 'dart:io';
import 'package:flutter/material.dart';
import 'package:open_file/open_file.dart';
import 'package:path_provider/path_provider.dart';
import '../../core/services/api_service.dart';

class CertificateScreen extends StatefulWidget {
  const CertificateScreen({Key? key}) : super(key: key);

  @override
  _CertificateScreenState createState() => _CertificateScreenState();
}

class _CertificateScreenState extends State<CertificateScreen> {
  bool isLoading = true;
  List<dynamic> certificates = [];

  @override
  void initState() {
    super.initState();
    fetchCertificates();
  }

  Future<void> fetchCertificates() async {
    try {
      final response = await ApiService().getCertificates();
      setState(() {
        certificates = response;
        isLoading = false;
      });
    } catch (e) {
      setState(() => isLoading = false);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Failed to fetch certificates")),
      );
    }
  }

  Future<void> downloadAndOpenCertificate(
    String trainingCode,
    String fileName,
  ) async {
    try {
      final dir = await getApplicationDocumentsDirectory();
      final filePath = '${dir.path}/$fileName';

      // If already downloaded → open directly
      if (File(filePath).existsSync()) {
        OpenFile.open(filePath);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Certificate already saved at: $filePath")),
        );
        return;
      }

      final file = await ApiService().downloadCertificate(
        trainingCode,
        fileName,
      );
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Certificate saved at: ${file.path}")),
      );
      OpenFile.open(file.path);
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Failed to download certificate")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('My Certificates')),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : certificates.isEmpty
          ? const Center(child: Text('No certificates available.'))
          : RefreshIndicator(
              onRefresh: fetchCertificates, // Pull-to-refresh
              child: ListView.builder(
                itemCount: certificates.length,
                itemBuilder: (context, index) {
                  final cert = certificates[index];
                  final training = cert['training'];
                  final trainingCode = training['code'];
                  final title = training['name'] ?? 'Certificate';
                  final issueDate = cert['issued_date'] ?? '';

                  return Card(
                    margin: const EdgeInsets.symmetric(
                      vertical: 8,
                      horizontal: 12,
                    ),
                    child: ListTile(
                      title: Text(
                        title,
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                      subtitle: Text("Issued on: $issueDate"),
                      trailing: IconButton(
                        icon: const Icon(Icons.download),
                        onPressed: () => downloadAndOpenCertificate(
                          trainingCode,
                          '$trainingCode.pdf',
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
