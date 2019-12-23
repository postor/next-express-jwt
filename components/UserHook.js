import { useState } from 'react'
import { connect } from './jwt'
import request from 'superagent'

const User = ({ user, setUser, clean }) => {
  const [username, setUsername] = useState('test')
  const [password, setPassword] = useState('123')

  if (!user) {
    return (<div>
      <p>
        <label>username:</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} />
      </p>
      <p>
        <label>password:</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)} />
      </p>
      <p><button onClick={() => {
        request.post('/api/login').send({
          user: username,
          pass: password,
        }).then((res) => {
          if (res.body.error) {
            return Promise.reject(res.body.error)
          }
          const { token } = res.body

          document.cookie = `jwt=${token}`
          setUser({
            username,
            token,
          })
        }).catch(alert)
      }}>login</button></p>
      <p>default user: <br /> test:123</p>
    </div>)
  }

  return (<div>
    <p>hi, {username}|<a onClick={() => {
      clean()
    }}>logout</a></p>
  </div>)
}

export default connect(User)