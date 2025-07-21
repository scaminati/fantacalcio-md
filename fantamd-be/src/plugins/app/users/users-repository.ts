import { FastifyInstance } from 'fastify'
import { Knex } from 'knex'
import fp from 'fastify-plugin'
import { Auth } from '../../../schemas/auth.js'

declare module 'fastify' {
  interface FastifyInstance {
    usersRepository: ReturnType<typeof createUsersRepository>;
  }
}

function createUsersRepository (fastify: FastifyInstance) {
  const knex = fastify.knex

  return {
    async findByUsername (username: string, trx?: Knex) {
      const user: Auth & { password: string } = await (trx ?? knex)('users')
        .select('id', 'username', 'password')
        .where({ username })
        .first()

      return user
    }
  }
}

export default fp(
  async function (fastify: FastifyInstance) {
    const repo = createUsersRepository(fastify)
    fastify.decorate('usersRepository', repo)
  },
  {
    name: 'users-repository',
    dependencies: ['knex']
  }
)
