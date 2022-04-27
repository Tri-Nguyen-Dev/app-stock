<template lang="pug">
  .border-top-1.border-gray-300.grid-nogutter
    .col.p-4.border-tab
      .grid.grid-nogutter.align-items-center.mb-4
        .icon.bg-primary.surface-900.mr-3.icon-sender-info
        span.uppercase.text-800.font-bold Seller Information
      div
        StockOutItemInput( v-for='item in sellerInfor' :key='item.id' :title='item.label' :disable='item.disable' :options='item.options' )
    .border-top-1.border-gray-300.grid-nogutter
    .col.p-4
      .grid.grid-nogutter.align-items-center.mb-4
        .icon.bg-primary.surface-900.mr-3.icon-receive-square
        span.uppercase.text-800.font-bold receiver information
      div
        StockOutItemInput( v-for='item in receiverInfor' :key='item.id' :title='item.label' :disable='item.disable' :options='item.options' )
    .border-top-1.border-gray-300.grid-nogutter
    .col.p-4
      .grid.grid-nogutter.align-items-center.mb-4
        .icon.bg-primary.surface-900.mr-3.icon-calendar-infor
        span.uppercase.text-800.font-bold time information
      div
        StockUnit(
          title="Due delivery date"
          icon="icon-calendar"
          :value="deliveryDate"
        )
        StockUnit.mt-2(
          title="Estimated delivery date"
          icon="icon-clock"
          :value="estimatedDate"
        )
    .border-top-1.border-gray-300.grid-nogutter
    .col.p-4
      .grid.grid-nogutter.align-items-center.mb-4
        .icon.bg-primary.surface-900.mr-3.icon-buildings
        span.uppercase.text-800.font-bold warehouse contact
      div
        StockOutItemInput( v-for='item in warehouseContact' :key='item.id' :title='item.label' :disable='item.disable' :options='item.options' )
    .border-top-1.border-gray-300.grid-nogutter
    .col.p-4
      .grid.grid-nogutter.align-items-center.mb-4
        .icon.bg-primary.surface-900.mr-3.icon-profile-circle
        span.uppercase.text-800.font-bold creator information
      div
        StockOutItemInput( v-for='item in cretorInfor' :key='item.id' :title='item.label' :disable='item.disable' :options='item.options' )
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { SELLER_INFORMATION, RECEIVER_INFORMATION, WAREHOUSE_CONTACT, CREATOR_INFORMATION } from '~/utils'

@Component
class LabelCreate extends Vue {
  @Prop() readonly title!: any | undefined
  @Prop() readonly icon!: any | undefined

  deliveryDate: string = 'Fill receiver information'
  estimatedDate: string = 'Fill receiver information'

  sellerInfor = SELLER_INFORMATION
  receiverInfor = RECEIVER_INFORMATION
  warehouseContact = WAREHOUSE_CONTACT
  cretorInfor = CREATOR_INFORMATION

}

export default LabelCreate
</script>
<style lang="sass" scoped>
.text-label::after
	content: ':'

</style>