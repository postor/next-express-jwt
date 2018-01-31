export default (fn, ctx, args) => {
  const rtn = fn.apply(ctx, args)
  if (rtn.then) {
    return rtn
  }
  return Promise.resolve(rtn)
}