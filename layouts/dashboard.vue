<template lang="pug">
  div
    .col.fixed.sideMenu
      Sidemenu
    .col.mainContent
      Nuxt
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
class Dashboard extends Vue {}

export default Dashboard
</script>

<style lang="sass">
.sideMenu
  min-height: 100vh
.mainContent
  margin-left: 250px
</style>
