// src/docs/swagger.ts
import { Express } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { OpenAPIV3 } from 'openapi-types';

export const setupSwagger = (app: Express, port = 3000) => {
  const swaggerDefinition: OpenAPIV3.Document = {
    openapi: '3.0.0',
    info: {
      title: 'Inventory Sync Service API',
      version: '1.0.0',
      description: 'REST API for inventory tracking and sync jobs',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
      },
    ],
    paths: {},
  };

  const options: { definition: OpenAPIV3.Document; apis: string[] } = {
    definition: swaggerDefinition,
    apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
  };

  const swaggerSpec = swaggerJsdoc(options);

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
