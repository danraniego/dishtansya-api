'use strict';

import { DataTypes, QueryInterface, Sequelize } from 'sequelize';
import { Order } from '@models/order/order.model';
import { User } from '@models/user/user.model';
import { Product } from '@models/product/product.model';

module.exports = {
	async up(queryInterface: QueryInterface) {
		await queryInterface.createTable(Order.getTableName(), {
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			user_id: {
				type: DataTypes.UUID,
				allowNull: false,
				references: {
					model: User.getTableName(),
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			product_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: Product.getTableName(),
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'RESTRICT',
			},
			quantity: {
				type: DataTypes.INTEGER,
				allowNull: false,
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

		await queryInterface.addIndex(Order.getTableName(), ['user_id'], { name: 'orders_user_id_idx' });
		await queryInterface.addIndex(Order.getTableName(), ['product_id'], { name: 'orders_product_id_idx' });
	},

	async down(queryInterface: QueryInterface) {
		await queryInterface.dropTable(Order.getTableName());
	}
};
