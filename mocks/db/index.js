const auth = require('./auth.json')
const user = require('./user.json')
const genStockList = require('./stock-list.js')
const genBoxList = require('./box-list.js')
const genCategoryList = require('./category-list.js')
const genWareList = require('./warehouse-list.js')
const genItemsList = require('./items-list.js')

module.exports = {
  user,
  login: auth,
  logout: auth,
  stock: genStockList(),
  box: genBoxList(),
  category: genCategoryList(),
  warehouse: genWareList(),
  items: genItemsList()
}
