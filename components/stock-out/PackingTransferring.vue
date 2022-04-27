<template lang="pug">
TabView
  TabPanel(header='Header I')
    | Transferring
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
class PackingTransferring extends Vue {

}

export default PackingTransferring
</script>
<style lang="sass" scoped>
</style>
