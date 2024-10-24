import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

export async function connectToDatabase() {
  try {
    console.log('Connecting to database');
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;  // Re-throw to handle in the main app
  }
}