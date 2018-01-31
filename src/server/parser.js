export default (config = {}) => {
  const {
    parserMethodName = 'getUser',
    cookieName = 'jwt',
    verify,
  } = config

  return (option = {}) => (req, res, next) => {
    const {
      parserCacheName = 'user',
    } = option

    req[parserMethodName] = async () => {
      
      if (req[parserCacheName]) {
        return req[parserCacheName]
      }

      const token = req.cookies[cookieName]
      if (!token) {
        return
      }

      const user = await verify(token)
      req[parserCacheName] = Object.assign({ token, }, user)
      return user
    }
    next()
  }
}