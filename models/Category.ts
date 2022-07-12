export namespace Category {
    export interface Model {
      id: number
      name: string
      icon: string
      displayOrder: number
      deleted: boolean
    }
  
    export interface CreateCategory {
      id: number
      name: string
      icon: string
      displayOrder: number
      deleted: boolean
    }
}
  