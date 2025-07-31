import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart';

extension JsonExtension on Response {
  Map<String, dynamic> json() => jsonDecode(this.body);
}

void showSnackBar(BuildContext context, String message, {Color color = Colors.red}) {
  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(
      content: Text(message),
      backgroundColor: color,
      behavior: SnackBarBehavior.floating,
    ),
  );

}

