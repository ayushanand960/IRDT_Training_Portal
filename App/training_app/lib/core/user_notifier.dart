import 'package:flutter/material.dart';

class UserNotifier {
  static ValueNotifier<String?> photoUrl = ValueNotifier<String?>(null);
  static ValueNotifier<String> fullName = ValueNotifier<String>('User');
}
