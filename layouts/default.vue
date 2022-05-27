<template lang="pug">
  .layout-wrapper.layout-static
    MenuSidebar(v-if="widthScreen > 1024")
    Sidebar(v-else :visible.sync="visibleMenu")
      MenuSidebar(@toggleMenu='toggleMenu')
    .main-container(:style="{ marginLeft: widthScreen > 1024 ? sidebarWidth : 0 }")
      .menu-mobile.pi.pi-align-justify(v-if="widthScreen <= 1024" @click="handleToggleMenu")
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

  @nsSidebar.Action
  handleGetWidth!: (params?: any) => Promise<void>

  handleToggleMenu() {
    this.visibleMenu = !this.visibleMenu
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
  height: 100vh
  padding: $space-size-16
  @incluce desktop
    padding: $space-size-32
  .menu-mobile 
    font-size: 20px
.layout-static
  ::v-deep.p-sidebar-header 
    z-index: 1111
</style>
