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
  }
}
