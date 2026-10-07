import { logger } from '@utils/logger.util';
import { Response } from 'express';

export class HttpResponse {

	static send(res: Response, status: number, body: object) {
		return res.status(status).json(body);
	}

	static created(res: Response, body: object) {
		return this.send(res, 201, body);
	}

	static success(res: Response, body: object) {
		return this.send(res, 200, body);
	}

	static badRequest(res: Response, message?: string) {
		return this.send(res, 400, { message: message ?? "Bad Request!" });
	}

	static unAuthorized(res: Response, message?: string) {
		return this.send(res, 401, { message: message ?? "Unauthorized Access!" });
	}

	static notFound(res: Response, message?: string) {
		return this.send(res, 404, { message: message ?? "Resource Not Found!" });
	}

	static unprocessableEntity(res: Response, message?: string, errors?: object) {
		return this.send(res, 422, { message: message ?? "Unprocessable Entity!", errors });
	}

	static serverError(res: Response, message?: string, error?: unknown) {
		if (error) {
			logger.error(error instanceof Error ? error.stack ?? error.message : JSON.stringify(error));
		}

		return this.send(res, 500, { message: message ?? "Internal Server Error!" });
	}

	static error(res: Response, code: number, message?: string) {
		return this.send(res, code, { message: message ?? "An error occurred!" });
	}
}
