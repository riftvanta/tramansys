import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  writeBatch,
  increment,
  Timestamp,
  DocumentSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  User,
  Order,
  Bank,
  PlatformBank,
  ChatMessage,
  BalanceTransaction,
  Notification,
  FirestoreUser,
  FirestoreOrder,
  OrderFilters,
  OrderSort,
  PaginatedResponse,
  OrderStatus,
  UserRole,
} from '../types';

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  ORDERS: 'orders',
  BANKS: 'banks',
  BANK_ASSIGNMENTS: 'bankAssignments',
  PLATFORM_BANKS: 'platformBanks',
  CHAT_MESSAGES: 'chatMessages',
  CHAT_THREADS: 'chatThreads',
  FILE_UPLOADS: 'fileUploads',
  BALANCE_TRANSACTIONS: 'balanceTransactions',
  NOTIFICATIONS: 'notifications',
  COUNTERS: 'counters',
} as const;

// Error handling utility
export class FirestoreError extends Error {
  constructor(message: string, public code?: string, public originalError?: Error) {
    super(message);
    this.name = 'FirestoreError';
  }
}

// Timestamp utilities
export const toFirestoreTimestamp = (date: Date) => Timestamp.fromDate(date);
export const fromFirestoreTimestamp = (timestamp: any): Date => {
  if (timestamp?.toDate) {
    return timestamp.toDate();
  }
  return new Date(timestamp);
};

// Document converter utilities
export const convertUserFromFirestore = (doc: DocumentSnapshot): User | null => {
  if (!doc.exists()) return null;
  const data = doc.data() as FirestoreUser;
  return {
    ...data,
    id: doc.id,
    createdAt: fromFirestoreTimestamp(data.createdAt),
    updatedAt: fromFirestoreTimestamp(data.updatedAt),
  };
};

export const convertOrderFromFirestore = (doc: DocumentSnapshot): Order | null => {
  if (!doc.exists()) return null;
  const data = doc.data() as FirestoreOrder;
  return {
    ...data,
    id: doc.id,
    timestamps: {
      created: fromFirestoreTimestamp(data.timestamps.created),
      updated: fromFirestoreTimestamp(data.timestamps.updated),
      completed: data.timestamps.completed ? fromFirestoreTimestamp(data.timestamps.completed) : undefined,
      approved: data.timestamps.approved ? fromFirestoreTimestamp(data.timestamps.approved) : undefined,
      rejected: data.timestamps.rejected ? fromFirestoreTimestamp(data.timestamps.rejected) : undefined,
    },
  };
};

// =============================================================================
// USER OPERATIONS
// =============================================================================

export const userOperations = {
  // Create user
  async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.USERS), {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      throw new FirestoreError('Failed to create user', 'user-create-error', error as Error);
    }
  },

  // Get user by ID
  async getById(userId: string): Promise<User | null> {
    try {
      const docRef = doc(db, COLLECTIONS.USERS, userId);
      const docSnap = await getDoc(docRef);
      return convertUserFromFirestore(docSnap);
    } catch (error) {
      throw new FirestoreError('Failed to get user', 'user-get-error', error as Error);
    }
  },

  // Get user by username
  async getByUsername(username: string): Promise<User | null> {
    try {
      const q = query(
        collection(db, COLLECTIONS.USERS),
        where('username', '==', username),
        limit(1)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return null;
      return convertUserFromFirestore(querySnapshot.docs[0]);
    } catch (error) {
      throw new FirestoreError('Failed to get user by username', 'user-get-username-error', error as Error);
    }
  },

  // Update user
  async update(userId: string, userData: Partial<User>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.USERS, userId);
      const { id, createdAt, ...updateData } = userData;
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      throw new FirestoreError('Failed to update user', 'user-update-error', error as Error);
    }
  },

  // Update user balance
  async updateBalance(userId: string, amount: number): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.USERS, userId);
      await updateDoc(docRef, {
        balance: increment(amount),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      throw new FirestoreError('Failed to update user balance', 'user-balance-error', error as Error);
    }
  },

  // Get all users with filtering
  async getAll(filters?: { role?: UserRole; status?: 'active' | 'inactive' }): Promise<User[]> {
    try {
      let q = query(collection(db, COLLECTIONS.USERS), orderBy('createdAt', 'desc'));
      
      if (filters?.role) {
        q = query(q, where('role', '==', filters.role));
      }
      if (filters?.status) {
        q = query(q, where('status', '==', filters.status));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(convertUserFromFirestore).filter(Boolean) as User[];
    } catch (error) {
      throw new FirestoreError('Failed to get all users', 'users-get-all-error', error as Error);
    }
  },

  // Delete user
  async delete(userId: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.USERS, userId);
      await deleteDoc(docRef);
    } catch (error) {
      throw new FirestoreError('Failed to delete user', 'user-delete-error', error as Error);
    }
  },

  // Real-time listener for user changes
  onUserChange(userId: string, callback: (user: User | null) => void): Unsubscribe {
    const docRef = doc(db, COLLECTIONS.USERS, userId);
    return onSnapshot(docRef, (doc) => {
      callback(convertUserFromFirestore(doc));
    }, (error) => {
      console.error('User listener error:', error);
      callback(null);
    });
  },
};

