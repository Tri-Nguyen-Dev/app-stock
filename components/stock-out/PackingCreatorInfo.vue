<template lang="pug">
.packingWarehouseInfo.grid
  .icon.icon-profile-circle.mr-2.bg-blue-700.inline-block
  span.uppercase.font-bold.mb-4 warehouse information
  .col-12(className='lg:col-12 md:col-12 sm:col-12 py-3 px-2')
    StockUnit(title="Id creator" value="BDSM6969" icon="icon-sender-name")
  .col-12(className='lg:col-12 md:col-12 sm:col-12 py-3 px-2')
    StockUnit(title="Email Address" value="linhndm@gmail.com" icon="icon-sender-email")
  .col-12(className='lg:col-12 md:col-12 sm:col-12 py-3 px-2')
    StockUnit(title="Phone number" value="+84 333 666 888" icon="icon-sender-phone")
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
class PackingCreatorInfo extends Vue {

}

export default PackingCreatorInfo
</script>
<style lang="sass" scoped>
</style>
