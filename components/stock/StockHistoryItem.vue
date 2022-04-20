<template lang="pug">
  .grid
    .col.border-right-1.border-black-alpha-10
      .grid
        .col-fixed.flex.align-items-center
          div.surface-200.p-2.border-round
            .icon--large.icon-transferring.bg-green-400(v-show='item.description === "REQUEST_ACTION_TO_INVENTORY"')
            .icon--large.icon-outgoing.bg-orange-400(v-show='item.description === "REQUEST_ACTION_TO_EXPORT_BOX"')
            .icon--large.icon-incoming.bg-blue-500(v-show='item.description === "REQUEST_ACTION_TO_IMPORT_BOX"')
        .col
          div.font-semibold.text-lg(v-show='item.description === "REQUEST_ACTION_TO_INVENTORY"') Transferring quantity
          div.font-semibold.text-lg(v-show='item.description === "REQUEST_ACTION_TO_EXPORT_BOX"') Outgoing Quantity
          div.font-semibold.text-lg(v-show='item.description === "REQUEST_ACTION_TO_IMPORT_BOX"') Incoming Quantity
          span.font-bold.text-lg {{item.amount}}
    .col.border-right-1.border-black-alpha-10
      .grid
        .col-fixed.flex.align-items-center
          div.surface-200.p-2.border-round
            .icon--large.icon-initial-quantity
        .col
          div.font-semibold.text-lg Initial Quantity
          span.font-bold.text-lg {{item.initialQuantity}}
    .col
      .grid
        .col-fixed.flex.align-items-center
          div.surface-200.p-2.border-round
            .icon--large.icon-inventory-quantity
        .col
          div.font-semibold.text-lg Inventory Quantity
          span.font-bold.text-lg {{item.inventoryQuantity}}
</template>
<script lang='ts'>
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
class StockHistoryItem extends Vue {
  @Prop() readonly item!: any | undefined
}

export default StockHistoryItem
</script>
<style scoped lang="sass">

</style>