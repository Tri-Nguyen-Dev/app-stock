import { Module, Mutation, VuexModule } from 'vuex-module-decorators'

export const SIDEBAR_WIDTH = 270
export const SIDEBAR_WIDTH_COLLAPSED = 90

@Module({
  stateFactory: true,
  namespaced: true
})
export default class StoreSidebar extends VuexModule {

  public collapsed: boolean = false

  get sidebarWidth(): string {
    return `${this.collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH}px`
  }

  @Mutation
  toggleSidebar() {
    this.collapsed = !this.collapsed
  }
}
