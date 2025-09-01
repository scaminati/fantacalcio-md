import {
  FastifyPluginAsyncTypebox,
  Type
} from '@fastify/type-provider-typebox'
import { CredentialsSchema } from '../../../schemas/auth.js'

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { usersRepository, passwordManager } = fastify
  fastify.post(
    '/login',
    {
      schema: {
        body: CredentialsSchema,
        response: {
          200: Type.Object({
            token: Type.String()
          }),
          401: Type.Object({
            message: Type.String()
          })
        },
        tags: ['Authentication']
      }
    },
    async function (request, reply) {
      const { username, password } = request.body

      return fastify.knex.transaction(async (trx) => {
        const user = await usersRepository.findByUsername(username, trx)

        if (user) {
          const isPasswordValid = await passwordManager.compare(
            password,
            user.password
          )
          if (isPasswordValid) {
            const { password, ...jwtUser } = user // exclude password from jwt
            return { token: fastify.jwt.sign({ user: jwtUser }) }
          }
        }

        reply.status(401)

        return { message: 'Username o password non valide.' }
      })
    }
  )
}

export default plugin
