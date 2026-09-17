import express, { Application, Request, Response } from 'express';
import carRoutes from './routes/cars.js';

const PORT = process.env.PORT || 2333;

const app: Application = express();

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

app.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});
