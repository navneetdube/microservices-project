const seedAdmin = require("./admin.seed");
const seedModules = require("./modules.seed");
const seedRoles = require("./roles.seed");
const seedRoleModulePermissions = require("./roleModulePermission.seed");

module.exports = async () => {
  await seedAdmin();
    await seedRoles();
  await seedModules();
  await seedRoleModulePermissions();

    console.log("All seeders executed successfully");
};
