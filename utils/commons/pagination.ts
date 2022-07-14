
export function calculateIndex(index: number, pageNumber: number, pageSize: number) {
  return (index + 1) + (pageNumber * pageSize)
}

export function paddingNum(num) {
  num = num || 0
  if (num < 0) return num.toString()
  return String(num).padStart(2, '0')
}
