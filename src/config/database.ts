import {env} from '../config/env.js';

import mongoose from 'mongoose';

const MONGODB_URI = env.mongoURI ;

export const connectDB = async (): Promise<void> => {
  try {
    console.log(`Connecting to MongoDB at ${MONGODB_URI}`);
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`MongoDB Connected (Mongoose): ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${(error as Error).message}`);
    disconnectFromMongoDB();
    process.exit(1);
  }
};

// Call this only when your application terminates
export async function disconnectFromMongoDB() {
  await mongoose.connection.close();
}

