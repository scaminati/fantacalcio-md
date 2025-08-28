import jwtPlugin from '@fastify/jwt';
import fp from 'fastify-plugin';
export default fp(async (fastify) => {
    fastify.register(jwtPlugin, {
        secret: fastify.config.JWT_SECRET
    });
}, {
    name: 'jwt'
});
