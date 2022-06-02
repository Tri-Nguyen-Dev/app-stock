import { Module, Mutation, VuexModule, Action } from 'vuex-module-decorators'
import { PathBind } from '~/utils/commons/path-bind'
import { $api } from '~/utils'

@Module({
  stateFactory: true,
  namespaced: true
})

export default class Driver extends VuexModule {
private static readonly STATE_URL = {
  GET_DRIVER: '/staff/list-driver',
  GET_DRIVER_DETAIL: '/warehouse/list/by-seller-email',
  POST_DRIVER: ''
}

public driverList: [] = []
public totalList: string
public driverDetail: [] = []

@Mutation
setDriverList(data: any) {
  this.driverList = data.items
  this.totalList = data.total
}

@Mutation
setDriverDetail(data: any) {
  this.driverDetail = data.items
}

@Mutation
setAssignDriver(data: any) {
  this.driverDetail = data.items
}

@Action({ commit: 'setDriverList', rawError: true })
async actDriverList(params: any): Promise<string | undefined> {
  try {
    const url = PathBind.transform(
      this.context,
      Driver.STATE_URL.GET_DRIVER
    )
    const response = await $api.get(url, { params })
    return response.data

  } catch (error) {}
}

@Action({ commit: 'setDriverDetail', rawError: true })
async actDriverDetail(params: { id: string }): Promise<string | undefined> {
  try {
    const url = PathBind.transform(
      this.context,
      Driver.STATE_URL.GET_DRIVER_DETAIL, params
    )
    const response = await $api.get(url)
    return response.data
  } catch (error) {}
}

  @Action({ commit: 'setAssignDriver', rawError: true })
async actSetAssignDriver(params: any): Promise<string | undefined> {
  try{
    const url = PathBind.transform(this.context, Driver.STATE_URL.POST_DRIVER)
    const response = await $api.post(url, params)
    return response.data
  } catch (error) {}
}

}
