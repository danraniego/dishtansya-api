import { NextFunction, Request, Response } from 'express';
import { AuthRequest } from '@http/auth.request';
import { HttpResponse } from '@http/http.response';
import { AuthProvider } from '@providers/auth.provider';

export class AuthMiddleware {

	static guard() {
		return (req: Request, res: Response, next: NextFunction) => {
			const token = AuthProvider.extractBearerToken(req);

			if (!token) {
				return HttpResponse.unAuthorized(res, 'Access denied. No token provided.');
			}

			const result = AuthProvider.verifyToken(token);
			if (!result) {
				return HttpResponse.unAuthorized(res, 'Invalid or expired token.');
			}

			(req as AuthRequest).userId = result.userId;
			(req as AuthRequest).email = result.email;
			(req as AuthRequest).token = token;

			next();
		};
	}
}
