import { Router } from 'express';
import passport from 'passport';
import { uploader } from '../utils/multerUtil.js';
import { authorize } from "../middlewares/authorization.middleware.js";

import ProductsController from '../controllers/products.controllers.js';
import ProductRepository from '../repositories/products.repository.js';
import ProductService from '../services/products.service.js';
import productDBManager from '../dao/mongo/productDBManager.js';

const router = Router();

const dao = new productDBManager();
const repository = new ProductRepository(dao);
const service = new ProductService(repository);
const controller = new ProductsController(service);

router.get('/', controller.getAllProducts);

router.get('/:pid', controller.getProductById);

router.post('/',
    passport.authenticate("current", { session: false }),
    authorize(["admin"]),
    uploader.array('thumbnails', 3),
    controller.createProduct
);

router.put('/:pid',
    passport.authenticate("current", { session: false }),
    authorize(["admin"]),
    uploader.array('thumbnails', 3),
    controller.updateProduct
);

router.delete('/:pid',
    passport.authenticate("current", { session: false }),
    authorize(["admin"]),
    controller.deleteProduct
);

export default router;