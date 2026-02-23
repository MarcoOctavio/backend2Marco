import { Router } from 'express';
import passport from 'passport';
import { authorize } from '../middlewares/authorization.middleware.js';

import CartController from '../controllers/carts.controller.js';
import CartRepository from '../repositories/cart.repository.js';
import ProductRepository from '../repositories/products.repository.js';
import TicketRepository from '../repositories/ticket.repository.js';

import cartDBManager from '../dao/mongo/cartDBManager.js';
import productDBManager from '../dao/mongo/productDBManager.js';
import ticketModel from '../dao/models/ticket.model.js';

import CartService from '../services/cart.service.js';

const router = Router();

const cartDAO = new cartDBManager();
const productDAO = new productDBManager();

const cartRepo = new CartRepository(cartDAO);
const productRepo = new ProductRepository(productDAO);
const ticketRepo = new TicketRepository(ticketModel);

const service = new CartService(cartRepo, productRepo, ticketRepo);
const controller = new CartController(service);

router.get('/:cid', controller.getCartById);

router.post('/', controller.createCart);

router.post('/:cid/product/:pid',
    passport.authenticate("current", { session: false }),
    authorize(["user"]),
    controller.addProductToCart
);

router.delete('/:cid/product/:pid',
    passport.authenticate("current", { session: false }),
    authorize(["user"]),
    controller.deleteProductFromCart
);

router.put('/:cid/product/:pid',
    passport.authenticate("current", { session: false }),
    authorize(["user"]),
    controller.updateProductQuantity
);

router.delete('/:cid',
    passport.authenticate("current", { session: false }),
    authorize(["user"]),
    controller.clearCart
);

router.post('/:cid/purchase',
    passport.authenticate("current", { session: false }),
    authorize(["user"]),
    controller.purchaseCart
);

export default router;