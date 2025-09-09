import Fastify from 'fastify'
import fp from 'fastify-plugin'
import { beforeAll, afterAll } from 'vitest'
import serviceApp, { options } from '../src/app'

function buildFastify () {
  const app = Fastify({ logger: true, ...options as any })
  app.register(fp(serviceApp))
  return app
}

const fastify: any = buildFastify()

beforeAll(async () => {
  // called once before all tests run
  await fastify.ready()
})

afterAll(async () => {
  // called once after all tests run
  await fastify.close()
})

export default fastify
