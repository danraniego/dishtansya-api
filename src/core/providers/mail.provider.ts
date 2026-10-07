import nodemailer, { Transporter } from 'nodemailer';
import { logger } from '@utils/logger.util';

export interface MailMessage {
	to: string;
	subject: string;
	html: string;
}

export class MailProvider {
	private static transporter: Transporter;

	private static getTransporter(): Transporter {
		if (!this.transporter) {
			this.transporter = nodemailer.createTransport({
				host: process.env.MAIL_HOST || 'localhost',
				port: parseInt(process.env.MAIL_PORT || '1025'),
				secure: process.env.MAIL_PORT === '465',
				auth: process.env.MAIL_USER
					? { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS }
					: undefined,
			});
		}

		return this.transporter;
	}

	public static async send(message: MailMessage): Promise<void> {
		await this.getTransporter().sendMail({
			from: process.env.MAIL_FROM || 'Dishtansya <no-reply@dishtansya.com>',
			...message,
		});

		logger.info(`MailProvider.send: "${message.subject}" sent to ${message.to}`);
	}
}
