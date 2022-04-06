export namespace Stock {

  export interface Model {
    id: string,
    name?: string,
    description?: string,
    imageUrl?: string,
    barcode?: String
    sku : String
    category?: {
      id: string
      name: string
    },
    type?: object,
    delete?: boolean,
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
    }
  }
}
