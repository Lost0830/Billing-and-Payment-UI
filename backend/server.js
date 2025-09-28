import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { MongoMemoryServer } from 'mongodb-memory-server';

// Import your User model
import User from './models/users.js';
import Billing from './models/Billing.js';
import Payment from './models/Payment.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

let MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/HIMS';
let mongod = null;

console.log('🔧 Starting HIMS Backend Server...');

// Middleware
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173"],
  credentials: true
}));

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';

// Database connection state
let isConnected = false;

const connectDB = async () => {
  try {
    // Try to connect to local MongoDB first
    try {
      console.log('🔄 Attempting to connect to local MongoDB...');
      await mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 3000,
      });
      console.log('✅ Connected to local MongoDB!');
      isConnected = true;
      return;
    } catch (localError) {
      console.log('❌ Local MongoDB not available, starting in-memory database...');
    }

    // Fallback to in-memory MongoDB
    console.log('🔄 Starting MongoDB Memory Server...');
    mongod = await MongoMemoryServer.create();
    MONGODB_URI = mongod.getUri();
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to in-memory MongoDB!');
    console.log('💡 This is a temporary database for development');
    isConnected = true;

  } catch (error) {
    console.error('❌ All connection attempts failed:', error.message);
    process.exit(1);
  }
};

// Simple test routes
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = dbState === 1 ? 'Connected' : 'Disconnected';
  
  res.json({ 
    success: true, 
    message: 'HIMS Backend Server is running!',
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatus,
      state: dbState,
      connected: dbState === 1,
      type: mongod ? 'In-Memory' : 'Local MongoDB'
    }
  });
});

app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Test endpoint is working!',
    databaseConnected: mongoose.connection.readyState === 1
  });
});

// Debug endpoint to check all user data
app.get('/api/debug/users', async (req, res) => {
  try {
    console.log('=== DEBUG: Checking all users in database ===');
    const users = await User.find();
    
    const usersWithDetails = users.map(user => ({
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      department: user.department,
      passwordHash: user.passwordHash ? `EXISTS (${user.passwordHash.length} chars)` : 'MISSING',
      isBcryptHash: user.passwordHash ? user.passwordHash.startsWith('$2b$') : false,
      createdAt: user.createdAt
    }));
    
    console.log('📊 Users in database:', usersWithDetails);
    
    res.json({
      success: true,
      totalUsers: users.length,
      users: usersWithDetails
    });
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Seed database with sample users
app.post('/api/seed', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database not connected'
      });
    }

    console.log('🌱 Starting database seed...');
    
    const sampleUsers = [
      {
        name: 'Admin User',
        email: 'admin@hims.com',
        passwordHash: await bcrypt.hash('admin123', 10),
        role: 'admin',
        department: 'Billing Management'
      },
      {
        name: 'Accountant Jane',
        email: 'jane@hims.com',
        passwordHash: await bcrypt.hash('password123', 10),
        role: 'accountant',
        department: 'Billing Management'
      },
      {
        name: 'Pharmacist John',
        email: 'john@pharmacy.com',
        passwordHash: await bcrypt.hash('pharma123', 10),
        role: 'pharmacist',
        department: 'Pharmacy Management'
      },
      {
        name: 'Doctor Smith',
        email: 'doctor@hospital.com',
        passwordHash: await bcrypt.hash('doctor123', 10),
        role: 'doctor',
        department: 'EMR System'
      },
      {
        name: 'Nurse Wilson',
        email: 'nurse@hospital.com',
        passwordHash: await bcrypt.hash('nurse123', 10),
        role: 'nurse',
        department: 'EMR System'
      }
    ];

    // Clear existing data
    const deleteResult = await User.deleteMany({});
    console.log('🗑️ Cleared existing users:', deleteResult.deletedCount);

    // Insert new data
    const insertedUsers = await User.insertMany(sampleUsers);
    console.log(`✅ Inserted ${insertedUsers.length} users`);

    // Verify insertion
    const verifyUsers = await User.find();
    console.log('🔍 Verification - Total users in DB:', verifyUsers.length);

    res.json({ 
      success: true,
      message: 'Database seeded successfully with sample users!', 
      inserted: insertedUsers.length,
      users: insertedUsers.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      }))
    });
    
  } catch (error) {
    console.error('❌ Seed error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Seed failed', 
      error: error.message 
    });
  }
});

