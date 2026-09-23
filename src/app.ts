import express, { Application, Request, Response } from 'express';
import carRoutes from './routes/cars.js';
import { env } from './config/env.js';
import { connectDB } from './config/database.js';

const PORT = env.port;

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
  await connectDB();
  app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
  });
};

startServer();


