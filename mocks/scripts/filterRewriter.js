// eslint-disable-next-line @typescript-eslint/no-unused-vars
module.exports = function (req, res, next) {
  if (req.method === 'GET') {
    // rewrite params filter .id\
    req.url = req.url.replaceAll('Ids[]', '.id')
    req.url = req.url.replaceAll('Id', '.id')
  }
  // Continue to JSON Server router
  next()
}

