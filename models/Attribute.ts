export namespace Attribute {
  export interface Model {
    id: string,
    name: string,
    description: string,
    icon: string,
    displayOrder: number,
    deleted: true

  }

  export interface Value {
    id: string,
    attribute: Model,
    icon: string,
    displayOrder: number,
    value: string
  }
}