// Billing endpoints
app.get('/api/billing/invoices', async (req, res) => {
  try {
    const invoices = await Billing.find().sort({ invoiceDate: -1 });
    res.json({ success: true, data: invoices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/billing/invoices', async (req, res) => {
  try {
    const invoice = new Billing(req.body);
    const savedInvoice = await invoice.save();
    res.status(201).json({ success: true, data: savedInvoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/billing/invoices/:id', async (req, res) => {
  try {
    const invoice = await Billing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Payment endpoints
app.get('/api/billing/payments', async (req, res) => {
  try {
    const payments = await Payment.find().sort({ paymentDate: -1 });
    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/billing/payments', async (req, res) => {
  try {
    const payment = new Payment(req.body);
    const savedPayment = await payment.save();
    
    // Update the corresponding invoice
    await Billing.findOneAndUpdate(
      { invoiceId: payment.invoiceId },
      { 
        $inc: { paidAmount: payment.amount },
        $set: { 
          outstandingBalance: mongoose.Types.Decimal128.fromString(
            (await Billing.findOne({ invoiceId: payment.invoiceId })).totalAmount - payment.amount
          ),
          status: payment.amount === (await Billing.findOne({ invoiceId: payment.invoiceId })).totalAmount ? 'Paid' : 'Partially Paid'
        }
      }
    );
    
    res.status(201).json({ success: true, data: savedPayment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// User login endpoint with detailed debugging
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('\n=== 🔐 LOGIN DEBUGGING START ===');
    console.log('1. 📨 Received login request');
    console.log('   Email:', email);
    console.log('   Password provided:', password ? '***' : 'MISSING');
    
    if (!email || !password) {
      console.log('2. ❌ Missing email or password');
      return res.status(400).json({ 
        success: false,
        message: 'Email and password are required' 
      });
    }

    // Check database connection
    console.log('3. 🔗 Checking database connection...');
    const dbState = mongoose.connection.readyState;
    console.log('   Database state:', dbState, dbState === 1 ? '(Connected)' : '(Disconnected)');
    
    if (dbState !== 1) {
      console.log('4. ❌ Database not connected');
      return res.status(503).json({
        success: false,
        message: 'Database not connected'
      });
    }

    // Count total users
    console.log('5. 👥 Counting users in database...');
    const totalUsers = await User.countDocuments();
    console.log('   Total users in database:', totalUsers);

    if (totalUsers === 0) {
      console.log('6. ❌ No users found in database');
      return res.status(401).json({ 
        success: false,
        message: 'No users found. Please seed the database first using /api/seed' 
      });
    }

    // Find user by email (case insensitive)
    console.log('6. 🔍 Searching for user with email:', email);
    const user = await User.findOne({ 
      email: { $regex: new RegExp(`^${email.trim()}$`, 'i') }
    });
    
    console.log('7. 👤 User found:', user ? 'YES' : 'NO');
    
    if (user) {
      console.log('8. 📋 User details:');
      console.log('   - ID:', user._id);
      console.log('   - Email:', user.email);
      console.log('   - Name:', user.name);
      console.log('   - Role:', user.role);
      console.log('   - Password hash exists:', !!user.passwordHash);
      console.log('   - Password hash length:', user.passwordHash ? user.passwordHash.length : 0);
      console.log('   - Is bcrypt hash:', user.passwordHash ? user.passwordHash.startsWith('$2b$') : false);
    }

    if (!user) {
      // Show available emails for debugging
      console.log('9. 📧 Listing all available emails...');
      const allUsers = await User.find({}, 'email role');
      const availableEmails = allUsers.map(u => `${u.email} (${u.role})`);
      console.log('   Available users:', availableEmails);
      
      return res.status(401).json({ 
        success: false,
        message: `User not found. Available users: ${availableEmails.join(', ')}` 
      });
    }

    // Check if password hash exists and is valid
    console.log('10. 🔑 Checking password hash...');
    if (!user.passwordHash) {
      console.log('   ❌ ERROR: User has no password hash!');
      return res.status(401).json({ 
        success: false,
        message: 'User account configuration error - no password set' 
      });
    }

    if (!user.passwordHash.startsWith('$2b$')) {
      console.log('   ❌ ERROR: Password hash is not a valid bcrypt hash!');
      return res.status(401).json({ 
        success: false,
        message: 'User account configuration error - invalid password format' 
      });
    }

    // Compare passwords
    console.log('11. 🔄 Comparing passwords...');
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    console.log('   Password valid:', validPassword);

    if (!validPassword) {
      console.log('12. ❌ Invalid password');
      return res.status(401).json({ 
        success: false,
        message: 'Invalid password. Please check your credentials and try again.' 
      });
    }

    console.log('13. ✅ Login successful! Generating token...');
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('14. 🎉 Login completed successfully for:', user.email);
    console.log('=== 🔐 LOGIN DEBUGGING END ===\n');

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      }
    });
    
  } catch (error) {
    console.error('15. 💥 LOGIN ERROR:', error);
    console.log('=== 🔐 LOGIN DEBUGGING END WITH ERROR ===\n');
    
    res.status(500).json({ 
      success: false,
      message: 'Login failed due to server error', 
      error: error.message 
    });
  }
});

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database not connected'
      });
    }

    const users = await User.find().select('-passwordHash');
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Get user by ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create new user
app.post('/api/users', async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      passwordHash,
      role: role || 'user',
      department: department || 'General'
    });

    const savedUser = await newUser.save();
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        department: savedUser.department
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Test login endpoint (simple version for quick testing)
app.post('/api/auth/test-login', async (req, res) => {
  const { email, password } = req.body;
  
  // Simple hardcoded test
  if (email === 'admin@hims.com' && password === 'admin123') {
    return res.json({
      success: true,
      message: 'Test login successful!',
      user: {
        id: 'test-id',
        name: 'Admin User',
        email: 'admin@hims.com',
        role: 'admin',
        department: 'Billing Management'
      }
    });
  }
  
  res.status(401).json({ 
    success: false,
    message: 'Test failed. Use:' 
  });
});

// Root endpoint
app.get('/', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? '✅ Connected' : '❌ Disconnected';
  const dbType = mongod ? 'In-Memory' : 'Local MongoDB';
  
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>HIMS Backend Server</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        .success { color: green; }
        .error { color: red; }
        .endpoint { background: #f5f5f5; padding: 10px; margin: 5px 0; border-radius: 5px; }
        .test-btn { background: #358E83; color: white; padding: 10px; border: none; border-radius: 5px; cursor: pointer; margin: 5px; }
        .test-btn:hover { background: #2a7168; }
        .user-list { background: #e8f5e8; padding: 10px; margin: 10px 0; border-radius: 5px; }
        .debug-info { background: #fff3cd; padding: 10px; margin: 10px 0; border-radius: 5px; }
      </style>
    </head>
    <body>
      <h1>🏥 HIMS Backend Server</h1>
      <p><strong>Port:</strong> ${PORT}</p>
      <p><strong>Database:</strong> <span class="${mongoose.connection.readyState === 1 ? 'success' : 'error'}">${dbStatus}</span> (${dbType})</p>
      
      <div class="debug-info">
        <h3>🔧 Debugging Tools:</h3>
        <p>If login is failing, use these tools to diagnose the issue:</p>
        <button class="test-btn" onclick="debugUsers()">Check Database Users</button>
        <button class="test-btn" onclick="seedDatabase()">Reset Database</button>
        <button class="test-btn" onclick="testLogin()">Test Login</button>
      </div>
      
      <h2>📋 Available Endpoints:</h2>
      <div class="endpoint">
        <strong>GET</strong> <a href="/api/health">/api/health</a> - Server health check
      </div>
      <div class="endpoint">
        <strong>GET</strong> <a href="/api/debug/users">/api/debug/users</a> - Debug user data
      </div>
      <div class="endpoint">
        <strong>POST</strong> <button class="test-btn" onclick="seedDatabase()">/api/seed</button> - Seed database
      </div>
      <div class="endpoint">
        <strong>POST</strong> <button class="test-btn" onclick="testLogin()">/api/auth/login</button> - User login
      </div>
      <div class="endpoint">
        <strong>GET</strong> <a href="/api/users">/api/users</a> - Get all users
      </div>
      

      <script>
        async function debugUsers() {
          try {
            const response = await fetch('/api/debug/users');
            const result = await response.json();
            alert('Total users: ' + result.totalUsers + '\\nCheck server console for details.');
            console.log('Debug users result:', result);
          } catch (error) {
            alert('Debug failed: ' + error);
          }
        }

        async function seedDatabase() {
          try {
            const response = await fetch('/api/seed', { method: 'POST' });
            const result = await response.json();
            alert(result.message);
          } catch (error) {
            alert('Seed failed: ' + error);
          }
        }

        async function testLogin() {
          const email = prompt('Enter email:',);
          const password = prompt('Enter password:',);
          
          if (email && password) {
            try {
              const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
              });
              const result = await response.json();
              alert(result.message);
              console.log('Login result:', result);
            } catch (error) {
              alert('Login test failed: ' + error);
            }
          }
        }
      </script>
    </body>
    </html>
  `);
});

// Start server
const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log('\n🚀 HIMS Backend Server started successfully!');
      console.log(`📍 Port: ${PORT}`);
      console.log(`🌐 URL: http://localhost:${PORT}`);
      console.log(`💾 Database: ${MONGODB_URI}`);
      console.log(`📊 Database State: ${mongoose.connection.readyState}`);
      console.log('\n✅ Available endpoints:');
      console.log(`   GET  http://localhost:${PORT}/api/health`);
      console.log(`   GET  http://localhost:${PORT}/api/debug/users`);
      console.log(`   POST http://localhost:${PORT}/api/seed`);
      console.log(`   POST http://localhost:${PORT}/api/auth/login`);
      console.log(`   GET  http://localhost:${PORT}/api/users`);
      console.log('\n🔧 Debugging tools available at: http://localhost:${PORT}');
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();