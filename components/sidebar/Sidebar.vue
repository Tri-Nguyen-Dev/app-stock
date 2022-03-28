<template>
  <div class="sidebar" :style="{ width: sidebarWidth }">
    <h1>
      <span v-if="collapsed">
        <div>V</div>
        <div>S</div>
      </span>
      <span v-else>Vue Sidebar</span>
    </h1>

    <SidebarItem to="/" icon="fas fa-home">Home</SidebarItem>
    <SidebarItem to="/dashboard" icon="fas fa-columns">Dashboard</SidebarItem>
    <SidebarItem to="/analytics" icon="fas fa-chart-bar">Analytics</SidebarItem>
    <SidebarItem to="/friends" icon="fas fa-users">Friends</SidebarItem>
    <SidebarItem to="/image" icon="fas fa-image">Images</SidebarItem>

    <span
      class="collapse-icon"
      :class="{ 'rotate-180': collapsed }"
      @click="toggleSidebar"
    >
      <i class="fas fa-angle-double-left" />
    </span>
  </div>
</template>

<script lang='ts'>
import { Component, Mutation, namespace, Provide, Vue } from 'nuxt-property-decorator'
import SidebarItem from './SidebarItem'

const nsSidebar = namespace('layout/store-sidebar')

@Component({
  components: { SidebarItem }
})
class Sidebar extends Vue {
  @nsSidebar.Getter('sidebarWidth')
  sidebarWidth

  @nsSidebar.State('collapsed')
  @Provide()
  collapsed

  @Mutation
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
  padding: 0.5em;
  transition: 0.3s ease;
  display: flex;
  flex-direction: column;
}

.collapse-icon {
  position: absolute;
  bottom: 0;
  padding: 0.75em;

  color: rgba(255, 255, 255, 0.7);

  transition: 0.2s linear;
}

.rotate-180 {
  transform: rotate(180deg);
  transition: 0.2s linear;
}
</style>
