import { Router } from 'express';
import { validateMiddleware } from '@middlewares/validate.middleware';
import { RequestMiddleware } from '@middlewares/request.middleware';
import { AuthController } from './auth.controller';
import { AuthValidator } from './auth.validator';

const router = Router();

router.post('/register', RequestMiddleware.sanitize(['email', 'password']), validateMiddleware(AuthValidator.register), AuthController.register);
router.post('/login', RequestMiddleware.sanitize(['email', 'password']), validateMiddleware(AuthValidator.login), AuthController.login);

export const AuthRoutes = router;
