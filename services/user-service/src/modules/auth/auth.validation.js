const { body } = require("express-validator");
const { ROLES } = require("../../enums");


exports.login = [
  body("password")
    .notEmpty()
    .withMessage("Password is required"),

  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(Object.values(ROLES))
    .withMessage(`Invalid role. Allowed roles: ${Object.values(ROLES).join(", ")}`),

  body().custom((body) => {
    const { role, email, mobile } = body;

    if (role === ROLES.INSPECTION_MANAGER) {
      if (!mobile) {
        throw new Error("Mobile number is required for Inspection Manager login");
      }
      if (email) {
        throw new Error("Inspection Manager can only login with mobile number");
      }
      return true;
    }

    // For other roles, email is required
    if (!email) {
      throw new Error("Email is required for login");
    }
    if (mobile) {
      throw new Error(`Only mobile login is allowed for ${role}`);
    }
    return true;
  }),

  body("email")
    .if(() => false) // Skip standard email validation, handled in custom validator
    .isEmail()
    .normalizeEmail(),

  body("mobile")
    .if(() => false) // Skip standard mobile validation, handled in custom validator
    .isMobilePhone("en-IN")
];