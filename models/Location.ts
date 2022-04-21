export namespace Location {
  export interface RackLocation {
    id: number,
    name: string,
    status: string
  }

  export interface Rack {
    id: number,
    name: string,
    listRackLocation: [
      string
    ],
    numberOfShelf: number,
    numberOfUnit: number,
    height: number,
    length: number,
    width: number,
    description: string,
    icon: string,
    deleted: true
  }
}
