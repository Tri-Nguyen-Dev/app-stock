<template lang="pug">
.packingWarehouseInfo.grid
  .icon.icon-warehouse-info.mr-2.bg-blue-700.inline-block
  span.uppercase.font-bold.mb-4 warehouse information
  .col-12(className='lg:col-12 md:col-12 sm:col-12 py-3 px-2')
    StockUnit.location-unit(title="Address" value="Shop 7-17, G/F, Landmark, Central" icon="icon-location-r")
  .col-12(className='lg:col-12 md:col-12 sm:col-12 py-3 px-2')
    StockUnit(title="Email Address" value="linhndm@gmail.com" icon="icon-sender-email")
  .col-12(className='lg:col-12 md:col-12 sm:col-12 py-3 px-2')
    StockUnit(title="Phone number" value="+84 333 666 888" icon="icon-sender-phone")
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
class PackingWarehouseInfo extends Vue {

}

export default PackingWarehouseInfo
</script>
<style lang="sass" scoped>
</style>
