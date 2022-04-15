<template lang="pug">
  .stock__log--information(v-if='historyList.data && historyList.data.items')
    .bg-white.border-round.p-3(v-for='item in historyList.data.items').mb-3
      .isChangeDate.pb-3.flex
        div.flex.mr-4
          .icon.icon-calendar
          span.font-semibold {{convertDate(item.createdAt)}}
        div.flex
          span.uppercase.text-500.font-semibold boxcode:&nbsp;
          span.uppercase.font-semibold.text-blue-700.mr-1 {{item.boxCode}}
          .icon.icon-arrow-up-right
      .informationChange.pt-3
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
<script lang="ts">
import moment from 'moment'
import { Component, Vue, namespace } from 'nuxt-property-decorator'
const nsStoreStockHistory = namespace('stock/stock-detail')

@Component
class StockLogInformation extends Vue {
  outgoing: boolean = true
  transferring: boolean = false
  incoming: boolean = false

  @nsStoreStockHistory.State
  historyList!: {}

  @nsStoreStockHistory.Action
  actGetHistoryStock!: (params:any) => Promise<void>

  convertDate(date: any) {
    return moment(date).format('hh:mm, DD MMMM YYYY')
  }

  async mounted() {
    await this.actGetHistoryStock({ stockId: this.$route.params.sid, boxId: this.$route.params.bid })
  }
}

export default StockLogInformation
</script>
<style lang="sass" scoped>
.stock__log--information
  .isChangeDate
    border-bottom: 1px solid #eeeff2
</style>
