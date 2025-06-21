import { hash } from 'bcryptjs';
import firestoreOperations from './firestore';
import databaseUtils from './database-utils';

// =============================================================================
// DATABASE INITIALIZATION CONFIGURATION
// =============================================================================

interface InitConfig {
  createDefaultAdmin: boolean;
  adminUsername: string;
  adminPassword: string;
  createSampleBanks: boolean;
  createSamplePlatformBanks: boolean;
  skipExisting: boolean;
}

const DEFAULT_CONFIG: InitConfig = {
  createDefaultAdmin: true,
  adminUsername: 'admin',
  adminPassword: 'admin123',
  createSampleBanks: true,
  createSamplePlatformBanks: true,
  skipExisting: true,
};

// =============================================================================
// INITIALIZATION FUNCTIONS
// =============================================================================

export class DatabaseInitializer {
  private config: InitConfig;
  private logger: (message: string, level?: 'info' | 'warn' | 'error') => void;

  constructor(config: Partial<InitConfig> = {}, logger?: (message: string, level?: string) => void) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.logger = logger || ((message, level = 'info') => console.log(`[${level.toUpperCase()}] ${message}`));
  }

  // Main initialization function
  async initialize(): Promise<{ success: boolean; errors: string[] }> {
    const errors: string[] = [];
    
    try {
      this.logger('Starting database initialization...', 'info');

      // Step 1: Health check
      this.logger('Performing database health check...', 'info');
      const healthCheck = await databaseUtils.init.healthCheck();
      if (healthCheck.status === 'unhealthy') {
        this.logger(`Health check failed: ${healthCheck.issues.join(', ')}`, 'warn');
      }

      // Step 2: Initialize counters
      this.logger('Initializing counters...', 'info');
      await databaseUtils.init.initializeCounters();

      // Step 3: Create default admin if needed
      if (this.config.createDefaultAdmin) {
        const adminResult = await this.createDefaultAdmin();
        if (!adminResult.success) {
          errors.push(...adminResult.errors);
        }
      }

      // Step 4: Create sample banks if needed
      if (this.config.createSampleBanks) {
        const banksResult = await this.createSampleBanks();
        if (!banksResult.success) {
          errors.push(...banksResult.errors);
        }
      }

      // Step 5: Create sample platform banks if needed
      if (this.config.createSamplePlatformBanks) {
        const platformBanksResult = await this.createSamplePlatformBanks();
        if (!platformBanksResult.success) {
          errors.push(...platformBanksResult.errors);
        }
      }

      // Step 6: Final validation
      this.logger('Performing final validation...', 'info');
      const finalCheck = await this.validateInitialization();
      if (!finalCheck.success) {
        errors.push(...finalCheck.errors);
      }

      const success = errors.length === 0;
      this.logger(
        success 
          ? 'Database initialization completed successfully!' 
          : `Database initialization completed with ${errors.length} errors`,
        success ? 'info' : 'error'
      );

      return { success, errors };

    } catch (error) {
      const errorMessage = `Database initialization failed: ${error}`;
      this.logger(errorMessage, 'error');
      return { success: false, errors: [errorMessage] };
    }
  }

  // Create default admin user
  private async createDefaultAdmin(): Promise<{ success: boolean; errors: string[] }> {
    const errors: string[] = [];

    try {
      this.logger('Checking for existing admin user...', 'info');
      
      const adminExists = await databaseUtils.init.checkAdminExists();
      if (adminExists && this.config.skipExisting) {
        this.logger('Admin user already exists, skipping creation', 'info');
        return { success: true, errors: [] };
      }

      if (adminExists && !this.config.skipExisting) {
        this.logger('Admin user already exists but skipExisting is false', 'warn');
        errors.push('Admin user already exists');
        return { success: false, errors };
      }

      this.logger('Creating default admin user...', 'info');

      // Validate admin credentials
      const usernameValidation = databaseUtils.validation.validateUsername(this.config.adminUsername);
      if (!usernameValidation.isValid) {
        errors.push(`Invalid admin username: ${usernameValidation.error}`);
        return { success: false, errors };
      }

      const passwordValidation = databaseUtils.validation.validatePassword(this.config.adminPassword);
      if (!passwordValidation.isValid) {
        errors.push(`Invalid admin password: ${passwordValidation.error}`);
        return { success: false, errors };
      }

      // Check if username is already taken
      const existingUser = await firestoreOperations.users.getByUsername(this.config.adminUsername);
      if (existingUser) {
        errors.push(`Username '${this.config.adminUsername}' is already taken`);
        return { success: false, errors };
      }

      // Hash password and create admin
      const hashedPassword = await hash(this.config.adminPassword, 12);
      const adminId = await databaseUtils.init.createDefaultAdmin(this.config.adminUsername, hashedPassword);
      
      this.logger(`Default admin user created with ID: ${adminId}`, 'info');
      return { success: true, errors: [] };

    } catch (error) {
      const errorMessage = `Failed to create default admin: ${error}`;
      this.logger(errorMessage, 'error');
      return { success: false, errors: [errorMessage] };
    }
  }

  // Create sample banks for testing
  private async createSampleBanks(): Promise<{ success: boolean; errors: string[] }> {
    const errors: string[] = [];

    try {
      this.logger('Creating sample banks...', 'info');

      const sampleBanks = [
        {
          name: 'Arab Bank',
          accountNumber: '123456789',
          accountName: 'TramAnSys Exchange Account',
          type: 'exchange' as const,
          status: 'active' as const,
          assignedTo: [],
          isPublic: true,
        },
        {
          name: 'Jordan Commercial Bank',
          accountNumber: '987654321',
          accountName: 'TramAnSys JCB Account',
          type: 'exchange' as const,
          status: 'active' as const,
          assignedTo: [],
          isPublic: true,
        },
        {
          name: 'Bank of Jordan',
          accountNumber: '456789123',
          accountName: 'TramAnSys BOJ Account',
          type: 'exchange' as const,
          status: 'active' as const,
          assignedTo: [],
          isPublic: false,
        },
      ];

      const existingBanks = await firestoreOperations.banks.getAll();
      let createdCount = 0;

      for (const bankData of sampleBanks) {
        // Check if bank already exists
        const bankExists = existingBanks.some(bank => bank.name === bankData.name);
        
        if (bankExists && this.config.skipExisting) {
          this.logger(`Bank '${bankData.name}' already exists, skipping`, 'info');
          continue;
        }

        if (bankExists && !this.config.skipExisting) {
          errors.push(`Bank '${bankData.name}' already exists`);
          continue;
        }

        try {
          const bankId = await firestoreOperations.banks.create(bankData);
          this.logger(`Created sample bank: ${bankData.name} (ID: ${bankId})`, 'info');
          createdCount++;
        } catch (error) {
          const errorMessage = `Failed to create bank '${bankData.name}': ${error}`;
          this.logger(errorMessage, 'error');
          errors.push(errorMessage);
        }
      }

      this.logger(`Created ${createdCount} sample banks`, 'info');
      return { success: errors.length === 0, errors };

    } catch (error) {
      const errorMessage = `Failed to create sample banks: ${error}`;
      this.logger(errorMessage, 'error');
      return { success: false, errors: [errorMessage] };
    }
  }

  // Create sample platform banks for testing
  private async createSamplePlatformBanks(): Promise<{ success: boolean; errors: string[] }> {
    const errors: string[] = [];

    try {
      this.logger('Creating sample platform banks...', 'info');

      const samplePlatformBanks = [
        {
          name: 'TramAnSys Main Account - Arab Bank',
          accountNumber: 'PB-001-123456',
          accountName: 'TramAnSys Financial Services',
          balance: 50000,
          status: 'active' as const,
        },
        {
          name: 'TramAnSys Secondary Account - JCB',
          accountNumber: 'PB-002-789012',
          accountName: 'TramAnSys Financial Services',
          balance: 25000,
          status: 'active' as const,
        },
        {
          name: 'TramAnSys Reserve Account - BOJ',
          accountNumber: 'PB-003-345678',
          accountName: 'TramAnSys Financial Services',
          balance: 100000,
          status: 'active' as const,
        },
      ];

      const existingPlatformBanks = await firestoreOperations.platformBanks.getAll();
      let createdCount = 0;

      for (const bankData of samplePlatformBanks) {
        // Check if platform bank already exists
        const bankExists = existingPlatformBanks.some(bank => bank.name === bankData.name);
        
        if (bankExists && this.config.skipExisting) {
          this.logger(`Platform bank '${bankData.name}' already exists, skipping`, 'info');
          continue;
        }

        if (bankExists && !this.config.skipExisting) {
          errors.push(`Platform bank '${bankData.name}' already exists`);
          continue;
        }

        try {
          const bankId = await firestoreOperations.platformBanks.create(bankData);
          this.logger(`Created sample platform bank: ${bankData.name} (ID: ${bankId})`, 'info');
          createdCount++;
        } catch (error) {
          const errorMessage = `Failed to create platform bank '${bankData.name}': ${error}`;
          this.logger(errorMessage, 'error');
          errors.push(errorMessage);
        }
      }

      this.logger(`Created ${createdCount} sample platform banks`, 'info');
      return { success: errors.length === 0, errors };

    } catch (error) {
      const errorMessage = `Failed to create sample platform banks: ${error}`;
      this.logger(errorMessage, 'error');
      return { success: false, errors: [errorMessage] };
    }
  }

  // Validate initialization
  private async validateInitialization(): Promise<{ success: boolean; errors: string[] }> {
    const errors: string[] = [];

    try {
      // Check admin exists
      const adminExists = await databaseUtils.init.checkAdminExists();
      if (!adminExists) {
        errors.push('No admin user found after initialization');
      }

      // Check database connection
      const isConnected = await firestoreOperations.connection.checkConnection();
      if (!isConnected) {
        errors.push('Database connection failed after initialization');
      }

      // Check basic collections exist (by trying to read them)
      try {
        await firestoreOperations.users.getAll();
        await firestoreOperations.banks.getAll();
        await firestoreOperations.platformBanks.getAll();
      } catch (error) {
        errors.push(`Failed to access collections: ${error}`);
      }

      return { success: errors.length === 0, errors };

    } catch (error) {
      return { success: false, errors: [`Validation failed: ${error}`] };
    }
  }

  // Reset database (DANGEROUS - only for development)
  async resetDatabase(): Promise<{ success: boolean; errors: string[] }> {
    try {
      this.logger('WARNING: Resetting database - this will delete ALL data!', 'warn');

      // This is a simplified reset - in production, you'd want more sophisticated cleanup
      // For now, we'll just log the warning as actual deletion requires admin privileges
      
      this.logger('Database reset is not implemented for safety reasons', 'warn');
      this.logger('To reset the database, manually delete collections from Firebase Console', 'warn');

      return { success: true, errors: [] };

    } catch (error) {
      const errorMessage = `Database reset failed: ${error}`;
      this.logger(errorMessage, 'error');
      return { success: false, errors: [errorMessage] };
    }
  }

  // Get initialization status
  async getInitializationStatus(): Promise<{
    isInitialized: boolean;
    adminExists: boolean;
    connectionStatus: boolean;
    collections: {
      users: number;
      banks: number;
      platformBanks: number;
      orders: number;
    };
  }> {
    try {
      const adminExists = await databaseUtils.init.checkAdminExists();
      const connectionStatus = await firestoreOperations.connection.checkConnection();
      
      const [users, banks, platformBanks] = await Promise.all([
        firestoreOperations.users.getAll(),
        firestoreOperations.banks.getAll(),
        firestoreOperations.platformBanks.getAll(),
      ]);

      // Get orders count (simplified)
      const orders = await firestoreOperations.orders.getAll();

      return {
        isInitialized: adminExists && connectionStatus,
        adminExists,
        connectionStatus,
        collections: {
          users: users.length,
          banks: banks.length,
          platformBanks: platformBanks.length,
          orders: orders.total,
        },
      };

    } catch (error) {
      this.logger(`Failed to get initialization status: ${error}`, 'error');
      return {
        isInitialized: false,
        adminExists: false,
        connectionStatus: false,
        collections: {
          users: 0,
          banks: 0,
          platformBanks: 0,
          orders: 0,
        },
      };
    }
  }
}

// =============================================================================
// CONVENIENCE FUNCTIONS
// =============================================================================

// Initialize database with default configuration
export async function initializeDatabase(config?: Partial<InitConfig>): Promise<{ success: boolean; errors: string[] }> {
  const initializer = new DatabaseInitializer(config);
  return await initializer.initialize();
}

// Quick health check
export async function quickHealthCheck(): Promise<boolean> {
  try {
    const healthCheck = await databaseUtils.init.healthCheck();
    return healthCheck.status === 'healthy';
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
}

// Check if database is ready for use
export async function isDatabaseReady(): Promise<boolean> {
  try {
    const initializer = new DatabaseInitializer();
    const status = await initializer.getInitializationStatus();
    return status.isInitialized;
  } catch (error) {
    console.error('Database readiness check failed:', error);
    return false;
  }
}

// Export the main initializer class
export default DatabaseInitializer; 