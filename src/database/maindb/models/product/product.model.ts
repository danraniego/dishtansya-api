import { DataTypes, Model, Sequelize } from 'sequelize';
import { mainDb } from "@database";

export class Product extends Model {
	declare id: number;
	declare name: string;
	declare available_stock: number;
	declare created_at: Date;
	declare updated_at: Date;

	static properties = {
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
	};
}

Product.init(
	Product.properties,
	{
		tableName: "products",
		sequelize: mainDb,
		timestamps: true,
		createdAt: 'created_at',
		updatedAt: 'updated_at',
	}
);
