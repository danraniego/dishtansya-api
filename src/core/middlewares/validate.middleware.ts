import { Request, Response, NextFunction } from "express";
import { ValidationChain, validationResult } from "express-validator";
import { HttpResponse } from "@http/http.response";

export const validateMiddleware = (validators: ValidationChain[]) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		for (const validation of validators) {
			await validation.run(req);
		}

		const errors = validationResult(req);

		if (errors.isEmpty()) {
			return next();
		}

		const data = errors.array().map(error => ({
			field: (error as { path: string }).path,
			error: error.msg,
		}));

		return HttpResponse.unprocessableEntity(res, data[0].error, data);
	};
};