// =============================================================================
// ORDER OPERATIONS
// =============================================================================

export const orderOperations = {
  // Generate next order ID
  async generateOrderId(): Promise<string> {
    try {
      const now = new Date();
      const year = now.getFullYear().toString().slice(-2); // YY format
      const month = (now.getMonth() + 1).toString().padStart(2, '0'); // MM format
      
      const counterRef = doc(db, COLLECTIONS.COUNTERS, `orders-${year}${month}`);
      const counterDoc = await getDoc(counterRef);
      
      let nextNumber = 1;
      if (counterDoc.exists()) {
        nextNumber = (counterDoc.data().count || 0) + 1;
      }

      // Update counter atomically
      await updateDoc(counterRef, { count: nextNumber });
      
      // Format: TYYMMXXXX (T + year + month + 4-digit number)
      return `T${year}${month}${nextNumber.toString().padStart(4, '0')}`;
    } catch (error) {
      throw new FirestoreError('Failed to generate order ID', 'order-id-error', error as Error);
    }
  },

  // Create order
  async create(orderData: Omit<Order, 'id' | 'orderId' | 'timestamps'>): Promise<string> {
    try {
      const orderId = await this.generateOrderId();
      const docRef = await addDoc(collection(db, COLLECTIONS.ORDERS), {
        ...orderData,
        orderId,
        timestamps: {
          created: serverTimestamp(),
          updated: serverTimestamp(),
        },
      });
      return docRef.id;
    } catch (error) {
      throw new FirestoreError('Failed to create order', 'order-create-error', error as Error);
    }
  },

  // Get order by ID
  async getById(orderId: string): Promise<Order | null> {
    try {
      const docRef = doc(db, COLLECTIONS.ORDERS, orderId);
      const docSnap = await getDoc(docRef);
      return convertOrderFromFirestore(docSnap);
    } catch (error) {
      throw new FirestoreError('Failed to get order', 'order-get-error', error as Error);
    }
  },

  // Get order by custom order ID
  async getByOrderId(orderId: string): Promise<Order | null> {
    try {
      const q = query(
        collection(db, COLLECTIONS.ORDERS),
        where('orderId', '==', orderId),
        limit(1)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return null;
      return convertOrderFromFirestore(querySnapshot.docs[0]);
    } catch (error) {
      throw new FirestoreError('Failed to get order by order ID', 'order-get-orderid-error', error as Error);
    }
  },

  // Update order
  async update(orderId: string, orderData: Partial<Order>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.ORDERS, orderId);
      const { id, orderId: customOrderId, timestamps, ...updateData } = orderData;
      
      // Handle timestamp updates for status changes
      const timestampUpdates: any = { updated: serverTimestamp() };
      if (orderData.status) {
        switch (orderData.status) {
          case 'approved':
            timestampUpdates.approved = serverTimestamp();
            break;
          case 'rejected':
            timestampUpdates.rejected = serverTimestamp();
            break;
          case 'completed':
            timestampUpdates.completed = serverTimestamp();
            break;
        }
      }

      await updateDoc(docRef, {
        ...updateData,
        'timestamps.updated': timestampUpdates.updated,
        ...(timestampUpdates.approved && { 'timestamps.approved': timestampUpdates.approved }),
        ...(timestampUpdates.rejected && { 'timestamps.rejected': timestampUpdates.rejected }),
        ...(timestampUpdates.completed && { 'timestamps.completed': timestampUpdates.completed }),
      });
    } catch (error) {
      throw new FirestoreError('Failed to update order', 'order-update-error', error as Error);
    }
  },

  // Update order status
  async updateStatus(orderId: string, status: OrderStatus, notes?: string): Promise<void> {
    try {
      await this.update(orderId, {
        status,
        ...(notes && { adminNotes: notes }),
      });
    } catch (error) {
      throw new FirestoreError('Failed to update order status', 'order-status-error', error as Error);
    }
  },

  // Get orders with filtering and pagination
  async getAll(
    filters?: OrderFilters,
    sort?: OrderSort,
    page = 1,
    pageSize = 20
  ): Promise<PaginatedResponse<Order>> {
    try {
      let q = query(collection(db, COLLECTIONS.ORDERS));

      // Apply filters
      if (filters) {
        if (filters.status && filters.status.length > 0) {
          q = query(q, where('status', 'in', filters.status));
        }
        if (filters.type && filters.type.length > 0) {
          q = query(q, where('type', 'in', filters.type));
        }
        if (filters.exchangeId) {
          q = query(q, where('exchangeId', '==', filters.exchangeId));
        }
        if (filters.dateFrom) {
          q = query(q, where('timestamps.created', '>=', toFirestoreTimestamp(filters.dateFrom)));
        }
        if (filters.dateTo) {
          q = query(q, where('timestamps.created', '<=', toFirestoreTimestamp(filters.dateTo)));
        }
      }

      // Apply sorting
      if (sort) {
        const sortField = sort.field === 'createdAt' ? 'timestamps.created' : sort.field;
        q = query(q, orderBy(sortField, sort.direction));
      } else {
        q = query(q, orderBy('timestamps.created', 'desc'));
      }

      // Apply pagination
      q = query(q, limit(pageSize));
      if (page > 1) {
        // This is a simplified pagination - in production, you'd want to use cursor-based pagination
        const skipCount = (page - 1) * pageSize;
        // Note: offset is not available in Firestore, so this is a limitation
        // For production, implement cursor-based pagination
      }

      const querySnapshot = await getDocs(q);
      const orders = querySnapshot.docs.map(convertOrderFromFirestore).filter(Boolean) as Order[];

      // Get total count (this is expensive - consider maintaining a separate counter)
      const totalQuery = query(collection(db, COLLECTIONS.ORDERS));
      const totalSnapshot = await getDocs(totalQuery);
      const total = totalSnapshot.size;

      return {
        data: orders,
        total,
        page,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize),
      };
    } catch (error) {
      throw new FirestoreError('Failed to get orders', 'orders-get-all-error', error as Error);
    }
  },

  // Get orders by exchange ID
  async getByExchangeId(exchangeId: string): Promise<Order[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.ORDERS),
        where('exchangeId', '==', exchangeId),
        orderBy('timestamps.created', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(convertOrderFromFirestore).filter(Boolean) as Order[];
    } catch (error) {
      throw new FirestoreError('Failed to get orders by exchange', 'orders-get-exchange-error', error as Error);
    }
  },

  // Real-time listener for order changes
  onOrderChange(orderId: string, callback: (order: Order | null) => void): Unsubscribe {
    const docRef = doc(db, COLLECTIONS.ORDERS, orderId);
    return onSnapshot(docRef, (doc) => {
      callback(convertOrderFromFirestore(doc));
    }, (error) => {
      console.error('Order listener error:', error);
      callback(null);
    });
  },

  // Real-time listener for orders list
  onOrdersChange(
    callback: (orders: Order[]) => void,
    filters?: OrderFilters
  ): Unsubscribe {
    let q = query(
      collection(db, COLLECTIONS.ORDERS),
      orderBy('timestamps.created', 'desc')
    );

    // Apply filters
    if (filters) {
      if (filters.status && filters.status.length > 0) {
        q = query(q, where('status', 'in', filters.status));
      }
      if (filters.exchangeId) {
        q = query(q, where('exchangeId', '==', filters.exchangeId));
      }
    }

    return onSnapshot(q, (querySnapshot) => {
      const orders = querySnapshot.docs.map(convertOrderFromFirestore).filter(Boolean) as Order[];
      callback(orders);
    }, (error) => {
      console.error('Orders listener error:', error);
      callback([]);
    });
  },
};

