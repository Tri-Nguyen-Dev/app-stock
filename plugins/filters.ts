import Vue from 'vue'
import { FilterConstants } from '~/utils'
const dayjs = require('dayjs')
const baseImageUrl = process.env.BASE_IMAGE_URL || ''
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

Vue.filter('statusBoxHistory', (value) => {
  return FilterConstants.STATUS_HISTORY_MAP.get(value) || ''
})

// -- [ Format date time 12hour type] ------------------------------------------------
Vue.filter('dateTimeHour12', (value) => {
  return dayjs(new Date(value)).format('DD-MM-YYYY hh:mm A')
})

// -- [ Format date time type] ------------------------------------------------
Vue.filter('dateMonthYear', (value) => {
  return dayjs(new Date(value)).format('DD, MMMM, YYYY')
})

// -- [ Format date  type] ------------------------------------------------
Vue.filter('dateMonthYear', (value) => {
  return dayjs(new Date(value)).format('DD/MM/YYYY')
})

// -- [ AWS ] ------------------------------------------------
Vue.filter('getImageUrl', (imagePath) => {
  if (!imagePath) return null
  return `${baseImageUrl}/cdn/${imagePath}`
})
Vue.filter('getThumbnailUrl', (imagePath) => {
  if (!imagePath) return null
  return `${baseImageUrl}/thumbnail/${imagePath}`
})

// --  [ has tag check ] -------------------------------------------------
Vue.filter('checkHasTag', (value) => {
  return value ? 'Yes' : 'No'
})
