import React, { Component } from "react"
import PropTypes from 'prop-types'

const connect = (ComponentToWrap) => {
  return class WxComponent extends Component {

    static contextTypes = {
      jwt_user: PropTypes.any,
      jwt_setUser: PropTypes.func,
      jwt_clean: PropTypes.func,
    }

    render() {
      const {
        jwt_user,
        jwt_setUser,
        jwt_clean,
      } = this.context

      const p = {
        ...this.props,
        user: jwt_user,
        setUser: jwt_setUser,
        clean: jwt_clean,
      }

      return (
        <ComponentToWrap {...p} />
      )
    }
  }
}
export default connect