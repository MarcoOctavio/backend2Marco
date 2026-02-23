import crypto from 'crypto';

export default class CartService {
    constructor(cartRepo, productRepo, ticketRepo) {
        this.cartRepo = cartRepo;
        this.productRepo = productRepo;
        this.ticketRepo = ticketRepo;
    }

    async purchaseCart(cid, userEmail) {
        const cart = await this.cartRepo.getById(cid);

  if (!cart) {
    throw new Error("Carrito no encontrado");
  }

  let totalAmount = 0;
  let rejectedProducts = [];

  for (let item of cart.products) {

    const product = await this.productRepo.getById(item.product);

    if (!product) {
      rejectedProducts.push(item.product);
      continue;
    }

    if (product.stock >= item.quantity) {

      product.stock -= item.quantity;
      await this.productRepo.update(product._id, product);

      totalAmount += product.price * item.quantity;

    } else {
      rejectedProducts.push(product._id);
    }
  }

  if (totalAmount === 0) {
    return {
      message: "No se pudo procesar ninguna compra",
      rejectedProducts
    };
  }

  const ticket = await this.ticketRepo.create({
    code: crypto.randomUUID(),
    amount: totalAmount,
    purchaser: userEmail,
  });


  cart.products = cart.products.filter(item =>
    rejectedProducts.some(id => id.toString() === item.product.toString())
  );

  await this.cartRepo.update(cart._id, cart);

  return {
    ticket,
    rejectedProducts
  };

}   
}