// ignore_for_file: constant_identifier_names

enum BusinessType { physical, virtual }
enum BusinessStatus { active, pending, suspended, inactive, inReview, defaulter }

class Branch {
  final String id;
  final String name;
  final String address;
  final String phone;
  final bool isHeadquarters;

  Branch({
    required this.id,
    required this.name,
    required this.address,
    required this.phone,
    required this.isHeadquarters,
  });

  factory Branch.fromJson(Map<String, dynamic> json) {
    return Branch(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      address: json['address'] ?? '',
      phone: json['phone'] ?? '',
      isHeadquarters: json['isHeadquarters'] ?? false,
    );
  }
}

class Document {
  final String id;
  final String name;
  final String type;
  final String uploadedDate;
  final String status;

  Document({
    required this.id,
    required this.name,
    required this.type,
    required this.uploadedDate,
    required this.status,
  });

  factory Document.fromJson(Map<String, dynamic> json) {
    return Document(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      type: json['type'] ?? '',
      uploadedDate: json['uploadedDate'] ?? '',
      status: json['status'] ?? 'pending',
    );
  }
}

class Business {
  final String id;
  final String name;
  final BusinessType type;
  final String registrationNumber;
  final String tin;
  final BusinessStatus status;
  final String registeredDate;
  final String address;
  final String email;
  final String phone;
  final String region;
  final List<Branch> branches;
  final List<Document> documents;

  Business({
    required this.id,
    required this.name,
    required this.type,
    required this.registrationNumber,
    required this.tin,
    required this.status,
    required this.registeredDate,
    required this.address,
    required this.email,
    required this.phone,
    required this.region,
    required this.branches,
    required this.documents,
  });

  factory Business.fromJson(Map<String, dynamic> json) {
    return Business(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      type: json['type'] == 'virtual' ? BusinessType.virtual : BusinessType.physical,
      registrationNumber: json['registrationNumber'] ?? '',
      tin: json['tin'] ?? '',
      status: _parseBusinessStatus(json['status']),
      registeredDate: json['registeredDate'] ?? '',
      address: json['address'] ?? '',
      email: json['email'] ?? '',
      phone: json['phone'] ?? '',
      region: json['region'] ?? '',
      branches: (json['branches'] as List<dynamic>?)?.map((e) => Branch.fromJson(e)).toList() ?? [],
      documents: (json['documents'] as List<dynamic>?)?.map((e) => Document.fromJson(e)).toList() ?? [],
    );
  }

  static BusinessStatus _parseBusinessStatus(String? status) {
    switch (status) {
      case 'active': return BusinessStatus.active;
      case 'suspended': return BusinessStatus.suspended;
      case 'inactive': return BusinessStatus.inactive;
      case 'in_review': return BusinessStatus.inReview;
      case 'defaulter': return BusinessStatus.defaulter;
      case 'pending':
      default:
        return BusinessStatus.pending;
    }
  }
}

enum AssessmentStatus { pending, approved, unpaid, paid, overdue, partial, disputed }

class Assessment {
  final String id;
  final String businessId;
  final String businessName;
  final String referenceNumber;
  final String description;
  final double amount;
  final double amountPaid;
  final String dueDate;
  final String issueDate;
  final AssessmentStatus status;
  final String taxPeriod;
  final String taxType;

  Assessment({
    required this.id,
    required this.businessId,
    required this.businessName,
    required this.referenceNumber,
    required this.description,
    required this.amount,
    required this.amountPaid,
    required this.dueDate,
    required this.issueDate,
    required this.status,
    required this.taxPeriod,
    required this.taxType,
  });

  factory Assessment.fromJson(Map<String, dynamic> json) {
    return Assessment(
      id: json['id'] ?? '',
      businessId: json['businessId'] ?? json['taxpayerId'] ?? '',
      businessName: json['businessName'] ?? '',
      referenceNumber: json['referenceNumber'] ?? '',
      description: json['description'] ?? '',
      amount: (json['amount'] ?? 0).toDouble(),
      amountPaid: (json['amountPaid'] ?? 0).toDouble(),
      dueDate: json['dueDate'] ?? '',
      issueDate: json['assessmentDate'] ?? json['issueDate'] ?? '',
      status: _parseAssessmentStatus(json['status']),
      taxPeriod: json['period'] ?? json['taxPeriod'] ?? '',
      taxType: json['taxType'] ?? '',
    );
  }

