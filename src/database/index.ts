import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import { logger } from "@utils/logger.util";
import fs from "fs";

dotenv.config();

const isDev = ['local', 'development'].includes(process.env.ENV || '');

const getDialectOptions = () => {
	if (isDev) return {};

	const sslOptions: Record<string, boolean | string> = {
		require: true,
		rejectUnauthorized: false,
	};

	if (process.env.DB_SSL_CA) {
		sslOptions.ca = fs.readFileSync(process.env.DB_SSL_CA).toString();
	}

	return {
		connectTimeout: 20000,
		ssl: sslOptions,
	};
};

// Tests run against an in-memory SQLite database so they need no external services.
export const mainDb = process.env.NODE_ENV === 'test'
	? new Sequelize({ dialect: 'sqlite', storage: ':memory:', logging: false })
	: new Sequelize({
		database: process.env.DB_NAME,
		dialect: 'postgres',
		username: process.env.DB_USER,
		password: process.env.DB_PASS,
		host: process.env.DB_HOST,
		logging: false,
		port: parseInt(process.env.DB_PORT || '5432'),
		dialectOptions: getDialectOptions(),
	});

export const connectDatabases = async () => {
	try {
		await mainDb.authenticate();
		logger.info(`Connected to ${process.env.ENV} Database`);
	} catch (error) {
		logger.error(`Error connecting to ${process.env.ENV} database: ${error}`);
	}
};
