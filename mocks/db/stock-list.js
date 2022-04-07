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
    const code = faker.random.alphaNumeric(5)
    const category = _.sample(categoryList)
    const type = _.sample(typeList)
    const status = faker.datatype.number({ min: 0, max: 1 })
    const createdAt = faker.date.between('2022-03-01', '2022-03-15').toISOString().split('T')[0]
    const updatedAt = faker.date.between('2022-03-15', '2022-03-30').toISOString().split('T')[0]
    stocks.push({
      id,
      name,
      description,
      imageUrl,
      code,
      category,
      type,
      status,
      createdAt,
      updatedAt
    })
  }

  return stocks
}

module.exports = generateData;
