export namespace Box {
  export interface Model {
    id: string,
    code: string,
    receiptNoteId: string,
    creatorId: string
    seller: {
      id: string,
      name: string,
      email: string,
      phone: string
    },
    createAt?: Date,
    updatedAt?: Date,
    length: number,
    width: number,
    height: number
    weight: number,
    boxSize: string,
    warehouse: {
      id: string,
      name: string
    },
    location:{
      id:string,
      name:string
    },
    status?: boolean
  }
}
