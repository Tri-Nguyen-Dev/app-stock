<template lang="pug">
  .stock__log--information.bg-white.border-round.p-3
    .isChangeDate.pb-3.flex
      div.flex.mr-4
        .icon-btn.icon-calendar
        span.font-semibold 11:00, 10 January 2022
      div.flex
        span.uppercase.text-500.font-semibold boxcode:&nbsp;
        span.uppercase.font-semibold.text-blue-700.mr-1 ef9999
        .icon-btn.icon-export
    .informationChange.pt-3
      .grid
        .col.border-right-1.border-black-alpha-10
          .grid(v-show='transferring')
            .col-fixed.flex.align-items-center
              div.surface-200.p-2.border-round
                .icon--large.icon-transferring.bg-green-400
            .col
              div.font-semibold.text-lg Transferring quantity
              span.font-bold.text-lg 20
          .grid(v-show='outgoing')
            .col-fixed.flex.align-items-center
              div.surface-200.p-2.border-round
                .icon--large.icon-outgoing.bg-orange-400
            .col
              div.font-semibold.text-lg Outgoing Quantity
              span.font-bold.text-lg 20
          .grid(v-show='incoming')
            .col-fixed.flex.align-items-center
              div.surface-200.p-2.border-round
                .icon--large.icon-incoming.bg-blue-500
            .col
              div.font-semibold.text-lg Incoming Quantity
              span.font-bold.text-lg 20
        .col.border-right-1.border-black-alpha-10
          .grid
            .col-fixed.flex.align-items-center
              div.surface-200.p-2.border-round
                .icon--large.icon-initial-quantity
            .col
              div.font-semibold.text-lg Initial Quantity
              span.font-bold.text-lg 100
        .col
          .grid
            .col-fixed.flex.align-items-center
              div.surface-200.p-2.border-round
                .icon--large.icon-inventory-quantity
            .col
              div.font-semibold.text-lg Inventory Quantity
              span.font-bold.text-lg 100
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
class StockLogInformation extends Vue {
  outgoing: boolean = true

  transferring: boolean = false

  incoming: boolean = false
}

export default StockLogInformation
</script>
<style lang="sass" scoped>
.stock__log--information
  .isChangeDate
    border-bottom: 1px solid #eeeff2

.stock__boxcode--outgoing
  width: 10px
  height: auto
</style>
