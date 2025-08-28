import fp from 'fastify-plugin';
function createUsersRepository(fastify) {
    const knex = fastify.knex;
    return {
        async findByUsername(username, trx) {
            const user = await (trx ?? knex)('users')
                .select('id', 'username', 'password')
                .where({ username })
                .first();
            return user;
        }
    };
}
export default fp(async function (fastify) {
    const repo = createUsersRepository(fastify);
    fastify.decorate('usersRepository', repo);
}, {
    name: 'users-repository',
    dependencies: ['knex']
});
