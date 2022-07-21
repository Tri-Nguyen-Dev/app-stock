export namespace BoxSize {
  export interface Model {
    id: number
    name: string
    height: number
    width: number
    length: number
  }

  export interface CreateOrUpdateBoxSize {
    id: number
    name: string
    height: number
    width: number
    length: number
  }
}
