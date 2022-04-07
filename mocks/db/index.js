const auth = require('./auth.json')
const user = require('./user.json')
const category = require('./category.json')
const warehouse = require('./warehouse.json')
const genStockList = require('./stock.js')
const genBoxList = require('./box.js')
const genStockItemList = require('./stock-item.js')
const genTypeList = require('./types.js')const boxes = genBoxList()
const stocks = genStockList(warehouse, category, genTypeList())

module.exports = {
  user,
  login: auth,
  logout: auth,
  stock: stocks,
  category,
  warehouse,
  box: boxes,
  stockbox: genStockItemList(stocks, boxes)
}
