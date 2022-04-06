<template lang="pug">
  .sidebar(:style="{ width: sidebarWidth }")
    .menu-section.sidebar-head
      template(v-if="!collapsed")
        img.user-avatar(:src="userImageUrl")
        .user-info
          span.user-name {{ userDisplayName }}
          span.user-role Role Ex
      .icon.icon--xlarge.icon-menu-toggle.surface-500(:class="{ 'bg-primary': collapsed}", @click="toggleSidebar")

    .menu-section.sidebar-menu
      SidebarItem(v-for="")
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
  // -- [ Statement Properties ] ------------------------------------------------

  @nsSidebar.Getter('sidebarWidth')
  sidebarWidth!: string

  @nsSidebar.State('collapsed')
  collapsed!: boolean

  @nsSidebar.Mutation('toggleSidebar')
  toggleSidebar

  // -- [ Properties ] ----------------------------------------------------------

  // -- [ Getters ] ----------------------------------------------------------

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

export default Sidebar
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

    .user-info
      @include flex-column
      flex-grow: 1

    .user-name
      font-size: $font-size-large
      font-weight: $font-weight-bold

  &-menu
    padding-top: $space-size-16

  &-foot
    border-top: 1px solid $text-color-400
    height: 130px
    margin-top: auto

  .menu-section
    position: relative
</style>
