import { DataTypes, Model, Sequelize } from 'sequelize';
import { mainDb } from "@database";
import { User } from '@models/user/user.model';
import { Product } from '@models/product/product.model';

export class Order extends Model {
	declare id: number;
	declare user_id: string;
	declare product_id: number;
	declare quantity: number;
	declare created_at: Date;
	declare updated_at: Date;

	static properties = {
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
	};
}

Order.init(
	Order.properties,
	{
		tableName: "orders",
		sequelize: mainDb,
		timestamps: true,
		createdAt: 'created_at',
		updatedAt: 'updated_at',
	}
);
