import mongoose from 'mongoose';
import readline from 'readline';
import { config } from '../config';
import User from '../models/User';
import { UserRole } from '../../../shared/src/types';
import { ADMIN_EMAIL } from '../../../shared/src/constants';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
};

async function createAdminUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongodb.uri);
    console.log('✓ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
    
    if (existingAdmin) {
      console.log(`\n⚠️  Admin user already exists with email: ${ADMIN_EMAIL}`);
      const overwrite = await question('Do you want to update the password? (yes/no): ');
      
      if (overwrite.toLowerCase() !== 'yes' && overwrite.toLowerCase() !== 'y') {
        console.log('Operation cancelled.');
        rl.close();
        process.exit(0);
      }
    }

    // Get admin details
    console.log(`\nCreating admin user with email: ${ADMIN_EMAIL}`);
    const name = await question('Enter admin name: ');
    const password = await question('Enter admin password (min 8 characters): ');
    const confirmPassword = await question('Confirm password: ');

    // Validate inputs
    if (!name || name.trim().length === 0) {
      console.error('❌ Name cannot be empty');
      rl.close();
      process.exit(1);
    }

    if (password.length < 8) {
      console.error('❌ Password must be at least 8 characters long');
      rl.close();
      process.exit(1);
    }

    if (password !== confirmPassword) {
      console.error('❌ Passwords do not match');
      rl.close();
      process.exit(1);
    }

    if (existingAdmin) {
      // Update existing admin
      existingAdmin.name = name;
      existingAdmin.password = password;
      await existingAdmin.save();
      console.log('\n✓ Admin user updated successfully');
    } else {
      // Create new admin
      await User.create({
        email: ADMIN_EMAIL,
        password,
        name,
        role: UserRole.ADMIN,
        isActive: true,
      });
      console.log('\n✓ Admin user created successfully');
    }

    console.log('\nAdmin Details:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Email: ${ADMIN_EMAIL}`);
    console.log(`Name:  ${name}`);
    console.log(`Role:  ${UserRole.ADMIN}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    rl.close();
    process.exit(1);
  }
}

// Run the script
createAdminUser();
