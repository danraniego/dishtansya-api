import { Request } from "express";
import jwt from "jsonwebtoken";

export interface TokenData {
	userId: string;
	email: string;
}

export class AuthProvider {

	private static get secret(): string {
		const secret = process.env.JWT_SECRET;
		if (!secret) {
			throw new Error("JWT_SECRET environment variable is not set");
		}
		return secret;
	}

	public static generateToken(data: TokenData): string {
		return jwt.sign({ email: data.email }, this.secret, {
			subject: data.userId,
			expiresIn: (process.env.JWT_EXPIRES_IN || '1h') as jwt.SignOptions['expiresIn'],
		});
	}

	public static verifyToken(token: string): TokenData | null {
		try {
			const payload = jwt.verify(token, this.secret) as jwt.JwtPayload;
			if (!payload.sub) return null;

			return { userId: payload.sub, email: payload.email };
		} catch {
			return null;
		}
	}

	public static extractBearerToken(req: Request): string | null {
		const authHeader = req.headers['authorization'];
		if (!authHeader?.startsWith('Bearer ')) return null;
		return authHeader.split(' ')[1] ?? null;
	}
}