  static AssessmentStatus _parseAssessmentStatus(String? status) {
    switch (status) {
      case 'pending': return AssessmentStatus.pending;
      case 'approved': return AssessmentStatus.approved;
      case 'paid': return AssessmentStatus.paid;
      case 'overdue': return AssessmentStatus.overdue;
      case 'partial': return AssessmentStatus.partial;
      case 'disputed': return AssessmentStatus.disputed;
      case 'unpaid':
      default:
        return AssessmentStatus.unpaid;
    }
  }
}

enum PaymentMethod { bankTransfer, mobileMoney, card, cash, pos, check }
enum PaymentStatus { pending, processing, completed, confirmed, failed, cancelled, refunded }

class Payment {
  final String id;
  final String assessmentId;
  final String referenceNumber;
  final double amount;
  final PaymentMethod method;
  final PaymentStatus status;
  final String date;
  final String? transactionRef;
  final String? receiptNumber;
  final String? proofDocument;

  Payment({
    required this.id,
    required this.assessmentId,
    required this.referenceNumber,
    required this.amount,
    required this.method,
    required this.status,
    required this.date,
    this.transactionRef,
    this.receiptNumber,
    this.proofDocument,
  });

  factory Payment.fromJson(Map<String, dynamic> json) {
    return Payment(
      id: json['id'] ?? '',
      assessmentId: json['assessmentId'] ?? '',
      referenceNumber: json['transactionRef'] ?? json['referenceNumber'] ?? '',
      amount: (json['amount'] ?? 0).toDouble(),
      method: _parsePaymentMethod(json['paymentMethod'] ?? json['method']),
      status: _parsePaymentStatus(json['status']),
      date: json['paymentDate'] ?? json['date'] ?? '',
      transactionRef: json['transactionRef'],
      receiptNumber: json['receiptNumber'],
      proofDocument: json['proofDocument'],
    );
  }

  static PaymentMethod _parsePaymentMethod(String? method) {
    switch (method) {
      case 'bank_transfer': return PaymentMethod.bankTransfer;
      case 'mobile_money': return PaymentMethod.mobileMoney;
      case 'momo': return PaymentMethod.mobileMoney;
      case 'bank': return PaymentMethod.bankTransfer;
      case 'card': return PaymentMethod.card;
      case 'cash': return PaymentMethod.cash;
      case 'pos': return PaymentMethod.pos;
      case 'check': return PaymentMethod.check;
      default:
        return PaymentMethod.mobileMoney;
    }
  }

  static PaymentStatus _parsePaymentStatus(String? status) {
    switch (status) {
      case 'completed': return PaymentStatus.completed;
      case 'confirmed': return PaymentStatus.confirmed;
      case 'failed': return PaymentStatus.failed;
      case 'cancelled': return PaymentStatus.cancelled;
      case 'refunded': return PaymentStatus.refunded;
      case 'processing': return PaymentStatus.processing;
      case 'pending':
      default:
        return PaymentStatus.pending;
    }
  }
}

class Receipt {
  final String id;
  final String paymentId;
  final String receiptNumber;
  final String businessName;
  final double amount;
  final String date;
  final String taxPeriod;
  final String taxType;
  final String qrCode;
  final bool verified;

  Receipt({
    required this.id,
    required this.paymentId,
    required this.receiptNumber,
    required this.businessName,
    required this.amount,
    required this.date,
    required this.taxPeriod,
    required this.taxType,
    required this.qrCode,
    required this.verified,
  });

