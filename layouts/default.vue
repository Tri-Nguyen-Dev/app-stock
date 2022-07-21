<template lang="pug">
  .layout-wrapper.layout-static
    MenuSidebar(v-if="widthScreen > 1024")
    Sidebar(v-else :visible.sync="visibleMenu")
      MenuSidebar(@toggleMenu='toggleMenu')
    .menu-mobile(v-if="widthScreen <= 1024")
      .menu-mobile-icon.pi.pi-align-justify( @click="handleToggleMenu")
    .main-container(:style="{ marginLeft: widthScreen > 1024 ? sidebarWidth : 0 }")
      Toast
      Nuxt(v-if="renderMyComponent")
</template>

<script lang="ts">
import { Component, namespace, Vue, Watch } from 'nuxt-property-decorator'
import Sidebar from 'primevue/sidebar'
import MenuSidebar from '~/components/sidebar/Sidebar.vue'
const nsSidebar = namespace('layout/store-sidebar')
const nsStoreWarehouse = namespace('warehouse/warehouse-list')

@Component({
  middleware: 'authenticate',
  components: { MenuSidebar, Sidebar }
})
class Dashboard extends Vue {
  visibleMenu: boolean = false
  renderMyComponent: boolean = true

  @nsSidebar.Getter('sidebarWidth')
  sidebarWidth!: string

  @nsSidebar.State
  widthScreen!: number

  @nsStoreWarehouse.State
  warehouseSelected!: any
  
  @nsSidebar.Mutation('openSidebar')
  closeSidebar

  @Watch('warehouseSelected')
  changeWarehouse() {
    this.renderMyComponent = false
    this.$nextTick(() => {
      this.renderMyComponent = true
    })
  }

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
  padding: $space-size-16
  @include mobile
    min-height: 100vh
  @include tablet
    min-height: 100vh
  @include desktop
    padding: $space-size-32
    height: 100vh
    overflow: hidden
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
::-webkit-scrollbar
  width: 7px
  height: 7px
  background-color: #F5F5F5

::-webkit-scrollbar-track
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3)
  border-radius: 10px
  background-color: #F5F5F5

::-webkit-scrollbar-thumb
  border-radius: 10px
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3)
  background-color: #979AA4
</style>
