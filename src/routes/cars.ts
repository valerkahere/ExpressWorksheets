import { Router } from 'express';
import { CarController } from '../controllers/cars.js';

const router = Router();
const carController = new CarController();

router.get('/', carController.getCars);
router.post('/', carController.createCar);

router.get('/:id', carController.getCarById);
router.put('/:id', carController.updateCar);
router.delete('/:id', carController.deleteCar);

export default router;
