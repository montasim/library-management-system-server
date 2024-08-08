import swaggerJsdoc from 'swagger-jsdoc';
import configuration from './src/configuration/configuration.js';
import toSentenceCase from './src/utilities/toSentenceCase.js';
import fs from 'fs'; // Import the fs module to write to a file

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Library Management System Server',
        version: '1.0.0',
        description:
            'This Library Management System Server is a robust backend API developed using Express, designed to facilitate comprehensive management of library operations. It supports a wide range of features from user authentication and book management to permission controls and user profile management. The system ensures data integrity and security using bearer token authentication, making it ideal for educational institutions, public libraries, and private collections.',
    },
    servers: [
        {
            url: `http://localhost:${configuration.port}/api/${configuration.version}`,
            description: 'Development server',
            variables: {
                version: {
                    default: configuration.version,
                },
            },
        },
        {
            url: `http://stg.example.com/api/${configuration.version}`,
            description: 'Staging server',
            variables: {
                version: {
                    default: configuration.version,
                },
            },
        },
        {
            url: `https://library-management-system-server-green.vercel.app/api/${configuration.version}`,
            description: 'Production server',
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
