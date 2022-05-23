<template lang="pug">
  .layout-wrapper.layout-static
    MenuSidebar(v-if="widthScreen > 1024")
    .main-container(:style="{ marginLeft: widthScreen > 1024 ? sidebarWidth : 0 }")
      Toast
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

  @nsSidebar.State
  widthScreen!: number

  @nsSidebar.Action
  handleGetWidth!: (params?: any) => Promise<void>
     
  onResize(_e: any) {
    this.handleGetWidth(window.innerWidth)
  }

  created() {
    window.addEventListener('resize', this.onResize)
  }

  destroyed() {
    window.removeEventListener('resize', this.onResize)
  }
}

export default Dashboard
</script>

<style lang="sass">
.main-container
  background-color: $bg-body-base
  height: 100vh
  padding: $space-size-32
</style>
