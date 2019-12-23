export default (config = {}) => {
  const {
    parserMethodName = 'getUser',
  } = config

  return (option = {}) => {
    const {
      onGuardValid = (req, res, next, user) => {
        next()
      },
      onGuardInvalid = (req, res, next) => {
        res.json({ error: 'you need to login first!' })
      }
    } = option

    return async (req, res, next) => {
      const user = await req[parserMethodName]()
      if (user) {
        onGuardValid(req, res, next, user)
      } else {
        onGuardInvalid(req, res, next)
      }
    }
  }
}