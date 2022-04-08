// eslint-disable-next-line @typescript-eslint/no-unused-vars
module.exports = function (req, res, next) {
  if (req.method === 'GET') {
    // rewrite params filter .id\
    req.url = req.url.replaceAll('Ids[]', '.id');
    req.url = req.url.replaceAll('Id', '.id');
    req.url = req.url.replaceAll('sortByColumn', '_sort');

    if(req.query.sortDescending) req.url = req.url.replaceAll('sortDescending=true', '_order=desc');
  }
  // Continue to JSON Server router
  next();
};

