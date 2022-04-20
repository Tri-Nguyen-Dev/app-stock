import { Module, Mutation, VuexModule, Action } from 'vuex-module-decorators'
import { $api, PathBind } from '~/utils'
import { GenerateUploadUrl} from '~/models/common/UploadImage'

@Module({
  stateFactory: true,
  namespaced: true
})

export default class StoreUploadImage extends VuexModule {
  private static readonly STATE_URL = {
    UPLOAD_IMAGE: '/common/generate-upload-url'
  }

  public generateUploadUrl?: {} = {}

  @Mutation
  setUploadUrl(generateUploadUrl: {}){
    this.generateUploadUrl = generateUploadUrl
  }

  @Action({commit: 'setUploadUrl', rawError: true })
  async actGetGenerateUrl(params: GenerateUploadUrl): Promise<string | undefined> {
    try {
      const url = PathBind.transform(this.context, StoreUploadImage.STATE_URL.UPLOAD_IMAGE)
      const response = await $api.get(url, {params})
      return response.data
    } catch (error) {}
  }
}
