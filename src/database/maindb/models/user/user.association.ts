import { User } from "./user.model";
import { Order } from "@models/order/order.model";

User.hasMany(Order, {
	foreignKey: 'user_id',
	as: 'orders'
});
