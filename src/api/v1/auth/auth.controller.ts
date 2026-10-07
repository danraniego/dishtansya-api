import { Request, Response } from 'express';
import { HttpResponse } from '@http/http.response';
import { ServiceError } from '@utils/service-error.util';
import { AuthService } from './auth.service';

export class AuthController {

	private static handleError(res: Response, error: unknown) {
		if (error instanceof ServiceError) {
			return HttpResponse.error(res, error.code, error.message);
		}

		return HttpResponse.serverError(res, undefined, error);
	}

	static async register(req: Request, res: Response) {
		try {
			await AuthService.register(req.body);

			return HttpResponse.created(res, { message: 'User successfully registered' });
		} catch (error) {
			return AuthController.handleError(res, error);
		}
	}

	static async login(req: Request, res: Response) {
		try {
			const data = await AuthService.login(req.body);

			return HttpResponse.created(res, data);
		} catch (error) {
			return AuthController.handleError(res, error);
		}
	}
}
