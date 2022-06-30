import { Warehouse }  from '~/models/Warehouse'

export namespace User {

  export interface Model {
    id?: string,
    email?: string,
    username?: string,
    firstName?: string,
    lastName?: string,
    displayName?: string,
    phoneNumber?: string,
    avatarUrl?: string,
    role?: string
    warehouse:Warehouse.Model
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
