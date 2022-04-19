export namespace Box {
  export interface Model {
    id: string,
    barCode: string,
    request: {
      seller: {
        id: string,
        email: string
      },
      warehouse: {
        id: string,
        name: string
      }
    }
    createdAt?: Date,
    updatedAt?: Date,
    length: number,
    width: number,
    height: number
    weight: number,
    rackLocation: {
      id: string,
      name: string
    }
    status: string
    boxSize?: string
  }
}
