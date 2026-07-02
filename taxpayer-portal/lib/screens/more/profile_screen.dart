import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:provider/provider.dart';

import '../../core/theme/app_theme.dart';
import '../../core/models/models.dart';
import '../../core/api/api_service.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  bool _isLoading = true;
  TaxpayerProfile? _profile;
  TaxpayerProfile? _editedProfile;
  List<Business> _businesses = [];
  bool _isEditing = false;

  @override
  void initState() {
    super.initState();
    _fetchData();
  }

  Future<void> _fetchData() async {
    final api = context.read<ApiService>();
    try {
      final profile = await api.getProfile();
      final businesses = await api.getBusinesses();
      setState(() {
        _profile = profile;
        _editedProfile = profile;
        _businesses = businesses;
        _isLoading = false;
      });
    } catch (e) {
      debugPrint('Error fetching data: $e');
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _handleSave() {
    setState(() {
      _profile = _editedProfile;
      _isEditing = false;
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Profile updated successfully'), backgroundColor: Colors.green),
    );
  }

  void _handleCancel() {
    setState(() {
      _editedProfile = _profile;
      _isEditing = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    final themeProvider = context.watch<ThemeProvider>();
    final colors = themeProvider.colors;

    if (_isLoading) {
      return Scaffold(
        backgroundColor: colors.background,
        appBar: AppBar(backgroundColor: colors.background, elevation: 0),
        body: Center(child: CircularProgressIndicator(color: colors.primary)),
      );
    }

    if (_profile == null) {
      return Scaffold(
        backgroundColor: colors.background,
        body: Center(child: Text('Failed to load profile', style: TextStyle(color: colors.textSecondary))),
      );
    }

    final initials = _profile!.name.split(' ').map((n) => n.isNotEmpty ? n[0] : '').join('');

    return Scaffold(
      backgroundColor: colors.background,
      appBar: AppBar(
        title: Text('Profile', style: TextStyle(color: colors.textInverse)),
        backgroundColor: colors.primary,
        elevation: 0,
        iconTheme: IconThemeData(color: colors.textInverse),
      ),
      body: ListView(
        padding: const EdgeInsets.only(bottom: 32),
        children: [
          Container(
            padding: const EdgeInsets.symmetric(vertical: 28),
            decoration: BoxDecoration(color: colors.primary),
            alignment: Alignment.center,
            child: Column(
              children: [
                Container(
                  width: 88,
                  height: 88,
                  decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24)),
                  alignment: Alignment.center,
                  margin: const EdgeInsets.only(bottom: 14),
                  child: Text(initials, style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold, color: colors.primary)),
                ),
                Text(_profile!.name, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w600, color: Colors.white)),
                const SizedBox(height: 4),
                Text(_profile!.tin, style: TextStyle(fontSize: 14, color: Colors.white.withOpacity(0.8))),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Personal Information', style: TextStyle(fontSize: 17, fontWeight: FontWeight.w600, color: colors.text)),
                    if (!_isEditing)
                      GestureDetector(
                        onTap: () => setState(() => _isEditing = true),
                        child: Row(
                          children: [
                            Icon(LucideIcons.edit3, size: 16, color: colors.primary),
                            const SizedBox(width: 6),
                            Text('Edit', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: colors.primary)),
                          ],
                        ),
                      )
                    else
                      Row(
                        children: [
                          GestureDetector(
                            onTap: _handleCancel,
                            child: Container(
                              width: 38,
                              height: 38,
                              decoration: BoxDecoration(color: colors.surfaceSecondary, borderRadius: BorderRadius.circular(12)),
                              alignment: Alignment.center,
                              child: Icon(LucideIcons.x, size: 18, color: colors.textSecondary),
                            ),
                          ),
                          const SizedBox(width: 10),
                          GestureDetector(
                            onTap: _handleSave,
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                              decoration: BoxDecoration(color: colors.primary, borderRadius: BorderRadius.circular(10)),
                              child: Row(
                                children: [
                                  const Icon(LucideIcons.save, size: 16, color: Colors.white),
                                  const SizedBox(width: 6),
                                  const Text('Save', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: Colors.white)),
                                ],
                              ),
                            ),
                          ),
                        ],
                      )
                  ],
                ),
                const SizedBox(height: 14),
                Container(
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    color: colors.surface,
                    borderRadius: BorderRadius.circular(18),
                    boxShadow: [
                      BoxShadow(color: colors.primary.withOpacity(0.05), blurRadius: 8, offset: const Offset(0, 2)),
                    ],
                  ),
                  child: Column(
                    children: [
                      _buildInfoRow(LucideIcons.mail, 'Email Address', _editedProfile!.email, (v) => setState(() => _editedProfile = TaxpayerProfile(id: _editedProfile!.id, name: _editedProfile!.name, tin: _editedProfile!.tin, email: v, phone: _editedProfile!.phone, address: _editedProfile!.address, avatar: _editedProfile!.avatar)), colors, keyboardType: TextInputType.emailAddress),
                      Container(height: 1, color: colors.border, margin: const EdgeInsets.symmetric(vertical: 16)),
                      _buildInfoRow(LucideIcons.phone, 'Phone Number', _editedProfile!.phone, (v) => setState(() => _editedProfile = TaxpayerProfile(id: _editedProfile!.id, name: _editedProfile!.name, tin: _editedProfile!.tin, email: _editedProfile!.email, phone: v, address: _editedProfile!.address, avatar: _editedProfile!.avatar)), colors, keyboardType: TextInputType.phone),
                      Container(height: 1, color: colors.border, margin: const EdgeInsets.symmetric(vertical: 16)),
                      _buildInfoRow(LucideIcons.mapPin, 'Address', _editedProfile!.address, (v) => setState(() => _editedProfile = TaxpayerProfile(id: _editedProfile!.id, name: _editedProfile!.name, tin: _editedProfile!.tin, email: _editedProfile!.email, phone: _editedProfile!.phone, address: v, avatar: _editedProfile!.avatar)), colors, isMultiline: true),
                    ],
                  ),
                ),
                const SizedBox(height: 24),
                Text('Registered Businesses', style: TextStyle(fontSize: 17, fontWeight: FontWeight.w600, color: colors.text)),
                const SizedBox(height: 14),
                ..._businesses.map((business) {
                  final isActive = business.status == BusinessStatus.active;
                  final statusColor = isActive ? colors.success : colors.warning;
                  return Container(
                    margin: const EdgeInsets.only(bottom: 10),
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: colors.surface,
                      borderRadius: BorderRadius.circular(14),
                      boxShadow: [
                        BoxShadow(color: colors.primary.withOpacity(0.03), blurRadius: 4, offset: const Offset(0, 1)),
                      ],
                    ),
                    child: Row(
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(business.name, style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: colors.text)),
                              const SizedBox(height: 3),
                              Text(business.tin, style: TextStyle(fontSize: 12, color: colors.textSecondary)),
                            ],
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
                          decoration: BoxDecoration(color: statusColor.withOpacity(0.15), borderRadius: BorderRadius.circular(12)),
                          child: Text(
                            business.status.name[0].toUpperCase() + business.status.name.substring(1),
                            style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: statusColor),
                          ),
                        ),
                      ],
                    ),
                  );
                }).toList(),
              ],
            ),
          )
        ],
      ),
    );
  }

  Widget _buildInfoRow(IconData icon, String label, String value, Function(String) onChanged, AppColors colors, {TextInputType? keyboardType, bool isMultiline = false}) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: 40,
          height: 40,
          decoration: BoxDecoration(color: colors.primary.withOpacity(0.12), borderRadius: BorderRadius.circular(12)),
          alignment: Alignment.center,
          child: Icon(icon, size: 18, color: colors.primary),
        ),
        const SizedBox(width: 14),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label, style: TextStyle(fontSize: 12, color: colors.textSecondary)),
              const SizedBox(height: 4),
              if (_isEditing)
                TextField(
                  controller: TextEditingController(text: value)..selection = TextSelection.collapsed(offset: value.length),
                  onChanged: onChanged,
                  keyboardType: keyboardType,
                  maxLines: isMultiline ? 2 : 1,
                  style: TextStyle(fontSize: 15, color: colors.text),
                  decoration: InputDecoration(
                    contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                    filled: true,
                    fillColor: colors.surfaceSecondary,
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide(color: colors.border)),
                    enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide(color: colors.border)),
                  ),
                )
              else
                Text(value, style: TextStyle(fontSize: 15, fontWeight: FontWeight.w500, color: colors.text)),
            ],
          ),
        ),
      ],
    );
  }
}
