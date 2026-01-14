const router = require("express").Router();
const controller = require("./webhook.controller");

router.post(
  "/stripe",
  controller.handleStripeWebhook
);

module.exports = router;
