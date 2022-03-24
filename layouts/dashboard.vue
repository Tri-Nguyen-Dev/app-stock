<template lang="pug">
.layout-wrapper.layout-static
  .layout-sidebar
    Sidebar
  .layout-main-container
    Nuxt
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
class Dashboard extends Vue {}

export default Dashboard
</script>

<style lang="sass">
.layout-main-container
  background-color: $bg-body-base
</style>
