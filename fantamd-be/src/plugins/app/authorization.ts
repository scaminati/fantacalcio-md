import fp from 'fastify-plugin'
import { FastifyReply, FastifyRequest } from 'fastify'

declare module 'fastify' {
  export interface FastifyInstance {
    verifyAccess: typeof verifyAccess
  }
}

async function verifyAccess (request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify()
}

/**
 * The use of fastify-plugin is required to be able
 * to export the decorators to the outer scope
 *
 * @see {@link https://github.com/fastify/fastify-plugin}
 */
export default fp(
  async function (fastify) {
    fastify.decorate('verifyAccess', verifyAccess)
  },
  // You should name your plugins if you want to avoid name collisions
  // and/or to perform dependency checks.
  { name: 'authorization' }
)
