import { wrapper } from '../components/jwt'
import User from '../components/User'

const Index = () => (<div>
  <User />
</div>)

export default wrapper(Index)