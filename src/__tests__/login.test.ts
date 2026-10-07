import jwt from 'jsonwebtoken';
import { api, createUser, resetDatabase } from './helpers';
import { mainDb } from '@database';
import { User } from '@models/user/user.model';

describe('POST /login', () => {
	let user: User;

	beforeEach(async () => {
		await resetDatabase();
		user = await createUser('backend@multisyscorp.com', 'test123');
	});

	afterAll(async () => {
		await mainDb.close();
	});

	const login = (email: string, password: string) => api().post('/login').send({ email, password });

	it('returns a JWT access token for valid credentials', async () => {
		const res = await login('backend@multisyscorp.com', 'test123');

		expect(res.status).toBe(201);
		expect(Object.keys(res.body)).toEqual(['access_token']);

		const payload = jwt.verify(res.body.access_token, process.env.JWT_SECRET!) as jwt.JwtPayload;
		expect(payload.sub).toBe(user.id);
	});

	it('rejects an unknown account', async () => {
		const res = await login('backend123123@multisyscorp.com', 'test121231233');

		expect(res.status).toBe(401);
		expect(res.body).toEqual({ message: 'Invalid credentials' });
	});

	it('rejects a wrong password', async () => {
		const res = await login('backend@multisyscorp.com', 'wrong-password');

		expect(res.status).toBe(401);
		expect(res.body).toEqual({ message: 'Invalid credentials' });
	});

	describe('account locking', () => {
		const failTimes = async (times: number) => {
			for (let i = 0; i < times; i++) {
				await login('backend@multisyscorp.com', 'wrong-password');
			}
		};

		it('locks the account for 5 minutes after 5 failed attempts', async () => {
			await failTimes(5);

			const res = await login('backend@multisyscorp.com', 'test123');

			expect(res.status).toBe(423);
			expect(res.body.message).toMatch(/locked/i);

			await user.reload();
			const lockMs = user.locked_until!.getTime() - Date.now();
			expect(lockMs).toBeGreaterThan(4 * 60000);
			expect(lockMs).toBeLessThanOrEqual(5 * 60000);
		});

		it('does not lock after only 4 failed attempts', async () => {
			await failTimes(4);

			const res = await login('backend@multisyscorp.com', 'test123');

			expect(res.status).toBe(201);
		});

		it('unlocks the account once the lock expires', async () => {
			await failTimes(5);
			await user.update({ locked_until: new Date(Date.now() - 1000) });

			const res = await login('backend@multisyscorp.com', 'test123');

			expect(res.status).toBe(201);
			await user.reload();
			expect(user.locked_until).toBeNull();
			expect(user.failed_login_attempts).toBe(0);
		});

		it('resets the failed attempt counter after a successful login', async () => {
			await failTimes(4);
			await login('backend@multisyscorp.com', 'test123');
			await failTimes(4);

			const res = await login('backend@multisyscorp.com', 'test123');

			expect(res.status).toBe(201);
		});
	});
});
