export namespace Airtag {
  export interface AirtagAttr {
    id?: string,
    model?: string,
    productionBatch?: string,
    costPrice?: number,
    retailPrice?: number,
    size?: string,
    color?: string,
    connectivity?: string,
    speaker?: string,
    batteryLife?: string,
    sensorTechnology?: string,
    accelerometer?: string,
    accessibility?: string,
    systemRequirement?: string,
    brandName?: string,
    manufacturingDate?: string,
  }
  export interface Model {
    id?: string
    status?: String
    airTagAttribute?: AirtagAttr
    barCode?: string
    AirtagStatus: string
  }
}
