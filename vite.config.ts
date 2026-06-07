import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { sendContactEmail } from './api/_email'

/**
 * Dev-only: serve POST /api/contact locally so the contact form works under
 * `npm run dev` exactly like it does on Vercel. Production uses api/contact.ts.
 */
function contactApiDevPlugin(): Plugin {
  return {
    name: 'dev-contact-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/contact', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        let raw = ''
        req.on('data', (chunk) => (raw += chunk))
        req.on('end', async () => {
          let parsed: Record<string, string> = {}
          try {
            parsed = raw ? JSON.parse(raw) : {}
          } catch {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Invalid JSON.' }))
            return
          }

          const result = await sendContactEmail(parsed)
          res.statusCode = result.status
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(result.body))
        })
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load .env.local (and friends) into process.env so the dev middleware and
  // shared email module can read RESEND_API_KEY locally.
  const env = loadEnv(mode, process.cwd(), '')
  if (env.RESEND_API_KEY) process.env.RESEND_API_KEY = env.RESEND_API_KEY

  return {
    plugins: [react(), contactApiDevPlugin()],
  }
})
