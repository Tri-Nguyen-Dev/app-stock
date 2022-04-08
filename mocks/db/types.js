const { faker } = require('@faker-js/faker');

function generateData() {
  return Array.from({ length: 10 }, (_, i) => {
    return { id: i, name: faker.commerce.productMaterial() };
  });
}

module.exports = generateData;
