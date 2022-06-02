<template lang="pug">
.packingTimeDelivery.grid(v-if="timeDelivery")
  .icon.icon-calendar-infor.mr-2.bg-blue-700.inline-block
  span.uppercase.font-bold.mb-4 driver information
  .col-12(className='lg:col-12 md:col-12 sm:col-12 py-3 px-2')
    StockUnit(title="Name" :value="`${driverInfo.firstName}  ${driverInfo.lastName}`" icon="icon-sender-phone")
  .col-12(className='lg:col-12 md:col-12 sm:col-12 py-3 px-2')
    StockUnit(title="Phone" :value="driverInfo.phoneNumber" icon="icon-sender-phone")
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
class DeliveryDriverInfo extends Vue {
  @Prop() driverInfo!: any
}

export default DeliveryDriverInfo
</script>
<style lang="sass" scoped>
</style>
