import { Module, Mutation, VuexModule, Action } from 'vuex-module-decorators'
import { PathBind } from '~/utils/commons/path-bind'
import { $api } from '~/utils'

@Module({
  stateFactory: true,
  namespaced: true
})

export default class Warehouse extends VuexModule {
private static readonly STATE_URL = {
  GET_DRIVER: '/driver/list',
  GET_DRIVER_DETAIL: '/warehouse/list/by-seller-email'
}

public driverList: [] = []
public totalList: number
public driverDetail: [] = []

@Mutation
setDriverList(data: any) {
  this.driverList = data.items
}

@Mutation
setDriverDetail(data: any) {
  this.driverDetail = data.items
}

@Action({ commit: 'setDriverList', rawError: true })
async actDriverList( ): Promise<string | undefined> {
  try {
    const url = PathBind.transform(
      this.context,
      Warehouse.STATE_URL.GET_DRIVER
    )
    const response = await $api.get(url)
    return response.data
  } catch (error) {}
}

@Action({ commit: 'setDriverDetail', rawError: true })
async actDriverDetail(params: { id: string }): Promise<string | undefined> {
  try {
    const url = PathBind.transform(
      this.context,
      Warehouse.STATE_URL.GET_DRIVER_DETAIL, params
    )
    const response = await $api.get(url)
    return response.data
  } catch (error) {}
}

}
