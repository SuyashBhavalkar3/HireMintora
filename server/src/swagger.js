/**
 * @file swagger.js
 * @description Swagger/OpenAPI 3.0 configuration for auto-generated REST API docs.
 *
 * The Swagger UI is served at `/api-docs` and is auto-populated from JSDoc
 * annotations in the route files (see `apis` glob below).
 *
 * Authentication: All protected endpoints require a Bearer JWT token.
 * The `securitySchemes` section below configures the "Authorize" button in the UI.
 */

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HireMintora API',
      version: '1.0.0',
      description: 'API documentation for HireMintora',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
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
  },
  apis: ['./src/**/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
