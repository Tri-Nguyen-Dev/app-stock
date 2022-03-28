export namespace Stock {

  export interface Model {
    id: string,
    name?: string,
    description?: string,
    imageUrl?: string,
    barcode?: String
    sku : String
    category?: {
      id: number
      name: string
    },
    type?: {
      id: number
      name: string
    },
    status?: string,
    createAt?: Date,
    updateAt?: Date
  }
}
