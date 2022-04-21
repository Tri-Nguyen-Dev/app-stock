const { faker } = require('@faker-js/faker')
const lodash = require('lodash')

function generateItems (stocks, boxes) {
  const itemsList = []

  for (let i = 0; i < stocks.length; i++) {
    const stock = stocks[i]

    lodash.range(faker.datatype.number({ min: 3, max: 30 })).forEach(_ => {
      const box = lodash.sample(boxes)
      const inventoryQuantity = faker.datatype.number({ min: 1, max: 500 })
      const receiptNote = faker.random.alphaNumeric(9)
      const creatorId = faker.random.alphaNumeric(9)
      const price = faker.datatype.number({ min: 1, max: 500 })
      itemsList.push({
        id: box.id,
        stockId: stock.id,
        imageUrl: box.imageUrl,
        name: stock.name,
        sku: stock.sku,
        boxId: box.id,
        boxCode: box.barCode,
        seller: box.seller,
        location: box.location,
        warehouse: box.warehouse,
        deleted: box.deleted,
        attributes: stock.attributes,
        receiptNote,
        creatorId,
        price,
        inventoryQuantity
      })
    })
  }  return itemsList
}

module.exports = generateItems
