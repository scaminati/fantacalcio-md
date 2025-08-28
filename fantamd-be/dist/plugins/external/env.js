import env from '@fastify/env';
const schema = {
    type: 'object',
    required: [
        'DB_HOST',
        'DB_PORT',
        'DB_USER',
        'DB_PASSWORD',
        'DB_DATABASE',
        'JWT_SECRET'
    ],
    properties: {
        DB_HOST: {
            type: 'string',
            default: 'localhost'
        },
        DB_PORT: {
            type: 'number',
            default: 5432
        },
        DB_USER: {
            type: 'string'
        },
        DB_PASSWORD: {
            type: 'string'
        },
        DB_DATABASE: {
            type: 'string'
        },
        JWT_SECRET: {
            type: 'string'
        },
        RATE_LIMIT_MAX: {
            type: 'number',
            default: 100
        }
    }
};
export const autoConfig = {
    confKey: 'config',
    schema,
    dotenv: true,
    data: process.env
};
export default env;
