import { describe, expect, test, vi } from 'vitest'
import fastify from '../../test-setup.js'
import * as mockData from '../../test-utils.js'

describe('Competitors api', () => {
  describe('GET /api/competitors/', () => {
    const method = 'GET'
    const apiPath = '/api/competitors/'
    test('Should return competitors list', async () => {
      vi.spyOn(fastify.competitorsRepository, 'paginate').mockReturnValueOnce(mockData.competitorsPage)
      const query = {
        page: 1,
        limit: 10,
        order: 'desc'
      }
      const res = await fastify.inject({
        method,
        url: `${apiPath}?page=${query.page}&limit=${query.limit}`,
        headers: {
          Authorization: `Bearer ${mockData.token}`
        }
      })
      const data = await res.json()
      expect(res.statusCode).toBe(200)
      expect(data).toStrictEqual(mockData.competitorsPage)
      expect(fastify.competitorsRepository.paginate).toHaveBeenCalledExactlyOnceWith(query)
    })
    test('Should return 401 if use invalid token', async () => {
      const res = await fastify.inject({
        method,
        url: apiPath,
        headers: {
          Authorization: `Bearer ${mockData.invalidToken}`
        }
      })
      const data = await res.json()
      expect(res.statusCode).toBe(401)
      expect(data.message).toBe(mockData.authInvalid)
    })
    test('Should return 401 if not pass authorization', async () => {
      const res = await fastify.inject({
        method,
        url: apiPath
      })
      const data = await res.json()
      expect(res.statusCode).toBe(401)
      expect(data.message).toBe(mockData.authMissing)
    })
  })
  describe('GET /api/competitors/:id', () => {
    const method = 'GET'
    const apiPath = '/api/competitors/'
    test('Should return competitor', async () => {
      vi.spyOn(fastify.competitorsRepository, 'findById').mockReturnValueOnce(mockData.competitor)
      const res = await fastify.inject({
        method,
        url: `${apiPath}${mockData.competitor.id}`,
        headers: {
          Authorization: `Bearer ${mockData.token}`
        }
      })
      const data = await res.json()
      expect(res.statusCode).toBe(200)
      expect(data).toStrictEqual(mockData.competitor)
      expect(fastify.competitorsRepository.findById).toHaveBeenCalledExactlyOnceWith(mockData.competitor.id)
    })
    test('Should return 401 if use invalid token', async () => {
      const res = await fastify.inject({
        method,
        url: `${apiPath}${mockData.competitor.id}`,
        headers: {
          Authorization: `Bearer ${mockData.invalidToken}`
        }
      })
      const data = await res.json()
      expect(res.statusCode).toBe(401)
      expect(data.message).toBe(mockData.authInvalid)
    })
    test('Should return 401 if not pass authorization', async () => {
      const res = await fastify.inject({
        method,
        url: `${apiPath}${mockData.competitor.id}`
      })
      const data = await res.json()
      expect(res.statusCode).toBe(401)
      expect(data.message).toBe(mockData.authMissing)
    })
    test('Should return 404 if not found competitor', async () => {
      vi.spyOn(fastify.competitorsRepository, 'findById').mockReturnValueOnce(null)
      const notFoundId = 12345
      const res = await fastify.inject({
        method,
        url: `${apiPath}${notFoundId}`,
        headers: {
          Authorization: `Bearer ${mockData.token}`
        }
      })
      const data = await res.json()
      expect(res.statusCode).toBe(404)
      expect(data.message).toBe('Partecipante non trovato!')
      expect(fastify.competitorsRepository.findById).toHaveBeenCalledExactlyOnceWith(notFoundId)
    })
  })
  describe('POST /api/competitors/', () => {
    const method = 'POST'
    const apiPath = '/api/competitors/'
    test('Should create competitor successfully', async () => {
      vi.spyOn(fastify.competitorsRepository, 'create').mockReturnValueOnce(mockData.competitor)
      const res = await fastify.inject({
        method,
        url: `${apiPath}`,
        headers: {
          Authorization: `Bearer ${mockData.token}`
        },
        payload: mockData.competitorCreate
      })
      const data = await res.json()
      expect(res.statusCode).toBe(201)
      expect(data).toStrictEqual(mockData.competitor)
      expect(fastify.competitorsRepository.create).toHaveBeenCalledExactlyOnceWith(mockData.competitorCreate)
    })
    test('Should fail creation with invalid competitor', async () => {
      const { fullname, ...payloadWithoutRequired } = mockData.competitorCreate
      const res = await fastify.inject({
        method,
        url: `${apiPath}`,
        headers: {
          Authorization: `Bearer ${mockData.token}`
        },
        payload: payloadWithoutRequired
      })
      expect(res.statusCode).toBe(400)
    })
    test('Should return 401 if use invalid token', async () => {
      const res = await fastify.inject({
        method,
        url: `${apiPath}`,
        headers: {
          Authorization: `Bearer ${mockData.invalidToken}`
        },
        payload: mockData.competitorCreate
      })
      const data = await res.json()
      expect(res.statusCode).toBe(401)
      expect(data.message).toBe(mockData.authInvalid)
    })
    test('Should return 401 if not pass authorization', async () => {
      const res = await fastify.inject({
        method,
        url: `${apiPath}`,
        payload: mockData.competitorCreate
      })
      const data = await res.json()
      expect(res.statusCode).toBe(401)
      expect(data.message).toBe(mockData.authMissing)
    })
  })
  describe('PATCH /api/competitors/:id', () => {
    const method = 'PATCH'
    const apiPath = `/api/competitors/${mockData.competitor.id}`
    test('Should update competitor successfully', async () => {
      vi.spyOn(fastify.competitorsRepository, 'update').mockReturnValueOnce(mockData.competitor)
      const res = await fastify.inject({
        method,
        url: `${apiPath}`,
        headers: {
          Authorization: `Bearer ${mockData.token}`
        },
        payload: mockData.competitor
      })
      const data = await res.json()
      expect(res.statusCode).toBe(200)
      expect(data).toStrictEqual(mockData.competitor)
      expect(fastify.competitorsRepository.update).toHaveBeenCalledExactlyOnceWith(mockData.competitor.id, expect.anything())
    })
    test('Should return 404 if competitor not found', async () => {
      vi.spyOn(fastify.competitorsRepository, 'update').mockReturnValueOnce(null)
      const res = await fastify.inject({
        method,
        url: `${apiPath}`,
        headers: {
          Authorization: `Bearer ${mockData.token}`
        },
        payload: mockData.competitor
      })
      const data = await res.json()
      expect(res.statusCode).toBe(404)
      expect(data.message).toStrictEqual('Partecipante non trovato!')
    })
    test('Should return 401 if use invalid token', async () => {
      const res = await fastify.inject({
        method,
        url: `${apiPath}`,
        headers: {
          Authorization: `Bearer ${mockData.invalidToken}`
        },
        payload: mockData.competitor
      })
      const data = await res.json()
      expect(res.statusCode).toBe(401)
      expect(data.message).toBe(mockData.authInvalid)
    })
    test('Should return 401 if not pass authorization', async () => {
      const res = await fastify.inject({
        method,
        url: `${apiPath}`,
        payload: mockData.competitor
      })
      const data = await res.json()
      expect(res.statusCode).toBe(401)
      expect(data.message).toBe(mockData.authMissing)
    })
  })
  describe('DELETE /api/competitors/:id', () => {
    const method = 'DELETE'
    const apiPath = `/api/competitors/${mockData.competitor.id}`
    test('Should delete competitor successfully', async () => {
      vi.spyOn(fastify.competitorsRepository, 'delete').mockReturnValueOnce(mockData.competitor)
      const res = await fastify.inject({
        method,
        url: `${apiPath}`,
        headers: {
          Authorization: `Bearer ${mockData.token}`
        },
        payload: mockData.competitor
      })
      const data = await res.json()
      expect(res.statusCode).toBe(200)
      expect(data).toStrictEqual({ id: mockData.competitor.id })
      expect(fastify.competitorsRepository.delete).toHaveBeenCalledExactlyOnceWith(mockData.competitor.id)
    })
    test('Should return 404 if competitor not found', async () => {
      vi.spyOn(fastify.competitorsRepository, 'delete').mockReturnValueOnce(null)
      const res = await fastify.inject({
        method,
        url: `${apiPath}`,
        headers: {
          Authorization: `Bearer ${mockData.token}`
        },
        payload: mockData.competitor
      })
      const data = await res.json()
      expect(res.statusCode).toBe(404)
      expect(data.message).toStrictEqual('Partecipante non trovato!')
    })
    test('Should return 401 if use invalid token', async () => {
      const res = await fastify.inject({
        method,
        url: `${apiPath}`,
        headers: {
          Authorization: `Bearer ${mockData.invalidToken}`
        },
        payload: mockData.competitor
      })
      const data = await res.json()
      expect(res.statusCode).toBe(401)
      expect(data.message).toBe(mockData.authInvalid)
    })
    test('Should return 401 if not pass authorization', async () => {
      const res = await fastify.inject({
        method,
        url: `${apiPath}`,
        payload: mockData.competitor
      })
      const data = await res.json()
      expect(res.statusCode).toBe(401)
      expect(data.message).toBe(mockData.authMissing)
    })
  })
})
