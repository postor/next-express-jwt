import { Component } from 'react'
import { connect } from './jwt'
import request from 'superagent'

class User extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
    }
  }

  render() {
    const { user, clean } = this.props
    if (!user) {
      return this.renderLogin()
    }

    const { username } = user
    return (<div>
      <p>hi, {username}|<a onClick={() => {
        clean()
      }}>登出</a></p>
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
    if (!username) {
      alert('empty username')
      return
    }
    if (!password) {
      alert('empty password')
      return
    }

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