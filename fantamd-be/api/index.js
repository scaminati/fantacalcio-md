import serviceApp, { options } from '../dist/app.js'
import Fastify from 'fastify'
import fp from 'fastify-plugin'

const app = Fastify({ logger: true, ...options })
app.register(fp(serviceApp))

export default async function handler (req, reply) {
  await app.ready()
  app.server.emit('request', req, reply)
}
