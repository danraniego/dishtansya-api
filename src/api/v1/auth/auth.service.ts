import { UniqueConstraintError } from 'sequelize';
import { User } from '@models/user/user.model';
import { UserService } from '@services/data/user/user.service';
import { AuthProvider } from '@providers/auth.provider';
import { EmailQueue } from '@workers/queue/email/email.queue';
import { ACCOUNT_LOCK_MINUTES, MAX_FAILED_LOGIN_ATTEMPTS } from '@constants/auth.constants';
import { hashPassword, verifyPassword } from '@utils/password.util';
import { ServiceError } from '@utils/service-error.util';
import { logger } from '@utils/logger.util';
import { LoginRequestDto, LoginResponseDto, RegisterRequestDto } from './auth.dto';

const FILE = 'AuthService';

export class AuthService {

	public static async register(data: RegisterRequestDto): Promise<User> {
		const emailTaken = () => new ServiceError({ file: FILE, method: 'register', code: 400, error: 'Email already taken' });

		if (await UserService.isExistByField('email', data.email)) {
			throw emailTaken();
		}

		let user: User;
		try {
			user = await User.create({
				email: data.email,
				password: await hashPassword(data.password),
			});
		} catch (error) {
			// A concurrent request registered the same email between the check and the insert.
			if (error instanceof UniqueConstraintError) throw emailTaken();
			throw error;
		}

		// Queued so registration doesn't wait on (or fail because of) the mail server.
		EmailQueue.sendWelcome({ email: user.email })
			.catch(error => logger.error(`AuthService.register: failed to queue welcome email: ${error.message}`));

		return user;
	}

	public static async login(data: LoginRequestDto): Promise<LoginResponseDto> {
		const invalidCredentials = () => new ServiceError({ file: FILE, method: 'login', code: 401, error: 'Invalid credentials' });

		const user = await UserService.findByEmail(data.email);
		if (!user) {
			throw invalidCredentials();
		}

		this.assertNotLocked(user);

		if (!(await verifyPassword(data.password, user.password))) {
			await this.recordFailedAttempt(user);
			throw invalidCredentials();
		}

		if (user.failed_login_attempts > 0 || user.locked_until) {
			await user.update({ failed_login_attempts: 0, locked_until: null });
		}

		return {
			access_token: AuthProvider.generateToken({ userId: user.id, email: user.email }),
		};
	}

	private static assertNotLocked(user: User): void {
		if (!user.locked_until || user.locked_until.getTime() <= Date.now()) return;

		const minutesLeft = Math.ceil((user.locked_until.getTime() - Date.now()) / 60000);
		throw new ServiceError({
			file: FILE,
			method: 'login',
			code: 423,
			error: `Account is locked due to too many failed login attempts. Please try again in ${minutesLeft} minute(s).`,
		});
	}

	private static async recordFailedAttempt(user: User): Promise<void> {
		await user.increment('failed_login_attempts');
		await user.reload();

		if (user.failed_login_attempts >= MAX_FAILED_LOGIN_ATTEMPTS) {
			await user.update({
				failed_login_attempts: 0,
				locked_until: new Date(Date.now() + ACCOUNT_LOCK_MINUTES * 60000),
			});
		}
	}
}
