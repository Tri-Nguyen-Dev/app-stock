import { Seller } from './Seller'
import { Warehouse } from './Warehouse'
import { User } from './User'
import { Stock } from './Stock'
import { Box } from './Box'
import { Airtag } from './AirTag'
export namespace OrderDetail {
  export interface Model {
    id?: string,
    seller?: Seller.Model
    receiverAddress?: string,
    receiverEmail?: string,
    receiverName?: string,
    receiverPhone?: string,
    dueDeliveryDate?: string,
    estimatedDeliveryTime?: number,
    warehouse?: Warehouse.Model
    assignee?: User.Model,
    status?: string,
    driver?: User.Model,
    deliveryItemList?: [{
      id?: number
      stockBox?: {
        id?: number,
        stock?: Stock.Model
        box?: Box.Model,
        amount?: number,
        value?: number,
        sku?: string,
        itemStatus?: string
      }
      airtag?: Airtag.Model
    }

    ],
    note?: string
  }
}
