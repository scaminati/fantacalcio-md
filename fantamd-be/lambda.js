import awsLambdaFastify from '@fastify/aws-lambda'
import init from './dist/server.js'

const app = init()
const handler = awsLambdaFastify(app)
const appIsReady = app.ready()

export const handlerLambda = async (event, context) => {
  await appIsReady
  return handler(event, context)
}