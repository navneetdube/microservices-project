const { User, Role} = require("../../models");

exports.findByEmail = (email) => {
  return User.findOne({ where: { email }, 
      });
};

exports.findByMobile = (mobile) => {
  return User.findOne({ where: { mobile } });
};

exports.create = (data, transaction) => {
  return User.create(data, { transaction });
};

exports.findRoleIdByName = async (roleName) => {
 const role = await Role.findOne({ where: { name: roleName } });
  return role ? role.id : null;
}
