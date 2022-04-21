
export function refreshAllFilter(filter: any) {
  for (const items in filter) filter[items] = null
  return filter
}