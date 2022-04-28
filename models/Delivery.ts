export namespace Delivery {
  export interface Model {
    id: string,
    creatorId: string,
    createTIme: string,
    sellerId: string,
    sellerEmail: string,
    receiptDate: string,
    receiverAddress: string,
    dueDeliveryDate: string,
    estimatedDeliveryTime: string,
    lastedUpdateTime: string,
    warehouseId: string,
    warehouseName: string,
    assignee: string,
    status: string
  }
}