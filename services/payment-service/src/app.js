require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDoc = require("./docs/swagger");
const sequelize = require("./config/db");
const routes = require("./routes");
const webhookRoutes = require("./modules/webhook/webhook.routes");
const PORT = process.env.PORT || "5000"

require('./models')

const app = express();

app.use(
  "/api/webhook",
  express.raw({ type: "application/json" }),
  webhookRoutes
);

app.use(express.json());
app.use(cors());


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use("/", routes);


(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected Successfully");

    
      await sequelize.sync({ alter: true });
      console.log(" Database synced successfully");
    
      

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error(" Database connection failed:", err.message);
    console.error("Full error:", err);
  }
})();



// PORT=5000

// DB_HOST=localhost
// DB_USER=root
// DB_PASSWORD=Mumbai@123
// DB_NAME=stripe_demo

// STRIPE_SECRET_KEY=sk_test_********************
// STRIPE_WEBHOOK_SECRET=whsec_********************


