import awsLambdaFastify from '@fastify/aws-lambda'
import serviceApp from '../dist/app.js'
import fastify from 'fastify'

const app = fastify({ logger: true })
const handlerLambda = awsLambdaFastify(app)

export const handler = async (event, context) => {
  app.register(fp(serviceApp))
  await app.ready()
  
  return handlerLambda(event, context)
}
