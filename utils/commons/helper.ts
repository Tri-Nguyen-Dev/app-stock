
export function refreshAllFilter(filter: any) {
  for (const items in filter) filter[items] = null
  return filter
}

export function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@\\"]+(\.[^<>()[\]\\.,;:\s@\\"]+)*)|(\\".+\\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
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