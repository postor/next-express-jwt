import connect from './connect'
import p from './provider'
import w from './next-wrapper'

export default (config = {}) => {
  const Provider = p(config)
  const wrapper = w({
    ...config,
    Provider,
  })
  
  return {
    Provider,
    connect,
    wrapper,
  }
}