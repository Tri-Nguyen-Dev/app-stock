import { Module, Mutation, VuexModule, Action } from 'vuex-module-decorators'
import { PathBind } from '../../utils/commons/path-bind'
import { SuccessResponse } from '~/utils/response/success-response'
import { $api } from '~/utils'

@Module({
  stateFactory: true,
  namespaced: true,
})
export default class Category extends VuexModule {
  private static readonly STATE_URL = {
    GET_CATEGORIES: '/categories',
  }

  public categoryList: [] = []

  @Mutation
  setCategoryList(data: []) {
    this.categoryList = data
  }

  @Action({ commit: 'setCategoryList', rawError: true })
  async actCategoryList(params?: any): Promise<string | undefined> {
    const categoryList = require('~/mocks/category.json')
    try {
      const url = PathBind.transform(
        this.context,
        Category.STATE_URL.GET_CATEGORIES,
        params
      )
      const response: SuccessResponse<any> = await $api.get(url)

      if (!response.content) {
        return categoryList
      }

      return response.content
    } catch (error) {}
  }
}
