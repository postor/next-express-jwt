# next-express-jwt

jwt with less headache on express and next.js, support ssr with cookie.

## usage

### 1.based on a working next.js with express

if you don't have one refer https://github.com/zeit/next.js/tree/canary/examples/custom-server-express

### 2.config server jwt

```
const jwt = require('next-express-jwt/dist/server').default({
  "secret": "test-secret"
})
```


### 3.`server.use(jwt.parser())`

register a function(default `req.getUser()`) to express `req` object through `server.use(jwt.parser())`, which can parse cookie and return parsed user, this should after `server.static` and before apis and next handle, remember to use `cookie-parser` before this

server.js

```
const server = express()
// use cookie parser before jwt parser
server.use(cookieParser())
// use parser before your api and next handle
server.use(jwt.parser())
```

### 4.login api

it might look like this, use `jwt.sign` to get a jwt token, and send it to browser

server.js

```
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
```

### 5.login form

components/User.js

```
import { Component } from 'react'
import connect from 'next-express-jwt/dist/browser/connect'
import request from 'superagent'

class User extends Component {
  constructor(props) {
    super(props)
    this.state = {username: '',password: '',}
  }
  render() {
    const { user, clean } = this.props
    if (!user) {
      return this.renderLogin()
    }
    const { username } = user
    return (<div>
      <p>hi, {username}|<a onClick={() =>clean()}>登出</a></p>
    </div>)
  }
  renderLogin() {
    const { username, password } = this.state
    return (<div>
      <p>
        <label>username:</label>
        <input value={username} onChange={(e) => this.setState({
          username: e.target.value,
        })} />
      </p>
      <p>
        <label>password:</label>
        <input value={password} onChange={(e) => this.setState({
          password: e.target.value,
        })} />
      </p>
      <p><button onClick={() => this.login()}>login</button></p>
      <p>test:123</p>
    </div>)
  }

  login() {
    const { username, password } = this.state
    request.post('/api/login').send({
      user: username,
      pass: password,
    }).then((res) => {
      if (res.body.error) {
        return Promise.reject(res.body.error)
      }
      const { token } = res.body
      const { setUser } = this.props
      document.cookie = `jwt=${token}`
      setUser({
        username,
        token,
      })
    }).catch(alert)
  }
}
export default connect(User)
```

### 6.page to show login form

before that let's config jwt for browser side

components/jwt.js

```
import jwt from 'next-express-jwt/dist/browser'
export const { Provider, connect, wrapper } = jwt()
```

then page

pages/index.js

```
import { wrapper } from '../components/jwt'
import User from '../components/User'

const Index = () => (<div>
  <User />
</div>)

export default wrapper(Index)
```

### 7.allow only authed users for some api

server.js

```
server.get('/api/authed', jwt.guard(), async (req, res) => {
  //after jwt.parser you can get user through req.getUser (req[config.parserMethodName] if not default config)
  const user = await req.getUser()
  res.json({ user })
})
```

## run example

```
git clone https://github.com/postor/next-express-jwt.git
cd next-express-jwt/example
yarn && yarn start
```

then open http://localhost:3000


## api documents

[server side](./documents/server.md)

[browser side](./documents/browser.md)