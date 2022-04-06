const jsonServer = require('json-server')
const data = require('./db')

const postAsUpdate = require('./scripts/postAsUpdate.js')
const pagingResults = require('./scripts/pagingResults.js')

const server = jsonServer.create()
const router = jsonServer.router(data)
const middlewares = jsonServer.defaults()

server.use(postAsUpdate)
// -- Rewriter
server.use(
  jsonServer.rewriter({
    '/api/*': '/$1',
    '/:page/list*': '/:page$2',
    '*pageSize*': '$1_limit$2',
    '*pageNumber*': '$1_page$2',
    '/:page/create': '/:page',
    '/:page/:id/detail': '/:page/:id',
    '/:page/:id/update': '/:page/:id',
    '/:page/:id/delete': '/:page/:id',
    '/auth/:page': '/:page',
    '*name*': '$1name_like$2',
    '*barcode*': '$1barcode_like$2',
    '*seller*': '$1seller.email_like$2',
    '*boxCode*': '$1boxCode_like$2',
    '*location*': '$1location.name_like$2',
    '*warehouse*': '$1warehouse.name_like$2',
    '*sku*': '$1sku_like$2',
    '*status*': '$1status.name_like$2',
    '/stock/:stockId/box/list': '/stockbox?stockId=:stockId',
    '/stock/:stockId/box/list*': '/stockbox$2&stockId=:stockId',
    '/stock/:stockId/box/:boxId/detail': '/stockbox/:boxId?stockId=:stockId'

  })
)

server.use(middlewares)
server.use(jsonServer.bodyParser)
// -- Custom responses for mock api here
router.render = pagingResults

server.use(router)
server.listen(process.env.MOCK_API_PORT || 3000)
