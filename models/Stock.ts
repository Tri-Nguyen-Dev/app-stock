export namespace Stock {

  export interface Model {
    id: string,
    name?: string,
    description?: string,
    imageUrl?: string,
    barCode?: String
    sku : String
    category?: {
      id: string
      name: string
    },
    type?: object,
    deleted?: boolean,
    unit: {
      id: number,
      name: string
    },
    height:number,
    width: number,
    length: number,
    weight: number,
    totalInventoryQuantity: number,
    stockStatus: string,
    attributeValue: [
      {
        id: string,
        attribute: {
          id: string,
          name: string,
          icon: string,
          displayOrder: number,
          deleted: true
        },
        icon: string,
        displayOrder: number,
        value: string
      }
    ],
  }

  export interface ModelDetail {
    data: {
      id: string,
      name?: string,
      seller: {
        name: string,
        phone: number,
        email: string
      },
      description?: string,
      imageUrl?: string,
      barCode?: string
      unit?: string
      sku? : string
      attributeValue: [{
        id: string
        name: string
        value: string
      }]
      category?: {
        id: string
        name: string
      },
      type?: object,
      deleted?: boolean,
      location: {
        name?: string
      },
      warehouse: {
        name?: string
      },
    }
  }
  export class BoxModel{
    data:{
      total: number,
      items:[{
        id: string,
        stock: {
          id: string,
          name: string,
          description: string,
          imageUrl: string,
          barCode: string,
          sku: string,
          category: {
            id: number,
            name: string,
            icon: string,
            displayOrder: number,
            deleted: string
          },
          attributeValue: [],
          deleted: false
        },
        box: {
          id: string,
          icon: string,
          barCode: string,
          qrCode:string,
          inventoryFee: string,
          request: {
            id: string,
            action: string,
            status: string,
            boxList: string,
            seller: {
              id: string,
              name: string,
              phone: string,
              email: string,
              address: string,
              status: string
            },
            airtagE: {
              id: string,
              airTagAttribute: {
                id: string,
                model: string,
                productionBatch:string,
                costPrice: number,
                retailPrice: number,
                size: number,
                color: string,
                connectivity: string,
                speaker: string,
                batteryLife: string,
                sensorTechnology: string,
                accelerometer: string,
                accessibility: string,
                systemRequirement: string,
                brandName: string,
                manufacturingDate: Date
              },
              status: 1,
              createdAt: Date,
              updatedAt: Date,
              createBy: string,
              updateBy: string
            },
            driver: {
              id: 2,
              firstName: string,
              lastName: string,
              status: string,
              createdAt: Date,
              updatedAt: Date,
              createBy: string,
              updateBy: string
            },
            warehouse: {
              id: string,
              name: string,
              icon: string,
              address:string,
              description: string,
              phone: string,
              maxNumberShelf: number,
              createdAt: Date,
              updatedAt: Date,
              createBy: string,
              updateBy: string
            },
            createdAt: Date,
            updatedAt: Date,
            createBy: string,
            updateBy: string
          },
          listStockWithAmount: string,
          weight: number,
          height: number,
          width: number,
          length: number,
          locationStatus: string,
          status: string,
          deleted: false,
          shelfBin: {
            id: string,
            name: string,
            box: string,
            shelfRowNumber: 1,
            shelfColumnNumber: 1,
            status: string,
            createdAt: Date,
            updatedAt:Date,
            deleted: Boolean,
            createBy: string,
            updateBy: string
          },
          createdAt: Date,
          updatedAt: Date,
          createBy: string,
          updateBy: string
        },
        amount: 10,
        deleted: Boolean
      }]
    }
  }

  export interface CreateStock {
    id?: string,
    name?: string,
    imagePath?: string,
    barCode?: string,
    totalInventoryQuantity?: number,
    unit?: {
      id:number,
    },
    height?: number,
    width?: number,
    length?: number,
    weight?: number,
    category?: {
      id: string
    },
    stockStatus?: string,
    deleted?: boolean
  }
}
