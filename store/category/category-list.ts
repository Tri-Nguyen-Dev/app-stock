import { Module, Mutation, VuexModule, Action } from 'vuex-module-decorators'
import { PathBind } from '../../utils/commons/path-bind'
import { $api } from '~/utils'

@Module({
  stateFactory: true,
  namespaced: true
})
export default class Category extends VuexModule {
  private static readonly STATE_URL = {
    GET_CATEGORIES: '/category/list'
  }

  public categoryList: [] = []

  @Mutation
  setCategoryList(data: []) {
    this.categoryList = data
  }

  @Action({ commit: 'setCategoryList', rawError: true })
  async actCategoryList(): Promise<string | undefined> {
    const categoryList = require('~/mocks/category.json')
    try {
      const url = PathBind.transform(
        this.context,
        Category.STATE_URL.GET_CATEGORIES
      )
      const response = await $api.post(url)

      if (!response.data) {
        return categoryList
      }

      return response.data
    } catch (error) {}
  }
}
