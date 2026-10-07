import crypto from 'crypto';
import { promisify } from 'util';

const pbkdf2Async = promisify(crypto.pbkdf2);

const PASSWORD_HASH_SCHEME = 'pbkdf2_sha512';
const PASSWORD_HASH_ITERATIONS = Number(process.env.PASSWORD_HASH_ITERATIONS ?? 210000);
const PASSWORD_HASH_KEY_LEN = 64;
const PASSWORD_HASH_DIGEST = 'sha512';
const PASSWORD_HASH_SALT_BYTES = 16;

const isHexString = (value: string): boolean => value.length % 2 === 0 && /^[0-9a-f]+$/i.test(value);

export const hashPassword = async (password: string): Promise<string> => {
	const salt = crypto.randomBytes(PASSWORD_HASH_SALT_BYTES);
	const hash = await pbkdf2Async(password, salt, PASSWORD_HASH_ITERATIONS, PASSWORD_HASH_KEY_LEN, PASSWORD_HASH_DIGEST);

	return [
		PASSWORD_HASH_SCHEME,
		String(PASSWORD_HASH_ITERATIONS),
		salt.toString('hex'),
		hash.toString('hex'),
	].join('$');
};

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
	const [scheme, iterationsText, saltHex, hashHex] = (hashedPassword ?? '').split('$');

	if (scheme !== PASSWORD_HASH_SCHEME || !iterationsText || !saltHex || !hashHex) return false;

	const iterations = Number(iterationsText);
	if (!Number.isInteger(iterations) || iterations <= 0) return false;
	if (!isHexString(saltHex) || !isHexString(hashHex)) return false;

	const computed = await pbkdf2Async(password, Buffer.from(saltHex, 'hex'), iterations, hashHex.length / 2, PASSWORD_HASH_DIGEST);
	return crypto.timingSafeEqual(computed, Buffer.from(hashHex, 'hex'));
};
