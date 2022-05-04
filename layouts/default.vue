<template lang="pug">
  .layout-wrapper.layout-static
    MenuSidebar
    .main-container(:style="{ marginLeft: sidebarWidth }")
      Nuxt
</template>

<script lang="ts">
import { Component, namespace, Vue } from 'nuxt-property-decorator'
import MenuSidebar from '~/components/sidebar/Sidebar.vue'
const nsSidebar = namespace('layout/store-sidebar')

@Component({
  middleware: 'authenticate',
  components: { MenuSidebar }
})
class Dashboard extends Vue {
  @nsSidebar.Getter('sidebarWidth')
  sidebarWidth!: string
}

export default Dashboard
</script>

<style lang="sass">
.main-container
  background-color: $bg-body-base
  height: 100vh
  padding: $space-size-32
</style>
