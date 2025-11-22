function basicAuth(req, res, next) {
  const userId = req.headers['x-user-id']
  if (!userId) {
    return res.status(401).send('Unauthorized: Missing x-user-id header')
  }
  req.userId = userId
  next()
}

module.exports = { basicAuth }
