export enum MENU_ACTION {
  LOGOUT
}

export const PAGE_MENU = [
  { id: 1, icon: 'shopping-cart', label: 'Stock' },
  { id: 11, to: '/stock', label: 'Stock List', parentId: 1 },
  { id: 12, to: '/box', label: 'Box List', parentId: 1, isLast: true },
  { id: 2, icon: 'activity', label: 'Activities' },
  { id: 21, to: '/stock-in', label: 'Stock In', parentId: 2 },
  { id: 22, to: '/stock-out/order-list', label: 'Stock Out', parentId: 2 },
  { id: 23, to: '/stock-take', label: 'Stock Take', parentId: 2 },
  { id: 24, to: '/stock-return', label: 'Stock Returned', parentId: 2, isLast: true },
  { id: 3, icon: 'location', label: 'Bin' },
  { id: 4, icon: 'award', label: 'Role' },
  { id: 5, icon: 'user-octagon', label: 'Shipper' },
  { id: 6, icon: 'tag', label: 'Tags' },
  { id: 7, icon: 'send-square', label: 'Seller' },
  { id: 8, icon: 'dashboard', label: 'Dashboard' },
  { id: 9, icon: 'dollar-square', label: 'Inventory Fee' }
]

export const SETTING_MENU = [
  { id: 100, icon: 'notification', label: 'Notifications', hideToggled: true },
  { id: 200, icon: 'setting', label: 'Setting' },
  { id: 201, label: 'Logout', parentId: 200, action: MENU_ACTION.LOGOUT, isLast: true }
]
