const auth = require('./auth.json')
const user = require('./user.json')
const genStockList = require('./stock-list.js')
const genBoxDetail = require('./box-detail.js')

module.exports = {
  user,
  login: auth,
  logout: auth,
  stock: genStockList(),
  boxDetail: genBoxDetail()
}
