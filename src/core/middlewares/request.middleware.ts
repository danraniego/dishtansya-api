import { Request, Response, NextFunction } from 'express';
import { HttpResponse } from "@http/http.response";

export class RequestMiddleware {

	// Rejects request bodies containing keys outside the allowed list.
	public static sanitize(allowedKeys: string[]) {
		return (req: Request, res: Response, next: NextFunction) => {
			const extraKeys = Object.keys(req.body ?? {}).filter(key => !allowedKeys.includes(key));

			if (extraKeys.length > 0) {
				return HttpResponse.badRequest(res, `Unexpected fields: ${extraKeys.join(', ')}`);
			}

			next();
		};
	}
}
