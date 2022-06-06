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
  GET_DRIVER_HISTORY: '/staff/:id/driver-delivery-history',
  GET_DRIVER_DETAIL: '/staff/:id/driver-info',
  POST_DRIVER: '/delivery-order/:idDelivery/set-delivery'
}

public driverList: [] = []
public totalList: number = 0
public driverHistory: [] = []
public totalDetailList: number = 0
public driverDetail: [] = []

@Mutation
setDriverList(data: any) {
  this.driverList = data.items
  this.totalList = data.total
}

@Mutation
setDriverHistory(data: any) {
  this.driverHistory = data?.items
  this.totalDetailList = data?.total

}

@Mutation
setDriverDetail(data : any ){
  this.driverDetail = data
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

@Action({ commit: 'setDriverHistory', rawError: true })
async actDriverHistory(params: any ): Promise<string | undefined> {
  try {
    const url = PathBind.transform(
      this.context,
      Driver.STATE_URL.GET_DRIVER_HISTORY, { id: params.id }
    )
    const response = await $api.get(url, { params: params.filter })
    return response.data
  } catch (error) {}
}

@Action({ commit: 'setDriverDetail', rawError: true })
async actDriverDetail(params: any ): Promise<string | undefined> {
  try {
    const url = PathBind.transform(
      this.context,
      Driver.STATE_URL.GET_DRIVER_DETAIL, { id: params.id }
    )
    const response = await $api.get(url )
    return response.data
  } catch (error) {}
}

@Action({ rawError: true })
async actSetAssignDriver(
  params
): Promise<string | undefined> {
  try {
    const url = PathBind.transform(this.context, Driver.STATE_URL.POST_DRIVER,  params )
    const response = await $api.post(url, { id: params.id })
    if (!response.data) {
      return
    }
    return response.data
  } catch (error) {
  }
}

}
