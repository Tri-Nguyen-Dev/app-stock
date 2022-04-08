const jsonServer = require('json-server');
const data = require('./db');
const postAsUpdate = require('./scripts/postAsUpdate.js');
const pagingResults = require('./scripts/pagingResults.js');
const filterRewriter = require('./scripts/filterRewriter.js');
const server = jsonServer.create();
const router = jsonServer.router(data);
const middlewares = jsonServer.defaults();

server.use(postAsUpdate);
server.use(filterRewriter);
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
    '*&barcode=*': '$1&barcode_like=$2',
    '*&sellerName*': '$1&seller.name$2',
    '*&from*': '$1&createdAt_gte$2',
    '*&to*': '$1&createdAt_lte$2',
    '*&warehouseId*': '$1&warehouse.id$2',
    '*&binName*': '$1&location.name$2',
    '*&sort*': '$1&_sort$2',
    '*&order=desc*': '$1&_order=desc$2',
    '*&order=asc*': '$1&_order=asc$2',
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
);

server.use(middlewares);
server.use(jsonServer.bodyParser);
// -- Custom responses for mock api here
router.render = pagingResults;

server.use(router);
server.listen(process.env.MOCK_API_PORT || 3000);
