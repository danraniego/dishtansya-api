import { DataTypes, Model, Sequelize } from 'sequelize';
import { mainDb } from "@database";

export class User extends Model {
	declare id: string;
	declare email: string;
	declare password: string;
	declare failed_login_attempts: number;
	declare locked_until: Date | null;
	declare created_at: Date;
	declare updated_at: Date;

	static properties = {
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
	};
}

User.init(
	User.properties,
	{
		tableName: "users",
		sequelize: mainDb,
		timestamps: true,
		createdAt: 'created_at',
		updatedAt: 'updated_at',
	}
);
