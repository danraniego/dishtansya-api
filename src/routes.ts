import { Router } from 'express';
import { AuthRoutes } from '@api/auth/auth.route';
import { OrderRoutes } from '@api/order/order.route';

const router = Router();

router.use('/', AuthRoutes);
router.use('/order', OrderRoutes);

export const appRoutes = router;
