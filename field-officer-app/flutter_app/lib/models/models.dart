class Taxpayer {
  final String id;
  final String name;
  final String businessName;
  final String tin;
  final String email;
  final String phone;
  final String address;
  final String region;
  final String registrationDate;
  final List<String> taxType;
  final double outstandingAmount;
  final String? lastPaymentDate;
  final String status; // 'active', 'pending', 'suspended', 'inactive', 'in_review', 'defaulter'
  final String qrCode;

  Taxpayer({
    required this.id,
    required this.name,
    required this.businessName,
    required this.tin,
    required this.email,
    required this.phone,
    required this.address,
    required this.region,
    required this.registrationDate,
    required this.taxType,
    required this.outstandingAmount,
    this.lastPaymentDate,
    required this.status,
    required this.qrCode,
  });

  factory Taxpayer.fromJson(Map<String, dynamic> json) {
    return Taxpayer(
      id: json['id'] as String,
      name: json['name'] as String,
      businessName: json['businessName'] as String,
      tin: json['tin'] as String,
      email: json['email'] as String,
      phone: json['phone'] as String,
      address: json['address'] as String,
      region: json['region'] as String,
      registrationDate: json['registrationDate'] as String,
      taxType: (json['taxType'] as List<dynamic>).cast<String>(),
      outstandingAmount: (json['outstandingAmount'] as num).toDouble(),
      lastPaymentDate: json['lastPaymentDate'] as String?,
      status: json['status'] as String,
      qrCode: json['qrCode'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'businessName': businessName,
      'tin': tin,
      'email': email,
      'phone': phone,
      'address': address,
      'region': region,
      'registrationDate': registrationDate,
      'taxType': taxType,
      'outstandingAmount': outstandingAmount,
      'lastPaymentDate': lastPaymentDate,
      'status': status,
      'qrCode': qrCode,
    };
  }
}

class Payment {
  final String id;
  final String taxpayerId;
  final String taxpayerName;
  final double amount;
  final String date;
  final String time;
  final String method; // 'cash', 'bank_transfer', 'mobile_money', 'card', 'pos', 'check'
  final String status; // 'pending', 'processing', 'completed', 'confirmed', 'failed', 'cancelled', 'refunded'
  final String receiptNumber;
  final String? invoiceNumber;
  final String? transactionRef;
  final String? assessmentId;

  Payment({
    required this.id,
    required this.taxpayerId,
    required this.taxpayerName,
    required this.amount,
    required this.date,
    required this.time,
    required this.method,
    required this.status,
    required this.receiptNumber,
    this.invoiceNumber,
    this.transactionRef,
    this.assessmentId,
  });

  Payment copyWith({
    String? id,
    String? taxpayerId,
    String? taxpayerName,
    double? amount,
    String? date,
    String? time,
    String? method,
    String? status,
    String? receiptNumber,
    String? invoiceNumber,
    String? transactionRef,
    String? assessmentId,
  }) {
    return Payment(
      id: id ?? this.id,
      taxpayerId: taxpayerId ?? this.taxpayerId,
      taxpayerName: taxpayerName ?? this.taxpayerName,
      amount: amount ?? this.amount,
      date: date ?? this.date,
      time: time ?? this.time,
      method: method ?? this.method,
      status: status ?? this.status,
      receiptNumber: receiptNumber ?? this.receiptNumber,
      invoiceNumber: invoiceNumber ?? this.invoiceNumber,
      transactionRef: transactionRef ?? this.transactionRef,
      assessmentId: assessmentId ?? this.assessmentId,
    );
  }

  factory Payment.fromJson(Map<String, dynamic> json) {
    return Payment(
      id: json['id'] as String,
      taxpayerId: json['taxpayerId'] as String,
      taxpayerName: json['taxpayerName'] as String,
      amount: (json['amount'] as num).toDouble(),
      date: json['date'] as String,
      time: json['time'] as String,
      method: json['method'] as String,
      status: json['status'] as String,
      receiptNumber: json['receiptNumber'] as String,
      invoiceNumber: json['invoiceNumber'] as String?,
      transactionRef: json['transactionRef'] as String?,
      assessmentId: json['assessmentId'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'taxpayerId': taxpayerId,
      'taxpayerName': taxpayerName,
      'amount': amount,
      'date': date,
      'time': time,
      'method': method,
      'status': status,
      'receiptNumber': receiptNumber,
      'invoiceNumber': invoiceNumber,
      'transactionRef': transactionRef,
      'assessmentId': assessmentId,
    };
  }
}

class InvoiceItem {
  final String description;
  final double amount;

  InvoiceItem({
    required this.description,
    required this.amount,
  });

  factory InvoiceItem.fromJson(Map<String, dynamic> json) {
    return InvoiceItem(
      description: json['description'] as String,
      amount: (json['amount'] as num).toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'description': description,
      'amount': amount,
    };
  }
}

class Invoice {
  final String id;
  final String invoiceNumber;
  final String taxpayerId;
  final String taxpayerName;
  final double amount;
  final String dueDate;
  final String createdDate;
  final String status; // 'unpaid', 'paid', 'overdue'
  final List<InvoiceItem> items;

  Invoice({
    required this.id,
    required this.invoiceNumber,
    required this.taxpayerId,
    required this.taxpayerName,
    required this.amount,
    required this.dueDate,
    required this.createdDate,
    required this.status,
    required this.items,
  });

  factory Invoice.fromJson(Map<String, dynamic> json) {
    var rawItems = json['items'] as List;
    List<InvoiceItem> itemsList =
        rawItems.map((item) => InvoiceItem.fromJson(item)).toList();

    return Invoice(
      id: json['id'] as String,
      invoiceNumber: json['invoiceNumber'] as String,
      taxpayerId: json['taxpayerId'] as String,
      taxpayerName: json['taxpayerName'] as String,
      amount: (json['amount'] as num).toDouble(),
      dueDate: json['dueDate'] as String,
      createdDate: json['createdDate'] as String,
      status: json['status'] as String,
      items: itemsList,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'invoiceNumber': invoiceNumber,
      'taxpayerId': taxpayerId,
      'taxpayerName': taxpayerName,
      'amount': amount,
      'dueDate': dueDate,
      'createdDate': createdDate,
      'status': status,
      'items': items.map((item) => item.toJson()).toList(),
    };
  }
}

class VisitLog {
  final String id;
  final String taxpayerId;
  final String taxpayerName;
  final String address;
  final String date;
  final String time;
  final String purpose; // 'collection', 'inspection', 'verification', 'follow-up'
  final String notes;
  final String outcome; // 'successful', 'not-available', 'refused', 'rescheduled'
  final String? photoUri;

  VisitLog({
    required this.id,
    required this.taxpayerId,
    required this.taxpayerName,
    required this.address,
    required this.date,
    required this.time,
    required this.purpose,
    required this.notes,
    required this.outcome,
    this.photoUri,
  });

  factory VisitLog.fromJson(Map<String, dynamic> json) {
    return VisitLog(
      id: json['id'] as String,
      taxpayerId: json['taxpayerId'] as String,
      taxpayerName: json['taxpayerName'] as String,
      address: json['address'] as String,
      date: json['date'] as String,
      time: json['time'] as String,
      purpose: json['purpose'] as String,
      notes: json['notes'] as String,
      outcome: json['outcome'] as String,
      photoUri: json['photoUri'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'taxpayerId': taxpayerId,
      'taxpayerName': taxpayerName,
      'address': address,
      'date': date,
      'time': time,
      'purpose': purpose,
      'notes': notes,
      'outcome': outcome,
      'photoUri': photoUri,
    };
  }
}

class OfficerStats {
  final double todayCollections;
  final double dailyTarget;
  final int totalVisits;
  final int successfulCollections;
  final int pendingPayments;
  final int defaultersCount;

  OfficerStats({
    required this.todayCollections,
    required this.dailyTarget,
    required this.totalVisits,
    required this.successfulCollections,
    required this.pendingPayments,
    required this.defaultersCount,
  });
}

class Assessment {
  final String id;
  final String taxpayerId;
  final String? businessName;
  final String? referenceNumber;
  final String? description;
  final String taxType;
  final double amount;
  final double amountPaid;
  final String period;
  final String status; // pending, approved, unpaid, paid, overdue, partial, disputed
  final String assessedBy;
  final String assessmentDate;
  final String dueDate;

  Assessment({
    required this.id, required this.taxpayerId, this.businessName,
    this.referenceNumber, this.description, required this.taxType,
    required this.amount, required this.amountPaid, required this.period,
    required this.status, required this.assessedBy, required this.assessmentDate,
    required this.dueDate,
  });

  factory Assessment.fromJson(Map<String, dynamic> json) {
    return Assessment(
      id: json['id'] as String, taxpayerId: json['taxpayerId'] as String,
      businessName: json['businessName'] as String?,
      referenceNumber: json['referenceNumber'] as String?,
      description: json['description'] as String?,
      taxType: json['taxType'] as String,
      amount: (json['amount'] as num).toDouble(),
      amountPaid: (json['amountPaid'] as num).toDouble(),
      period: json['period'] as String, status: json['status'] as String,
      assessedBy: json['assessedBy'] as String,
      assessmentDate: json['assessmentDate'] as String,
      dueDate: json['dueDate'] as String,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id, 'taxpayerId': taxpayerId, 'businessName': businessName,
    'referenceNumber': referenceNumber, 'description': description,
    'taxType': taxType, 'amount': amount, 'amountPaid': amountPaid,
    'period': period, 'status': status, 'assessedBy': assessedBy,
    'assessmentDate': assessmentDate, 'dueDate': dueDate,
  };
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
    required this.id, required this.paymentId, required this.receiptNumber,
    required this.businessName, required this.amount, required this.date,
    required this.taxPeriod, required this.taxType, required this.qrCode,
    required this.verified,
  });

  factory Receipt.fromJson(Map<String, dynamic> json) => Receipt(
    id: json['id'] as String, paymentId: json['paymentId'] as String,
    receiptNumber: json['receiptNumber'] as String,
    businessName: json['businessName'] as String,
    amount: (json['amount'] as num).toDouble(), date: json['date'] as String,
    taxPeriod: json['taxPeriod'] as String, taxType: json['taxType'] as String,
    qrCode: json['qrCode'] as String, verified: json['verified'] as bool,
  );

  Map<String, dynamic> toJson() => {
    'id': id, 'paymentId': paymentId, 'receiptNumber': receiptNumber,
    'businessName': businessName, 'amount': amount, 'date': date,
    'taxPeriod': taxPeriod, 'taxType': taxType, 'qrCode': qrCode,
    'verified': verified,
  };
}
