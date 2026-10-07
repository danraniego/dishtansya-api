'use strict';

import { QueryInterface } from 'sequelize';
import { Product } from '@models/product/product.model';

const PRODUCTS = [
	{ id: 1, name: 'Fried Chicken Bucket (6 pcs)', available_stock: 100 },
	{ id: 2, name: 'Spaghetti Family Pan', available_stock: 50 },
	{ id: 3, name: 'Classic Cheeseburger', available_stock: 200 },
	{ id: 4, name: 'Mango Pie', available_stock: 150 },
	{ id: 5, name: 'Pancit Palabok', available_stock: 75 },
];

module.exports = {
	async up(queryInterface: QueryInterface) {
		const now = new Date();

		await queryInterface.bulkInsert(
			Product.getTableName(),
			PRODUCTS.map(product => ({ ...product, created_at: now, updated_at: now }))
		);

		// Explicit ids bypass the sequence; move it past the seeded rows.
		if (queryInterface.sequelize.getDialect() === 'postgres') {
			await queryInterface.sequelize.query(
				`SELECT setval(pg_get_serial_sequence('${Product.getTableName()}', 'id'), (SELECT MAX(id) FROM ${Product.getTableName()}))`
			);
		}
	},

	async down(queryInterface: QueryInterface) {
		await queryInterface.bulkDelete(Product.getTableName(), { id: PRODUCTS.map(product => product.id) });
	}
};
