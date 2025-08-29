import awsLambdaFastify from '@fastify/aws-lambda'
import serviceApp, { options } from '../dist/app.js'
import Fastify, { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'

const app: FastifyInstance = Fastify({ logger: true, ...options as any }) as any
const handlerLambda = awsLambdaFastify(app)

export const handler = async (event, context) => {
  app.register(fp(serviceApp))
  await app.ready()
  
  return handlerLambda(event, context)
}
