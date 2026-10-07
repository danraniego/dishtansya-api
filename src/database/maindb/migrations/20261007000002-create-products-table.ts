'use strict';

import { DataTypes, QueryInterface, Sequelize } from 'sequelize';
import { Product } from '@models/product/product.model';

module.exports = {
	async up(queryInterface: QueryInterface) {
		await queryInterface.createTable(Product.getTableName(), {
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			name: {
				type: DataTypes.STRING(150),
				allowNull: false,
			},
			available_stock: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0,
			},
			created_at: {
				type: DataTypes.DATE,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
			},
			updated_at: {
				type: DataTypes.DATE,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
			},
		});

		await queryInterface.sequelize.query(
			`ALTER TABLE ${Product.getTableName()} ADD CONSTRAINT products_available_stock_non_negative CHECK (available_stock >= 0)`
		);
	},

	async down(queryInterface: QueryInterface) {
		await queryInterface.dropTable(Product.getTableName());
	}
};
