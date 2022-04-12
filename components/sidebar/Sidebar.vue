<template>
  <div class="sidebar" :style="{ width: sidebarWidth }">
    <div class="menu-section sidebar-head">
      <div
        class="icon icon--large icon-menu-toggle bg-primary"
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
import { Component, namespace, Vue } from 'nuxt-property-decorator'const nsSidebar = namespace('layout/store-sidebar')

@Component
class Sidebar extends Vue {
  @nsSidebar.Getter('sidebarWidth')
  sidebarWidth!: string

  @nsSidebar.State('collapsed')
  collapsed!: boolean

  @nsSidebar.Mutation('toggleSidebar')
  toggleSidebar
}
export default  Sidebar
</script>

<style lang="scss" scoped>
.sidebar {
  float: left;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  bottom: 0;
  padding: 30px 16px 30px 18px;
  transition: 0.3s ease;
  display: flex;
  flex-direction: column;

  &-head {
    height: 48px;
    border-bottom: 2px solid #E8EAEF;
    padding-bottom: 16px;
  }

  &-menu {
    padding-top: 16px;
    border-bottom: 1px solid #E8EAEF;
  }

  &-foot {
    height: 130px;
    margin-top: auto;
  }

  .menu-section {
    position: relative;
  }
}

.collapse-icon {
  position: absolute;
  bottom: 0;
  padding: 0.75em;

  color: rgba(255, 255, 255, 0.7);

  transition: 0.2s linear;
}
</style>
