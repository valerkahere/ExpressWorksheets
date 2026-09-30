import { Router } from 'express';
import { CarController } from '../controllers/cars.js';
import { validate } from '../middleware/validate.middleware.js';
import { createCarZSchema, updateCarZSchema } from '../models/cars.js';

const router = Router();
const carController = new CarController();

router.get('/', carController.getCars);
router.post('/', validate(createCarZSchema), carController.createCar);

router.get('/:id', carController.getCarById);
router.put('/:id', validate(updateCarZSchema), carController.updateCar);
router.delete('/:id', carController.deleteCar);

export default router;
