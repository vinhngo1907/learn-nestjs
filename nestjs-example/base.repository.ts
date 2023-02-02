import { Model, FilterQuery, QueryOptions, Document } from 'mongoose';

export class BaseRepository<T extends Document> {
	constructor(private readonly model: Model<T>) { }

	async create(doc): Promise<any> {
		const createdEntity = new this.model(doc);
		return await createdEntity.save();
	}

	async findByCondition(
		filter,
		field?: any | null,
		option?: any | null,
		populate?: any | null,
	): Promise<any> {
		return this.model.findOne(filter, field, option).populate(populate)
	}
	async update(
		filter: any,
		data: any
	): Promise<T> {
		const updatedEntity = await this.model.findOneAndUpdate(filter, data);
		return updatedEntity;
	}
}