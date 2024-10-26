import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(mongoUri);
    
    // Add connection event listeners
    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected successfully');
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    // Handle application termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      process.exit(0);
    });

    return { status: 'connected', message: 'Database connected successfully' };
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return { 
      status: 'error', 
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

export const checkConnection = () => {
  return {
    status: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    message: mongoose.connection.readyState === 1 
      ? 'Database connection is healthy'
      : 'Database is not connected'
  };
};

export default connectDB;