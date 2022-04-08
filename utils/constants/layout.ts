export const PAGE_MENU = [
  { id: 1, icon: 'shopping-cart', label: 'Stock' },
  { id: 11, to: 'stock', label: 'Stock List', parentId: 1 },
  { id: 12, to: 'box', label: 'Box List', parentId: 1, isLast: true },
  { id: 2, icon: 'activity', label: 'Activities' },
  { id: 3, icon: 'location', label: 'Bin' },
  { id: 4, icon: 'award', label: 'Role' },
  { id: 5, icon: 'user-octagon', label: 'Shipper' },
  { id: 6, icon: 'tag', label: 'Tags' },
  { id: 7, icon: 'send-square', label: 'Seller' },
  { id: 8, icon: 'dashboard', label: 'Dashboard' },
  { id: 9, icon: 'dollar-square', label: 'Inventory Fee' }
];

export const SETTING_MENU = [
  { id: 100, icon: 'notification', label: 'Notifications' },
  { id: 200, icon: 'setting', label: 'Setting' }
];

export const ITEM_BOX_DETAIL = [
  { id: 1, icon: 'receipt', label: 'Receipt note ID' },
  { id: 2, icon: 'tag-user', label: 'Create ID' },
  { id: 4, icon: 'warehouse', label: 'Warehouse' },
  { id: 5, icon: 'location-2', label: 'Location' },
  { id: 6, icon: 'calendar', label: 'Create Time' },
  { id: 7, icon: 'frame', label: 'Box Items' },
  { id: 8, icon: 'dollar-square-2', label: 'Estimated inventory Fee' },
  { id: 9, icon: 'resize', label: 'Box Size:' }
];

export const ITEM_SELLER_INFOR = [
  { id: 1, icon: 'user-octagon-2', label: 'Sender' },
  { id: 2, icon: 'sms-notification', label: 'Email' },
  { id: 3, icon: 'phone', label: 'Phone number' }
];
