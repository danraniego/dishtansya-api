import { Order } from "./order.model";
import { User } from "@models/user/user.model";
import { Product } from "@models/product/product.model";

Order.belongsTo(User, {
	foreignKey: 'user_id',
	as: 'user'
});

Order.belongsTo(Product, {
	foreignKey: 'product_id',
	as: 'product'
});
