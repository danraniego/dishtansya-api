import { Queue } from 'bullmq';
import { redisConnection } from '@config/redis.config';
import { EMAIL_QUEUE, EmailJob } from '@constants/queues';
import { logger } from '@utils/logger.util';

export interface WelcomeEmailJob {
	email: string;
}

export class EmailQueue {
	private static queue: Queue;

	private static getQueue(): Queue {
		if (!this.queue) {
			// Fail fast instead of buffering commands when Redis is unreachable.
			this.queue = new Queue(EMAIL_QUEUE, {
				connection: { ...redisConnection, enableOfflineQueue: false },
				defaultJobOptions: {
					attempts: 3,
					backoff: { type: 'exponential', delay: 5000 },
					removeOnComplete: true,
					removeOnFail: 100,
				},
			});
			this.queue.on('error', error => logger.error(`EmailQueue: ${error.message}`));
		}

		return this.queue;
	}

	public static async sendWelcome(data: WelcomeEmailJob): Promise<void> {
		await this.getQueue().add(EmailJob.WELCOME, data);
	}
}
