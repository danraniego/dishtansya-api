import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";

const isTest = process.env.NODE_ENV === 'test';

export const logger = winston.createLogger({
	level: "info",
	silent: isTest,
	format: winston.format.combine(
		winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
		winston.format.printf(({ timestamp, level, message }) => {
			return `${timestamp} [${level.toUpperCase()}]: ${message}`;
		})
	),
	transports: isTest ? [new winston.transports.Console()] : [
		new DailyRotateFile({
			filename: path.resolve(process.cwd(), "storage", "logs", "app-%DATE%.log"),
			datePattern: "YYYY-MM-DD",
			maxSize: "20m",
			maxFiles: "14d",
		}),
		new winston.transports.Console(),
	],
});
