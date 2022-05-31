<template lang="pug">
  .layout-wrapper.layout-static
    MenuSidebar(v-if="widthScreen > 1024")
    Sidebar(v-else :visible.sync="visibleMenu")
      MenuSidebar(@toggleMenu='toggleMenu')
    .menu-mobile(v-if="widthScreen <= 1024")
      .menu-mobile-icon.pi.pi-align-justify( @click="handleToggleMenu")
    .main-container(:style="{ marginLeft: widthScreen > 1024 ? sidebarWidth : 0 }")
      Toast
      Nuxt
</template>

<script lang="ts">
import { Component, namespace, Vue } from 'nuxt-property-decorator'
import Sidebar from 'primevue/sidebar'
import MenuSidebar from '~/components/sidebar/Sidebar.vue'
const nsSidebar = namespace('layout/store-sidebar')

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
  closeSidebar

  handleToggleMenu() {
    this.visibleMenu = !this.visibleMenu
    this.closeSidebar()
  }
  
  toggleMenu(){
    this.handleToggleMenu()
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
    font-size: 20px

</style>
