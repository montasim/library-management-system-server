import swaggerJsdoc from 'swagger-jsdoc';
import configuration from './src/configuration/configuration.js';
import toSentenceCase from './src/utilities/toSentenceCase.js';
import fs from 'fs'; // Import the fs module to write to a file

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Express API for My Application',
        version: '1.0.0',
        description: 'This is the swagger doc for the API',
    },
    servers: [
        {
            url: `http://localhost:${configuration.port}/api/${configuration.version}`,
            description: `${toSentenceCase(configuration.env)} server`,
            variables: {
                version: {
                    default: configuration.version,
                },
            },
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: ['./src/**/*.routes.js', './src/**/routes.js'], // paths to files containing OpenAPI definitions
};

const swaggerSpec = swaggerJsdoc(options);

// Write the Swagger specification to a JSON file
fs.writeFileSync(
    './src/modules/api/documentation/api/swagger.json',
    JSON.stringify(swaggerSpec, null, 2),
    'utf8'
);

export default swaggerSpec;
