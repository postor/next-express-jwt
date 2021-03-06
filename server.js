const Server = require('http').Server
const express = require('express')
const next = require('next')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const jwt = require('./dist/server').default({
  "secret": "test-secret"
})

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare()
  .then(() => {
    const server = express()

    // use cookie parser before jwt parser
    server.use(cookieParser())
    // use parser before your api and next handle
    server.use(jwt.parser())
    // your own login logic
    server.post('/api/login', bodyParser.json(), (req, res) => {
      const { user, pass } = req.body
      const success = (user == 'test' && pass == '123')
      if (success) {
        jwt.sign({ username: user }).then((token) => {
          res.json({
            token,
          })
        }).catch((error) => res.json({
          error,
        }))
      } else {
        res.json({
          error: 'login fail'
        })
      }
    })

    //use guard to prevent anonymous call
    server.get('/api/authed', jwt.guard(), async (req, res) => {
      //after jwt.parser you can get user through req.getUser (req[config.parserMethodName] if not default config)
      const user = await req.getUser()
      res.json({ user })
    })

    const noneAnonymousRoutes = ['/about']
    server.get('*', async (req, res) => {
      if (!noneAnonymousRoutes.includes(req.url)) return handle(req, res)
      const user = await req.getUser()
      if (user) return handle(req, res)
      return res.redirect('/')
    })

    server.listen(port, (err) => {
      if (err) throw err
      console.log(`> Ready on http://localhost:${port}`)
    })
  })