const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

// Set test environment variables
process.env.JWT_SECRET = "test-secret-key-for-testing";
process.env.JWT_EXPIRES_IN = "7d";
process.env.BCRYPT_SALT_ROUNDS = "10";
process.env.NODE_ENV = "test";

let mongoServer;

beforeAll(async () => {
  // Only create new connection if not already connected
  if (mongoose.connection.readyState === 0) {
    // Start MongoDB Memory Server
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    // Connect to in-memory database
    await mongoose.connect(mongoUri);
  }
}, 30000); // Increased timeout for MongoDB Memory Server

afterAll(async () => {
  // Disconnect and stop MongoDB Memory Server
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
}, 30000);

afterEach(async () => {
  // Clean all collections after each test
  if (mongoose.connection.readyState !== 0) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
});

// Suppress console output during tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};
