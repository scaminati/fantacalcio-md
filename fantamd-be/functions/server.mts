import awsLambdaFastify from '@fastify/aws-lambda'
import serviceApp from '../dist/app.js'
import Fastify from 'fastify'
import fp from 'fastify-plugin'

const app = Fastify({ logger: true })
const handlerLambda = awsLambdaFastify(app)

export const handler = async (event, context) => {
  app.register(fp(serviceApp))
  await app.ready()
  
  return handlerLambda(event, context)
}
