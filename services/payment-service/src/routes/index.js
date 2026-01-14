const router = require("express").Router();

router.use("/payments", require("../modules/payment/payment.routes"));
router.use("/webhook", require("../modules/webhook/webhook.routes"));




module.exports = router;