// =============================================================================
// BANK OPERATIONS
// =============================================================================

export const bankOperations = {
  // Create bank
  async create(bankData: Omit<Bank, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.BANKS), {
        ...bankData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      throw new FirestoreError('Failed to create bank', 'bank-create-error', error as Error);
    }
  },

  // Get all banks
  async getAll(): Promise<Bank[]> {
    try {
      const q = query(collection(db, COLLECTIONS.BANKS), orderBy('name'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: fromFirestoreTimestamp(doc.data().createdAt),
        updatedAt: fromFirestoreTimestamp(doc.data().updatedAt),
      } as Bank));
    } catch (error) {
      throw new FirestoreError('Failed to get banks', 'banks-get-error', error as Error);
    }
  },

  // Update bank
  async update(bankId: string, bankData: Partial<Bank>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.BANKS, bankId);
      const { id, createdAt, ...updateData } = bankData;
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      throw new FirestoreError('Failed to update bank', 'bank-update-error', error as Error);
    }
  },

  // Delete bank
  async delete(bankId: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.BANKS, bankId);
      await deleteDoc(docRef);
    } catch (error) {
      throw new FirestoreError('Failed to delete bank', 'bank-delete-error', error as Error);
    }
  },
};

// =============================================================================
// PLATFORM BANK OPERATIONS
// =============================================================================

