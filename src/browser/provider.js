import React, { Component, Children } from 'react'
import PropTypes from 'prop-types'

const isServerSide = typeof window == 'undefined'

export default (config = {}) => {

  const {
    parserMethodName = 'getUser',
    cookieName = 'jwt',
  } = config

  let jwtUser = undefined

  class Provider extends Component {
    static childContextTypes = {
      jwt_user: PropTypes.any,
      jwt_setUser: PropTypes.func,
      jwt_clean: PropTypes.func,
    }

    constructor(props) {
      super(props)
      const { user } = props
      this.state = {
        user,
      }

      //prisist state from cache
      if (!isServerSide) {
        if (user) {
          jwtUser = user
        } else {
          this.state = {
            user: jwtUser
          }
        }
      }
    }

    render() {
      return Children.only(this.props.children)
    }

    getChildContext() {
      const { user } = this.state
      const jwt_setUser = (user) => {
        this.setState({ user, })
        jwtUser = user
      }
      const jwt_clean = () => {
        document.cookie = `${cookieName}=`
        this.setState({ user: undefined })
        jwtUser = undefined
      }

      return {
        jwt_user: user,
        jwt_setUser,
        jwt_clean,
      }
    }

  }

  return Provider
}