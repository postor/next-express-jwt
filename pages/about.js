import Link from 'next/link'
import { wrapper } from '../components/jwt'
import User from '../components/User'

const Index = (props) => (<div>
  <Link href="/"><a>index</a></Link>
  <User />
  {props.keys && (<ul>
    {props.keys.map((x, i) => (<li key={i}>{x}</li>))}
  </ul>)}
</div>)

Index.getInitialProps = (ctx) => {
  return { keys: Object.keys(ctx) }
}

export default wrapper(Index)