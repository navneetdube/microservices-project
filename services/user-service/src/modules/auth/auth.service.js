const sequelize = require("../../config/db");
const repo = require("./auth.repository");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { ROLES } = require("../../enums");
const ERROR_CODES = require('../../constants/errorCodes')

exports.login = async ({ email, mobile, password, role }) => {
  try {
    const user = email
      ? await repo.findByEmail(email)
      : await repo.findByMobile(mobile);
    console.log("🚀 ~ user:", user)


    if (!user) throw new Error("User not found");

    // Validate that user's role matches the requested role
    if (user.role !== role) {
      throw new Error(`User does not have ${role} role. User role is ${user.role}`);
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Invalid credentials");

    const token = jwt.sign(
      { id: user.id, role: user.role, roleId: user.roleId },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    return { token };
  } catch (err) {
    throw err;
  }
};



