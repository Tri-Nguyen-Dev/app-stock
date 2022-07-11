import { Module, Mutation, VuexModule, Action } from 'vuex-module-decorators'
import { PathBind } from '~/utils/commons/path-bind'
import { $api } from '~/utils'
import { Warehouse as WarehouseModel } from '~/models/Warehouse'
@Module({
  stateFactory: true,
  namespaced: true
})

export default class Warehouse extends VuexModule {
  private static readonly STATE_URL = {
    GET_WAREHOUSE: '/warehouse/list',
    GET_WAREHOUSE_DETAIL: '/warehouse/:id/detail',
    UPDATE_WAREHOUSE_DETAIL: '/warehouse/:id/update',
    GET_WAREHOUSE_SELLER: '/warehouse/list/by-seller-email',
    DELETE_WAREHOUSE: '/warehouse/:id/delete',
    DELETE_WAREHOUSE_LIST: '/warehouse/list/delete',
    CREATE_WAREHOUSE: '/warehouse/create'
  }

  public warehouseList: [] = []
  public warehouseDetail: any = {}
  public warehouseBySeller: [] = []
  public newWarehouseDetail: any = {}

  @Mutation
  setWarehouseList(data: any) {
    this.warehouseList = data.items
  }

  @Mutation
  setWarehouseDetail(data: any) {
    this.warehouseDetail = data
  }

  @Mutation
  setNewWarehouse(newWarehouseDetail: WarehouseModel.CreateOrUpdateWarehouse) {
    this.newWarehouseDetail = newWarehouseDetail
  }

  @Mutation
  setWarehouseBySeller(data: any) {
    this.warehouseBySeller = data.items
  }

  @Action({ commit: 'setWarehouseList', rawError: true })
  async actWarehouseList(): Promise<string | undefined> {
    try {
      const url = PathBind.transform(
        this.context,
        Warehouse.STATE_URL.GET_WAREHOUSE
      )
      const response = await $api.get(url)
      return response.data
    } catch (error) {
    }
  }

  @Action({ commit: 'setWarehouseDetail', rawError: true })
  async actWarehouseDetail(params: { id: number }): Promise<string | undefined> {
    try {
      const url = PathBind.transform(
        this.context,
        Warehouse.STATE_URL.GET_WAREHOUSE_DETAIL,
        params
      )
      return await $api.get(url)
    } catch (error) {
    }
  }

  @Action ({ rawError: true })
  async actDeletedWarehouseById( id?: any ): Promise<string | undefined> {
    try{
      const url = PathBind.transform(this.context, Warehouse.STATE_URL.DELETE_WAREHOUSE, { id })
      const response: any = await $api.post( url )
      if(!response.data) {
        return
      }
      return response.data
    } catch (error){
    }
  }

  @Action({ commit: 'setNewWarehouse', rawError: true })
  async actCreateNewWarehouse(params: any): Promise<string | undefined> {
    try{
      const url = PathBind.transform(this.context, Warehouse.STATE_URL.CREATE_WAREHOUSE)
      const response = await $api.post(url, params)
      return response.data
    } catch (error) {}
  }

  @Action({ rawError: true })
  async actUpdateWarehouse(id): Promise<string | undefined> {
    const url = PathBind.transform(
      this.context,
      Warehouse.STATE_URL.UPDATE_WAREHOUSE_DETAIL,
      { id }
    )
    const response: any = await $api.post(url)
    return response.data
  }

  @Action({ commit: 'setWarehouseBySeller', rawError: true })
  async actWarehouseBySeller( params? : any  ): Promise<string | undefined> {
    try {
      const url = PathBind.transform(
        this.context,
        Warehouse.STATE_URL.GET_WAREHOUSE_SELLER
      )
      const response = await $api.get(url, { params })
      return response.data
    } catch (error) {
    }
  }
}
