import { Module, Mutation, VuexModule, Action } from 'vuex-module-decorators'
import { PathBind } from '~/utils/commons/path-bind'
import { $api } from '~/utils'
import { Category as CategoryModel } from '~/models/Category'

@Module({
  stateFactory: true,
  namespaced: true
})
export default class Category extends VuexModule {
  private static readonly STATE_URL = {
    GET_CATEGORIES: '/category/list',
    GET_CATEGORIES_TOTAL: '/category/list',
    DELETE_CATEGORY: '/category/:id/delete',
    CREATE_CATEGORY: '/category/create',
    UPDATE_CATEGORY: '/category/:id/update'
  }

  public categoryList: any = []
  public categoriesTotal: any = []
  public newCategoryDetail: any = {}

  @Mutation
  setCategoryList(data: any) {
    this.categoryList = data.items
    this.categoriesTotal = data.total
  }

  @Mutation
  setNewCategory(newCategoryDetail: CategoryModel.CreateCategory) {
    this.newCategoryDetail = newCategoryDetail
  }

  @Action({ commit: 'setCategoryList', rawError: true })
  async actCategoryList(params?: any): Promise<string | undefined> {
    try {
      const url = PathBind.transform(
        this.context,
        Category.STATE_URL.GET_CATEGORIES,
        params
      )
      const response = await $api.get(url, { params })
      return response.data
    } catch (error) {}
  }

  @Action({ rawError: true })
  async actDeleteCategoryByIds(id): Promise<string | undefined> {
    const url = PathBind.transform(
      this.context,
      Category.STATE_URL.DELETE_CATEGORY,
      { id }
    )
    const response: any = await $api.post(url)
    return response.data
  }

  @Action({ commit: 'setNewCategory', rawError: true })
  async actCreateNewCategory(params: any): Promise<string | undefined> { 
    const url = PathBind.transform(
      this.context,
      Category.STATE_URL.CREATE_CATEGORY
    )
    const response = await $api.post(url, params)
    return response.data
  }

  @Action({ rawError: true })
  async actUpdateCategory(params: any): Promise<string | undefined> {
    const url = PathBind.transform(
      this.context,
      Category.STATE_URL.UPDATE_CATEGORY,
      { id: params.id }
    )
    const response: any = await $api.post(url, params)
    return response.data
  }
}
