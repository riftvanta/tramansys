import { 
  User, 
  Order, 
  OrderFormData, 
  UserFormData, 
  CommissionRate,
  CliqDetails,
  OrderStatus,
} from '@/types';
import { firestoreOperations } from './firestore';

// =============================================================================
// VALIDATION UTILITIES
// =============================================================================

export const validationUtils = {
  // Username validation
  validateUsername(username: string): { isValid: boolean; error?: string } {
    if (!username || username.length < 3) {
      return { isValid: false, error: 'Username must be at least 3 characters long' };
    }
    if (username.length > 50) {
      return { isValid: false, error: 'Username must be no more than 50 characters long' };
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return { isValid: false, error: 'Username can only contain letters, numbers, hyphens, and underscores' };
    }
    return { isValid: true };
  },

  // Password validation
  validatePassword(password: string): { isValid: boolean; error?: string } {
    if (!password || password.length < 8) {
      return { isValid: false, error: 'Password must be at least 8 characters long' };
    }
    if (password.length > 100) {
      return { isValid: false, error: 'Password must be no more than 100 characters long' };
    }
    return { isValid: true };
  },

  // Jordanian mobile number validation
  validateJordanianMobile(mobile: string): { isValid: boolean; error?: string } {
    if (!mobile) {
      return { isValid: false, error: 'Mobile number is required' };
    }
    
    // Remove spaces and special characters
    const cleanMobile = mobile.replace(/[\s\-\(\)]/g, '');
    
    // Check for valid Jordanian mobile formats
    const jordanianMobileRegex = /^(?:\+?962|00962|0)([789]\d{8})$/;
    const match = cleanMobile.match(jordanianMobileRegex);
    
    if (!match) {
      return { 
        isValid: false, 
        error: 'Please enter a valid Jordanian mobile number (format: 07XXXXXXXX, 08XXXXXXXX, or 09XXXXXXXX)' 
      };
    }
    
    return { isValid: true };
  },

  // Amount validation
  validateAmount(amount: number, min: number = 0.01, max: number = 1000000): { isValid: boolean; error?: string } {
    if (!amount || isNaN(amount)) {
      return { isValid: false, error: 'Amount is required and must be a valid number' };
    }
    if (amount < min) {
      return { isValid: false, error: `Amount must be at least ${min} JOD` };
    }
    if (amount > max) {
      return { isValid: false, error: `Amount cannot exceed ${max} JOD` };
    }
    return { isValid: true };
  },

  // CliQ details validation
  validateCliqDetails(cliqDetails: CliqDetails): { isValid: boolean; error?: string } {
    if (!cliqDetails.aliasName && !cliqDetails.mobileNumber) {
      return { isValid: false, error: 'Either alias name or mobile number is required for CliQ transfer' };
    }
    
    if (cliqDetails.mobileNumber) {
      const mobileValidation = this.validateJordanianMobile(cliqDetails.mobileNumber);
      if (!mobileValidation.isValid) {
        return mobileValidation;
      }
    }
    
    if (cliqDetails.aliasName && cliqDetails.aliasName.length < 2) {
      return { isValid: false, error: 'Alias name must be at least 2 characters long' };
    }
    
    return { isValid: true };
  },

  // Order form validation
  validateOrderForm(formData: OrderFormData): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};
    
    // Validate amount
    const amountValidation = this.validateAmount(formData.amount);
    if (!amountValidation.isValid) {
      errors.amount = amountValidation.error!;
    }
    
    // Validate CliQ details for outgoing orders
    if (formData.type === 'outgoing' && formData.cliqDetails) {
      const cliqValidation = this.validateCliqDetails(formData.cliqDetails);
      if (!cliqValidation.isValid) {
        errors.cliqDetails = cliqValidation.error!;
      }
    }
    
    // Validate screenshots for incoming orders
    if (formData.type === 'incoming' && (!formData.screenshots || formData.screenshots.length === 0)) {
      errors.screenshots = 'Payment proof screenshot is required for incoming transfers';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },

  // User form validation
  validateUserForm(formData: UserFormData): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};
    
    // Validate username
    const usernameValidation = this.validateUsername(formData.username);
    if (!usernameValidation.isValid) {
      errors.username = usernameValidation.error!;
    }
    
    // Validate password (if provided)
    if (formData.password) {
      const passwordValidation = this.validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        errors.password = passwordValidation.error!;
      }
    }
    
    // Validate exchange name for exchange users
    if (formData.role === 'exchange' && !formData.exchangeName) {
      errors.exchangeName = 'Exchange name is required for exchange office accounts';
    }
    
    // Validate balance
    if (formData.balance !== undefined && isNaN(formData.balance)) {
      errors.balance = 'Balance must be a valid number';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },
};

