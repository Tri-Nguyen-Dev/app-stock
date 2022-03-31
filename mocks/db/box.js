const { faker } = require('@faker-js/faker')
const _ = require('lodash')

function generateData (warehouseList, locationList) {
  const boxes = []
  for (let id = 1; id < 105; id++) {
    const barcode = faker.random.alphaNumeric(5)
    const seller = {
      id,
      name: faker.name.firstName(),
      email: faker.internet.email()
    }
    const warehouse = _.sample(warehouseList)
    const location = _.sample(locationList)
    const attributes = [
      { id: 1, name: 'length', value: faker.datatype.number({ min: 1, max: 100 }) },
      { id: 2, name: 'width', value: faker.datatype.number({ min: 1, max: 100 }) },
      { id: 3, name: 'height', value: faker.datatype.number({ min: 1, max: 100 }) },
      { id: 3, name: 'weight', value: faker.datatype.float({ max: 100 }) }
    ]
    const deleted = faker.datatype.boolean()
    const createdAt = faker.date.between('2022-03-01', '2022-03-15').toISOString().split('T')[0]
    const updatedAt = faker.date.between('2022-03-15', '2022-03-30').toISOString().split('T')[0]
    boxes.push({
      id,
      barcode,
      seller,
      attributes,
      warehouse,
      location,
      deleted,
      createdAt,
      updatedAt
    })
  }

  return boxes
}

module.exports = generateData;
