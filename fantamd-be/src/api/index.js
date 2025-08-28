import { initFastify } from '../src/server.ts'

const app = initFastify()

export default async function handler (req, res) {
  await app.ready()
  app.server.emit('request', req, res)
}
