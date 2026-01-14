const bcrypt = require("bcryptjs");
const { User } = require("../models");

module.exports = async () => {
  try {
    const exists = await User.findOne({ where: { role: "ADMIN" } });
    if (exists) {
      console.log("Admin user already exists");
      return;
    }

    await User.create({
      name: "System Admin",
      email: "admin@system.com",
      password: await bcrypt.hash("Admin@123", 10),
      role: "ADMIN"
    });

    console.log("Admin seeded successfully");
  } catch (error) {
    console.error("Error seeding admin:", error.message);
    throw error;
  }
};
