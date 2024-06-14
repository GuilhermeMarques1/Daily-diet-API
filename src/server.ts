import { env } from './env'
import { app } from './app'

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log(`App is listening on port ${env.PORT}`)
  })
