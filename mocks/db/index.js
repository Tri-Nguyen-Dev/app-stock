const auth = require('./auth.json')
const user = require('./user.json')
const genStockList = require('./stock-list.js')
const genBoxList = require('./box-list.js')

module.exports = {
  user,
  login: auth,
  logout: auth,
  stock: genStockList(),
  box: genBoxList()
}
