import fp from 'fastify-plugin';
import knex from 'knex';
export const autoConfig = (fastify) => {
    return {
        client: 'pg',
        connection: {
            host: fastify.config.DB_HOST,
            user: fastify.config.DB_USER,
            password: fastify.config.DB_PASSWORD,
            database: fastify.config.DB_DATABASE,
            port: Number(fastify.config.DB_PORT)
        },
        pool: { min: 2, max: 10 }
    };
};
export default fp(async (fastify, opts) => {
    fastify.decorate('knex', knex(opts));
    fastify.addHook('onClose', async (instance) => {
        await instance.knex.destroy();
    });
}, { name: 'knex' });
