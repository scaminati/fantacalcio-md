import { initFastify } from './server.js'

async function standalone () {
  const app = await initFastify()

  try {
    // Start listening.
    await app.listen({
      host: process.env.HOST ?? '127.0.0.1',
      port: Number(process.env.PORT ?? 8080)
    })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

standalone()
