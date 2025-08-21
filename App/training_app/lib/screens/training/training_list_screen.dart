import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../core/services/api_service.dart';
import '../../data/branch_training_list.dart';
import '../../data/mode_list.dart';
import '../../data/venue_list.dart';
import '../../core/constants.dart';

class TrainingListScreen extends StatefulWidget {
  const TrainingListScreen({super.key});

  @override
  State<TrainingListScreen> createState() => _TrainingListScreenState();
}

class _TrainingListScreenState extends State<TrainingListScreen> {
  final ApiService _apiService = ApiService();

  List<dynamic> _trainings = [];
  List<String> _enrolledTrainings = [];
  List<String> _coordinators = [];

  String? _selectedVenue;
  String? _selectedBranch;
  String? _selectedMode;
  String? _selectedCoordinator;
  DateTime? _selectedDate;

  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _fetchTrainings();
    _fetchMyEnrollments();
  }

  Future<void> _fetchTrainings() async {
    setState(() => _isLoading = true);
    try {
      final data = await _apiService.getTrainings();
      setState(() {
        _trainings = data;
        _coordinators = data
            .map((e) => e['faculty_name_display'])
            .where((name) => name != null && name != "-")
            .toSet()
            .cast<String>()
            .toList();
      });
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text(e.toString())));
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _fetchMyEnrollments() async {
    final enrolled = await _apiService.getMyEnrollments();
    setState(() {
      _enrolledTrainings = enrolled;
    });
  }

  bool _isWithin7Days(DateTime trainingDate, DateTime selectedDate) {
    return trainingDate.isAfter(
          selectedDate.subtract(const Duration(days: 7)),
        ) &&
        trainingDate.isBefore(selectedDate.add(const Duration(days: 7)));
  }

  List<dynamic> get _filteredTrainings {
    return _trainings.where((training) {
      final matchesVenue =
          _selectedVenue == null || training['venue'] == _selectedVenue;
      final matchesBranch =
          _selectedBranch == null ||
          training['target_group'] == _selectedBranch;
      final matchesMode =
          _selectedMode == null || training['mode'] == _selectedMode;
      final matchesCoordinator =
          _selectedCoordinator == null ||
          training['faculty_name_display'] == _selectedCoordinator;
      final matchesDate =
          _selectedDate == null ||
          _isWithin7Days(
            DateTime.parse(training['start_date']),
            _selectedDate!,
          );
      return matchesVenue &&
          matchesBranch &&
          matchesMode &&
          matchesCoordinator &&
          matchesDate;
    }).toList();
  }

  List<dynamic> get _thisWeekTrainings {
    final now = DateTime.now();
    final list = _filteredTrainings.where((t) {
      final startDate = DateTime.parse(t['start_date']);
      return startDate.isAfter(now.subtract(const Duration(days: 7))) &&
          startDate.isBefore(now.add(const Duration(days: 7)));
    }).toList();
    list.sort(
      (a, b) => DateTime.parse(
        a['start_date'],
      ).compareTo(DateTime.parse(b['start_date'])),
    );
    return list;
  }

  List<dynamic> get _upcomingTrainings {
    final now = DateTime.now();
    final list = _filteredTrainings.where((t) {
      final startDate = DateTime.parse(t['start_date']);
      return startDate.isAfter(now.add(const Duration(days: 7)));
    }).toList();
    list.sort(
      (a, b) => DateTime.parse(
        a['start_date'],
      ).compareTo(DateTime.parse(b['start_date'])),
    );
    return list;
  }

  List<dynamic> get _pastTrainings {
    final now = DateTime.now();
    final list = _filteredTrainings.where((t) {
      final endDate = DateTime.parse(t['end_date']);
      return endDate.isBefore(now);
    }).toList();
    list.sort(
      (a, b) => DateTime.parse(
        b['end_date'],
      ).compareTo(DateTime.parse(a['end_date'])),
    );
    return list;
  }

  Future<void> _enroll(String trainingCode) async {
    final prefs = await SharedPreferences.getInstance();
    final ehrmsCode = prefs.getString('ehrms_code') ?? '';

    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text("Confirm Enrollment"),
        content: const Text("Do you want to enroll in this training?"),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text("Cancel", style: TextStyle(color: Colors.black)),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text("Enroll"),
          ),
        ],
      ),
    );

    if (confirmed != true) return;

    try {
      await _apiService.enrollTraining(ehrmsCode, trainingCode);
      setState(() => _enrolledTrainings.add(trainingCode));
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text("Enrolled successfully!")));
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(e.toString().replaceFirst("Exception: ", ""))),
      );
    }
  }

  void _clearFilters() {
    setState(() {
      _selectedVenue = null;
      _selectedBranch = null;
      _selectedMode = null;
      _selectedCoordinator = null;
      _selectedDate = null;
    });
  }

  Widget _buildFilterSection() {
    return Card(
      elevation: 3,
      margin: const EdgeInsets.all(12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: ExpansionTile(
        initiallyExpanded: false,
        title: const Row(
          children: [
            Icon(Icons.filter_list),
            SizedBox(width: 8),
            Text("Filters", style: TextStyle(fontWeight: FontWeight.bold)),
          ],
        ),
        children: [
          Padding(
            padding: const EdgeInsets.all(12.0),
            child: Column(
              children: [
                DropdownButtonFormField<String>(
                  value: _selectedVenue,
                  decoration: const InputDecoration(labelText: "Venue"),
                  items: venues
                      .map(
                        (venue) =>
                            DropdownMenuItem(value: venue, child: Text(venue)),
                      )
                      .toList(),
                  onChanged: (val) => setState(() => _selectedVenue = val),
                ),
                const SizedBox(height: 8),
                DropdownButtonFormField<String>(
                  value: _selectedBranch,
                  decoration: const InputDecoration(labelText: "Branch"),
                  items: targetGroups
                      .map((b) => DropdownMenuItem(value: b, child: Text(b)))
                      .toList(),
                  onChanged: (val) => setState(() => _selectedBranch = val),
                ),
                const SizedBox(height: 8),
                DropdownButtonFormField<String>(
                  value: _selectedMode,
                  decoration: const InputDecoration(labelText: "Mode"),
                  items: modes
                      .map((m) => DropdownMenuItem(value: m, child: Text(m)))
                      .toList(),
                  onChanged: (val) => setState(() => _selectedMode = val),
                ),
                const SizedBox(height: 8),
                DropdownButtonFormField<String>(
                  value: _selectedCoordinator,
                  decoration: const InputDecoration(labelText: "Coordinator"),
                  items: _coordinators
                      .map((c) => DropdownMenuItem(value: c, child: Text(c)))
                      .toList(),
                  onChanged: (val) =>
                      setState(() => _selectedCoordinator = val),
                ),
                const SizedBox(height: 8),
                OutlinedButton(
                  onPressed: () async {
                    final picked = await showDatePicker(
                      context: context,
                      initialDate: DateTime.now(),
                      firstDate: DateTime(2020),
                      lastDate: DateTime(2030),
                    );
                    if (picked != null) setState(() => _selectedDate = picked);
                  },
                  child: Text(
                    _selectedDate == null
                        ? "Select Date"
                        : DateFormat('dd-MM-yyyy').format(_selectedDate!),
                    style: const TextStyle(color: Colors.black),
                  ),
                ),
                const SizedBox(height: 8),
                ElevatedButton(
                  onPressed: _clearFilters,
                  child: const Text("CLEAR FILTERS"),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatusChip(String text, Color color) {
    return Chip(
      label: Text(text, style: const TextStyle(color: Colors.white)),
      backgroundColor: color,
    );
  }

  Widget _buildTrainingCard(
    dynamic training, {
    bool allowEnroll = true,
    bool isPast = false,
    bool isThisWeek = false,
  }) {
    final isEnrolled = _enrolledTrainings.contains(training['code']);
    final dateFormat = DateFormat('dd-MM-yyyy');

    return Tooltip(
      message: isPast ? "This training has ended" : "",
      child: Card(
        color: isPast ? Colors.grey.shade200 : Colors.white,
        shape: RoundedRectangleBorder(
          side: isEnrolled
              ? BorderSide(color: Colors.blue.shade300, width: 2)
              : BorderSide.none,
          borderRadius: BorderRadius.circular(10),
        ),
        margin: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                "(${training['code'] ?? '-'}) ${training['name'] ?? "No Name"}",
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                training['venue'] ?? '-',
                style: const TextStyle(color: Colors.grey),
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  const Icon(Icons.calendar_today, size: 16),
                  const SizedBox(width: 4),
                  Text(
                    "${dateFormat.format(DateTime.parse(training['start_date']))} - ${dateFormat.format(DateTime.parse(training['end_date']))}",
                  ),
                ],
              ),
              const SizedBox(height: 4),
              Row(
                children: [
                  const Icon(Icons.group, size: 16),
                  const SizedBox(width: 4),
                  Expanded(child: Text(training['target_group'] ?? "-")),
                ],
              ),
              const SizedBox(height: 4),
              Row(
                children: [
                  const Icon(Icons.person, size: 16),
                  const SizedBox(width: 4),
                  Expanded(
                    child: Text(
                      "Faculty: ${training['faculty_name_display'] ?? "-"}",
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 4),
              Row(
                children: [
                  const Icon(Icons.people_alt, size: 16),
                  const SizedBox(width: 4),
                  Text(
                    "Participants: ${training['number_of_participants'] ?? 'N/A'}",
                  ),
                ],
              ),
              const SizedBox(height: 4),
              Row(
                children: [
                  const Icon(Icons.computer, size: 16),
                  const SizedBox(width: 4),
                  Text("Mode: ${training['mode'] ?? '-'}"),
                ],
              ),
              const SizedBox(height: 8),
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  if (isPast) _buildStatusChip("Completed", Colors.grey),
                  if (isThisWeek)
                    _buildStatusChip("In Progress", Colors.orange),
                  if (!isPast && !isThisWeek)
                    _buildStatusChip("Upcoming", Colors.green),
                  const SizedBox(width: 8),
                  if (isEnrolled)
                    const Chip(
                      label: Text("Enrolled"),
                      backgroundColor: Colors.blueGrey,
                    ),
                  if (!isEnrolled && allowEnroll && !isPast)
                    ElevatedButton(
                      onPressed: () => _enroll(training['code']),
                      child: const Text("ENROLL"),
                    ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSectionHeader(String title, Color color, IconData icon) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      color: color,
      child: Row(
        children: [
          Icon(icon, color: Colors.white),
          const SizedBox(width: 8),
          Text(
            title,
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTrainingSection(
    String title,
    List<dynamic> trainings, {
    required Color color,
    required IconData icon,
    bool allowEnroll = true,
    bool isPast = false,
    bool isThisWeek = false,
  }) {
    if (trainings.isEmpty) return const SizedBox();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionHeader(title, color, icon),
        ...trainings
            .map(
              (t) => _buildTrainingCard(
                t,
                allowEnroll: allowEnroll,
                isPast: isPast,
                isThisWeek: isThisWeek,
              ),
            )
            .toList(),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Training Programs")),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              child: Column(
                children: [
                  _buildFilterSection(),
                  const Divider(),
                  _buildTrainingSection(
                    "Trainings This Week",
                    _thisWeekTrainings,
                    color: Colors.blue,
                    icon: Icons.calendar_today,
                    allowEnroll: false,
                    isThisWeek: true,
                  ),
                  _buildTrainingSection(
                    "Upcoming Trainings",
                    _upcomingTrainings,
                    color: Colors.green,
                    icon: Icons.schedule,
                    allowEnroll: true,
                  ),
                  _buildTrainingSection(
                    "Past Trainings",
                    _pastTrainings,
                    color: Colors.grey,
                    icon: Icons.history,
                    allowEnroll: false,
                    isPast: true,
                  ),
                  if (_thisWeekTrainings.isEmpty &&
                      _upcomingTrainings.isEmpty &&
                      _pastTrainings.isEmpty)
                    const Center(
                      child: Padding(
                        padding: EdgeInsets.all(20),
                        child: Text("No trainings found."),
                      ),
                    ),
                ],
              ),
            ),
    );
  }
}
