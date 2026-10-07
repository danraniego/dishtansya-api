import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const base = {
	username: process.env.DB_USER || '',
	password: process.env.DB_PASS || '',
	database: process.env.DB_NAME || '',
	host: process.env.DB_HOST || 'localhost',
	dialect: 'postgres',
	port: parseInt(process.env.DB_PORT || '5432'),
};

const ssl = {
	connectTimeout: 20000,
	ssl: {
		require: true,
		rejectUnauthorized: false,
	},
};

const config = {
	development: { ...base, logging: true, dialectOptions: {} },
	staging: { ...base, logging: true, dialectOptions: ssl },
	production: { ...base, logging: false, dialectOptions: ssl },
};

const configPath = path.resolve(__dirname, '../src/database/migration.config.json');
fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

console.log('Config file generated successfully!');
