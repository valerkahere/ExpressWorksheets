import express, { Application, Request, Response } from 'express';
import carRoutes from './routes/cars.js';

import { authenticateKey } from './middleware/auth.middleware.js';
import { logging } from './middleware/logging.middleware.js';
import { swaggerSpec } from './config/swagger.js';
import swaggerUi from 'swagger-ui-express';

export const app: Application = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json(), logging);

app.use('/api/cars', authenticateKey, carRoutes);

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



