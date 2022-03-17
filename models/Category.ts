export namespace Category {
  export interface Model {
    id: number
    email: string
    role: number
    status: number
    userDetail: Category.Detail
  }

  export interface Detail {
    firstName: string
    lastName: string
    displayName: string
    phoneNumber: string
    pictureUrl: string
  }

  export interface Token {
    userId: string
    token: string
    user?: Category.Model
  }
}
