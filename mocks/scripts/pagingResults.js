const queryString = require('query-string')
module.exports = function(req, res) {
  const headers = res.getHeaders();
  const totalCount = headers['x-total-count']
  if(req.originalMethod === 'GET' && totalCount){
    const queryParams = queryString.parse(req._parsedOriginalUrl.query)
    const result = {
      data: res.locals.data,
      pagination:{
        pageNumber: Number.parseInt(queryParams._page) || 1,
        pageSize: Number.parseInt(queryParams._limit) || 10,
        total: Number.parseInt(totalCount)
      }
    }
    return res.jsonp(result)
  }
  res.jsonp(res.locals.data)
}
