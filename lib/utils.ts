import { type ClassValue, clsx } from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

// Utility function for combining class names
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Date formatting utilities
const JORDAN_TIMEZONE = 'Asia/Amman';

export function formatDate(date: Date | string, pattern: string = 'MMM dd, yyyy'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatInTimeZone(dateObj, JORDAN_TIMEZONE, pattern);
}

export function formatDateTime(date: Date | string): string {
  return formatDate(date, 'MMM dd, yyyy HH:mm');
}

export function formatTime(date: Date | string): string {
  return formatDate(date, 'HH:mm');
}

export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
}

// Currency formatting
export function formatCurrency(amount: number, currency: string = 'JOD'): string {
  return new Intl.NumberFormat('en-JO', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-JO').format(num);
}

// Validation utilities
export function isValidJordanianMobile(phone: string): boolean {
  // Jordanian mobile formats: 00962, +962, or 07/8/9
  const patterns = [
    /^00962[789]\d{8}$/, // 00962xxxxxxxxx
    /^\+962[789]\d{8}$/, // +962xxxxxxxxx  
    /^0[789]\d{8}$/,     // 0xxxxxxxxx
  ];
  
  return patterns.some(pattern => pattern.test(phone.replace(/\s+/g, '')));
}

export function normalizeJordanianMobile(phone: string): string {
  const cleaned = phone.replace(/\s+/g, '');
  
  if (cleaned.startsWith('00962')) {
    return cleaned;
  } else if (cleaned.startsWith('+962')) {
    return '00962' + cleaned.substring(4);
  } else if (cleaned.startsWith('0')) {
    return '00962' + cleaned.substring(1);
  }
  
  return cleaned;
}

export function isValidUsername(username: string): boolean {
  // 3-50 chars, alphanumeric + underscore/hyphen
  return /^[a-zA-Z0-9_-]{3,50}$/.test(username);
}

// Order ID generation utilities
export function generateOrderId(date: Date = new Date()): string {
  const year = formatInTimeZone(date, JORDAN_TIMEZONE, 'yy');
  const month = formatInTimeZone(date, JORDAN_TIMEZONE, 'MM');
  
  // This will need to be implemented with Firestore counter for sequential numbering
  // For now, return format without the sequential number
  return `T${year}${month}`;
}

export function parseOrderId(orderId: string): { year: string; month: string; sequence: string } | null {
  const match = orderId.match(/^T(\d{2})(\d{2})(\d{4})$/);
  if (!match) return null;
  
  return {
    year: match[1],
    month: match[2],
    sequence: match[3],
  };
}

// File utilities
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function isValidImageType(mimeType: string): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  return validTypes.includes(mimeType.toLowerCase());
}

export function isValidFileSize(size: number, maxSizeMB: number = 5): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return size <= maxSizeBytes;
}

// String utilities
export function truncate(str: string, length: number = 100): string {
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Array utilities
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

// Object utilities
export function omit<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result;
}

export function pick<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}

// Status utilities
export function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    submitted: 'bg-blue-100 text-blue-800',
    pending_review: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    processing: 'bg-purple-100 text-purple-800',
    completed: 'bg-emerald-100 text-emerald-800',
    cancelled: 'bg-gray-100 text-gray-800',
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
  };
  
  return colorMap[status] || 'bg-gray-100 text-gray-800';
}

export function getStatusLabel(status: string): string {
  const labelMap: Record<string, string> = {
    submitted: 'Submitted',
    pending_review: 'Pending Review',
    approved: 'Approved',
    rejected: 'Rejected',
    processing: 'Processing',
    completed: 'Completed',
    cancelled: 'Cancelled',
    active: 'Active',
    inactive: 'Inactive',
  };
  
  return labelMap[status] || capitalize(status);
}

// Error handling utilities
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unexpected error occurred';
}

// Debounce utility
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
} 