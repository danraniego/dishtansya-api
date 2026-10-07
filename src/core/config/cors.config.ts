import { CorsOptions } from 'cors';

const isDev = ['local', 'development'].includes(process.env.ENV || '');

const getAllowedOrigins = (): string[] | '*' => {
	if (isDev) return '*';

	const origins = process.env.ALLOWED_ORIGINS;
	if (!origins) return '*';

	return origins.split(',').map(origin => origin.trim()).filter(Boolean);
};

const allowedOrigins = getAllowedOrigins();

export const corsOptions: CorsOptions = {
	origin: allowedOrigins === '*' ? true : allowedOrigins,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true,
	maxAge: 86400,
};
