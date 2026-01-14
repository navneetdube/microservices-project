const paymentService = require("./payment.service");

exports.createPayment = async (req, res, next) => {
  console.log("🚀 ~ req:", req.body)
  try {
    const { productId } = req.body;
    const userId =  1; // coming from auth middleware

    const result = await paymentService.createPaymentIntent({
      productId,
      userId,
    });

    return res.status(201).json({
      success: true,
      data: result,
      message: "Payment intent created",
    });
  } catch (error) {
    next(error);
  }
};

exports.getOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const order = await paymentService.getOrderById(orderId);

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
