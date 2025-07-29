
import 'package:flutter/material.dart';

InputDecoration fieldDecoration(String label, {bool required = false}) {
  return InputDecoration(
    // labelText: required ? "$label *" : label,
    labelText: required ? "$label *" : label,

    filled: true,
    fillColor: Colors.white,
    isDense: true,
    labelStyle: TextStyle(color: Colors.black),
    floatingLabelStyle: TextStyle(
      color: Colors.black,
      backgroundColor: Colors.white,
    ),
    border: OutlineInputBorder(),
    enabledBorder: OutlineInputBorder(
      borderSide: BorderSide(color: Colors.grey.shade400),
    ),
    focusedBorder: OutlineInputBorder(
      borderSide: BorderSide(color: Colors.black, width: 1.5),
    ),
    contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 14),
  );
}



class UIHelper {
  static const verticalSpaceSmall = SizedBox(height: 12);
  static const verticalSpaceMedium = SizedBox(height: 24);
  static const verticalSpaceLarge = SizedBox(height: 36);

  static const horizontalSpaceSmall = SizedBox(width: 12);
  static const horizontalSpaceMedium = SizedBox(width: 24);
  static const horizontalSpaceLarge = SizedBox(width: 36);
}
void showErrorToast(BuildContext context, String message) {
  final snackBar = SnackBar(content: Text(message));
  ScaffoldMessenger.of(context).showSnackBar(snackBar);
}

