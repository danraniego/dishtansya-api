import { Op, Sequelize } from 'sequelize';
import { mainDb } from '@database';
import { Order } from '@models/order/order.model';
import { Product } from '@models/product/product.model';
import { ServiceError } from '@utils/service-error.util';
import { CreateOrderDto } from './order.dto';

const FILE = 'OrderService';

export class OrderService {

	public static async create(userId: string, data: CreateOrderDto): Promise<Order> {
		return mainDb.transaction(async (transaction) => {
			const product = await Product.findByPk(data.product_id, { attributes: ['id'], transaction });
			if (!product) {
				throw new ServiceError({ file: FILE, method: 'create', code: 404, error: 'Product not found' });
			}

			// Conditional decrement: the stock check and deduction happen in one statement,
			// so concurrent orders can't oversell the product.
			const [affected] = await Product.update(
				{ available_stock: Sequelize.literal(`available_stock - ${Number(data.quantity)}`) },
				{
					where: { id: data.product_id, available_stock: { [Op.gte]: data.quantity } },
					transaction,
				}
			);

			if (affected === 0) {
				throw new ServiceError({
					file: FILE,
					method: 'create',
					code: 400,
					error: 'Failed to order this product due to unavailability of the stock',
				});
			}

			return Order.create({
				user_id: userId,
				product_id: data.product_id,
				quantity: data.quantity,
			}, { transaction });
		});
	}
}
