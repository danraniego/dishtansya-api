import { Product } from "./product.model";
import { Order } from "@models/order/order.model";

Product.hasMany(Order, {
	foreignKey: 'product_id',
	as: 'orders'
});
