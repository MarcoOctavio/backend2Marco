export default class ProductService {
    constructor(repository) {
        this.repository = repository;
    }

    async createProduct(data) {
        return await this.repository.create(data);
    }
}