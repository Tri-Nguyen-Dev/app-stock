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
    id: string,
    name?: string,
    description?: string,
    imageUrl?: string,
    barcode?: string
    unit?: string
    sku? : string
    attributes: [{
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
