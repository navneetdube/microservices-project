const bcrypt = require("bcryptjs");
const { User, Role } = require("../models");
const { where } = require("sequelize");

module.exports = async () => {
  try {

    const adminRole = await Role.findOne({
  where: { name: "ADMIN" }
})
    const exists = await User.findOne({ where: { role: "ADMIN" } });
    if (exists) {
//        await User.update(
//   { roleId: adminRole.id },
//   { where: { email: "admin@system.com" } }
// );
      console.log("Admin user already exists");
      return;
    }


if (!adminRole) {
  throw new Error("ADMIN role not found");
}


await User.create({
  name: "System Admin",
  email: "admin@system.com",
  password: await bcrypt.hash("Admin@123", 10),
  role: "ADMIN",
  roleId: adminRole.id
});


    console.log("Admin seeded successfully");
  } catch (error) {
    console.error("Error seeding admin:", error.message);
    throw error;
  }
};
