import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { initializeApp } from '../server/index';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  // Load .env but allow test overrides
  dotenv.config();
  
  // Set test environment
  process.env.NODE_ENV = 'test';
  
  // Create in-memory MongoDB
  mongoServer = await MongoMemoryServer.create();
  
  // Set the MongoDB URI before app initialization
  process.env.MONGODB_URI = mongoServer.getUri();
  process.env.SESSION_SECRET = 'test-session-secret';

  // Clear any existing connections
  await mongoose.disconnect();

  // Initialize the app with test database
  await initializeApp();
});

afterAll(async () => {
  if (mongoServer) {
    await mongoose.disconnect();
    await mongoServer.stop();
  }
});

afterEach(async () => {
  if (mongoose.connection.readyState === 1) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
});