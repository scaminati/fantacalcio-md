import authPlugin from '@fastify/auth';
import fp from 'fastify-plugin';
export default fp(async (fastify) => {
    fastify.register(authPlugin);
}, {
    name: 'auth'
});
