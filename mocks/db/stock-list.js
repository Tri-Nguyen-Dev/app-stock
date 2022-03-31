const { faker } = require('@faker-js/faker')
const _ = require('lodash')

function generateData () {
  const stocks = []
  const categoryList = Array.from({ length: 10 }, (_, i) => {
    return { id: i, name: faker.commerce.product() }
  })
  const typeList = Array.from({ length: 10 }, (_, i) => {
    return { id: i, name: faker.commerce.productMaterial() }
  })
  for (let id = 1; id < 105; id++) {
    const name = faker.commerce.productName()
    const description = faker.commerce.productDescription()
    const imageUrl = faker.image.business(480, 480, true)
    const barcode = faker.random.alphaNumeric(5)
    const category = _.sample(categoryList)
    const type = _.sample(typeList)
    const status = faker.datatype.number({ min: 0, max: 1 })
    const size = faker.datatype.number({ min: 1, max: 500 })
    const weight = faker.datatype.number({ min: 1, max: 500 })
    const unit = faker.random.alphaNumeric(5)
    const totalInventory = faker.datatype.number({ min: 1, max: 500 })
    const deleted = faker.datatype.boolean()
    const createdAt = faker.date.between('2022-03-01', '2022-03-15').toISOString().split('T')[0]
    const updatedAt = faker.date.between('2022-03-15', '2022-03-30').toISOString().split('T')[0]
    stocks.push({
      id,
      name,
      description,
      imageUrl,
      barcode,
      category,
      type,
      status,
      size,
      weight,
      unit,
      totalInventory,
      delete: deleted,
      createdAt,
      updatedAt
    })
  }

  return stocks
}

module.exports = generateData;
