const { faker } = require('@faker-js/faker')
const _ = require('lodash')

function generateData (locationList) {
  const stocks = []
  const categoryList = Array.from({ length: 10 }, (_, i) => {
    return { id: i, name: faker.commerce.product() }
  })

  for (let id = 1; id < 105; id++) {
    const name = faker.commerce.productName()
    const imageUrl = faker.image.business(480, 480, true)
    const barcode = faker.finance.routingNumber()
    const sku = faker.random.alphaNumeric(8)
    const unit = faker.music.genre()
    const category = _.sample(categoryList)
    const status = faker.datatype.number({ min: 0, max: 1 })
    const createdAt = faker.date.between('2022-03-01', '2022-03-15').toISOString().split('T')[0]
    const updatedAt = faker.date.between('2022-03-15', '2022-03-30').toISOString().split('T')[0]
    const width = faker.datatype.number(100)
    const height = faker.datatype.number(100)
    const length = faker.datatype.number(100)
    const weight = faker.datatype.float({ max: 100 })
    const quantity = faker.datatype.number(100)
    const location = _.sample(locationList)

    stocks.push({
      id,
      name,
      length,
      height,
      weight,
      width,
      sku,
      unit,
      quantity,
      imageUrl,
      category,
      status,
      createdAt,
      updatedAt,
      barcode,
      location
    })
  }
  return stocks
}

module.exports = generateData
