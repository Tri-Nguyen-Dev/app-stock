<template lang="pug">
  .layout-wrapper.layout-static
    MenuSidebar(v-if="widthScreen > 1024")
    Sidebar(v-else :visible.sync="visibleMenu")
      MenuSidebar(@toggleMenu='toggleMenu')
    .menu-mobile(v-if="widthScreen <= 1024")
      .menu-section.sidebar-head
        img.user-avatar(:src="user.avatarUrl | getThumbnailUrl")
        .user-info
          span.user-name {{ userDisplayName }}
          span.user-role {{ userRole }}
      .menu-mobile-icon.pi.pi-align-justify( @click="handleToggleMenu")
    .main-container(:style="{ marginLeft: widthScreen > 1024 ? sidebarWidth : 0 }")
      Toast
      Nuxt
</template>

<script lang="ts">
import { Component, namespace, Vue } from 'nuxt-property-decorator'
import Sidebar from 'primevue/sidebar'
import { User } from '~/models/User'
import MenuSidebar from '~/components/sidebar/Sidebar.vue'
const nsSidebar = namespace('layout/store-sidebar')
const nsUser = namespace('user-auth/store-user')

@Component({
  middleware: 'authenticate',
  components: { MenuSidebar, Sidebar }
})
class Dashboard extends Vue {
  visibleMenu: boolean = false

  @nsSidebar.Getter('sidebarWidth')
  sidebarWidth!: string

  @nsSidebar.State
  widthScreen!: number
  
  @nsSidebar.Mutation('openSidebar')
  openSidebar

  @nsUser.State('user')
  user!: User.Model | undefined

  @nsSidebar.Action
  handleGetWidth!: (params?: any) => Promise<void>
  
  get userDisplayName() {
    return this.user?.displayName || 'Unknown'
  }

  get userRole() {
    return this.user?.role?.toUpperCase() || ''
  }

  handleToggleMenu() {
    this.visibleMenu = !this.visibleMenu
    this.openSidebar()
  }
  
  onResize(_e: any) {
    this.handleGetWidth(window.innerWidth)
  }
  
  toggleMenu(){
    this.handleToggleMenu()
  }

  created() {
    window.addEventListener('resize', this.onResize)
  }

  destroyed() {
    window.removeEventListener('resize', this.onResize)
  }
}

export default Dashboard
</script>

<style lang="sass">
.main-container
  background-color: $bg-body-base
  min-height: 100vh
  padding: $space-size-16
  @incluce desktop
    padding: $space-size-32
.layout-static
  ::v-deep.p-sidebar-header 
    z-index: 1111

.menu-mobile
  @include flex-center-space-between
  flex-direction: row
  background-color: $color-white
  padding: 8px 16px
  .menu-mobile-icon 
    font-size: 24px
  .sidebar-head 
    @include flex-center-vert
    .user-avatar
      @include size(48px)
      border: 2px solid #0095FF
      border-radius: 8px
      margin-right: $space-size-12

    .user-info
      @include flex-column
      flex-grow: 1

      .user-name
        font-size: $font-size-large
        font-weight: $font-weight-bold
      .user-role
        font-size: $font-size-small
        font-weight: $font-weight-light
        color: $text-color-700
</style>
