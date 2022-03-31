<template lang="pug">
  .layout-wrapper.layout-static
    Sidebar
    .main-container(:style="{ marginLeft: sidebarWidth }")
      Nuxt
</template>

<script lang="ts">
import { Component, namespace, Vue } from 'nuxt-property-decorator'

const nsSidebar = namespace('layout/store-sidebar')

@Component
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
  padding: $space-size-32 $space-size-32 0
</style>
