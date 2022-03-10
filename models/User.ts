export namespace User {

  export interface Model {
    id:         number,
    email:      string,
    role:       number,
    status:     number,
    userDetail: User.Detail
  }

  export interface Detail {
    firstName:   string,
    lastName:    string,
    displayName: string,
    phoneNumber: string
    pictureUrl:  string
  }

  export interface Token {
    userId: string
    token:  string
    user?:  User.Model
  }
}
