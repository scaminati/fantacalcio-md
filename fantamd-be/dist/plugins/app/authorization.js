import fp from 'fastify-plugin';
async function verifyAccess(request, reply) {
    await request.jwtVerify();
}
export default fp(async function (fastify) {
    fastify.decorate('verifyAccess', verifyAccess);
}, { name: 'authorization' });
