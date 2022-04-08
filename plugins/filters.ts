import Vue from 'vue'
const dayjs = require('dayjs')
// -- [ Variables ] ------------------------------------------------
export const BOX_SIZE_MAP = new Map<string, string>([
  ['BOX_SIZE_BIG', 'Big'],
  ['BOX_SIZE_MEDIUM', 'Medium'],
  ['BOX_SIZE_SMALL', 'Small']
])
export const STATUS_MAP = new Map<string, string>([
  ['BOX_STATUS_AVAILABLE', 'AVAILABLE'],
  ['BOX_STATUS_DISABLE', 'DISABLE'],
  ['BOX_STATUS_DRAFT', 'DRAFT']
])
// -- [ Convert Box size ] ------------------------------------------------
Vue.filter('boxSize', (value) => {
  return BOX_SIZE_MAP.get(value) || ''
})

// -- [ Convert Status ] ------------------------------------------------
Vue.filter('boxStatus', (value) => {
  return STATUS_MAP.get(value) || ''
})

// -- [ Format date time 12hour type] ------------------------------------------------
Vue.filter('dateTimeHour12', (value) => {
  return dayjs(new Date(value)).format('DD-MM-YYYY hh:mm A')
})

// -- [ Convert status ] ------------------------------------------------
Vue.filter('status', (value) => {
  const STATUS_MAP = new Map<string, string>([
    ['BOX_STATUS_AVAILABLE', 'AVAILABLE'],
    ['BOX_STATUS_DISABLE', 'DISABLE'],
    ['BOX_STATUS_DRAFT', 'DRAFT']
  ])
  return STATUS_MAP.get(value) || ''
})