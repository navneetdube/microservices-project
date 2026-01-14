const { Role } = require("../models");
const ROLES = require("../enums/roles.enum");

module.exports = async () => {
  try {
    for (const name of Object.values(ROLES)) {
      const exists = await Role.findOne({ where: { name } });

      if (!exists) {
        await Role.create({ name });
        console.log(`Role "${name}" seeded`);
      } else {
        console.log(`Role "${name}" already exists`);
      }
    }
  } catch (error) {
    console.error("Error seeding roles:", error.message);
    throw error;
  }
};
