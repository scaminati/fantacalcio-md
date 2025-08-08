import { FastifyInstance } from 'fastify'
import { Knex } from 'knex'
import fp from 'fastify-plugin'
import { Competitor, CompetitorsQuery, SaveCompetitor } from '../../../schemas/competitors.js'

declare module 'fastify' {
  interface FastifyInstance {
    competitorsRepository: ReturnType<typeof createCompetitorsRepository>;
  }
}

function createCompetitorsRepository (fastify: FastifyInstance) {
  const knex = fastify.knex

  return {
    async paginate (q: CompetitorsQuery) {
      const offset = (q.page - 1) * q.limit

      const query = fastify
        .knex<Competitor & { total: number }>('competitors')
        .select('*')
        .select(fastify.knex.raw('count(*) OVER() as total'))

      if (q.search) {
        query.whereILike('fullname', `%${q.search}%`)
          .orWhereILike('phone', `%${q.search}%`)
          .orWhereILike('email', `%${q.search}%`)
      }

      const competitors = await query
        .limit(q.limit)
        .offset(offset)
        .orderBy('created_at', q.order)

      return {
        results: competitors,
        total: competitors.length > 0 ? Number(competitors[0].total) : 0
      }
    },

    async findById (id: number, trx?: Knex) {
      return (trx ?? knex)<Competitor>('competitors').where({ id }).first()
    },

    async create (newCompetitor: SaveCompetitor, trx?: Knex) {
      const [competitor] = await (trx ?? knex)<Competitor>('competitors').insert(newCompetitor).returning('*')
      return competitor
    },

    async update (id: number, changes: SaveCompetitor, trx?: Knex) {
      const affectedRows = await (trx ?? knex)('competitors')
        .where({ id })
        .update(changes)

      if (affectedRows === 0) {
        return null
      }

      return this.findById(id)
    },

    async delete (id: number) {
      const affectedRows = await knex<Competitor>('competitors').where({ id }).delete()

      return affectedRows > 0
    }
  }
}

export default fp(
  async function (fastify: FastifyInstance) {
    const repo = createCompetitorsRepository(fastify)
    fastify.decorate('competitorsRepository', repo)
  },
  {
    name: 'competitors-repository',
    dependencies: ['knex']
  }
)
