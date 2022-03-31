const auth = require('./auth.json')
const user = require('./user.json')
const category = require('./category.json')
const warehouse = require('./warehouse.json')
const genStockList = require('./stock.js')
const genBoxList = require('./box.js')
const genStockBox = require('./stock-box.js')
const genTypeList = require('./types.js')
const location = require('./location.json')
const size = require('./size.json')

module.exports = {
  user,
  login: auth,
  logout: auth,
  stock: genStockList(warehouse, category, genTypeList()),
  category,
  warehouse,
  box: genBoxList(warehouse, location),
  items: genStockBox(),
  location,
  size
}
