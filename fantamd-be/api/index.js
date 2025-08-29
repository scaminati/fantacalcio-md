import serviceApp, { options } from './app.js'
import Fastify from 'fastify'
import fp from 'fastify-plugin'

const app = Fastify({ logger: true, ...options })

export default async function handler (req, reply) {
  app.register(fp(serviceApp))
  await app.ready()
  app.server.emit('request', req, reply)
}
