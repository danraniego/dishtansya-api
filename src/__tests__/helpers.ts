import '../database/associations';
import request from 'supertest';
import app from '../app';
import { mainDb } from '@database';
import { Product } from '@models/product/product.model';
import { User } from '@models/user/user.model';
import { hashPassword } from '@utils/password.util';

export const api = () => request(app);

export const resetDatabase = async () => {
	await mainDb.sync({ force: true });
};

export const createUser = async (email = 'backend@multisyscorp.com', password = 'test123') => {
	return User.create({ email, password: await hashPassword(password) });
};

export const seedProducts = async () => {
	await Product.bulkCreate([
		{ id: 1, name: 'Fried Chicken Bucket (6 pcs)', available_stock: 100 },
		{ id: 2, name: 'Spaghetti Family Pan', available_stock: 50 },
	]);
};

export const loginToken = async (email = 'backend@multisyscorp.com', password = 'test123') => {
	const res = await api().post('/login').send({ email, password });
	return res.body.access_token as string;
};
