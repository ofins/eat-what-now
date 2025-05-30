import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { zodToJsonSchema } from 'zod-to-json-schema';
import {
  createUserSchema,
  userFilterOptionsSchema,
  userSchema,
} from './db/users/users.schema';

// Users
const userSchemaJson = zodToJsonSchema(userSchema);
const userFilterOptionsSchemaJson = zodToJsonSchema(userFilterOptionsSchema);
const createUserSchemaJson = zodToJsonSchema(createUserSchema);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EatWhatNow API',
      version: '1.0.0',
      description: 'Backend API documentation',
    },
    components: {
      schemas: {
        UserSchema: userSchemaJson,
        UserFilterOptionsSchema: userFilterOptionsSchemaJson,
        CreateUserSchema: createUserSchemaJson,
      },
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-signature',
        },
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ ApiKeyAuth: [] }, { BearerAuth: [] }],
  },
  apis: ['src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
export const swaggerUiHandler = swaggerUi.serve;
export const swaggerUiSetup = swaggerUi.setup(
  swaggerSpec,
  undefined, // SwaggerUiOptions
  { persistAuthorization: true } // SwaggerOptions
);
