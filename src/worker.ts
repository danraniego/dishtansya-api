import dotenv from "dotenv";
import { logger } from "@utils/logger.util";
import { createEmailWorker } from "@workers/queue/email/email.worker";

dotenv.config();

const workers = [
	createEmailWorker(),
];

logger.info(`[Worker] ${workers.length} queue worker(s) running`);

const shutdown = async () => {
	logger.info('[Worker] Shutting down...');
	await Promise.all(workers.map(worker => worker.close()));
	process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
