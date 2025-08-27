import { initFastify } from '../src/server.js'

export default async function handler (req, res) {
  const app = await initFastify()
  app.server.emit('request', req, res)
}
