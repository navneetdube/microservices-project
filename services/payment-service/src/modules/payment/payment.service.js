const stripe = require("../../config/stripe");
const { Product, Order } = require("../../models");

exports.createPaymentIntent = async ({ productId, userId }) => {
  // 1️⃣ Fetch product (DO NOT trust client amount)
  const product = await Product.findByPk(productId);
  console.log("🚀 ~ product:", product)
  if (!product) {
    throw new Error("Product not found");
  }

  // 2️⃣ Create order in DB (PENDING)
  const order = await Order.create({
    productId: product.id,
    amount: product.price,
    status: "PENDING",
    userId, // optional if you track users
  });

  // 3️⃣ Create Stripe PaymentIntent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: product.price * 100, // rupees → paise
    currency: "inr",
    metadata: {
      orderId: order.id,
      productId: product.id,
      userId,
    },
  });

  // 4️⃣ Store paymentIntentId in DB
  await order.update({
    paymentIntentId: paymentIntent.id,
  });

  // 5️⃣ Return ONLY what frontend needs
  return {
    clientSecret: paymentIntent.client_secret,
    orderId: order.id,
  };
};

exports.getOrderById = async (orderId) => {
  const order = await Order.findByPk(orderId, {
    include: ["Product"],
  });

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
};
