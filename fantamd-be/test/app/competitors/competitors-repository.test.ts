import { describe } from 'node:test'
import { afterAll, beforeAll, expect, test } from 'vitest'
import fastify from '../../test-setup.ts'
import * as mockData from '../../test-utils.ts'

beforeAll(async () => {
  await fastify.knex('competitors').insert(mockData.competitorCreate)
})

afterAll(async () => {
  await fastify.knex('competitors').truncate()
})

describe('Competitors repository tests', () => {
  describe('Competitors repository paginate method', () => {
    test('Get competitor first page without query', async () => {
      const page = await fastify.competitorsRepository.paginate({
        page: 1,
        limit: 10,
        search: ''
      })
      expect(page.results).toEqual([expect.objectContaining(mockData.competitorCreate)])
      expect(page.total).toBe(1)
    })
    test('Get competitor first page with query', async () => {
      const page = await fastify.competitorsRepository.paginate({
        page: 1,
        limit: 10,
        search: mockData.competitorCreate.fullname
      })
      expect(page.results).toEqual([expect.objectContaining(mockData.competitorCreate)])
      expect(page.total).toBe(1)
    })
    test('Get competitor empty first page with wrong query', async () => {
      const page = await fastify.competitorsRepository.paginate({
        page: 1,
        limit: 10,
        search: 'wrong-query'
      })
      expect(page.results).toStrictEqual([])
      expect(page.total).toBe(0)
    })
  })
  describe('Competitors repository findById method', () => {
    test('Get competitor by id', async () => {
      const competitor = await fastify.competitorsRepository.findById(1)
      expect(competitor).toEqual(expect.objectContaining(mockData.competitorCreate))
    })
    test('Return undefined if competitor not found', async () => {
      const competitor = await fastify.competitorsRepository.findById(100)
      expect(competitor).toBeUndefined()
    })
  })
  describe('Competitors repository create method', () => {
    test('Create new competitor successfully', async () => {
      const competitor = await fastify.competitorsRepository.create(mockData.competitorCreate)
      expect(competitor).toEqual(expect.objectContaining(mockData.competitorCreate))
    })
    test('Thrown error if insert invalid competitor', async () => {
      const { fullname, ...invalidCompetitorCreate } = mockData.competitorCreate
      const createPromise = fastify.competitorsRepository.create(invalidCompetitorCreate)
      expect(createPromise).rejects.toThrow('null value in column "fullname" of relation "competitors" violates not-null constraint')
    })
  })
  describe('Competitors repository update method', () => {
    test('Update competitor successfully', async () => {
      const updatedName = 'Mario Rossi'
      const updatedCompetitorCreate = {
        ...mockData.competitorCreate,
        fullname: updatedName
      }
      const competitor = await fastify.competitorsRepository.update(2, updatedCompetitorCreate)
      expect(competitor).toEqual(expect.objectContaining(updatedCompetitorCreate))
      expect(competitor.fullname).toEqual(updatedName)
    })
    test('Return null if trying to update a non-existing competitor', async () => {
      const competitor = await fastify.competitorsRepository.update(100, mockData.competitorCreate)
      expect(competitor).toBeNull()
    })
  })
  describe('Competitors repository delete method', () => {
    test('Delete competitor successfully', async () => {
      const deleted = await fastify.competitorsRepository.delete(2)
      expect(deleted).toBeTruthy()
    })
    test('Return false if competitor has already deleted or does not exist', async () => {
      const deleted = await fastify.competitorsRepository.delete(2)
      expect(deleted).toBeFalsy()
    })
  })
})
