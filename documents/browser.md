# browser side

## browser

```
const browser = require('next-express-jwt').browser

import {browser} from 'next-express-jwt'

import {browser} from 'next-express-jwt/dist/browser'


const { Provider, connect, wrapper } = browser({  
  parserMethodName:'getUser', // req.getUser
  cookieName:'jwt',           // token cookie name
  serverSiderGetUser: async function defaultServerSideGetUser(ctx) {
    const { req } = ctx
    const user = await req[parserMethodName]()
    if (!user) {
      return undefined
    }
    const token = req.cookies[cookieName]
    return Object.assign({ token, }, user)
  }                           // for ssr, make sure return the same thing as browser side `setUser`, ctx is the same as next.js `getInitialProps`
})

```

## wrapper

wrap your next.js page and ssr is ready

```
const { wrapper } = browser()

const Index = (props) => (<div>
  <User />
  {props.keys && (<ul>
    {props.keys.map((x, i) => (<li key={i}>{x}</li>))}
  </ul>)}
</div>)

Index.getInitialProps = (ctx) => {
  return { keys: Object.keys(ctx) }
}

export default wrapper(Index)
```

## connect

after connect you can get `user`, `setUser`, `clean` from props

```
const { connect } = browser()
class User extends Component {
  render() {
    const { user, setUser, clean } = this.props
    return (<div></div>)
  }
}

export default connect(User)
```

**`clean` will clear cookie while `setUser` won't set** you should set cookie by your self, `document.cookie="jwt=xxxx"` or `res.cookie('jwt',xxx)`

## Provider

you may not need this, use `wrapper` directly