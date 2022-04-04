const { faker } = require('@faker-js/faker')
const lodash = require('lodash')

function generateItems (stocks, boxes) {
  const itemsList = []

  for (let i = 0; i < stocks.length; i++) {
    const stock = stocks[i]

    lodash.range(faker.datatype.number({ min: 3, max: 10 })).forEach(_ => {
      const box = lodash.sample(boxes)
      const inventoryQuantity = faker.datatype.number({ min: 1, max: 500 })

      itemsList.push({
        id: box.id,
        stockId: stock.id,
        sku: stock.sku,
        boxId: box.id,
        boxCode: box.barCode,
        seller: box.seller,
        location: box.location,
        warehouse: box.warehouse,
        deleted: box.deleted,
        inventoryQuantity
      })
    })
  }

  return itemsList
}

module.exports = generateItems
