import awsLambdaFastify from '@fastify/aws-lambda'
import init from './server.js'
const app = init()
export const handler = awsLambdaFastify(app, {
  decorateRequest: false
})
