import rateLimit from 'express-rate-limit';

/**
 * Global API Rate Limiter
 */
export const apiLimiter = rateLimit({
	windowMs: 60 * 1000, // 1 minute
	max: 300,
	standardHeaders: 'draft-8',
	legacyHeaders: false,
	message: {
		message: 'Too many requests. Please try again after a few minutes.',
	},
	statusCode: 429,
});
