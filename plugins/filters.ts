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

// -- [ Format date time] ------------------------------------------------
Vue.filter('dateTime', (value, format) => {
  try {
    return format ? dayjs(new Date(value)).format(format) : dayjs(new Date(value)).format('MM/DD/YYYY HH:mm')
  } catch (error) {
    return ''
  }
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

// --  [ Format capacity ] -------------------------------------------------
Vue.filter('capacityPercent', (value) => {
  const percent = value * 100
  return `${_.isInteger(percent) ? percent : (value * 100).toFixed()}%`
})

// -- [report status] -------------------------------
Vue.filter('reportStatus', (value) => {
  return FilterConstants.REPORT_STATUS_MAP.get(value) || ''
})

Vue.filter('itemStockStatus', (value) => {
  return FilterConstants.STATUS_ITEM_STOCK.get(value) || ''
})

Vue.filter('trimUnderShift', (value) => {
  if(!value) return ''
  return value.replace('_', ' ')
})

Vue.filter('sellerName', (value) => {
  if( !value.firstName && !value.lastName) {
    return ''
  }
  return value.displayName || `${value.firstName} ${value.lastName}`
})

// -- [ Format quantity ] -----------------------------

Vue.filter('formatQuantity', (value) => {
  if(!value) {
    return ''
  }
  return  Number(value).toLocaleString('en-US',{
    useGrouping:true
  })
})

// -- [ Format curentcy ] -----------------------------

Vue.filter('formatCurentcy', (value) => {
  if(!value) {
    return ''
  }
  return  Number(value).toLocaleString('en-US',{
    currency:'USD',
    style:'currency',
    useGrouping:true
  })
})

// -- [ Convert date time estimate] ------------------------------------------------
Vue.filter('estimateDayConvert', (value) => {
  return Math.round(value / (24*60*60))
})
