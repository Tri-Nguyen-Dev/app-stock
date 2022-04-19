
export function calculateIndex (index: number, pageNumber: number, pageSize: number) {
  return (index + 1) + (pageNumber * pageSize) 
}

export function calculateInfoPaginate (pageNumber: number, pageSize: number, total: number) {
  const start = ((pageNumber + 1) * pageSize) - (pageSize - 1)
  const convertStart = ('0' + start).slice(-2)
  const end = Math.min(start + pageSize - 1, total)
  return `Showing ${convertStart} - ${end} of ${total}`
}
