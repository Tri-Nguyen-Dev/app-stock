export namespace Request {
  export interface Model {
    id: string,
    action: string,
    status: string,
    createdAt?: Date,
    createdBy: string,
    createdId: string,
    seller: {
      id: string,
      name: string,
      email: string
    },
    warehouse: {
      id: string,
      name: string,
    },
  }

}
