import 'package:flutter/material.dart';

Widget buildBoxedDropdownItem(String text, BuildContext context) {
  return Container(
    padding: EdgeInsets.all(8),
    margin: EdgeInsets.symmetric(vertical: 4),
    decoration: BoxDecoration(
      color: Colors.grey[100],
      border: Border.all(color: Colors.grey.shade400),
      borderRadius: BorderRadius.circular(8),
    ),
    width: MediaQuery.of(context).size.width * 0.75,
    child: Text(
      text,
      maxLines: 2,
      overflow: TextOverflow.ellipsis,
      softWrap: true,
      style: TextStyle(fontSize: 14, color: Colors.black87),
    ),
  );
}

/// For showing the selected item (clean, without gray oval)
Widget buildSelectedItem(String text) {
  return Container(
    alignment: Alignment.centerLeft,
    padding: EdgeInsets.symmetric(horizontal: 12),
    child: Text(
      text,
      overflow: TextOverflow.ellipsis,
      style: TextStyle(fontSize: 14, color: Colors.black),
    ),
  );
}