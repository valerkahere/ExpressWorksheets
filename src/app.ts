import express, { Application, Request, Response } from 'express';
import carRoutes from './routes/cars.js';
import { env } from './config/env.js';
import mongoose from 'mongoose';

const PORT = env.port;
const MONGODB_URI = env.mongoURI;

const app: Application = express();

app.use(express.json());
app.use('/api/v1/cars', carRoutes);

app.get('/ping', async (_req: Request, res: Response) => {
  res.json({
    message: 'hello from valerkahere',
  });
});

app.get('/bananas', async (_req: Request, res: Response) => {
  res.json({
    message: 'this is bananas',
  });
});

app.get('/auth', async (_req: Request, res: Response) => {
  res.json({
    message: 'nothing here',
  });
});

const startServer = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('You successfully connected to MongoDB!');
  } catch (err) {
    console.dir(err);
  }

  app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
  });
};

startServer();

// Call this only when your application terminates
export async function disconnectFromMongoDB() {
  await mongoose.connection.close();
}
