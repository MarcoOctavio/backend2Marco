export default class ProductRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getAll = () => this.dao.getProducts();
    getById = (id) => this.dao.getProductById(id);
    create = (data) => this.dao.addProduct(data);
    update = (id, data) => this.dao.updateProduct(id, data);
    delete = (id) => this.dao.deleteProduct(id);
}