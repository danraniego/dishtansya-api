'use strict';

import { DataTypes, QueryInterface, Sequelize } from 'sequelize';
import { User } from '@models/user/user.model';

module.exports = {
	async up(queryInterface: QueryInterface) {
		await queryInterface.createTable(User.getTableName(), {
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				primaryKey: true,
			},
			email: {
				type: DataTypes.STRING(100),
				allowNull: false,
				unique: true,
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			failed_login_attempts: {
				type: DataTypes.SMALLINT,
				allowNull: false,
				defaultValue: 0,
			},
			locked_until: {
				type: DataTypes.DATE,
				allowNull: true,
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
	},

	async down(queryInterface: QueryInterface) {
		await queryInterface.dropTable(User.getTableName());
	}
};
