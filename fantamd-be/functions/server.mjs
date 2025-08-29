import awsLambdaFastify from '@fastify/aws-lambda'
import init from '../dist/server.js'

const app = init()
const handlerLambda = awsLambdaFastify(app)
const appIsReady = app.ready()

export const handler = async (event, context) => {
  await appIsReady
  return handlerLambda(event, context)
}