  factory Receipt.fromJson(Map<String, dynamic> json) {
    return Receipt(
      id: json['id'] ?? '',
      paymentId: json['paymentId'] ?? '',
      receiptNumber: json['receiptNumber'] ?? '',
      businessName: json['businessName'] ?? '',
      amount: (json['amount'] ?? 0).toDouble(),
      date: json['date'] ?? '',
      taxPeriod: json['taxPeriod'] ?? '',
      taxType: json['taxType'] ?? '',
      qrCode: json['qrCode'] ?? '',
      verified: json['verified'] ?? false,
    );
  }
}

enum DisputeStatus { submitted, underReview, resolved, rejected }
enum DisputeCategory { assessment, payment, registration, other }

class DisputeResponse {
  final String id;
  final String message;
  final String date;
  final bool isOfficial;

  DisputeResponse({
    required this.id,
    required this.message,
    required this.date,
    required this.isOfficial,
  });

  factory DisputeResponse.fromJson(Map<String, dynamic> json) {
    return DisputeResponse(
      id: json['id'] ?? '',
      message: json['message'] ?? '',
      date: json['date'] ?? '',
      isOfficial: json['isOfficial'] ?? false,
    );
  }
}

class Dispute {
  final String id;
  final String referenceNumber;
  final DisputeCategory category;
  final String subject;
  final String description;
  final DisputeStatus status;
  final String submittedDate;
  final String lastUpdated;
  final List<String> attachments;
  final List<DisputeResponse> responses;

  Dispute({
    required this.id,
    required this.referenceNumber,
    required this.category,
    required this.subject,
    required this.description,
    required this.status,
    required this.submittedDate,
    required this.lastUpdated,
    required this.attachments,
    required this.responses,
  });

  factory Dispute.fromJson(Map<String, dynamic> json) {
    return Dispute(
      id: json['id'] ?? '',
      referenceNumber: json['referenceNumber'] ?? '',
      category: _parseDisputeCategory(json['category']),
      subject: json['subject'] ?? '',
      description: json['description'] ?? '',
      status: _parseDisputeStatus(json['status']),
      submittedDate: json['submittedDate'] ?? '',
      lastUpdated: json['lastUpdated'] ?? '',
      attachments: (json['attachments'] as List<dynamic>?)?.cast<String>() ?? [],
      responses: (json['responses'] as List<dynamic>?)?.map((e) => DisputeResponse.fromJson(e)).toList() ?? [],
    );
  }

  static DisputeCategory _parseDisputeCategory(String? category) {
    switch (category) {
      case 'payment': return DisputeCategory.payment;
      case 'registration': return DisputeCategory.registration;
      case 'other': return DisputeCategory.other;
      case 'assessment':
      default:
        return DisputeCategory.assessment;
    }
  }

  static DisputeStatus _parseDisputeStatus(String? status) {
    switch (status) {
      case 'under_review': return DisputeStatus.underReview;
      case 'resolved': return DisputeStatus.resolved;
      case 'rejected': return DisputeStatus.rejected;
      case 'submitted':
      default:
        return DisputeStatus.submitted;
    }
  }
}

enum NotificationType { reminder, system, payment, assessment, dispute }

class AppNotification {
  final String id;
  final NotificationType type;
  final String title;
  final String message;
  final String date;
  final bool read;
  final String? actionUrl;

  AppNotification({
    required this.id,
    required this.type,
    required this.title,
    required this.message,
    required this.date,
    required this.read,
    this.actionUrl,
  });

  factory AppNotification.fromJson(Map<String, dynamic> json) {
    return AppNotification(
      id: json['id'] ?? '',
      type: _parseNotificationType(json['type']),
      title: json['title'] ?? '',
      message: json['message'] ?? '',
      date: json['date'] ?? '',
      read: json['read'] ?? false,
      actionUrl: json['actionUrl'],
    );
  }

  static NotificationType _parseNotificationType(String? type) {
    switch (type) {
      case 'system': return NotificationType.system;
      case 'payment': return NotificationType.payment;
      case 'assessment': return NotificationType.assessment;
      case 'dispute': return NotificationType.dispute;
      case 'reminder':
      default:
        return NotificationType.reminder;
    }
  }
}

class TaxpayerProfile {
  final String id;
  final String name;
  final String email;
  final String phone;
  final String tin;
  final String address;
  final String? avatar;

