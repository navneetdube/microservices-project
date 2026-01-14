const { Sequelize } = require("sequelize");
const config = require("./config"); 
const env = process.env.NODE_ENV || "development";

const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    logging:  false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    retry: {
      max: 5
    }
  }
);

module.exports = sequelize;
