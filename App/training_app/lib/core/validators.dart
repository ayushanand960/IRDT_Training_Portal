const allowedEmailDomains = [
  "gmail",
  "yahoo",
  "outlook",
  "hotmail",
  "rediffmail",
  "icloud",
  "protonmail",
  "zoho",
  "aol",
  "yandex",
  "mail",
  "gmx",
  "nic",
  "gov",
  "edu",
  "irdt",
  "ramauniversity",
];

const allowedEmailTLDs = [
  // Single-part TLDs
  "com",
  "in",
  "org",
  "net",
  "edu",
  "gov",
  "mil",
  "co",
  "info",
  "biz",
  "io",
  "me",

  // Common multi-part TLDs
  "co.in",
  "ac.in",
  "gov.in",
  "edu.in",
  "res.in",
  "nic.in",
];

String? validateEmailValue(
  String? value,
  List<String> allowedEmailDomains,
  List<String> allowedEmailTLDs,
) {
  if (value == null || value.isEmpty) {
    return 'Enter email';
  }

  final emailRegex = RegExp(r'^[^@]+@[^@]+\.[^@]+$');
  if (!emailRegex.hasMatch(value)) {
    return 'Enter a valid email address';
  }

  try {
    final parts = value.split('@');
    final domainSplit = parts[1].split('.');

    final baseDomain = domainSplit.first.toLowerCase();
    final tld = domainSplit.length > 2
        ? '${domainSplit[domainSplit.length - 2]}.${domainSplit.last}'
              .toLowerCase()
        : domainSplit.last.toLowerCase();

    if (!allowedEmailDomains.contains(baseDomain)) {
      return 'Email domain not allowed';
    }
    if (!allowedEmailTLDs.contains(tld)) {
      return 'Email TLD not allowed';
    }
  } catch (_) {
    return 'Invalid email format';
  }

  return null; // valid
}

String? validateMobileNumber(String? value) {
  if (value == null || value.isEmpty) return 'Enter mobile number';

  // Checks for 10-digit number starting with 6-9
  final regex = RegExp(r'^[6-9][0-9]{9}$');
  if (!regex.hasMatch(value)) return 'Enter a valid 10-digit mobile number';

  return null;
}
