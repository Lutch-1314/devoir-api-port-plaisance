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
      description: 'Entrez votre token JWT ici (sans "Bearer ")'
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
    url: process.env.SWAGGER_SERVER || 'http://localhost:3000',
    description: 'Serveur local ou distant',
  },
],
  },
  apis: ['./routes/api/*.js'], // On cible toutes tes routes d’API
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };