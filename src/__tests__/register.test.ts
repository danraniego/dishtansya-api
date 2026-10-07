import { api, createUser, resetDatabase } from './helpers';
import { mainDb } from '@database';
import { User } from '@models/user/user.model';
import { EmailQueue } from '@workers/queue/email/email.queue';

jest.mock('@workers/queue/email/email.queue', () => ({
	EmailQueue: { sendWelcome: jest.fn().mockResolvedValue(undefined) },
}));

describe('POST /register', () => {
	beforeEach(async () => {
		await resetDatabase();
		jest.clearAllMocks();
	});

	afterAll(async () => {
		await mainDb.close();
	});

	it('registers a guest user', async () => {
		const res = await api()
			.post('/register')
			.send({ email: 'backend@multisyscorp.com', password: 'test123' });

		expect(res.status).toBe(201);
		expect(res.body).toEqual({ message: 'User successfully registered' });

		const user = await User.findOne({ where: { email: 'backend@multisyscorp.com' } });
		expect(user).not.toBeNull();
		expect(user!.password).not.toBe('test123');
	});

	it('queues a welcome email instead of sending it inline', async () => {
		await api().post('/register').send({ email: 'backend@multisyscorp.com', password: 'test123' });

		expect(EmailQueue.sendWelcome).toHaveBeenCalledWith({ email: 'backend@multisyscorp.com' });
	});

	it('rejects an email that is already taken', async () => {
		await createUser('backend@multisyscorp.com');

		const res = await api()
			.post('/register')
			.send({ email: 'backend@multisyscorp.com', password: 'test123' });

		expect(res.status).toBe(400);
		expect(res.body).toEqual({ message: 'Email already taken' });
		expect(await User.count()).toBe(1);
	});

	it('treats emails case-insensitively when checking if taken', async () => {
		await createUser('backend@multisyscorp.com');

		const res = await api()
			.post('/register')
			.send({ email: 'Backend@MultisysCorp.com', password: 'test123' });

		expect(res.status).toBe(400);
		expect(res.body).toEqual({ message: 'Email already taken' });
	});

	it('rejects an invalid email', async () => {
		const res = await api().post('/register').send({ email: 'not-an-email', password: 'test123' });

		expect(res.status).toBe(422);
		expect(res.body.message).toBe('Please provide a valid email address.');
	});
});
