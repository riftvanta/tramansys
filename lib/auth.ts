import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, AuthUser, UserRole } from '@/types';

// Constants
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12');
const SESSION_EXPIRES_IN = '24h';
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

// Password utilities
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// JWT utilities
export function signToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: SESSION_EXPIRES_IN });
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

// Session utilities
export function createSessionPayload(user: User): AuthUser {
  return {
    id: user.id,
    username: user.username,
    role: user.role,
    exchangeName: user.exchangeName,
    balance: user.balance,
  };
}

// Username validation
export function isValidUsername(username: string): boolean {
  // 3-50 chars, alphanumeric + underscore/hyphen
  return /^[a-zA-Z0-9_-]{3,50}$/.test(username);
}

// Password validation
export function isValidPassword(password: string): boolean {
  // Minimum 6 characters, at least one letter and one number
  return password.length >= 6 && /^(?=.*[A-Za-z])(?=.*\d)/.test(password);
}

// Rate limiting utilities (in-memory for development)
const loginAttempts = new Map<string, { count: number; lockUntil: number }>();

export function isRateLimited(identifier: string): boolean {
  const attempts = loginAttempts.get(identifier);
  if (!attempts) return false;
  
  if (attempts.lockUntil > Date.now()) {
    return true;
  }
  
  if (attempts.lockUntil <= Date.now() && attempts.count >= MAX_LOGIN_ATTEMPTS) {
    // Reset after lockout period
    loginAttempts.delete(identifier);
    return false;
  }
  
  return false;
}

export function recordLoginAttempt(identifier: string, success: boolean): void {
  if (success) {
    loginAttempts.delete(identifier);
    return;
  }
  
  const attempts = loginAttempts.get(identifier) || { count: 0, lockUntil: 0 };
  attempts.count++;
  
  if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
    attempts.lockUntil = Date.now() + LOCKOUT_TIME;
  }
  
  loginAttempts.set(identifier, attempts);
}

export function getRateLimitInfo(identifier: string): { 
  attempts: number; 
  lockUntil: number; 
  remainingAttempts: number;
} {
  const attempts = loginAttempts.get(identifier) || { count: 0, lockUntil: 0 };
  return {
    attempts: attempts.count,
    lockUntil: attempts.lockUntil,
    remainingAttempts: Math.max(0, MAX_LOGIN_ATTEMPTS - attempts.count),
  };
}

// Mock user database (in production, this would be Firestore)
const users: User[] = [
  {
    id: 'admin-001',
    username: 'admin',
    password: '', // Will be set with hashed password
    role: 'admin' as UserRole,
    balance: 0,
    commissionRates: {
      incoming: { type: 'percentage', value: 2.5 },
      outgoing: { type: 'percentage', value: 3.0 },
    },
    assignedBanks: [],
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'exchange-001',
    username: 'exchange',
    password: '', // Will be set with hashed password
    role: 'exchange' as UserRole,
    exchangeName: 'Demo Exchange Office',
    contactInfo: {
      email: 'exchange@tramansys.com',
      phone: '00962791234567',
    },
    balance: 1000,
    commissionRates: {
      incoming: { type: 'fixed', value: 5 },
      outgoing: { type: 'percentage', value: 2.0 },
    },
    assignedBanks: ['bank-001', 'bank-002'],
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Initialize user passwords
export async function initializeUsers(): Promise<void> {
  users[0].password = await hashPassword('admin123');
  users[1].password = await hashPassword('exchange123');
}

// User database functions (mock implementation)
export async function findUserByUsername(username: string): Promise<User | null> {
  await initializeUsers(); // Ensure passwords are hashed
  return users.find(user => user.username === username && user.status === 'active') || null;
}

export async function findUserById(id: string): Promise<User | null> {
  return users.find(user => user.id === id && user.status === 'active') || null;
}

// Authentication functions
export async function authenticateUser(username: string, password: string): Promise<{
  success: boolean;
  user?: AuthUser;
  error?: string;
}> {
  try {
    // Input validation
    if (!username || !password) {
      return { success: false, error: 'Username and password are required' };
    }

    if (!isValidUsername(username)) {
      return { success: false, error: 'Invalid username format' };
    }

    // Rate limiting check
    const clientIdentifier = username; // In production, use IP + username
    if (isRateLimited(clientIdentifier)) {
      const rateLimitInfo = getRateLimitInfo(clientIdentifier);
      const lockoutMinutes = Math.ceil((rateLimitInfo.lockUntil - Date.now()) / 60000);
      return { 
        success: false, 
        error: `Too many failed attempts. Try again in ${lockoutMinutes} minutes.` 
      };
    }

    // Find user
    const user = await findUserByUsername(username);
    if (!user) {
      recordLoginAttempt(clientIdentifier, false);
      return { success: false, error: 'Invalid username or password' };
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      recordLoginAttempt(clientIdentifier, false);
      return { success: false, error: 'Invalid username or password' };
    }

    // Success
    recordLoginAttempt(clientIdentifier, true);
    const authUser = createSessionPayload(user);
    
    return { success: true, user: authUser };
  } catch (error) {
    console.error('Authentication error:', error);
    return { success: false, error: 'Authentication failed' };
  }
} 