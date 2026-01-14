const { Role, Module, RoleModulePermission } = require("../models");
const ROLES = require("../enums/roles.enum");
const MODULES = require("../constants/modules.constant");
const { ACTIONS } = require("../constants/actions");

module.exports = async () => {
  try {

    const roles = await Role.findAll();
    const modules = await Module.findAll();

    const roleMap = Object.fromEntries(roles.map(r => [r.name, r.id]));
    const moduleMap = Object.fromEntries(modules.map(m => [m.code, m.id]));

    const permissions = [
      // AUTH
      { role: ROLES.ADMIN, module: MODULES.AUTH, actions: [ACTIONS.READ] },
      { role: ROLES.PROCUREMENT_MANAGER, module: MODULES.AUTH, actions: [ACTIONS.READ] },
      { role: ROLES.INSPECTION_MANAGER, module: MODULES.AUTH, actions: [ACTIONS.READ] },
      { role: ROLES.CLIENT, module: MODULES.AUTH, actions: [ACTIONS.READ] },

      // USER
      { role: ROLES.ADMIN, module: MODULES.USER, actions: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE] },
      { role: ROLES.PROCUREMENT_MANAGER, module: MODULES.USER, actions: [ACTIONS.CREATE, ACTIONS.READ] },
      { role: ROLES.INSPECTION_MANAGER, module: MODULES.USER, actions: [ACTIONS.READ] },
      { role: ROLES.CLIENT, module: MODULES.USER, actions: [ACTIONS.READ] },

      // ORDER
      { role: ROLES.ADMIN, module: MODULES.ORDER, actions: [ACTIONS.READ, ACTIONS.UPDATE] },
      { role: ROLES.PROCUREMENT_MANAGER, module: MODULES.ORDER, actions: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE] },
      { role: ROLES.INSPECTION_MANAGER, module: MODULES.ORDER, actions: [ACTIONS.READ, ACTIONS.UPDATE] },
      { role: ROLES.CLIENT, module: MODULES.ORDER, actions: [ACTIONS.READ] },

      // CHECKLIST
      { role: ROLES.ADMIN, module: MODULES.CHECKLIST, actions: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE] },
      { role: ROLES.PROCUREMENT_MANAGER, module: MODULES.CHECKLIST, actions: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE] },
      { role: ROLES.INSPECTION_MANAGER, module: MODULES.CHECKLIST, actions: [ACTIONS.READ] },
      { role: ROLES.CLIENT, module: MODULES.CHECKLIST, actions: [ACTIONS.READ] },

      // ANSWER
      { role: ROLES.ADMIN, module: MODULES.ANSWER, actions: [ACTIONS.READ] },
      { role: ROLES.PROCUREMENT_MANAGER, module: MODULES.ANSWER, actions: [ACTIONS.READ] },
      { role: ROLES.INSPECTION_MANAGER, module: MODULES.ANSWER, actions: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE] },
      { role: ROLES.CLIENT, module: MODULES.ANSWER, actions: [ACTIONS.READ] }
    ];

    for (const p of permissions) {
      const exists = await RoleModulePermission.findOne({
        where: {
          roleId: roleMap[p.role],
          moduleId: moduleMap[p.module]
        }
      });

      if (!exists) {
        await RoleModulePermission.create({
          roleId: roleMap[p.role],
          moduleId: moduleMap[p.module],
          actions: p.actions
        });

      }
    }

    console.log(" Role-Module Permission seeding completed");
  } catch (error) {
    console.error(" Error seeding role-module permissions:", error.message);
    throw error;
  }
};
