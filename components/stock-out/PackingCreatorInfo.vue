<template lang="pug">
.packingWarehouseInfo.grid(v-if="creatorInfo.createdBy")
  .icon.icon-profile-circle.mr-2.bg-blue-700.inline-block
  span.uppercase.font-bold.mb-4 warehouse information
  .col-12(className='lg:col-12 md:col-12 sm:col-12 py-3 px-2')
    StockUnit(title="Creator ID" :value="creatorInfo.createdBy.id" icon="icon-sender-name")
  .col-12(className='lg:col-12 md:col-12 sm:col-12 py-3 px-2')
    StockUnit(title="Email Address" :value="creatorInfo.createdBy.email" icon="icon-sender-email")
  .col-12(className='lg:col-12 md:col-12 sm:col-12 py-3 px-2')
    StockUnit(title="Phone number" :value="creatorInfo.createdBy.phoneNumber" icon="icon-sender-phone")
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
class PackingCreatorInfo extends Vue {
  @Prop() creatorInfo!: any
}

export default PackingCreatorInfo
</script>
<style lang="sass" scoped>
</style>
