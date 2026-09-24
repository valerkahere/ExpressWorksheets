import { Request, Response, NextFunction } from 'express';

export const logging = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  console.log(`${req.method} ${req.originalUrl}`);

  next();
};

