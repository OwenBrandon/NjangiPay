import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../state/theme_state.dart';

class TermsScreen extends StatelessWidget {
  const TermsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final themeState = Provider.of<ThemeState>(context);
    final colors = themeState.colors;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Terms & Privacy'),
        backgroundColor: themeState.isDarkMode ? colors.background : colors.primary,
        foregroundColor: themeState.isDarkMode ? colors.text : Colors.white,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            // Card 1: Terms of Service
            Container(
              width: double.infinity,
              decoration: BoxDecoration(
                color: colors.cardBg,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: colors.glassBorder),
              ),
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    "Terms of Service",
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.w700,
                      color: colors.text,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    "Last updated: January 2025",
                    style: TextStyle(
                      fontSize: 13,
                      color: colors.textSecondary,
                    ),
                  ),
                  const SizedBox(height: 20),
                  _buildSectionTitle("1. Acceptance of Terms", colors),
                  _buildSectionParagraph(
                    "By accessing and using this Field Officer application, you accept and agree to be bound by the terms and provisions of this agreement.",
                    colors,
                  ),
                  _buildSectionTitle("2. Use of Service", colors),
                  _buildSectionParagraph(
                    "This application is provided exclusively for authorized field officers of the tax collection authority. Unauthorized use is strictly prohibited.",
                    colors,
                  ),
                  _buildSectionTitle("3. Data Collection", colors),
                  _buildSectionParagraph(
                    "The app collects location data, payment records, and visit logs as part of normal operations. All data is securely stored and used only for official purposes.",
                    colors,
                  ),
                  _buildSectionTitle("4. User Responsibilities", colors),
                  _buildSectionParagraph(
                    "Users are responsible for maintaining the confidentiality of their login credentials and for all activities that occur under their account.",
                    colors,
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // Card 2: Privacy Policy
            Container(
              width: double.infinity,
              decoration: BoxDecoration(
                color: colors.cardBg,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: colors.glassBorder),
              ),
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    "Privacy Policy",
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.w700,
                      color: colors.text,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    "Last updated: January 2025",
                    style: TextStyle(
                      fontSize: 13,
                      color: colors.textSecondary,
                    ),
                  ),
                  const SizedBox(height: 20),
                  _buildSectionTitle("Information We Collect", colors),
                  _buildSectionParagraph(
                    "• Personal identification information\n"
                    "• Location data during field operations\n"
                    "• Payment transaction records\n"
                    "• Visit logs and inspection notes",
                    colors,
                  ),
                  _buildSectionTitle("How We Use Your Information", colors),
                  _buildSectionParagraph(
                    "We use the collected information to facilitate tax collection operations, generate reports, and improve service delivery.",
                    colors,
                  ),
                  _buildSectionTitle("Data Security", colors),
                  _buildSectionParagraph(
                    "We implement appropriate security measures to protect your personal information against unauthorized access, alteration, or disclosure.",
                    colors,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title, AppColors colors) {
    return Padding(
      padding: const EdgeInsets.only(top: 16, bottom: 8),
      child: Text(
        title,
        style: TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.w600,
          color: colors.text,
        ),
      ),
    );
  }

  Widget _buildSectionParagraph(String text, AppColors colors) {
    return Text(
      text,
      style: TextStyle(
        fontSize: 14,
        height: 1.5,
        color: colors.textSecondary,
      ),
    );
  }
}
