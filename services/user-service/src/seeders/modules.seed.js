const { Module } = require("../models");
const MODULES = require("../constants/modules.constant");

module.exports = async () => {
  try {
    for (const key of Object.keys(MODULES)) {
      const name = MODULES[key];

      const exists = await Module.findOne({
        where: { code: key }
      });

      if (!exists) {
        await Module.create({
          name,
          code: key
        });

        console.log(`Module "${name}" seeded`);
      } else {
        console.log(`Module "${name}" already exists, skipping`);
      }
    }

    console.log("Module seeding completed");
  } catch (error) {
    console.error("Error seeding modules:", error.message);
    throw error;
  }
};
