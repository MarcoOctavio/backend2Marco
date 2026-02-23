export default class UserRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getByEmail = (email) => this.dao.getUserByEmail(email);
    create = (data) => this.dao.createUser(data);
    update = (id, data) => this.dao.updateUser(id, data);
}