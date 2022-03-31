const auth = require('./auth.json')
const user = require('./user.json')
const genStockList = require('./stock-list.js')
const genCategoryList = require('./category-list.js')
const genWareList = require('./warehouse-list.js')

module.exports = {
  user,
  login: auth,
  logout: auth,
  stock: genStockList(),
  category: genCategoryList(),
  warehouse: genWareList()
}
