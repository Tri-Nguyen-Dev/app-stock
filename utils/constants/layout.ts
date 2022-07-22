export enum MENU_ACTION {
  LOGOUT
}

export const PAGE_MENU = [
  { id: 1, icon: 'shopping-cart', label: 'Stock' },
  { id: 11, to: '/stock', label: 'Stock List', parentId: 1 },
  { id: 12, to: '/box', label: 'Box List', parentId: 1, isLast: true },
  { id: 2, icon: 'activity', label: 'Activities' },
  { id: 21, to: '/stock-in', label: 'Stock In', parentId: 2 },
  { id: 22, label: 'Stock Out', parentId: 2 },
  { id: 26, to: '/stock-out/order-list', label: 'D/O List', parentId: 22, isChild: true },
  { id: 23, to: '/stock-out/packing/packing-note-list', label: 'Packing Note List', parentId: 22, isChild: true, isLast: true },
  { id: 24, to: '/stock-take', label: 'Stock Take', parentId: 2 },
  { id: 25, to: '/report' , label: 'Report', parentId: 2, isLast: true },
  { id: 3, icon: 'location', label: 'Bin', hideToggled: true },
  { id: 4, icon: 'award', label: 'Role', hideToggled: true },
  { id: 5, icon: 'user-octagon', label: 'Shipper', hideToggled: true },
  { id: 6, to: '/airtag', icon: 'tag', label: 'Tags', hideToggled: true },
  { id: 7, icon: 'send-square', label: 'Seller', hideToggled: true },
  { id: 8, to: '/dashboard', icon: 'dashboard', label: 'Dashboard', hideToggled: true },
  { id: 9, icon: 'dollar-square', label: 'Inventory Fee', hideToggled: true },
  { id: 13, to: '/warehouse', icon: 'house-2', label: 'Warehouse', hideToggled: true },
  { id: 10, to: '/category', icon: 'list-ul', label: 'Category', hideToggled: true }
]

export const SETTING_MENU = [
  { id: 100, icon: 'notification', label: 'Notifications', hideToggled: true },
  { id: 200, icon: 'setting', label: 'Setting' },
  { id: 201, label: 'Logout', parentId: 200, action: MENU_ACTION.LOGOUT, isLast: true }
]
