import { AuthRequest } from "@http/auth.request";
import { Request } from "express";

export interface AuthUser {
	userId: string;
	email: string;
	token: string;
}

export class Auth {

	public static user(req: Request): AuthUser {
		return {
			userId: (req as AuthRequest).userId,
			email: (req as AuthRequest).email,
			token: (req as AuthRequest).token,
		};
	}
}