export const platformBankOperations = {
  // Create platform bank
  async create(bankData: Omit<PlatformBank, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.PLATFORM_BANKS), {
        ...bankData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      throw new FirestoreError('Failed to create platform bank', 'platform-bank-create-error', error as Error);
    }
  },

  // Get all platform banks
  async getAll(): Promise<PlatformBank[]> {
    try {
      const q = query(collection(db, COLLECTIONS.PLATFORM_BANKS), orderBy('name'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: fromFirestoreTimestamp(doc.data().createdAt),
        updatedAt: fromFirestoreTimestamp(doc.data().updatedAt),
      } as PlatformBank));
    } catch (error) {
      throw new FirestoreError('Failed to get platform banks', 'platform-banks-get-error', error as Error);
    }
  },

  // Update platform bank balance
  async updateBalance(bankId: string, amount: number): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.PLATFORM_BANKS, bankId);
      await updateDoc(docRef, {
        balance: increment(amount),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      throw new FirestoreError('Failed to update platform bank balance', 'platform-bank-balance-error', error as Error);
    }
  },

  // Real-time listener for platform bank changes
  onPlatformBanksChange(callback: (banks: PlatformBank[]) => void): Unsubscribe {
    const q = query(collection(db, COLLECTIONS.PLATFORM_BANKS), orderBy('name'));
    return onSnapshot(q, (querySnapshot) => {
      const banks = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: fromFirestoreTimestamp(doc.data().createdAt),
        updatedAt: fromFirestoreTimestamp(doc.data().updatedAt),
      } as PlatformBank));
      callback(banks);
    }, (error) => {
      console.error('Platform banks listener error:', error);
      callback([]);
    });
  },
};

// =============================================================================
// CHAT OPERATIONS
// =============================================================================

export const chatOperations = {
  // Send message
  async sendMessage(messageData: Omit<ChatMessage, 'id' | 'timestamp'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.CHAT_MESSAGES), {
        ...messageData,
        timestamp: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      throw new FirestoreError('Failed to send message', 'message-send-error', error as Error);
    }
  },

  // Get messages for order
  async getMessagesByOrderId(orderId: string): Promise<ChatMessage[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.CHAT_MESSAGES),
        where('orderId', '==', orderId),
        orderBy('timestamp', 'asc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: fromFirestoreTimestamp(doc.data().timestamp),
      } as ChatMessage));
    } catch (error) {
      throw new FirestoreError('Failed to get messages', 'messages-get-error', error as Error);
    }
  },

  // Real-time listener for order messages
  onMessagesChange(orderId: string, callback: (messages: ChatMessage[]) => void): Unsubscribe {
    const q = query(
      collection(db, COLLECTIONS.CHAT_MESSAGES),
      where('orderId', '==', orderId),
      orderBy('timestamp', 'asc')
    );
    return onSnapshot(q, (querySnapshot) => {
      const messages = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: fromFirestoreTimestamp(doc.data().timestamp),
      } as ChatMessage));
      callback(messages);
    }, (error) => {
      console.error('Messages listener error:', error);
      callback([]);
    });
  },
};

