import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../core/services/api_service.dart';
import '../../core/constants.dart';
import '../../data/branch_training_list.dart';
import '../../widgets/ui_helpers.dart';
import 'dart:convert';


class TrainingListScreen extends StatefulWidget {
  const TrainingListScreen({super.key});

  @override
  State<TrainingListScreen> createState() => _TrainingListScreenState();
}

class _TrainingListScreenState extends State<TrainingListScreen> {
  String? selectedVenue;
  String? selectedBranch;
  String? selectedMode;
  DateTime? selectedDate;

  List<dynamic> trainings = [];
  bool isLoading = false;

  final List<String> venues = [
    'Bhopal',
    'Indore',
    'Jabalpur',
    'Gwalior',
    'Rewa',
    'Ujjain',
    'Satna',
    'Sagar',
  ];

  final List<String> modes = [
    'Online',
    'Offline',
    'Hybrid',
  ];

  Future<void> fetchTrainings() async {
    setState(() => isLoading = true);

    try {
      final queryParams = {
        if (selectedVenue != null) 'venue': selectedVenue!,
        if (selectedBranch != null) 'target_group': selectedBranch!,
        if (selectedMode != null) 'mode': selectedMode!,
        if (selectedDate != null)
          'start_date': DateFormat('yyyy-MM-dd').format(selectedDate!),
      };

      final uri = Uri.parse('${baseUrl}/training-list/').replace(
        queryParameters: queryParams,
      );

      final response = await ApiService.getWithAuth('${uri.path}?${uri.query}');

      if (response.statusCode == 200) {
        setState(() {
          trainings = List.from(jsonDecode(response.body));
        });
      } else {
        showErrorToast(context, 'Error ${response.statusCode}');
      }
    } catch (e) {
      showErrorToast(context, 'Failed to fetch trainings');
    } finally {
      setState(() => isLoading = false);
    }
  }

  Future<void> _pickDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: selectedDate ?? DateTime.now(),
      firstDate: DateTime(2024),
      lastDate: DateTime(2026),
    );

    if (picked != null) {
      setState(() => selectedDate = picked);
    }
  }

  Widget _buildDropdown<T>({
    required String label,
    required T? value,
    required List<T> items,
    required void Function(T?) onChanged,
  }) {
    return DropdownButtonFormField<T>(
      value: value,
      decoration: InputDecoration(labelText: label),
      items: items
          .map((item) => DropdownMenuItem<T>(
        value: item,
        child: Text(item.toString()),
      ))
          .toList(),
      onChanged: onChanged,
    );
  }

  Widget _buildTrainingCard(Map<String, dynamic> training) {
    return Card(
      elevation: 3,
      margin: const EdgeInsets.symmetric(vertical: 8),
      child: ListTile(
        title: Text(training['title'] ?? 'Untitled'),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (training['venue'] != null) Text('Venue: ${training['venue']}'),
            if (training['mode'] != null) Text('Mode: ${training['mode']}'),
            if (training['start_date'] != null)
              Text('Start: ${training['start_date']}'),
            if (training['end_date'] != null)
              Text('End: ${training['end_date']}'),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Training Programs')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            _buildDropdown(
              label: 'Location',
              value: selectedVenue,
              items: venues,
              onChanged: (val) => setState(() => selectedVenue = val),
            ),
            const SizedBox(height: 10),
            _buildDropdown(
              label: 'Branch',
              value: selectedBranch,
              items: branchList,
              onChanged: (val) => setState(() => selectedBranch = val),
            ),
            const SizedBox(height: 10),
            _buildDropdown(
              label: 'Mode',
              value: selectedMode,
              items: modes,
              onChanged: (val) => setState(() => selectedMode = val),
            ),
            const SizedBox(height: 10),
            Row(
              children: [
                Expanded(
                  child: Text(
                    selectedDate != null
                        ? 'Date: ${DateFormat('dd MMM yyyy').format(selectedDate!)}'
                        : 'Select Date',
                  ),
                ),
                ElevatedButton(
                  onPressed: _pickDate,
                  child: const Text('Pick Date'),
                ),
              ],
            ),
            const SizedBox(height: 16),
            ElevatedButton.icon(
              onPressed: fetchTrainings,
              icon: const Icon(Icons.search),
              label: const Text('Search'),
            ),
            const SizedBox(height: 16),
            Expanded(
              child: isLoading
                  ? const Center(child: CircularProgressIndicator())
                  : trainings.isEmpty
                  ? const Center(child: Text('No trainings found'))
                  : ListView.builder(
                itemCount: trainings.length,
                itemBuilder: (context, index) =>
                    _buildTrainingCard(trainings[index]),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
