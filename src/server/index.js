import jwt from 'jsonwebtoken'
import getParser from './parser'
import getGuard from './guard'

export default (config = {}) => {
  const { secret, signOption, verifyOption } = config
  const sign = getSignFn(secret, signOption)
  const verify = getVerifyFn(secret, verifyOption)

  const parser = getParser({
    ...config,
    verify,
  })

  const guard = getGuard(config)

  return {
    config,
    sign,
    verify,
    parser,
    guard,
  }
}


function getSignFn(secret, option) {
  return (payload) => new Promise((resolve, reject) => {
    jwt.sign(payload, secret, option, (err, token) => {
      if (err) {
        reject(err)
        return
      }
      resolve(token)
    })
  })
}

function getVerifyFn(secret, option) {
  return (token) => new Promise((resolve, reject) => {
    jwt.verify(token, secret, option, (err, decoded) => {
      if (err) {
        reject(err)
        return
      }
      resolve(decoded)
    })
  })
}