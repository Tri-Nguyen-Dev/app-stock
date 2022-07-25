<template lang="pug">
  
  .layout-wrapper.layout-static
    .loading(v-if='showLoading')
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
const nsCommon = namespace('commons/store-common')
const nsStoreWarehouse = namespace('warehouse/warehouse-list')

@Component({
  middleware: 'authenticate',
  components: { MenuSidebar, Sidebar }
})
class Dashboard extends Vue {
  visibleMenu: boolean = false
  // showLoading = false
  renderMyComponent: boolean = true

  @nsSidebar.Getter('sidebarWidth')
  sidebarWidth!: string

  @nsSidebar.State
  widthScreen!: number

  @nsStoreWarehouse.State
  warehouseSelected!: any
  
  @nsSidebar.Mutation('openSidebar')
  closeSidebar

  @nsCommon.State
  viewLoading!: boolean
  
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

  get showLoading(){
    return this.viewLoading
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

.loading 
  position: fixed
  z-index: 10000
  overflow: show
  margin: auto
  top: 0
  left: 0
  bottom: 0
  right: 0
  width: 50px
  height: 50px

/* Transparent Overlay */
.loading:before 
  content: ''
  display: block
  position: fixed
  top: 0
  left: 0
  width: 100%
  height: 100%
  background-color: rgba(255,255,255,0.5)

/* :not(:required) hides these rules from IE9 and below */
.loading:not(:required) 
  /* hide "loading..." text */
  font: 0/0 a
  color: transparent
  text-shadow: none
  background-color: transparent
  border: 0

.loading:not(:required):after 
  content: ''
  display: block
  font-size: 10px
  width: 50px
  height: 50px
  margin-top: -0.5em
  border: 5px solid #848484
  border-radius: 100%
  border-bottom-color: transparent
  -webkit-animation: spinner 1s linear 0s infinite
  animation: spinner 1s linear 0s infinite
/* Animation */

@-webkit-keyframes spinner 
  0% 
    -webkit-transform: rotate(0deg)
    -moz-transform: rotate(0deg)
    -ms-transform: rotate(0deg)
    -o-transform: rotate(0deg)
    transform: rotate(0deg)
  100% 
    -webkit-transform: rotate(360deg)
    -moz-transform: rotate(360deg)
    -ms-transform: rotate(360deg)
    -o-transform: rotate(360deg)
    transform: rotate(360deg)
@-moz-keyframes spinner 
  0% 
    -webkit-transform: rotate(0deg)
    -moz-transform: rotate(0deg)
    -ms-transform: rotate(0deg)
    -o-transform: rotate(0deg)
    transform: rotate(0deg)
  
  100% 
    -webkit-transform: rotate(360deg)
    -moz-transform: rotate(360deg)
    -ms-transform: rotate(360deg)
    -o-transform: rotate(360deg)
    transform: rotate(360deg)

@-o-keyframes spinner 
  0% 
    -webkit-transform: rotate(0deg)
    -moz-transform: rotate(0deg)
    -ms-transform: rotate(0deg)
    -o-transform: rotate(0deg)
    transform: rotate(0deg)
  100% 
    -webkit-transform: rotate(360deg)
    -moz-transform: rotate(360deg)
    -ms-transform: rotate(360deg)
    -o-transform: rotate(360deg)
    transform: rotate(360deg)
@keyframes spinner 
  0% 
    -webkit-transform: rotate(0deg)
    -moz-transform: rotate(0deg)
    -ms-transform: rotate(0deg)
    -o-transform: rotate(0deg)
    transform: rotate(0deg)
  
  100% 
    -webkit-transform: rotate(360deg)
    -moz-transform: rotate(360deg)
    -ms-transform: rotate(360deg)
    -o-transform: rotate(360deg)
    transform: rotate(360deg)
</style>
