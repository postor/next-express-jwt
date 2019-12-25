# next-express-jwt

make jwt easier on express and next.js, support ssr with cookie.

让jwt在express和next.js更方便使用，通过cookie支持服务端渲染

quick glance: https://www.youtube.com/watch?v=oDBTKbwDf_0&list=PLM1v95K5B1ntVsYvNJIxgRPppngrO_X4s

## usage | 使用

### 1.based on a working next.js with express | 基于一个工作的express+next.js环境

if you don't have one refer https://github.com/zeit/next.js/tree/canary/examples/custom-server-express

如果你还没有一个这样的环境，参考 https://github.com/zeit/next.js/tree/canary/examples/custom-server-express

### 2.config server jwt | 配置服务端jwt

```
const jwt = require('next-express-jwt/dist/server').default({
  "secret": "test-secret"
})
```


### 3.`server.use(jwt.parser())`

register a function(default `req.getUser()`) to express `req` object through `server.use(jwt.parser())`, which can parse cookie and return parsed user, this should after `server.static` and before apis and next handle, remember to use `cookie-parser` before this

通过`server.use(jwt.parser())`注册一个函数到`req`对象上(默认是 `req.getUser()`)，这个函数可以通过cookie验证用户身份并返回用户信息，这个注册应该在`server.static`和`cookie-parser`之后并在你的api和 next handle 之前

server.js

```
const server = express()
// use cookie parser before jwt parser
server.use(cookieParser())
// use parser before your api and next handle
server.use(jwt.parser())
```

### 4.login api | 登录接口

it might look like this, use `jwt.sign` to get a jwt token, and send it to browser

使用`jwt.sign`来获取一个token并且发送给浏览器，大概如下

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

### 5.login form | 登录表单

just use login api to get user info and token, then store user and set token to cookie

使用登录接口获取用户信息和token并保存，并将token保存到cookie


you can choose to use redux, or you can use `Provider` and `connect` from `browser`, do not use both. redux example: https://github.com/nextjs-boilerplate/next-express-redux-i18n

如果你不使用redux，可以使用这里提供的 Provider 和 connect，如果你使用了redux就不要使用这两个了. redux 实例参考: https://github.com/nextjs-boilerplate/next-express-redux-i18n

components/jwt.js

```
import jwt from 'next-express-jwt/dist/browser'
export const { Provider, connect, wrapper } = jwt()
```


components/User.js

```
import { Component } from 'react'
import {connect} from '../components/jwt'
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

### 6.page to show login form | 要显示登录界面的页面

`wrapper` will wrap page into `Provider` and  auto parse user for `Provider`, you can refer [wrapper](./documents/browser.md#wrapper)

`wrapper` 会自动提供 `Provider` 并从cookie匹配用户信息给 `Provider` , 具体参考 [wrapper](./documents/browser.md#wrapper)

first of all let's config jwt for browser side | 首先配置浏览器端的jwt

components/jwt.js

```
import jwt from 'next-express-jwt/dist/browser'
export const { Provider, connect, wrapper } = jwt()
```

then page | 然后是页面

pages/index.js

```
import { wrapper } from '../components/jwt'
import User from '../components/User'

const Index = () => (<div>
  <User />
</div>)

export default wrapper(Index)
```

if you use redux you have to handle the ssr part for user by yourself, maybe something like

如果你使用redux，用户的服务端渲染部分需要你自己处理，类似这样

```
Page.getInitialProps(ctx) {
  const { store, req } = ctx
  if (store && req) {
    const user = await req.getUser()
    store.dispatch(set(user))
  }
}
```

redux example: https://github.com/nextjs-boilerplate/next-express-redux-i18n

redux 实例参考: https://github.com/nextjs-boilerplate/next-express-redux-i18n

### 7.allow only authed users for some api | 接口的身份认证

使用`jwt.guard()`拦截未登录的用户，具体参考 [guard](./documents/server.md#guard)

server.js

```
server.get('/api/authed', jwt.guard(), async (req, res) => {
  //after jwt.parser you can get user through req.getUser (req[config.parserMethodName] if not default config)
  const user = await req.getUser()
  res.json({ user })
})
```

## run example | 本地体验

```
git clone https://github.com/postor/next-express-jwt.git
cd next-express-jwt/example
yarn && yarn start
```

then open http://localhost:3000


## api documents | 接口说明

[server side | 服务端](./documents/server.md)

[browser side | 浏览器端](./documents/browser.md)
