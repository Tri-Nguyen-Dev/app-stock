const auth = require('./auth.json')
const user = require('./user.json')
const category = require('./category.json')
const warehouse = require('./warehouse.json')
const genStockList = require('./stock.js')
const genBoxList = require('./box.js')
const genStockBox = require('./stock-box.js')
const genStockItemList = require('./stock-item.js')
const genTypeList = require('./types.js')
const location = require('./location.json')
const boxes = genBoxList()
const stocks = genStockList(warehouse, category, genTypeList())

module.exports = {
  user,
  login: auth,
  logout: auth,
  stock: genStockList(warehouse, category, genTypeList()),
  category,
  warehouse,
  box: genBoxList(warehouse, location),
  items: genStockBox(),
  stockbox: genStockItemList(stocks, boxes)
}