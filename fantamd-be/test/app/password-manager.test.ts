import fastify from '../test-setup.ts'
import { expect, test } from 'vitest'

test('Password manager tests', async () => {
  const password = 'test_password'
  const hash = await fastify.passwordManager.hash(password)
  expect(hash).toBeTypeOf('string')

  const validResult = await fastify.passwordManager.compare(password, hash)
  expect(validResult).toBeTruthy()

  const invalidPassword = await fastify.passwordManager.compare('wrong_password', hash)
  await expect(invalidPassword).toBeFalsy()

  const invalidHashPromise = fastify.passwordManager.compare(password, 'malformed_hash')
  await expect(invalidHashPromise).rejects.toThrowError()
})
