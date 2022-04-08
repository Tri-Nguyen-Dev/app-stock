const { faker } = require('@faker-js/faker')
const _ = require('lodash')

function generateData (warehouseList, locationList) {
  const boxes = []
  for (let id = 1; id < 105; id++) {
    const barCode = faker.random.alphaNumeric(5)
    const seller = {
      id,
      name: faker.name.firstName(),
      email: faker.internet.email()
    }
    const warehouse = _.sample(warehouseList)
    const location = _.sample(locationList)
    const length =  faker.datatype.number({ min: 1, max: 100 })
    const width =  faker.datatype.number({ min: 1, max: 100 })
    const height =  faker.datatype.number({ min: 1, max: 100 })
    const weight =  faker.datatype.float({ max: 100 })
    const status = faker.datatype.boolean()
    const createdAt = faker.date.between('2022-03-01', '2022-03-15').toISOString().split('T')[0]
    const updatedAt = faker.date.between('2022-03-15', '2022-03-30').toISOString().split('T')[0]
    boxes.push({
      id,
      barCode,
      seller,
      warehouse,
      location,
      length,
      width,
      height,
      weight,
      status,
      createdAt,
      updatedAt
    })
  }
  return boxes
}

module.exports = generateData
