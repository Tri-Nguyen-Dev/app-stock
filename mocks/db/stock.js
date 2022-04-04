const { faker } = require('@faker-js/faker')
const _ = require('lodash')

function generateData (warehouseList, categoryList, typeList) {
  const stocks = []
  for (let id = 1; id < 105; id++) {
    const name = faker.commerce.productName()
    const description = faker.commerce.productDescription()
    const imageUrl = faker.image.business(480, 480, true)
    const barcode = faker.random.alphaNumeric(5)
    const sku = faker.random.alphaNumeric(5)

    const category = _.sample(categoryList)
    const type = _.sample(typeList)
    const warehouse = _.sample(warehouseList)
    const attributes = [
      { id: 1, name: 'size', value: faker.datatype.number({ min: 1, max: 500 }) },
      { id: 2, name: 'weight', value: faker.datatype.number({ min: 1, max: 500 }) },
      { id: 3, name: 'unit', value: faker.random.alphaNumeric(5) }
    ]
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
      sku,
      warehouse,
      attributes,
      deleted,
      totalInventory,
      createdAt,
      updatedAt
    })
  }

  return stocks
}

module.exports = generateData;
