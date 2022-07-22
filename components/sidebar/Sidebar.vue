<template lang="pug">
  .sidebar(:style="{ width: sidebarWidth }" :class="{ 'sidebar-collapsed': !collapsed }")
    .menu-section.sidebar-head
      .flex
        template(v-if="!collapsed")
          img.user-avatar(:src="user?.avatarUrl | getThumbnailUrl")
          .user-info
            span.user-name {{ userDisplayName }}
            span.user-role {{ userRole }}
        .icon.icon--xlarge.icon-menu-toggle.surface-500(
          v-if="widthScreen > 1024"
          :class="{ 'bg-primary': collapsed }"
          @click="toggleSidebar")
      Dropdown.mt-2.w-full(
        v-if="isSelectWarehouse"
        v-model="selectedWarehouse"
        :options="warehouseOption"
        optionLabel="name"
        @change="changeWarehouse"
      )
    .sidebar-content
      .menu-section.sidebar-content-menu
        SidebarItem(v-for="item in pageMenu" :key="item.id" :item="item" @select="onSelectMenu(item)" @toggleMenu="toggleMenu")
      .menu-section.sidebar-content-foot
        SidebarItem(v-for="item in settingMenu" :key="item.id" :item="item" @select="onSelectMenu(item)")
</template>

<script lang='ts'>
import { Component, namespace, ProvideReactive, Vue, Watch } from 'nuxt-property-decorator'
import { User } from '~/models/User'
import { MENU_ACTION, PAGE_MENU, SETTING_MENU } from '~/utils'
const nsSidebar = namespace('layout/store-sidebar')
const nsUser = namespace('user-auth/store-user')
const nsStoreWarehouse = namespace('warehouse/warehouse-list')

@Component
class MenuSidebar extends Vue {
  // -- [ Statement Properties ] ------------------------------------------------
  @nsSidebar.State
  widthScreen!: number

  @nsSidebar.Getter('sidebarWidth')
  sidebarWidth!: string

  @nsSidebar.State('collapsed')
  collapsed!: boolean

  @nsSidebar.Mutation('toggleSidebar')
  toggleSidebar

  @nsUser.State('user')
  user!: User.Model | undefined

  @nsStoreWarehouse.State
  warehouseList!: any

  @nsStoreWarehouse.Action
  actWarehouseList!: () => Promise<void>

  @nsStoreWarehouse.Action
  actWarehouseSelected!: (warehouse) => Promise<any>

  // -- [ Properties ] ----------------------------------------------------------
  @ProvideReactive()
  selectedItem: any = null

  @ProvideReactive()
  selectParent: any = []

  pageMenu = PAGE_MENU
  settingMenu = SETTING_MENU
  warehouseOption: any = []
  selectedWarehouse: any = null
  // -- [ Getters ] -------------------------------------------------------------

  get userDisplayName() {
    return this.user?.displayName || 'Unknown'
  }

  get userRole() {
    return this.user?.role?.toUpperCase() || ''
  }

  get isSelectWarehouse() {
    return this.user?.role === 'admin'
  }
  // -- [ Methods ] ------------------------------------------------------------

  toggleMenu() {
    this.$emit('toggleMenu')
  }

  onSelectMenu(item) {
    if (this.collapsed) return
    if (!item.parentId || !item.to) {
      if (!_.includes(this.selectParent, item.id)) {
        this.selectParent.push(item.id)
      } else {
        const subParent = _.find(this.pageMenu, (obj) => (obj.parentId === item.id && !obj.to))
        this.selectParent = _.filter(this.selectParent, (o) => {
          return o !== item.id && o !== subParent?.id
        })
      }
    }
    if (item.to) {
      this.selectedItem = item
    }
    // handle specific actions
    if (item.action === MENU_ACTION.LOGOUT) {
      this.$auth.logout()
    }
  }

  changeWarehouse({ value }) {
    this.actWarehouseSelected(value)
    this.$forceUpdate()
  }

  @Watch('$route.path', { immediate: true, deep: true })
  handleSelect(path) {
    if (!this.collapsed) return
    const rootRoute = _.trim(path, '/').split('/')[0]
    if (rootRoute) {
      const itemPath = this.pageMenu.find(item => {
        return item.to === path
      })
      if (itemPath) {
        this.selectedItem = itemPath
      }
    }
  }

  async mounted() {
    if(this.isSelectWarehouse) {
      await this.actWarehouseList()
      this.warehouseOption = _.cloneDeep(this.warehouseList)
      this.selectedWarehouse = this.warehouseList[0]
    } else {
      this.selectedWarehouse = this.user?.warehouse
    }
    if(this.selectedWarehouse) {
      this.actWarehouseSelected(this.selectedWarehouse)
    }
    const path = this.$route.path
    const rootRoute = _.trim(path, '/').split('/')[0]
    if (rootRoute) {
      this.selectedItem = this.pageMenu.find(item => {
        return item.to === path
      })
      if (!this.selectedItem) {
        this.selectedItem = this.pageMenu.find(item => {
          const isPackingDetail = path.includes('/packing-detail')
          if (isPackingDetail) {
            return item.to === '/stock-out/packing/packing-note-list'
          }
          const menuRoute = _.trim(item.to, '/').split('/')[0]
          return _.trim(menuRoute, '/') === rootRoute && !isPackingDetail
        })
      }
      const subParentId = this.selectedItem?.parentId
      const subParent = _.find(this.pageMenu, (o) => (o.id === subParentId))
      if (!_.includes(this.selectParent, subParentId)) {
        this.selectParent.push(subParent?.parentId)
        this.selectParent.push(subParentId)
      }
    }
  }
}

export default MenuSidebar
</script>

<style lang="sass" scoped>
::-webkit-scrollbar
  background-color: transparent
  width: 12px
  position: absolute
  top: 0
  right: -10px

::-webkit-scrollbar-track
  display: none

::-webkit-scrollbar-thumb
  border-radius: 20px
  border: 3px solid transparent
  background-color: rgba(0, 0, 0, 0.3)
  background-clip: content-box
  position: absolute
  top: 0
  right: -10px

.sidebar-collapsed
  .sidebar-content
    overflow: hidden

  .sidebar-content:hover
    overflow-y: overlay

.sidebar
  @include flex-column
  float: left
  position: fixed
  z-index: 11
  top: 0
  left: 0
  bottom: 0
  padding: 30px 0
  transition: 0.3s ease

  &-head
    border-bottom: 1px solid $text-color-400
    padding: 0 $space-size-16 $space-size-16

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

  &-content
    @include flex-column
    flex: 1
    padding: 0 $space-size-16
    position: relative

    &-menu
      padding-top: $space-size-8
      margin-bottom: $space-size-16

    &-foot
      padding-top: $space-size-4
      border-top: 1px solid $text-color-400
      min-height: 130px
      margin-top: auto

  .menu-section
    position: relative

.user-role
  font-size: $font-size-small
  font-weight: $font-weight-light
  color: $text-color-700
</style>
