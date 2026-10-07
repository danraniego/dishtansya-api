import { body } from 'express-validator';

export class OrderValidator {

	static create = [
		body('product_id')
			.exists({ values: 'null' }).withMessage('product_id is required.').bail()
			.isInt({ min: 1 }).withMessage('product_id must be a positive integer.')
			.toInt(),
		body('quantity')
			.exists({ values: 'null' }).withMessage('quantity is required.').bail()
			.isInt({ min: 1, max: 1000000 }).withMessage('quantity must be a positive integer.')
			.toInt(),
	];
}
