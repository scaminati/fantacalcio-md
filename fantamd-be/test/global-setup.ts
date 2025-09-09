import { PostgreSqlContainer } from '@testcontainers/postgresql'
import knex, { Knex } from 'knex'

async function initDatabase () {
  const kn: Knex = knex({
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: Number(process.env.DB_PORT)
    },
    pool: { min: 0, max: 4 }
  })

  await kn.schema.createTable('competitors', function (table) {
    table.increments('id').primary()
    table.string('fullname', 50).notNullable()
    table.string('phone', 20).notNullable()
    table.string('email', 50).notNullable()
    table.text('paid')
    table.boolean('added_into_app').notNullable().defaultTo(false)
    table.timestamp('created_at').defaultTo(kn.fn.now())
  })

  await kn.schema.createTable('users', function (table) {
    table.increments('id').primary()
    table.string('username', 50).notNullable()
    table.text('password').notNullable()
  })
}

export default async function setup () {
  console.log('setup: setting up postgres container')
  const pgContainer = await new PostgreSqlContainer('postgres:15-alpine')
    .withDatabase(process.env.DB_DATABASE || '')
    .start()
  process.env.DB_HOST = pgContainer.getHost()
  process.env.DB_PORT = pgContainer.getPort().toString()
  process.env.DB_USER = pgContainer.getUsername()
  process.env.DB_PASSWORD = pgContainer.getPassword()

  await initDatabase()

  // return the teardown function to clean up
  return async function teardown () {
    console.log('*** teardown -- stopping postgres container')
    await pgContainer.stop().then(() => console.log('*** teardown -- container stopped'))
  }
}