// =============================================================================
// COMMISSION CALCULATION UTILITIES
// =============================================================================

export const commissionUtils = {
  // Calculate commission based on rate
  calculateCommission(amount: number, rate: CommissionRate): number {
    if (rate.type === 'percentage') {
      return (amount * rate.value) / 100;
    }
    return rate.value; // Fixed amount
  },

  // Calculate final amount for incoming transfers
  calculateFinalAmount(submittedAmount: number, rate: CommissionRate): number {
    const commission = this.calculateCommission(submittedAmount, rate);
    return submittedAmount - commission;
  },

  // Calculate total amount for outgoing transfers (amount + commission)
  calculateTotalAmount(baseAmount: number, rate: CommissionRate): number {
    const commission = this.calculateCommission(baseAmount, rate);
    return baseAmount + commission;
  },

  // Format commission for display
  formatCommission(rate: CommissionRate): string {
    if (rate.type === 'percentage') {
      return `${rate.value}%`;
    }
    return `${rate.value} JOD`;
  },
};

// =============================================================================
// ORDER UTILITIES
// =============================================================================

export const orderUtils = {
  // Get order status display text
  getStatusDisplayText(status: OrderStatus): string {
    const statusMap: Record<OrderStatus, string> = {
      submitted: 'Submitted',
      pending_review: 'Pending Review',
      approved: 'Approved',
      rejected: 'Rejected',
      processing: 'Processing',
      completed: 'Completed',
      cancelled: 'Cancelled',
    };
    return statusMap[status] || status;
  },

  // Get status color for UI
  getStatusColor(status: OrderStatus): string {
    const colorMap: Record<OrderStatus, string> = {
      submitted: 'blue',
      pending_review: 'yellow',
      approved: 'green',
      rejected: 'red',
      processing: 'purple',
      completed: 'green',
      cancelled: 'gray',
    };
    return colorMap[status] || 'gray';
  },

  // Check if status transition is valid
  isValidStatusTransition(currentStatus: OrderStatus, newStatus: OrderStatus): boolean {
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      submitted: ['pending_review', 'cancelled'],
      pending_review: ['approved', 'rejected', 'cancelled'],
      approved: ['processing', 'cancelled'],
      rejected: [], // Terminal state
      processing: ['completed', 'cancelled'],
      completed: [], // Terminal state
      cancelled: [], // Terminal state
    };
    
    return validTransitions[currentStatus]?.includes(newStatus) || false;
  },

  // Format order ID for display
  formatOrderId(orderId: string): string {
    return orderId.toUpperCase();
  },

  // Get order type display text
  getTypeDisplayText(type: 'incoming' | 'outgoing'): string {
    return type === 'incoming' ? 'Incoming Transfer' : 'Outgoing Transfer';
  },
};

// =============================================================================
// DATE UTILITIES
// =============================================================================

export const dateUtils = {
  // Format date for display
  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  },

  // Format date for Jordan timezone
  formatJordanTime(date: Date): string {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Amman',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  },

  // Get start of day in Jordan timezone
  getStartOfDayJordan(date: Date): Date {
    const jordanDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Amman' }));
    jordanDate.setHours(0, 0, 0, 0);
    return jordanDate;
  },

  // Get end of day in Jordan timezone
  getEndOfDayJordan(date: Date): Date {
    const jordanDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Amman' }));
    jordanDate.setHours(23, 59, 59, 999);
    return jordanDate;
  },

  // Check if date is today in Jordan timezone
  isToday(date: Date): boolean {
    const today = new Date();
    const jordanToday = new Date(today.toLocaleString('en-US', { timeZone: 'Asia/Amman' }));
    const jordanDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Amman' }));
    
    return (
      jordanDate.getDate() === jordanToday.getDate() &&
      jordanDate.getMonth() === jordanToday.getMonth() &&
      jordanDate.getFullYear() === jordanToday.getFullYear()
    );
  },
};

