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
  const name = len > 1 ? len : (selectedList[0].name || selectedList[0].id)
  return _.template(MessageConstants.DELETE_MESSAGE_TEMPLATE)({ name, nameList })
}

export function getCancelMessage(selectedList: any[], nameList: string) {
  const len = _.size(selectedList)
  if (!len) return ''
  const name = len > 1 ? len : (selectedList[0].name || selectedList[0].id)
  return _.template(MessageConstants.CANCEL_MESSAGE_TEMPLATE)({ name, nameList })
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
