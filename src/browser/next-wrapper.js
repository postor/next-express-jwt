import React, { Component, Children } from 'react'
import asAsync from '../as-async'

export default (config = {}) => {
  const {
    parserMethodName = 'getUser',
    cookieName = 'jwt',
    serverSiderGetUser = defaultServerSideGetUser,
    Provider,
  } = config

  return (Page) => {
    class JwtWrapper extends Component {
      constructor(props) {
        super(props)
      }

      render() {
        const { jwtUser } = this.props
        return (<Provider user={jwtUser}>
          <Page {...this.props} />
        </Provider>)
      }

      static async getInitialProps(ctx) {
        const jwtUser = await asAsync(serverSiderGetUser, null, [ctx])

        let rtn = {}
        if (Page.getInitialProps) {
          rtn = await Page.getInitialProps(ctx)
        }

        return {
          ...rtn,
          jwtUser
        }
      }
    }

    return JwtWrapper
  }


  async function defaultServerSideGetUser(ctx) {
    const { req } = ctx
    if (!req) {
      return undefined
    }
    const user = await req[parserMethodName]()
    if (!user) {
      return undefined
    }

    const token = req.cookies[cookieName]
    return Object.assign({ token, }, user)
  }
}
