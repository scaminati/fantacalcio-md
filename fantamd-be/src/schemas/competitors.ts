import { Static, Type } from '@sinclair/typebox'
import { DateTimeSchema, EmailSchema, IdSchema, StringSchema } from './common.js'

export interface Competitor extends Static<typeof CompetitorSchema> {}

export interface CompetitorsQuery extends Static<typeof QueryCompetitorsSchema> {}
export interface SaveCompetitor extends Static<typeof SaveCompetitorsSchema> {}

export const CompetitorSchema = Type.Object({
  id: IdSchema,
  fullname: StringSchema,
  phone: StringSchema,
  email: EmailSchema,
  paid: StringSchema,
  added_into_app: Type.Boolean(),
  created_at: DateTimeSchema
})

export const SaveCompetitorsSchema = Type.Object({
  fullname: StringSchema,
  phone: StringSchema,
  email: EmailSchema,
  paid: Type.Optional(StringSchema),
  added_into_app: Type.Boolean()
})

export const QueryCompetitorsSchema = Type.Object({
  page: Type.Integer({ minimum: 1, default: 1 }),
  limit: Type.Integer({ minimum: 1, maximum: 100, default: 10 }),
  order: Type.Optional(Type.Union([
    Type.Literal('asc'),
    Type.Literal('desc')
  ], { default: 'desc' }))
})

export const ComeptitorsPageSchema = Type.Object({
  total: Type.Integer({ minimum: 0, default: 0 }),
  results: Type.Array(CompetitorSchema)
})
