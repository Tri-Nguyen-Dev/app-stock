<template lang="pug">
TabView
  TabPanel(header='Header I')
    | Out Going
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
class PackingOutGoing extends Vue {

}

export default PackingOutGoing
</script>
<style lang="sass" scoped>
</style>
