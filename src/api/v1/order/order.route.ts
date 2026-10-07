import { Router } from 'express';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import { validateMiddleware } from '@middlewares/validate.middleware';
import { RequestMiddleware } from '@middlewares/request.middleware';
import { OrderController } from './order.controller';
import { OrderValidator } from './order.validator';

const router = Router();

router.post('/', AuthMiddleware.guard(), RequestMiddleware.sanitize(['product_id', 'quantity']), validateMiddleware(OrderValidator.create), OrderController.create);

export const OrderRoutes = router;
