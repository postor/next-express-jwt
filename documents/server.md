# server

## server

a function return `sign`、`verify`、`parser`、`guard` that you need on server side

### get

```
const server = require('next-express-jwt').server

import {server} from 'next-express-jwt'

import {server} from 'next-express-jwt/dist/server'

```

### usage

```
const {
  config, //config passed in
  sign,   //see below
  verify, //see below
  parser, //see below
  guard,  //see below
} = server({
  secret,       //secret taht used for both jwt.sign and jwt.verify
  signOption,   //option that used for jwt.sign refer https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback
  verifyOption, //option that used for jwt.verify refer https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
  parserMethodName,   //default 'getUser', attach getUser function to express req object, so you can 'const user = await req.getUser()', if you config this remember to config the browser
  cookieName,         //default 'jwt', parse token from cookie key, if you config this remember to config the browser
})
```

## sign

jwt.sign with binded config and promisefy, refer https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback

when user login you will need to generate a jwt token that contain auth info and send it to user

### get

```
const {sign} = server({secret:'xxx'})
```

### usage

```
sign({username:'xxx',id:103,isAdmin:true}).then((token)=>console.log({token})).catch((error)=>console.log({error}))
```


## verify

jwt.verify with binded config and promisefy, refer https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback

you do not need this in most cases

### get

```
const {verify} = server({secret:'xxx'})
```

### usage

```
verify(token).then((decoded)=>console.log({decoded})).catch((error)=>console.log({error}))
```

## parser

a function returns express middleware to attach `req.getUser()` function to express req object, to parse token form user cookie

**use `cookie-parser` before use this** for `getUser` will use cookie

**use this before use `guard`** `guard` will use this

**use this before use `next handlers`** `wrapper`(see browser document) for next will use this for ssr

### get

```
const {parser} = server({secret:'xxx'})
```

### usage

```
server.use(parser({
  parserCacheName,  //default 'user', means you can use req.user after await req.getUser()
}))
```

## guard

a function returns express middleware to allow only login users

**use `parser` before use this** for this will need `req.getUser`

### get

```
const {guard} = server({secret:'xxx'})
```

### usage

```
server.get('/api/authed', guard({
  onGuardValid: (req, res, next, user) => {
    next()
  },  // fire when parse from cookie success
  onGuardInvalid = (req, res, next) => {
    res.json({ error: 'you need to login first!' })
  }   // fire when parse from cookie fail
}), async (req, res) => {
  const user = await req.getUser()
  res.json({user})
}
```


