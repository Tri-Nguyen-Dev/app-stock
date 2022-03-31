const { faker } = require('@faker-js/faker')

function generateData () {
  const boxes = []
  for (let id = 1; id < 105; id++) {
    const barCode = faker.random.alphaNumeric(5)
    const seller = {
      id,
      name: faker.name.firstName(),
      email: faker.internet.email()
    }
    const createdAt = faker.date.between('2022-03-01', '2022-03-15').toISOString().split('T')[0]
    const length = faker.datatype.number(100)
    const width = faker.datatype.number(100)
    const height = faker.datatype.number(100)
    const weight = faker.datatype.float({ max: 100 })
    const warehouse = {
      id,
      name: faker.datatype.string(5)
    }
    const location = {
      id,
      name: faker.phone.phoneNumber('501-###-###')
    }
    const status = faker.datatype.number({ min: 0, max: 1 })
    boxes.push({
      id,
      barCode,
      seller,
      createdAt,
      length,
      width,
      height,
      weight,
      warehouse,
      location,
      status
    })
  }

  return boxes
}

module.exports = generateData;
