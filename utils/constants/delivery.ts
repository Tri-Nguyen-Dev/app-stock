export namespace DeliveryConstants {
    // -- [ Option List ] ------------------------------------------------
    export enum StatusDelivery {
      NEW = 0,
      IN_PROGRESS = 1,
      CANCELLED = 2,
      READY = 3,
      DELIVERING = 4,
      DELIVERED = 5,
      RETURNED = 6
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
      { name: 'Returned', value: StatusDelivery.RETURNED }
    ]
    export const MapDeliveryTab = new Map<number, string>([
      [TabDelivery.NEW, `${StatusDelivery.NEW},${StatusDelivery.IN_PROGRESS},${StatusDelivery.CANCELLED}`],
      [TabDelivery.DELIVERY_SETTING, `${StatusDelivery.READY},${StatusDelivery.DELIVERING}`],
      [TabDelivery.DELIVERED, `${StatusDelivery.DELIVERED},${StatusDelivery.RETURNED}`]
    ])
    
  }
  