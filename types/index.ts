// User Types
export type UserRole = 'admin' | 'exchange';

export interface User {
  id: string;
  username: string;
  password: string; // hashed
  role: UserRole;
  exchangeName?: string;
  contactInfo?: ContactInfo;
  balance: number;
  commissionRates: CommissionRates;
  assignedBanks: string[]; // array of bank IDs
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  address?: string;
}

export interface CommissionRates {
  incoming: CommissionRate;
  outgoing: CommissionRate;
}

export interface CommissionRate {
  type: 'fixed' | 'percentage';
  value: number;
}

// Order Types
export type OrderType = 'incoming' | 'outgoing';

export type OrderStatus = 
  | 'submitted'
  | 'pending_review'
  | 'approved'
  | 'rejected'
  | 'processing'
  | 'completed'
  | 'cancelled';

export interface Order {
  id: string;
  orderId: string; // custom format: TYYMMXXXX
  exchangeId: string; // reference to user
  type: OrderType;
  status: OrderStatus;
  submittedAmount: number;
  finalAmount?: number; // for incoming orders
  commission: number;
  cliqDetails?: CliqDetails;
  recipientDetails?: RecipientDetails;
  bankUsed?: string;
  platformBankUsed?: string; // for outgoing orders
  screenshots: string[]; // array of file URLs
  adminNotes?: string;
  rejectionReason?: string;
  timestamps: OrderTimestamps;
}

export interface CliqDetails {
  aliasName?: string;
  mobileNumber?: string; // Jordanian mobile format
}

export interface RecipientDetails {
  name?: string;
  bankName?: string;
  accountNumber?: string;
  notes?: string;
}

export interface OrderTimestamps {
  created: Date;
  updated: Date;
  completed?: Date;
  approved?: Date;
  rejected?: Date;
}

// Bank Types
export interface Bank {
  id: string;
  name: string;
  accountNumber?: string;
  accountName?: string;
  type: 'platform' | 'exchange';
  status: 'active' | 'inactive';
  balance?: number; // for platform banks
  assignedTo?: string[]; // array of exchange IDs
  isPublic: boolean; // public vs private assignment
  createdAt: Date;
  updatedAt: Date;
}

export interface BankAssignment {
  id: string;
  bankId: string;
  exchangeId: string;
  assignedAt: Date;
  assignedBy: string; // admin user ID
  isActive: boolean;
}

// Platform Bank Types
export interface PlatformBank {
  id: string;
  name: string;
  accountNumber: string;
  accountName: string;
  balance: number;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

// Message/Chat Types
export interface ChatMessage {
  id: string;
  orderId: string;
  senderId: string;
  senderRole: UserRole;
  message: string;
  messageType: 'text' | 'system';
  timestamp: Date;
  isRead: boolean;
}

export interface ChatThread {
  id: string;
  orderId: string;
  participants: string[]; // user IDs
  messages: ChatMessage[];
  lastMessage?: ChatMessage;
  createdAt: Date;
  updatedAt: Date;
}

// File Upload Types
export interface FileUpload {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
  orderId?: string; // associated order
  status: 'uploading' | 'completed' | 'failed';
}

export interface UploadProgress {
  filename: string;
  progress: number; // 0-100
  status: 'uploading' | 'completed' | 'failed' | 'cancelled';
  error?: string;
}

// Balance and Commission Types
export interface BalanceTransaction {
  id: string;
  userId: string;
  orderId: string;
  type: 'credit' | 'debit';
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  timestamp: Date;
}

export interface CommissionCalculation {
  orderId: string;
  baseAmount: number;
  commissionRate: CommissionRate;
  commissionAmount: number;
  finalAmount: number;
  calculatedAt: Date;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Auth Types
export interface AuthUser {
  id: string;
  username: string;
  role: UserRole;
  exchangeName?: string;
  balance: number;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthSession {
  user: AuthUser;
  token: string;
  expiresAt: Date;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  data?: any; // additional notification data
  createdAt: Date;
}

// Form Types
export interface OrderFormData {
  type: OrderType;
  amount: number;
  cliqDetails?: CliqDetails;
  recipientDetails?: RecipientDetails;
  bankUsed?: string;
  screenshots?: File[];
}

export interface UserFormData {
  username: string;
  password?: string;
  role: UserRole;
  exchangeName?: string;
  contactInfo?: ContactInfo;
  balance?: number;
  commissionRates?: CommissionRates;
  assignedBanks?: string[];
}

// Filter and Search Types
export interface OrderFilters {
  status?: OrderStatus[];
  type?: OrderType[];
  exchangeId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}

export interface OrderSort {
  field: 'createdAt' | 'amount' | 'status' | 'orderId';
  direction: 'asc' | 'desc';
}

// Statistics Types
export interface OrderStatistics {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  completed: number;
  totalAmount: number;
  avgAmount: number;
}

export interface DashboardStats {
  orders: OrderStatistics;
  users: {
    total: number;
    active: number;
    exchanges: number;
  };
  balances: {
    totalExchangeBalance: number;
    totalPlatformBalance: number;
  };
}

// Utility Types
export type RequireField<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;
export type WithTimestamps<T> = T & {
  createdAt: Date;
  updatedAt: Date;
};

// Firestore Document Types (for Firebase operations)
export type FirestoreUser = Omit<User, 'createdAt' | 'updatedAt'> & {
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
};

export type FirestoreOrder = Omit<Order, 'timestamps'> & {
  timestamps: {
    created: any; // Firestore Timestamp
    updated: any; // Firestore Timestamp
    completed?: any; // Firestore Timestamp
    approved?: any; // Firestore Timestamp
    rejected?: any; // Firestore Timestamp
  };
};

// Environment Types
export interface EnvironmentConfig {
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
  };
  app: {
    url: string;
    environment: 'development' | 'production' | 'test';
  };
  security: {
    sessionSecret: string;
    bcryptSaltRounds: number;
    jwtSecret: string;
  };
} 