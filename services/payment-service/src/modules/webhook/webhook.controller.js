const stripe = require("../../config/stripe");
const { Order } = require("../../models");

exports.handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body, // RAW body
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    // console.log("🚀 ~ event connection:", event)
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
              console.log("🚀 ~ event type:", event)
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        console.log("🚀 ~ paymentIntent:", paymentIntent)

        await Order.update(
          { status: "PAID" },
          { where: { paymentIntentId: paymentIntent.id } }
        );

        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;

        await Order.update(
          { status: "FAILED" },
          { where: { paymentIntentId: paymentIntent.id } }
        );

        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    res.status(500).json({ error: "Webhook handler failed" });
  }
};
