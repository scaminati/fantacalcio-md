import { describe, expect, test } from 'vitest'
import fastify from '../test-setup.ts'

describe('GET /', () => {
  test('Should return status OK with message', async () => {
    const res = await fastify.inject({
      url: '/'
    })
    const data = await res.json()

    expect(res.statusCode).toBe(200)
    expect(data.message).toBe('FantaMD server started!')
  })
})
