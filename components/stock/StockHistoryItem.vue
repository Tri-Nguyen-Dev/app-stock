<template lang="pug">
  .grid
    .col.border-right-1.border-black-alpha-10
      .grid
        .col-fixed.flex.align-items-center
          div.surface-200.p-2.border-round
            .icon--large.icon-transferring.bg-green-400(v-show='item.description === "REQUEST_ACTION_TO_TRANSFERRING_BOX"')
            .icon--large.icon-outgoing.bg-orange-400(v-show='item.description === "REQUEST_ACTION_TO_OUTGOING_BOX"')
            .icon--large.icon-incoming.bg-blue-500(v-show='item.description === "REQUEST_ACTION_TO_IMPORT_BOX"')
        .col
          div.font-semibold.text-lg(v-show='item.description === "REQUEST_ACTION_TO_TRANSFERRING_BOX"') Transferring
          div.font-semibold.text-lg(v-show='item.description === "REQUEST_ACTION_TO_OUTGOING_BOX"') Outgoing
          div.font-semibold.text-lg(v-show='item.description === "REQUEST_ACTION_TO_IMPORT_BOX"') Incoming
          span.font-bold.text-lg {{item.amount}}
    .col.border-right-1.border-black-alpha-10
      .grid
        .col-fixed.flex.align-items-center
          div.surface-200.p-2.border-round
            .icon--large.icon-initial-quantity
        .col
          div.font-semibold.text-lg Current
          span.font-bold.text-lg {{item.initialQuantity}}
    .col
      .grid
        .col-fixed.flex.align-items-center
          div.surface-200.p-2.border-round
            .icon--large.icon-inventory-quantity
        .col
          div.font-semibold.text-lg Total
          span.font-bold.text-lg(v-if='item.description === "REQUEST_ACTION_TO_IMPORT_BOX"') {{item.initialQuantity + item.amount}}
          span.font-bold.text-lg(v-else) {{item.initialQuantity - item.amount}}

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
