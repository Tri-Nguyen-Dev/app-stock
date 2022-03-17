<template lang="pug">
  .stockLogInformation.bg-white.border-round.p-3
    .isChangeDate.pb-3.flex
      div.flex.mr-4
        img(:src='require("~/assets/images/icons/icon__calendar--log.svg")').mr-3
        span.font-semibold 11:00, 10 January 2022
      div.flex
        span.uppercase.text-500.font-semibold boxcode:&nbsp;
        span.uppercase.font-semibold.text-blue-600.mr-1 ef9999
        img(:src='require("~/assets/images/icons/icon__arrow--export-blue.svg")').stock__boxcode--outgoing
    .informationChange.pt-3
      .grid
        .col.border-right-1.border-black-alpha-10
          .grid
            .col-fixed
              img(:src='require("~/assets/images/icons/icon__arrow--incoming.svg")')
            .col
              div.font-semibold.text-lg Incoming Quantity
              span.font-bold.text-lg 20
        .col.border-right-1.border-black-alpha-10
          .grid
            .col-fixed
              img(:src='require("~/assets/images/icons/icon__box--initialQuantity.svg")')
            .col
              div.font-semibold.text-lg Initial Quantity
              span.font-bold.text-lg 100
        .col
          .grid
            .col-fixed
              img(:src='require("~/assets/images/icons/icon__box--inventoryQuantity.svg")')
            .col
              div.font-semibold.text-lg Inventory Quantity
              span.font-bold.text-lg 100
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
class StockLogInformation extends Vue {}

export default StockLogInformation
</script>
<style lang="sass">
.stockLogInformation
  .isChangeDate
    border-bottom: 1px solid #eeeff2

.stock__boxcode--outgoing
  width: 10px
  height: auto
</style>
