export default class CartController {
    constructor(service) {
        this.service = service;
    }

    getCartById = async (req, res) => {
        const result = await this.service.getCartById(req.params.cid);
        res.send({ status: 'success', payload: result });
    };

    createCart = async (req, res) => {
        const result = await this.service.createCart();
        res.send({ status: 'success', payload: result });
    };

    addProductToCart = async (req, res) => {
        const result = await this.service.addProduct(
            req.params.cid,
            req.params.pid
        );
        res.send({ status: 'success', payload: result });
    };

    deleteProductFromCart = async (req, res) => {
        try {
            const result = await this.service.deleteProduct(
                req.params.cid,
                req.params.pid
            );
            res.send({ status: 'success', payload: result });
        } catch (error) {
            res.status(400).send({ status: 'error', message: error.message });
        }
    };

    updateProductQuantity = async (req, res) => {
        try {
            const result = await this.service.updateProductQuantity(
                req.params.cid,
                req.params.pid,
                req.body.quantity
            );
            res.send({ status: 'success', payload: result });
        } catch (error) {
            res.status(400).send({ status: 'error', message: error.message });
        }
    };

    clearCart = async (req, res) => {
        try {
            const result = await this.service.deleteAllProducts(req.params.cid);
            res.send({ status: 'success', payload: result });
        } catch (error) {
            res.status(400).send({ status: 'error', message: error.message });
        }
    };

    purchaseCart = async (req, res) => {
        try {
            const result = await this.service.purchaseCart(
                req.params.cid,
                req.user.email
            );

            res.send({
                status: "success",
                payload: result
            });

        } catch (error) {
            res.status(400).send({
                status: "error",
                message: error.message
            });
        }
    };
}