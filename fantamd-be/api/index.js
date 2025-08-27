import { initFastify } from '../src/server.js'

const app = await initFastify()

export default async function handler (req, res) {
  await app.ready()
  app.server.emit('request', req, res)
}
