import fp from 'fastify-plugin';
function createCompetitorsRepository(fastify) {
    const knex = fastify.knex;
    return {
        async paginate(q) {
            const offset = (q.page - 1) * q.limit;
            const query = fastify
                .knex('competitors')
                .select('*')
                .select(fastify.knex.raw('count(*) OVER() as total'));
            if (q.search) {
                query.whereILike('fullname', `%${q.search}%`)
                    .orWhereILike('phone', `%${q.search}%`)
                    .orWhereILike('email', `%${q.search}%`);
            }
            const competitors = await query
                .limit(q.limit)
                .offset(offset)
                .orderBy('created_at', q.order);
            return {
                results: competitors,
                total: competitors.length > 0 ? Number(competitors[0].total) : 0
            };
        },
        async findById(id, trx) {
            return (trx ?? knex)('competitors').where({ id }).first();
        },
        async create(newCompetitor, trx) {
            const [competitor] = await (trx ?? knex)('competitors').insert(newCompetitor).returning('*');
            return competitor;
        },
        async update(id, changes, trx) {
            const affectedRows = await (trx ?? knex)('competitors')
                .where({ id })
                .update(changes);
            if (affectedRows === 0) {
                return null;
            }
            return this.findById(id);
        },
        async delete(id) {
            const affectedRows = await knex('competitors').where({ id }).delete();
            return affectedRows > 0;
        }
    };
}
export default fp(async function (fastify) {
    const repo = createCompetitorsRepository(fastify);
    fastify.decorate('competitorsRepository', repo);
}, {
    name: 'competitors-repository',
    dependencies: ['knex']
});
