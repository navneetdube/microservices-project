
const express = require("express");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerDoc = require("./docs/swagger");
const routes = require("./routes");
const sequelize = require("./config/db");
 require("./models");
//  const seedAdmin = require("./seeders/admin.seed");
//  const seedModules = require("./seeders/modules.seed");
//  const seedRoles = require("./seeders/roles.seed");
//   const seedRoleModulePermissions = require("./seeders/roleModulePermission.seed");
const PORT = 3000;

const app = express();

app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use("/", routes);


(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected Successfully");

    
      await sequelize.sync({ alter: false });
      console.log(" Database synced successfully");
    
      // await seedAdmin();
      // await seedModules();
      // await seedRoles();
      // await seedRoleModulePermissions();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error(" Database connection failed:", err.message);
    console.error("Full error:", err);
  }
})();


