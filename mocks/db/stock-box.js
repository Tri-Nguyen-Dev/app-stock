const { faker } = require('@faker-js/faker')
const _ = require('lodash')

function generateItems () {
  const itemsList = []

  const warehouseList = Array.from({ length: 10 }, (_, i) => {
    return { id: i, name: faker.commerce.product() }
  })

  const statusList = Array.from({ length: 10 }, (_, i) => {
    return { id: i, name: faker.commerce.productMaterial() }
  })

  for (let id = 1; id < 100; id++) {
    const sellerEmail = faker.internet.email()
    const sku = faker.random.alphaNumeric(8)
    const inventoryQuantity = faker.datatype.number({ min: 1, max: 500 })
    const boxcode = faker.random.alphaNumeric(5)
    const warehouse = _.sample(warehouseList)
    const location = faker.random.alphaNumeric(10)
    const status = _.sample(statusList)
    itemsList.push({
      id,
      sellerEmail,
      sku,
      inventoryQuantity,
      boxcode,
      warehouse,
      location,
      status
    })
  }

  return itemsList
}

module.exports = generateItems
