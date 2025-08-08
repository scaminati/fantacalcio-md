import {
  FastifyPluginAsyncTypebox,
  Type
} from '@fastify/type-provider-typebox'
import { ComeptitorsPageSchema, CompetitorSchema, QueryCompetitorsSchema, SaveCompetitorsSchema } from '../../../schemas/competitors.js'

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { competitorsRepository } = fastify

  fastify.get(
    '/',
    {
      schema: {
        querystring: QueryCompetitorsSchema,
        response: {
          200: ComeptitorsPageSchema
        },
        security: [{ bearerAuth: [] }],
        tags: ['Competitors']
      },
      preHandler: fastify.auth([fastify.verifyAccess])

    },
    async function (request) {
      return competitorsRepository.paginate(request.query)
    }
  )

  fastify.get(
    '/:id',
    {
      schema: {
        params: Type.Object({
          id: Type.Number()
        }),
        response: {
          200: CompetitorSchema,
          404: Type.Object({ message: Type.String() })
        },
        security: [{ bearerAuth: [] }],
        tags: ['Competitors']
      },
      preHandler: fastify.auth([fastify.verifyAccess])
    },
    async function (request, reply) {
      const { id } = request.params
      const competitor = await competitorsRepository.findById(id)

      if (!competitor) {
        return reply.notFound('Competitor not found')
      }

      return competitor
    }
  )

  fastify.post(
    '/',
    {
      schema: {
        body: SaveCompetitorsSchema,
        response: {
          201: CompetitorSchema
        },
        security: [{ bearerAuth: [] }],
        tags: ['Competitors']
      },
      preHandler: fastify.auth([fastify.verifyAccess])
    },
    async function (request, reply) {
      const createdCompetitor = await competitorsRepository.create(request.body)
      reply.code(201)
      return createdCompetitor
    }
  )

  fastify.patch(
    '/:id',
    {
      schema: {
        params: Type.Object({
          id: Type.Number()
        }),
        body: SaveCompetitorsSchema,
        response: {
          200: CompetitorSchema,
          404: Type.Object({ message: Type.String() })
        },
        security: [{ bearerAuth: [] }],
        tags: ['Competitors']
      },
      preHandler: fastify.auth([fastify.verifyAccess])
    },
    async function (request, reply) {
      const { id } = request.params
      const updatedCompetitor = await competitorsRepository.update(id, request.body)

      if (!updatedCompetitor) {
        return reply.notFound('Competitor not found')
      }

      return updatedCompetitor
    }
  )

  fastify.delete(
    '/:id',
    {
      schema: {
        params: Type.Object({
          id: Type.Number()
        }),
        response: {
          204: Type.Null(),
          404: Type.Object({ message: Type.String() })
        },
        security: [{ bearerAuth: [] }],
        tags: ['Competitors']
      },
      preHandler: fastify.auth([fastify.verifyAccess])
    },
    async function (request, reply) {
      const deleted = await competitorsRepository.delete(request.params.id)
      if (!deleted) {
        return reply.notFound('Competitor not found')
      }

      return reply.code(204).send(null)
    }
  )
}

export default plugin
