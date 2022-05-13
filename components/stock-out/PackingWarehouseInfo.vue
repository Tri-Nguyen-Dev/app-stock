<template lang="pug">
.packingWarehouseInfo.grid(v-if="warehouseInfo.warehouse")
  .icon.icon-warehouse-info.mr-2.bg-blue-700.inline-block
  span.uppercase.font-bold.mb-4 {{warehouseInfo.warehouse.name}}
  .col-12(className='lg:col-12 md:col-12 sm:col-12 py-3 px-2')
    StockUnit.location-unit(title="Address" :value="warehouseInfo.warehouse.address" icon="icon-location-r")
  .col-12(className='lg:col-12 md:col-12 sm:col-12 py-3 px-2')
    StockUnit(title="Email Address" :value="warehouseInfo.warehouse.email" icon="icon-sender-email")
  .col-12(className='lg:col-12 md:col-12 sm:col-12 py-3 px-2')
    StockUnit(title="Phone number" :value="warehouseInfo.warehouse.phone" icon="icon-sender-phone")
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
class PackingWarehouseInfo extends Vue {
  @Prop() warehouseInfo!: any
}

export default PackingWarehouseInfo
</script>
<style lang="sass" scoped>
</style>
