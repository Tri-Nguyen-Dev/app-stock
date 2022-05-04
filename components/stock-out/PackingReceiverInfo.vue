<template lang="pug">
.packingSellerInfo.grid
  .icon.icon-receiver.mr-2.bg-blue-700.inline-block
  span.uppercase.font-bold.mb-4 Receiver information
  .col-12(className='lg:col-12 md:col-12 sm:col-12 py-3 px-2')
    StockUnit(title="22 David Avenue, NYC" value="Nguyen The Kim Ngoc" icon="icon-sender-name")
  .col-12(className='lg:col-12 md:col-12 sm:col-12 py-3 px-2')
    StockUnit(title="Email Address" value="hungnk@gmail.com" icon="icon-sender-email")
  .col-12(className='lg:col-12 md:col-12 sm:col-12 py-3 px-2')
    StockUnit(title="Phone number" value="+84 333 666 888" icon="icon-sender-phone")
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
class PackingReceiverInfo extends Vue {

}

export default PackingReceiverInfo
</script>
<style lang="sass" scoped>

</style>
