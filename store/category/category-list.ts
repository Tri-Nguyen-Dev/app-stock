import { Module, Mutation, VuexModule, Action } from 'vuex-module-decorators'
import { PathBind } from '~/utils/commons/path-bind'
import { $api } from '~/utils'

@Module({
  stateFactory: true,
  namespaced: true
})
export default class Category extends VuexModule {
  private static readonly STATE_URL = {
    GET_CATEGORIES: '/api/category/list'
  }

  public categoryList: any = []

  @Mutation
  setCategoryList(data: any) { 
    this.categoryList = data.items
  }

  @Action({ commit: 'setCategoryList', rawError: true })
  async actCategoryList(): Promise<string | undefined> {
    try {
      const url = PathBind.transform(
        this.context,
        Category.STATE_URL.GET_CATEGORIES
      )
      const response = await $api.get(url)      
  
      return response.data
    } catch (error) {}
  }
}
