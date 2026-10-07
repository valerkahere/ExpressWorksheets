import { connectDB, disconnectDB } from '../src/config/database.js';

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});
