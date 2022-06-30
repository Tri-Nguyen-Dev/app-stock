<template lang="pug">
.packingSellerInfo.grid(v-if="sellerInfo.seller")
  .icon.icon-sender-info.mr-2.bg-blue-700.inline-block
  span.uppercase.font-bold.mb-4 Seller information
  .col-12(className='lg:col-12 md:col-12 sm:col-12 py-3 px-2')
    StockUnit(title="Seller name" :value="sellerInfo.seller.displayName || `${sellerInfo.seller.firstName} ${sellerInfo.seller.lastName}`" icon="icon-sender-name")
  .col-12(className='lg:col-12 md:col-12 sm:col-12 py-3 px-2')
    StockUnit(title="Email Address" :value="sellerInfo.seller.email" icon="icon-sender-email")
  .col-12(className='lg:col-12 md:col-12 sm:col-12 py-3 px-2')
    StockUnit(title="Phone number" :value="sellerInfo.seller.phoneNumber" icon="icon-sender-phone")
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
class PackingSellerInfo extends Vue {
  @Prop() sellerInfo!: any
}

export default PackingSellerInfo
</script>
<style lang="sass" scoped>

</style>
