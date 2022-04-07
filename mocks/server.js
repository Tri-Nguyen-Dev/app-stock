const jsonServer = require('json-server')
const data = require('./db')
const postAsUpdate = require('./scripts/postAsUpdate.js')
const pagingResults = require('./scripts/pagingResults.js')
const filterRewriter = require('./scripts/filterRewriter.js')
const server = jsonServer.create()
const router = jsonServer.router(data)
const middlewares = jsonServer.defaults()

server.use(postAsUpdate)
server.use(filterRewriter)

// -- Rewriter
server.use(
  jsonServer.rewriter({
    '/api/*': '/$1',
    '/:page/list*': '/:page$2',
    '*?pageSize*': '$1?_limit$2',
    '*&pageSize*': '$1&_limit$2',
    '*?pageNumber*': '$1?_page$2',
    '*&pageNumber*': '$1&_page$2',
    '/:page/create': '/:page',
    '/:page/:id/detail': '/:page/:id',
    '/:page/:id/update': '/:page/:id',
    '/:page/:id/delete': '/:page/:id',
    '/auth/:page': '/:page',
    '*&name=*': '$1&name_like=$2',
    '*&barcode=*': '$1&barcode_like=$2'
  })
)

server.use(middlewares)
server.use(jsonServer.bodyParser)
// -- Custom responses for mock api here
router.render = pagingResults

server.use(router)
server.listen(process.env.MOCK_API_PORT || 3000)
