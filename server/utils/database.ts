import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    if (mongoose.connection.readyState === 1) {
      console.log('MongoDB already connected');
      return { status: 'connected', message: 'Database already connected' };
    }

    await mongoose.connect(mongoUri);
    
    mongoose.connection.on('connected', () => {
      console.log(`MongoDB connected successfully to ${process.env.NODE_ENV || 'production'} database`);
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    if (process.env.NODE_ENV !== 'test') {
      process.on('SIGINT', async () => {
        await mongoose.connection.close();
        process.exit(0);
      });
    }

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

export const disconnect = async () => {
  try {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
    throw error;
  }
};

export default connectDB;