// =============================================================================
// BALANCE TRANSACTION OPERATIONS
// =============================================================================

export const balanceTransactionOperations = {
  // Create balance transaction
  async create(transactionData: Omit<BalanceTransaction, 'id' | 'timestamp'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.BALANCE_TRANSACTIONS), {
        ...transactionData,
        timestamp: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      throw new FirestoreError('Failed to create balance transaction', 'balance-transaction-error', error as Error);
    }
  },

  // Get transactions by user ID
  async getByUserId(userId: string): Promise<BalanceTransaction[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.BALANCE_TRANSACTIONS),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: fromFirestoreTimestamp(doc.data().timestamp),
      } as BalanceTransaction));
    } catch (error) {
      throw new FirestoreError('Failed to get balance transactions', 'balance-transactions-get-error', error as Error);
    }
  },
};

// =============================================================================
// NOTIFICATION OPERATIONS
// =============================================================================

export const notificationOperations = {
  // Create notification
  async create(notificationData: Omit<Notification, 'id' | 'createdAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.NOTIFICATIONS), {
        ...notificationData,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      throw new FirestoreError('Failed to create notification', 'notification-create-error', error as Error);
    }
  },

  // Get notifications by user ID
  async getByUserId(userId: string): Promise<Notification[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.NOTIFICATIONS),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: fromFirestoreTimestamp(doc.data().createdAt),
      } as Notification));
    } catch (error) {
      throw new FirestoreError('Failed to get notifications', 'notifications-get-error', error as Error);
    }
  },

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.NOTIFICATIONS, notificationId);
      await updateDoc(docRef, { isRead: true });
    } catch (error) {
      throw new FirestoreError('Failed to mark notification as read', 'notification-read-error', error as Error);
    }
  },

  // Real-time listener for user notifications
  onNotificationsChange(userId: string, callback: (notifications: Notification[]) => void): Unsubscribe {
    const q = query(
      collection(db, COLLECTIONS.NOTIFICATIONS),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (querySnapshot) => {
      const notifications = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: fromFirestoreTimestamp(doc.data().createdAt),
      } as Notification));
      callback(notifications);
    }, (error) => {
      console.error('Notifications listener error:', error);
      callback([]);
    });
  },
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

// Connection status monitoring
export const connectionUtils = {
  // Check Firestore connection
  async checkConnection(): Promise<boolean> {
    try {
      const testRef = doc(db, COLLECTIONS.USERS, 'connection-test');
      await getDoc(testRef);
      return true;
    } catch (error) {
      console.error('Connection check failed:', error);
      return false;
    }
  },

  // Monitor connection status
  onConnectionChange(callback: (connected: boolean) => void): () => void {
    let isConnected = true;
    
    const checkInterval = setInterval(async () => {
      const connected = await this.checkConnection();
      if (connected !== isConnected) {
        isConnected = connected;
        callback(connected);
      }
    }, 5000);

    return () => clearInterval(checkInterval);
  },
};

// Batch operations utility
export const batchOperations = {
  // Create a new batch
  createBatch() {
    return writeBatch(db);
  },

  // Execute batch operations
  async executeBatch(batch: any): Promise<void> {
    try {
      await batch.commit();
    } catch (error) {
      throw new FirestoreError('Failed to execute batch operations', 'batch-error', error as Error);
    }
  },
};

// Export all operations
export const firestoreOperations = {
  users: userOperations,
  orders: orderOperations,
  banks: bankOperations,
  platformBanks: platformBankOperations,
  chat: chatOperations,
  balanceTransactions: balanceTransactionOperations,
  notifications: notificationOperations,
  connection: connectionUtils,
  batch: batchOperations,
};

export default firestoreOperations; 