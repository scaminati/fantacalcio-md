import { describe, expect, test, vi } from 'vitest'
import fastify from '../../test-setup.ts'
import * as mockData from '../../test-utils.ts'

describe('Auth api', () => {
  describe('POST /api/auth/login', () => {
    const method = 'POST'
    const apiPath = '/api/auth/login'
    test('Should return auth token if login success', async () => {
      vi.spyOn(fastify.usersRepository, 'findByUsername').mockReturnValueOnce(mockData.fakeUserFromDb)
      vi.spyOn(fastify.passwordManager, 'compare').mockResolvedValueOnce(true)

      const res = await fastify.inject({
        method,
        url: apiPath,
        payload: { username: mockData.username, password: mockData.password }
      })
      const data = await res.json()
      expect(res.statusCode).toBe(200)
      expect(data.token).toBeDefined()
      expect(fastify.usersRepository.findByUsername).toHaveBeenCalledExactlyOnceWith(mockData.username, expect.anything())
      expect(fastify.passwordManager.compare).toHaveBeenCalledExactlyOnceWith(mockData.password, mockData.fakeUserFromDb.password)
    })

    test('Should return 401 with invalid password', async () => {
      vi.spyOn(fastify.usersRepository, 'findByUsername').mockReturnValueOnce(mockData.fakeUserFromDb)
      vi.spyOn(fastify.passwordManager, 'compare').mockResolvedValueOnce(false)

      const res = await fastify.inject({
        method,
        url: apiPath,
        payload: { username: mockData.username, password: mockData.password }
      })
      const data = await res.json()
      expect(res.statusCode).toBe(401)
      expect(data.message).toBe('Username o password non valide.')
      expect(fastify.usersRepository.findByUsername).toHaveBeenCalledExactlyOnceWith(mockData.username, expect.anything())
      expect(fastify.passwordManager.compare).toHaveBeenCalledExactlyOnceWith(mockData.password, mockData.fakeUserFromDb.password)
    })

    test('Should return 401 with invalid username', async () => {
      vi.spyOn(fastify.usersRepository, 'findByUsername').mockReturnValueOnce(null)

      const res = await fastify.inject({
        method,
        url: apiPath,
        payload: { username: mockData.username, password: mockData.password }
      })
      const data = await res.json()
      expect(res.statusCode).toBe(401)
      expect(data.message).toBe('Username o password non valide.')
      expect(fastify.usersRepository.findByUsername).toHaveBeenCalledExactlyOnceWith(mockData.username, expect.anything())
    })
  })
})
