import { body } from 'express-validator';

const email = () => body('email')
	.exists({ values: 'falsy' }).withMessage('Email is required.').bail()
	.isString().withMessage('Email must be a string.').bail()
	.trim()
	.isEmail().withMessage('Please provide a valid email address.').bail()
	.isLength({ max: 100 }).withMessage('Email must not exceed 100 characters.')
	.toLowerCase();

export class AuthValidator {

	static register = [
		email(),
		body('password')
			.exists({ values: 'falsy' }).withMessage('Password is required.').bail()
			.isString().withMessage('Password must be a string.').bail()
			.isLength({ min: 6, max: 128 }).withMessage('Password must be between 6 and 128 characters.'),
	];

	static login = [
		email(),
		body('password')
			.exists({ values: 'falsy' }).withMessage('Password is required.').bail()
			.isString().withMessage('Password must be a string.'),
	];
}
