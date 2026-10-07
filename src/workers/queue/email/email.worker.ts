import { Job, Worker } from 'bullmq';
import { redisConnection } from '@config/redis.config';
import { EMAIL_QUEUE, EmailJob } from '@constants/queues';
import { MailProvider } from '@providers/mail.provider';
import { logger } from '@utils/logger.util';
import { WelcomeEmailJob } from './email.queue';

const handlers: Record<string, (job: Job) => Promise<void>> = {
	[EmailJob.WELCOME]: async (job: Job<WelcomeEmailJob>) => {
		await MailProvider.send({
			to: job.data.email,
			subject: 'Welcome to Dishtansya!',
			html: `<p>Hi ${job.data.email},</p><p>Your Dishtansya account has been created. Enjoy ordering from your favorite restaurants!</p>`,
		});
	},
};

export const createEmailWorker = () => {
	const worker = new Worker(EMAIL_QUEUE, async (job: Job) => {
		const handler = handlers[job.name];
		if (!handler) {
			throw new Error(`No handler for email job "${job.name}"`);
		}

		await handler(job);
	}, { connection: redisConnection });

	worker.on('failed', (job, error) => logger.error(`EmailWorker: job ${job?.id} (${job?.name}) failed: ${error.message}`));
	worker.on('error', error => logger.error(`EmailWorker: ${error.message}`));

	return worker;
};
