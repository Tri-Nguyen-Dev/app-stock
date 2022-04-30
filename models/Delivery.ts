export namespace DeliveryList {
  export interface Model {
    id: string,
    creatorId: string,
    creatorName: string,
    createTime: string,
    sellerId: string,
    sellerName: string,
    sellerEmail: string,
    receiptDate: string,
    receiverAddress: string,
    dueDeliveryDate: string,
    estimatedDeliveryTime: number,
    lastedUpdateTime: string,
    warehouseId: string,
    warehouseName: string,
    assigneeId: string,
    driverId: string,
    driverName: string,
    status: string
  }
}