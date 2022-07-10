<template lang="pug">
  .sidebar(:style="{ width: sidebarWidth }")
    .menu-section.sidebar-head
      template(v-if="!collapsed")
        img.user-avatar(:src="user.avatarUrl | getThumbnailUrl")
        .user-info
          span.user-name {{ userDisplayName }}
          span.user-role {{ userRole }}
      .icon.icon--xlarge.icon-menu-toggle.surface-500(v-if="widthScreen > 1024" :class="{ 'bg-primary': collapsed }", @click="toggleSidebar")
    .menu-section.sidebar-menu
      SidebarItem(v-for="item in pageMenu" :key="item.id" :item="item" @select="onSelectMenu(item)" @toggleMenu="toggleMenu")
    .menu-section.sidebar-foot
      SidebarItem(v-for="item in settingMenu" :key="item.id" :item="item" @select="onSelectMenu(item)")
</template>

<script lang='ts'>
import { Component, namespace, ProvideReactive, Vue, Watch } from 'nuxt-property-decorator'
import { User } from '~/models/User'
import { MENU_ACTION, PAGE_MENU, SETTING_MENU } from '~/utils'
const nsSidebar = namespace('layout/store-sidebar')
const nsUser = namespace('user-auth/store-user')

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

  // -- [ Properties ] ----------------------------------------------------------
  @ProvideReactive()
  selectedItem: any = null

  @ProvideReactive()
  selectParent: any = []

  pageMenu = PAGE_MENU
  settingMenu = SETTING_MENU
  // -- [ Getters ] -------------------------------------------------------------

  get userDisplayName() {
    return this.user?.displayName || 'Unknown'
  }

  get userRole() {
    return this.user?.role?.toUpperCase() || ''
  }
  // -- [ Methods ] ------------------------------------------------------------
  
  toggleMenu() {
    this.$emit('toggleMenu')
  }

  onSelectMenu(item) {
    if(this.collapsed) return
    if(!item.parentId || !item.to) {
      if(!_.includes(this.selectParent, item.id)) {
        this.selectParent.push(item.id)
      } else {
        const subParent = _.find(this.pageMenu, (obj) => (obj.parentId === item.id && !obj.to))
        this.selectParent = _.filter(this.selectParent, (o) => {
          return o !== item.id && o !== subParent?.id
        })
      }
    } else {
      this.selectedItem = item
    }
    // handle specific actions
    if (item.action === MENU_ACTION.LOGOUT) {
      this.$auth.logout()
    }
  }

  @Watch('$route.path', { immediate: true, deep: true })
  handleSelect(path) {
    if(!this.collapsed) return
    const rootRoute = _.trim(path, '/').split('/')[0]
    if (rootRoute) {
      const itemPath = this.pageMenu.find(item => {
        return item.to === path
      })
      if(itemPath) {
        this.selectedItem = itemPath
      }
    }
  }

  mounted() {
    const path = this.$route.path
    const rootRoute = _.trim(path, '/').split('/')[0]
    if (rootRoute) {
      this.selectedItem = this.pageMenu.find(item => {
        return item.to === path
      })
      if(!this.selectedItem) {
        this.selectedItem = this.pageMenu.find(item => {
          const isPackingDetail = path.includes('/packing-detail')
          if(isPackingDetail) {
            return item.to === '/stock-out/packing/packing-note-list'
          }
          const menuRoute = _.trim(item.to, '/').split('/')[0]
          return _.trim(menuRoute, '/') === rootRoute && !isPackingDetail
        })
      }
      const subParentId = this.selectedItem?.parentId
      const subParent = _.find(this.pageMenu, (o) => (o.id === subParentId))
      if(!_.includes(this.selectParent, subParentId)) {
        this.selectParent.push(subParent?.parentId)
        this.selectParent.push(subParentId)
      }
    }
  }
}

export default MenuSidebar
</script>

<style lang="sass" scoped>
.sidebar
  @include flex-column
  float: left
  position: fixed
  z-index: 11
  top: 0
  left: 0
  bottom: 0
  padding: 30px 16px 30px 18px
  transition: 0.3s ease

  &-head
    @include flex-center-vert
    border-bottom: 1px solid $text-color-400
    padding-bottom: $space-size-24

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

  &-menu
    padding-top: $space-size-16

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
