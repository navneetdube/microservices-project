const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Procurement Management API",
      version: "1.0.0",
      description: "Auto-generated Swagger from Express routes"
    },
    servers: [
      {
        url: "http://localhost:3000"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    }
  },


  apis: [
    "./src/modules/**/*.routes.js" 
  ]
};

module.exports = swaggerJsdoc(options);
