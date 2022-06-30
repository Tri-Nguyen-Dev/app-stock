export namespace DeliveryConstants {
  // -- [ Option List ] ------------------------------------------------
  export enum StatusDelivery {
    NEW = 0,
    IN_PROGRESS = 1,
    CANCELLED = 2,
    READY = 3,
    SETTED = 4,
    ACCEPTED = 5,
    DELIVERING = 6,
    DELIVERED = 7,
    RETURNED = 8,
    PENDING = 9
  }

  export enum StatusDeliveryName {
    NEW = 'DELIVERY_ORDER_STATUS_NEW',
    IN_PROGRESS = 'DELIVERY_ORDER_STATUS_IN_PROGRESS',
    CANCELLED = 'DELIVERY_ORDER_STATUS_CANCELLED',
    READY = 'DELIVERY_ORDER_STATUS_READY',
    SETTED = 'DELIVERY_ORDER_STATUS_SETTED',
    ACCEPTED = 'DELIVERY_ORDER_STATUS_ACCEPTED',
    DELIVERING = 'DELIVERY_ORDER_STATUS_DELIVERING',
    DELIVERED = 'DELIVERY_ORDER_STATUS_DELIVERED',
    RETURNED = 'DELIVERY_ORDER_STATUS_RETURNED',
    PENDING = 'DELIVERY_ORDER_STATUS_PENDING'
  }

  export enum TabDelivery {
    NEW = 0,
    DELIVERY_SETTING = 1,
    DELIVERED = 2
  }
  export const DELIVERY_STATUS_OPTIONS = [
    { name: 'New', value: StatusDelivery.NEW },
    { name: 'In Progress', value: StatusDelivery.IN_PROGRESS },
    { name: 'Cancelled', value: StatusDelivery.CANCELLED },
    { name: 'Ready', value: StatusDelivery.READY },
    { name: 'Delivering', value: StatusDelivery.DELIVERING },
    { name: 'Delivered', value: StatusDelivery.DELIVERED },
    { name: 'Returned', value: StatusDelivery.RETURNED },
    { name: 'Setted', value: StatusDelivery.SETTED },
    { name: 'Accepted', value: StatusDelivery.ACCEPTED },
    { name: 'Pending', value: StatusDelivery.PENDING }
  ]
  export const MapDeliveryTab = new Map<number, string>([
    [TabDelivery.NEW, `${StatusDelivery.NEW},${StatusDelivery.IN_PROGRESS},${StatusDelivery.CANCELLED}`],
    [TabDelivery.DELIVERY_SETTING, `${StatusDelivery.READY},${StatusDelivery.SETTED},${StatusDelivery.ACCEPTED},${StatusDelivery.DELIVERING}`],
    [TabDelivery.DELIVERED, `${StatusDelivery.DELIVERED},${StatusDelivery.RETURNED}`]
  ])

  export const MapStatusDelivery = new Map<string, string>([
    [StatusDeliveryName.NEW, 'New'],
    [StatusDeliveryName.IN_PROGRESS,'In Progress'],
    [StatusDeliveryName.CANCELLED,'Cancelled'],
    [StatusDeliveryName.READY, 'Ready'],
    [StatusDeliveryName.SETTED, 'Setted'],
    [StatusDeliveryName.ACCEPTED,'Accepted'],
    [StatusDeliveryName.DELIVERING, 'Delivering'],
    [StatusDeliveryName.DELIVERED,'Delivered'],
    [StatusDeliveryName.RETURNED, 'Returned'],
    [StatusDeliveryName.PENDING, 'Pending']
  ])
}
