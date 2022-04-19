// eslint-disable-next-line @typescript-eslint/no-unused-vars
module.exports = function (req, res, next) {
  if (req.method === 'POST') {
    // Converts POST to GET and move payload to query params
    // This way it will make JSON Server that it's GET request
    if (req.originalUrl.endsWith('update')) {
      req.method = 'PUT'
    } else if (req.originalUrl.endsWith('delete')) {
      req.method = 'DELETE'
    }
  } 
  // Continue to JSON Server router
  next()
}
