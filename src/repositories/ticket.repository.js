export default class TicketRepository {
    constructor(model) {
        this.model = model;
    }

    create = (data) => this.model.create(data);
}