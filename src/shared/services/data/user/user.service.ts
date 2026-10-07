import { User } from '@models/user/user.model';
import { BaseService } from '../base.service';

export class UserService extends BaseService<User> {
	protected static model = User;

	public static async findByEmail(email: string): Promise<User | null> {
		return User.findOne({ where: { email } });
	}
}
