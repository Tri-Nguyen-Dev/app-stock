<template lang="pug">
.packingSellerInfo.grid(v-if="receiverInfro")
  .icon.icon-receiver.mr-2.bg-blue-700.inline-block
  span.uppercase.font-bold.mb-4 Receiver information
  .col-12(className='lg:col-12 md:col-12 sm:col-12 py-3 px-2')
    StockUnit(:title="'Name'" :value="receiverInfro.receiverName" icon="icon-sender-name")
  .col-12(className='lg:col-12 md:col-12 sm:col-12 py-3 px-2')
    StockUnit(:title="'Address'" :value="receiverInfro.receiverAddress" icon="icon-sender-name")
  .col-12(className='lg:col-12 md:col-12 sm:col-12 py-3 px-2')
    StockUnit(title="Email" :value="receiverInfro.receiverEmail" icon="icon-sender-email")
  .col-12(className='lg:col-12 md:col-12 sm:col-12 py-3 px-2')
    StockUnit(title="Phone number" :value="receiverInfro.receiverPhone" icon="icon-sender-phone")
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
class PackingReceiverInfo extends Vue {
  @Prop() receiverInfro!: any
}

export default PackingReceiverInfo
</script>
<style lang="sass" scoped>

</style>
