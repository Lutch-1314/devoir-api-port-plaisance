// swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API du Port de Plaisance Russell',
      version: '1.0.0',
      description: 'Documentation Swagger de l’API du port de plaisance Russell',
    },
    components: {
  securitySchemes: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
  },
},
security: [
  {
    bearerAuth: [],
  },
],

    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Serveur local',
      },
    ],
  },
  apis: ['./routes/api/*.js'], // On cible toutes tes routes d’API
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };