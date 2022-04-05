<template>
  <div class="sidebar" :style="{ width: sidebarWidth }">
    <div class="menu-section sidebar-head">
      <img v-if="!collapsed" class="user-avatar" :src="userImageUrl"/>
      <div v-if="!collapsed" class="user-info">
        <span class="user-name">{{ userDisplayName }}</span>
        <br>
        <span class="user-role">Role Example</span>
      </div>
      <div
        class="icon icon--xlarge icon-menu-toggle bg-primary"
        @click="toggleSidebar"
      >
      </div>
    </div>

    <div class="menu-section sidebar-menu">
      <SidebarItem to="/stock" icon="icon-shopping-cart">Stock</SidebarItem>
      <SidebarItem to="/activity" icon="icon-activity">Activities</SidebarItem>
      <SidebarItem to="/bin" icon="icon-location">Bin</SidebarItem>
      <SidebarItem to="/role" icon="icon-award">Role</SidebarItem>
      <SidebarItem to="/shipper" icon="icon-user-octagon">Shipper</SidebarItem>
      <SidebarItem to="/tags" icon="icon-tag">Tags</SidebarItem>
      <SidebarItem to="/seller" icon="icon-send-square">Seller</SidebarItem>
      <SidebarItem to="/dashboard" icon="icon-dashboard">Dashboard</SidebarItem>
      <SidebarItem to="/inventory" icon="icon-dollar-square">Inventory Fee</SidebarItem>
    </div>

    <div class="menu-section sidebar-foot">
      <SidebarItem to="/notification" icon="icon-notification">Notifications</SidebarItem>
      <SidebarItem to="/setting" icon="icon-setting">Setting</SidebarItem>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, namespace, Vue } from 'nuxt-property-decorator'
import { User } from '~/models/User'

const nsSidebar = namespace('layout/store-sidebar')


@Component
class Sidebar extends Vue {
  @nsSidebar.Getter('sidebarWidth')
  sidebarWidth!: string

  @nsSidebar.State('collapsed')
  collapsed!: boolean

  @nsSidebar.Mutation('toggleSidebar')
  toggleSidebar

  PAGE_MENU = [
    {
      to: '', icon: 'stock', active: false, child: [

      ]
    }

  ]

  get user() {
    return this.$auth.user as unknown as User.Model
  }

  get userImageUrl() {
    return this.user.userDetail.pictureUrl
  }

  get userDisplayName() {
    return this.user.userDetail.displayName
  }
}
export default  Sidebar
</script>

<style lang="sass" scoped>
.sidebar
  @include flex-column
  float: left
  position: fixed
  z-index: 1
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

    .user-name
      font-size: $font-size-large
      font-weight: $font-weight-bold

    .icon
      margin-left: auto

  &-menu
    padding-top: $space-size-16


  &-foot
    border-top: 1px solid $text-color-400
    height: 130px
    margin-top: auto

  .menu-section
    position: relative

.collapse-icon
  position: absolute
  bottom: 0
  padding: 0.75em
  color: rgba(255, 255, 255, 0.7)
  transition: 0.2s linear
</style>