// =============================================================================
// DATABASE INITIALIZATION UTILITIES
// =============================================================================

export const databaseInit = {
  // Check if admin user exists
  async checkAdminExists(): Promise<boolean> {
    try {
      const users = await firestoreOperations.users.getAll({ role: 'admin' });
      return users.length > 0;
    } catch (error) {
      console.error('Error checking admin existence:', error);
      return false;
    }
  },

  // Create default admin user
  async createDefaultAdmin(username: string, hashedPassword: string): Promise<string> {
    try {
      const adminData: Omit<User, 'id' | 'createdAt' | 'updatedAt'> = {
        username,
        password: hashedPassword,
        role: 'admin',
        balance: 0,
        commissionRates: {
          incoming: { type: 'fixed', value: 0 },
          outgoing: { type: 'fixed', value: 0 },
        },
        assignedBanks: [],
        status: 'active',
      };
      
      return await firestoreOperations.users.create(adminData);
    } catch (error) {
      throw new Error(`Failed to create default admin: ${error}`);
    }
  },

  // Initialize database counters
  async initializeCounters(): Promise<void> {
    try {
      const now = new Date();
      const year = now.getFullYear().toString().slice(-2);
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      
      // Initialize current month counter if it doesn't exist
      const counterRef = `orders-${year}${month}`;
      // The counter will be created automatically when first order is generated
      console.log(`Counter ${counterRef} will be initialized on first order`);
    } catch (error) {
      console.error('Error initializing counters:', error);
    }
  },

  // Database health check
  async healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; issues: string[] }> {
    const issues: string[] = [];
    
    try {
      // Check connection
      const isConnected = await firestoreOperations.connection.checkConnection();
      if (!isConnected) {
        issues.push('Database connection failed');
      }
      
      // Check if admin exists
      const adminExists = await this.checkAdminExists();
      if (!adminExists) {
        issues.push('No admin user found');
      }
      
      return {
        status: issues.length === 0 ? 'healthy' : 'unhealthy',
        issues,
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        issues: [`Database health check failed: ${error}`],
      };
    }
  },
};

// =============================================================================
// SEARCH AND FILTER UTILITIES
// =============================================================================

export const searchUtils = {
  // Filter orders by search term
  filterOrdersBySearch(orders: Order[], searchTerm: string): Order[] {
    if (!searchTerm.trim()) return orders;
    
    const term = searchTerm.toLowerCase().trim();
    
    return orders.filter(order => 
      order.orderId.toLowerCase().includes(term) ||
      order.cliqDetails?.aliasName?.toLowerCase().includes(term) ||
      order.cliqDetails?.mobileNumber?.includes(term) ||
      order.recipientDetails?.name?.toLowerCase().includes(term) ||
      order.adminNotes?.toLowerCase().includes(term)
    );
  },

  // Filter users by search term
  filterUsersBySearch(users: User[], searchTerm: string): User[] {
    if (!searchTerm.trim()) return users;
    
    const term = searchTerm.toLowerCase().trim();
    
    return users.filter(user => 
      user.username.toLowerCase().includes(term) ||
      user.exchangeName?.toLowerCase().includes(term) ||
      user.contactInfo?.email?.toLowerCase().includes(term) ||
      user.contactInfo?.phone?.includes(term)
    );
  },
};

// =============================================================================
// EXPORT ALL UTILITIES
// =============================================================================

export const databaseUtils = {
  validation: validationUtils,
  commission: commissionUtils,
  order: orderUtils,
  date: dateUtils,
  init: databaseInit,
  search: searchUtils,
};

export default databaseUtils; 