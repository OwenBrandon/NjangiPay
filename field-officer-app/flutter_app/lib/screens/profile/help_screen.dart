import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../state/theme_state.dart';

class HelpScreen extends StatelessWidget {
  const HelpScreen({super.key});

  Future<void> _launchUrl(String url) async {
    final uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    }
  }

  @override
  Widget build(BuildContext context) {
    final themeState = Provider.of<ThemeState>(context);
    final colors = themeState.colors;

    final supportOptions = [
      {
        'icon': LucideIcons.phone,
        'label': 'Call Support',
        'desc': 'Speak with our support team',
        'action': () => _launchUrl('tel:+237222000000'),
        'color': colors.success,
      },
      {
        'icon': LucideIcons.mail,
        'label': 'Email Support',
        'desc': 'support@dgi.cm',
        'action': () => _launchUrl('mailto:support@dgi.cm'),
        'color': colors.primary,
      },
      {
        'icon': LucideIcons.messageCircle,
        'label': 'Live Chat',
        'desc': 'Chat with us in real-time',
        'action': () {
          showDialog(
            context: context,
            builder: (context) => AlertDialog(
              title: const Text('Live Chat'),
              content: const Text('Live chat session is connecting. Please wait...'),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text('Close'),
                ),
              ],
            ),
          );
        },
        'color': colors.accent,
      },
    ];

    final faqs = [
      {
        'question': 'How do I record a payment?',
        'answer':
            'Navigate to the Dashboard and tap "Payment" in Quick Actions, or go to the Payments tab and tap the + button.',
      },
      {
        'question': 'Can I work offline?',
        'answer':
            'Yes! Enable Offline Mode in Settings. Your data will sync automatically when you reconnect to the internet.',
      },
      {
        'question': 'How do I generate a receipt?',
        'answer':
            'After recording a payment, a receipt is automatically generated. You can view it from the Payments tab.',
      },
      {
        'question': 'How do I scan a QR code?',
        'answer':
            "From the Search tab, tap the QR icon next to the search bar. Point your camera at the taxpayer's QR code.",
      },
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Help Center'),
        backgroundColor: themeState.isDarkMode ? colors.background : colors.primary,
        foregroundColor: themeState.isDarkMode ? colors.text : Colors.white,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Contact Support Card Group
            Padding(
              padding: const EdgeInsets.only(left: 4, bottom: 12),
              child: Text(
                "CONTACT SUPPORT",
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: colors.textSecondary,
                  letterSpacing: 0.8,
                ),
              ),
            ),
            Container(
              decoration: BoxDecoration(
                color: colors.cardBg,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: colors.glassBorder),
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(20),
                child: Column(
                  children: supportOptions.asMap().entries.map((entry) {
                    final idx = entry.key;
                    final opt = entry.value;

                    return InkWell(
                      onTap: opt['action'] as VoidCallback,
                      child: Container(
                        decoration: BoxDecoration(
                          border: idx < supportOptions.length - 1
                              ? Border(
                                  bottom: BorderSide(color: colors.border.withOpacity(0.3)),
                                )
                              : null,
                        ),
                        padding: const EdgeInsets.all(16),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Row(
                              children: [
                                Container(
                                  width: 48,
                                  height: 48,
                                  decoration: BoxDecoration(
                                    color: (opt['color'] as Color).withOpacity(0.15),
                                    borderRadius: BorderRadius.circular(14),
                                  ),
                                  child: Icon(opt['icon'] as IconData, size: 22, color: opt['color'] as Color),
                                ),
                                const SizedBox(width: 14),
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      opt['label'] as String,
                                      style: TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.w600,
                                        color: colors.text,
                                      ),
                                    ),
                                    const SizedBox(height: 2),
                                    Text(
                                      opt['desc'] as String,
                                      style: TextStyle(
                                        fontSize: 13,
                                        color: colors.textSecondary,
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                            Icon(LucideIcons.externalLink, size: 18, color: colors.textLight),
                          ],
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ),
            ),

            const SizedBox(height: 24),

            // FAQs Card Group
            Padding(
              padding: const EdgeInsets.only(left: 4, bottom: 12),
              child: Text(
                "FREQUENTLY ASKED QUESTIONS",
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: colors.textSecondary,
                  letterSpacing: 0.8,
                ),
              ),
            ),
            Container(
              decoration: BoxDecoration(
                color: colors.cardBg,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: colors.glassBorder),
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(20),
                child: Column(
                  children: faqs.asMap().entries.map((entry) {
                    final idx = entry.key;
                    final faq = entry.value;

                    return Container(
                      decoration: BoxDecoration(
                        border: idx < faqs.length - 1
                            ? Border(
                                bottom: BorderSide(color: colors.border.withOpacity(0.3)),
                              )
                            : null,
                      ),
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Icon(LucideIcons.helpCircle, size: 18, color: colors.primary),
                              const SizedBox(width: 10),
                              Expanded(
                                child: Text(
                                  faq['question']!,
                                  style: TextStyle(
                                    fontSize: 15,
                                    fontWeight: FontWeight.w600,
                                    color: colors.text,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Padding(
                            padding: const EdgeInsets.only(left: 28),
                            child: Text(
                              faq['answer']!,
                              style: TextStyle(
                                fontSize: 14,
                                height: 1.4,
                                color: colors.textSecondary,
                              ),
                            ),
                          ),
                        ],
                      ),
                    );
                  }).toList(),
                ),
              ),
            ),

            const SizedBox(height: 24),

            // View User Guide Button
            SizedBox(
              width: double.infinity,
              child: TextButton.icon(
                style: TextButton.styleFrom(
                  backgroundColor: colors.primary.withOpacity(0.1),
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                ),
                onPressed: () {
                  showDialog(
                    context: context,
                    builder: (context) => AlertDialog(
                      title: const Text('User Guide'),
                      content: const Text('The Field Officer User Guide PDF has been cached locally.'),
                      actions: [
                        TextButton(
                          onPressed: () => Navigator.pop(context),
                          child: const Text('OK'),
                        ),
                      ],
                    ),
                  );
                },
                icon: Icon(LucideIcons.bookOpen, color: colors.primary, size: 20),
                label: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      "View User Guide",
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: colors.primary,
                      ),
                    ),
                    Icon(LucideIcons.chevronRight, color: colors.primary, size: 18),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
