import awsLambdaFastify from '@fastify/aws-lambda'
import init from './server'

const app = init()
const handler = awsLambdaFastify(app)
const appIsReady = app.ready()

module.exports.handler = async (event, context) => {
  await appIsReady
  return handler(event, context)
}
