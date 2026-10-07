import { Request, Response } from 'express';
import { HttpResponse } from '@http/http.response';
import { Auth } from '@contexts/auth.context';
import { ServiceError } from '@utils/service-error.util';
import { OrderService } from './order.service';

export class OrderController {

	private static handleError(res: Response, error: unknown) {
		if (error instanceof ServiceError) {
			return HttpResponse.error(res, error.code, error.message);
		}

		return HttpResponse.serverError(res, undefined, error);
	}

	static async create(req: Request, res: Response) {
		try {
			await OrderService.create(Auth.user(req).userId, req.body);

			return HttpResponse.created(res, { message: 'You have successfully ordered this product.' });
		} catch (error) {
			return OrderController.handleError(res, error);
		}
	}
}
