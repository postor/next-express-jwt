import server from './server'
import browser from './browser'

export default (config) => {
  return {
    ...server(config),
    ...browser(config),
  }
}