  TaxpayerProfile({
    required this.id,
    required this.name,
    required this.email,
    required this.phone,
    required this.tin,
    required this.address,
    this.avatar,
  });

  factory TaxpayerProfile.fromJson(Map<String, dynamic> json) {
    return TaxpayerProfile(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      phone: json['phone'] ?? '',
      tin: json['tin'] ?? '',
      address: json['address'] ?? '',
      avatar: json['avatar'],
    );
  }
}

class DashboardSummary {
  final double totalDue;
  final double totalOverdue;
  final double totalPaid;
  final int pendingAssessments;
  final int activeBusinesses;

  DashboardSummary({
    required this.totalDue,
    required this.totalOverdue,
    required this.totalPaid,
    required this.pendingAssessments,
    required this.activeBusinesses,
  });

  factory DashboardSummary.fromJson(Map<String, dynamic> json) {
    return DashboardSummary(
      totalDue: (json['totalDue'] ?? 0).toDouble(),
      totalOverdue: (json['totalOverdue'] ?? 0).toDouble(),
      totalPaid: (json['totalPaid'] ?? 0).toDouble(),
      pendingAssessments: json['pendingAssessments'] ?? 0,
      activeBusinesses: json['activeBusinesses'] ?? 0,
    );
  }
}

class FieldVisit {
  final String id;
  final String taxpayerId;
  final String officerId;
  final String businessName;
  final String location;
  final String visitDate;
  final String? visitTime;
  final String purpose;
  final String findings;
  final List<String> violations;
  final String outcome;
  final String status;
  final String? notes;
  final List<String>? photos;

  FieldVisit({
    required this.id, required this.taxpayerId, required this.officerId,
    required this.businessName, required this.location, required this.visitDate,
    this.visitTime, required this.purpose, required this.findings,
    required this.violations, required this.outcome, required this.status,
    this.notes, this.photos,
  });

  factory FieldVisit.fromJson(Map<String, dynamic> json) {
    return FieldVisit(
      id: json['id'] ?? '', taxpayerId: json['taxpayerId'] ?? '',
      officerId: json['officerId'] ?? '', businessName: json['businessName'] ?? '',
      location: json['location'] ?? '', visitDate: json['visitDate'] ?? '',
      visitTime: json['visitTime'], purpose: json['purpose'] ?? 'inspection',
      findings: json['findings'] ?? '',
      violations: (json['violations'] as List<dynamic>?)?.cast<String>() ?? [],
      outcome: json['outcome'] ?? 'successful', status: json['status'] ?? 'completed',
      notes: json['notes'],
      photos: (json['photos'] as List<dynamic>?)?.cast<String>(),
    );
  }
}

class InvoiceItem {
  final String description;
  final double amount;
  InvoiceItem({required this.description, required this.amount});
  factory InvoiceItem.fromJson(Map<String, dynamic> json) =>
      InvoiceItem(description: json['description'] ?? '', amount: (json['amount'] ?? 0).toDouble());
}

class Invoice {
  final String id;
  final String invoiceNumber;
  final String taxpayerId;
  final String? taxpayerName;
  final double amount;
  final String dueDate;
  final String createdDate;
  final String status;
  final List<InvoiceItem> items;

  Invoice({
    required this.id, required this.invoiceNumber, required this.taxpayerId,
    this.taxpayerName, required this.amount, required this.dueDate,
    required this.createdDate, required this.status, required this.items,
  });

  factory Invoice.fromJson(Map<String, dynamic> json) => Invoice(
    id: json['id'] ?? '', invoiceNumber: json['invoiceNumber'] ?? '',
    taxpayerId: json['taxpayerId'] ?? '', taxpayerName: json['taxpayerName'],
    amount: (json['amount'] ?? 0).toDouble(), dueDate: json['dueDate'] ?? '',
    createdDate: json['createdDate'] ?? '', status: json['status'] ?? 'unpaid',
    items: (json['items'] as List<dynamic>?)?.map((e) => InvoiceItem.fromJson(e)).toList() ?? [],
  );
}
