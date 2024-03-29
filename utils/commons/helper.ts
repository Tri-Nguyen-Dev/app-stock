import { MessageConstants } from '~/utils/constants/messages'

export function refreshAllFilter(filter: any) {
  for (const items in filter) filter[items] = null
  return filter
}

export function exportFileTypePdf(labelUrl: string, fileName: string) {
  const link = labelUrl
  const a = document.createElement('a')
  a.setAttribute('download', fileName)
  a.setAttribute('href', link)
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

export function getDeleteMessage(selectedList: any[], nameList: string) {
  const len = _.size(selectedList)
  if (!len) return ''
  return _.template(MessageConstants.DELETE_MESSAGE_TEMPLATE)({ len, nameList })
}

export function getCancelMessage(selectedList: any[], nameList: string) {
  const len = _.size(selectedList)
  if (!len) return ''
  return _.template(MessageConstants.CANCEL_MESSAGE_TEMPLATE)({ len, nameList })
}

export function resetScrollTable() {
  const ele = document.querySelector('.p-datatable-wrapper')
  if(ele) {
    ele.scrollTop = 0
    ele.scrollLeft = 0
  }
}

export function getTotalQuantityLabel(quantity: number, itemName, messages) {
  const isPlural = quantity > 1 ? `${itemName}s` : itemName
  return _.template(messages)({ quantity: `${quantity} ${isPlural}` })
}

export function numRounding(num: number, decimalPadding: number = 2) {
  const powNum = Math.pow(10, decimalPadding)
  return Math.round((num + Number.EPSILON) * powNum) / powNum
}
