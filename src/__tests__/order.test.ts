import { api, createUser, loginToken, resetDatabase, seedProducts } from './helpers';
import { mainDb } from '@database';
import { Order } from '@models/order/order.model';
import { Product } from '@models/product/product.model';

describe('POST /order', () => {
	let token: string;

	beforeEach(async () => {
		await resetDatabase();
		await seedProducts();
		await createUser();
		token = await loginToken();
	});

	afterAll(async () => {
		await mainDb.close();
	});

	const order = (body: object, accessToken = token) => api()
		.post('/order')
		.set('Authorization', `Bearer ${accessToken}`)
		.send(body);

	it('creates an order and deducts the stock', async () => {
		const res = await order({ product_id: '1', quantity: '2' });

		expect(res.status).toBe(201);
		expect(res.body).toEqual({ message: 'You have successfully ordered this product.' });

		const product = await Product.findByPk(1);
		expect(product!.available_stock).toBe(98);
		expect(await Order.count({ where: { product_id: 1, quantity: 2 } })).toBe(1);
	});

	it('rejects an order larger than the available stock', async () => {
		const res = await order({ product_id: '2', quantity: '9999' });

		expect(res.status).toBe(400);
		expect(res.body).toEqual({ message: 'Failed to order this product due to unavailability of the stock' });

		const product = await Product.findByPk(2);
		expect(product!.available_stock).toBe(50);
		expect(await Order.count()).toBe(0);
	});

	it('allows ordering exactly the remaining stock', async () => {
		const res = await order({ product_id: 2, quantity: 50 });

		expect(res.status).toBe(201);
		expect((await Product.findByPk(2))!.available_stock).toBe(0);
	});

	it('requires an access token', async () => {
		const res = await api().post('/order').send({ product_id: '1', quantity: '2' });

		expect(res.status).toBe(401);
	});

	it('rejects an invalid access token', async () => {
		const res = await order({ product_id: '1', quantity: '2' }, 'not-a-jwt');

		expect(res.status).toBe(401);
	});

	it('returns 404 for an unknown product', async () => {
		const res = await order({ product_id: '999', quantity: '1' });

		expect(res.status).toBe(404);
		expect(res.body).toEqual({ message: 'Product not found' });
	});

	it('rejects a non-positive quantity', async () => {
		const res = await order({ product_id: '1', quantity: '0' });

		expect(res.status).toBe(422);
		expect((await Product.findByPk(1))!.available_stock).toBe(100);
	});
});
