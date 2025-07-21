import authPlugin from '@fastify/auth'
import fp from 'fastify-plugin'

/**
 * This plugins enables the use of auth plugin.
 *
 * @see {@link https://github.com/fastify/fastify-auth}
 */
export default fp(async (fastify) => {
  fastify.register(authPlugin)
}, {
  name: 'auth'
})
