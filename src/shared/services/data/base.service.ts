import { logger } from '@utils/logger.util';
import { Model, ModelStatic } from 'sequelize';

export abstract class BaseService<_T extends Model> {
	protected static model: ModelStatic<any>;

	protected static getModel(): ModelStatic<any> {
		if (!this.model) {
			throw new Error(`Model not defined in ${this.name}. Add: protected static model = YourModel;`);
		}

		return this.model;
	}

	public static async isExist(id: number): Promise<boolean> {
		try {
			const model = this.getModel();
			const result = await model.findByPk(id, {
				attributes: ['id'],
				raw: true,
			});

			return !!result;
		} catch (error) {
			logger.error('BaseService.isExist:', error);
			throw error;
		}
	}

	public static async isExistByField(field: string, value: any): Promise<boolean> {
		try {
			const model = this.getModel();
			const count = await model.count({
				where: { [field]: value },
			});

			return count > 0;
		} catch (error) {
			logger.error('BaseService.isExistByField:', error);
			throw error;
		}
	}
}
