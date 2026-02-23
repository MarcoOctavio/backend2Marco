export default class ProductsDAO {
    async getAll() {
        return await productModel.find();
    }

    async getById(id) {
        return await productModel.findById(id);
    }

    async create(product) {
        return await productModel.create(product);
    }

    async update(id, data) {
        return await productModel.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id) {
        return await productModel.findByIdAndDelete(id);
    }
}