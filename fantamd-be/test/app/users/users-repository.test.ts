import { describe } from 'node:test'
import { afterAll, beforeAll, expect, test } from 'vitest'
import fastify from '../../test-setup.ts'
import * as mockData from '../../test-utils.ts'

beforeAll(async () => {
  await fastify.knex('users').insert(mockData.adminUser)
})

afterAll(async () => {
  await fastify.knex('users').truncate()
})

describe('User repository tests', () => {
  test('Find user by username successfully', async () => {
    const user = await fastify.usersRepository.findByUsername('admin')
    expect(user).toEqual(expect.objectContaining(mockData.adminUser))
  })

  test('Not found user with wrong username', async () => {
    const user = await fastify.usersRepository.findByUsername('wrong-user')
    expect(user).toBeUndefined()
  })
})
