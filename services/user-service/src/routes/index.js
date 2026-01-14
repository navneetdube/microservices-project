const router = require("express").Router();


router.use("/auth", require("../modules/auth/auth.routes"));
router.use("/orders", require("../modules/order/order.routes"));
router.use("/checklists", require("../modules/checklist/checklist.routes"));
router.use("/answers", require("../modules/answer/answer.routes"));
router.use("/users", require("../modules/user/user.routes"));

module.exports = router;