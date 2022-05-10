export namespace User {

  export interface Model {
    id?: number,
    email?: string,
    username?: string,
    firstName?: string,
    lastName?: string,
    displayName?: string,
    phoneNumber?: string,
    avatarUrl?: string,
    roleId?: number,
    status?: string
  }

  export interface KeyCloak {
    'email_verified': boolean
    'family_name': string,
    'given_name': string,
    'name': string,
    'preferred_username': string,
    'sub': string,
  }
}
