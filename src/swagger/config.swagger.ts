export const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.3",
    info: {
      title: "Reigenieria basic CRUD",
      version: "0.0.0",
      description: `
            Backend Service for Reigenieria project
          `,
      contact: {
        name: "CT",
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: {
      bearerAuth: [],
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Localhost App server",
      }
    ],
  },
  basePath: "/",
  apis: [
    "./src/controller/*.ts",
  ]
}
  