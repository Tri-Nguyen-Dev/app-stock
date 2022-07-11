export namespace Warehouse {
  export interface Model {
    id?: string,
    name?: string,
    icon?: string,
    address?: string,
    description?: string,
    phone?: string,
    email?: string,
    maxNumberRack?: number,
  }
  export interface CreateOrUpdateWarehouse {
    id?: string,
    name?: string,
    adress?: string,
    description?: string,
    phone?: string,
    email?: string,
    maxNumberRack?: number
  }
}
  