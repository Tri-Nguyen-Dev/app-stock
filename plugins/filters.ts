import Vue from 'vue'
import { FilterConstants } from '~/utils'
const dayjs = require('dayjs')
// -- [ Convert Box size ] ------------------------------------------------
Vue.filter('boxSize', (value) => {
  return FilterConstants.BOX_SIZE_MAP.get(value) || ''
})

// -- [ Convert Status ] ------------------------------------------------
Vue.filter('boxStatus', (value) => {
  return FilterConstants.STATUS_MAP.get(value) || ''
})
Vue.filter('requestStatus', (value) => {
  return FilterConstants.STATUS_REQUEST_MAP.get(value) || ''
})

// -- [ Format date time 12hour type] ------------------------------------------------
Vue.filter('dateTimeHour12', (value) => {
  return dayjs(new Date(value)).format('DD-MM-YYYY hh:mm A')
})
