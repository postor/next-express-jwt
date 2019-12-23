import Link from 'next/link'
import { wrapper } from '../components/jwt'
import User from '../components/UserHook'

const Index = (props) => (<div>
  <Link href="/"><a>index</a></Link>
  <User />
</div>)

Index.getInitialProps = (ctx) => {
  return { keys: Object.keys(ctx) }
}

export default wrapper(Index)