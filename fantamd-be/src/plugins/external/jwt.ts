import jwtPlugin from '@fastify/jwt'
import fp from 'fastify-plugin'

/**
 * This plugins enables the use of jwt.
 *
 * @see {@link https://github.com/fastify/fastify-jwt}
 */
export default fp(async (fastify) => {
  fastify.register(jwtPlugin, {
    secret: fastify.config.JWT_SECRET
  })
}, {
  name: 'jwt'
})
