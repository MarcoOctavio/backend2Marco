export default class CartRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getById = (id) => this.dao.getCartById(id);
    update = (id, data) => this.dao.updateCart(id, data);
}