<template lang="pug">
 .grid.p-4.surface-300.h-srceen
    .col-4.p-0.surface-0.border-round.left__information--stock.h-screen.overflow-y-auto.overflow-x-hidden
      .grid.border-bottom-1.border-gray-300
       .col.p-4.flex.align-items-center
        Button(icon="pi pi-arrow-left" @click='backToStockList').p-button-link
        span.font-semibold.text-lg Stock list
      .stock__information.p-4
        .grid.mb-3
          .col
            img(:src='require("~/assets/images/icons/icon__box--delivery.svg")').mr-2
            span.uppercase.font-bold stock information
        .grid.mb-3
          .col(class='xl:col-4').stock__information--image
            img(:src='require("~/assets/images/sample.png")').border-round
          .col
            Tag(severity="success").uppercase {{stockDetail.status}}
            h1.font-bold.my-2 Apple Macbook Pro
            div.mb-2
              p.uppercase.inline.font-semibold.text-400.mr-2 code:
              span.uppercase.font-semibold.text-blue-600 {{stockDetail.code}}
            div.mb-2
              p.uppercase.inline.font-semibold.text-400.mr-2 sku:
              span.uppercase.font-semibold.text-blue-600 {{stockDetail.sku}}
            div
              p.uppercase.inline.font-semibold.text-400.mr-2 unit:
              span.uppercase.font-semibold.text-blue-600 {{stockDetail.unit}}
        .grid.mb-3
          .col-6(class='xl:col-6 lg:col-12 md:col-12 sm:col-12')
           div.surface-hover.p-3
            .grid.align-items-center
              .col-2.flex.stock__information--icon
                img(:src='require("~/assets/images/icons/icon__location.svg")')
              .col
                div.text-500 Location
                span.font-semibold.mr-1 {{stockDetail.location}}
                img(:src='require("~/assets/images/icons/icon__arrow--export.svg")')
          .col(class='xl:col-6 lg:col-12 md:col-12 sm:col-12')
           div.surface-hover.p-3
            .grid.align-items-center
              .col-2.flex.stock__information--icon
                img(:src='require("~/assets/images/icons/icon__warehouse.svg")')
              .col
                div.text-500 Warehouse
                span.font-semibold.mr-1 {{stockDetail.warehouse}}
                img(:src='require("~/assets/images/icons/icon__arrow--export.svg")')
        .grid.mb-3
          .col-6(class='xl:col-6 lg:col-12 md:col-12 sm:col-12')
           div.surface-hover.p-3
            .grid.align-items-center
              .col-2.flex.stock__information--icon
                img(:src='require("~/assets/images/icons/icon__size.svg")')
              .col
                div.text-500 Size (cm)
                span.font-semibold {{stockDetail.size}}x{{stockDetail.size}}x{{stockDetail.size}}
          .col-6(class='xl:col-6 lg:col-12 md:col-12 sm:col-12')
           div.surface-hover.p-3
            .grid.align-items-center
              .col-2.flex.stock__information--icon
                img(:src='require("~/assets/images/icons/icon__weight.svg")')
              .col
                div.text-500 Weight (Kg)
                span.font-semibold  {{stockDetail.weight}}
        .grid
          .col
            .surface-hover.p-3
              .grid.align-items-center
                .col-1.flex(class='xl:mr-0 md:mr-3')
                  img(:src='require("~/assets/images/icons/icon__barcode.svg")')
                .col
                  div.text-500 Boxcode
                  span.font-semibold.mr-1   {{stockDetail.boxcode}}x{{stockDetail.boxcode}}x{{stockDetail.boxcode}}
                  img(:src='require("~/assets/images/icons/icon__arrow--export.svg")')
      .sender__information.p-4
        .grid.mb-3
          .col
            img(:src='require("~/assets/images/icons/icon__sender.svg")').mr-2
            span.uppercase.font-bold Sender information
        .surface-hover.mb-5
          .grid.p-3.align-items-center
            .col-1(class='xl:col-1 lg:col-2').sender__information--name
              img(:src='require("~/assets/images/icons/icon__sender--name.svg")')
            .col
              div.text-500 Sender
              span.font-semibold {{stockDetail.senderName}}
        .grid
          .col-fixed.col-6(class='xl:col-6 lg:col-12').mb-3.sender__information--logs
            .surface-hover
              .grid.p-3.align-items-center
                .col-2
                  img(:src='require("~/assets/images/icons/icon__sender--email.svg")')
                .col.sender__email
                  div.text-500 Email Address
                  .font-semibold.text-overflow-ellipsis.white-space-nowrap.overflow-hidden(v-tooltip.top='"stockDetail.senderEmail"') {{stockDetail.senderEmail}}
          .col-fixed.col-6(class='xl:col-6 lg:col-12').sender__information--logs
            .surface-hover
              .grid.p-3.align-items-center
                .col-2
                  img(:src='require("~/assets/images/icons/icon__sender--phone.svg")')
                .col
                  div.text-500 Phone number
                  span.font-semibold {{stockDetail.senderPhone}}
    .col-8.px-5.h-screen.right__information--stock
      .grid.mb-5
        .col
          h3.font-semibold.mt-0.text-3xl Stock history
          span.text-500 1280 logs found
      .stockLogInformation.overflow-auto
        StockLogInformation(v-for='item in 10' :key='item.index').mb-3
</template>
<script lang="ts">
import { Component, namespace, Vue } from 'nuxt-property-decorator'
import { Stock } from '~/store/stock/stockDetail'
const nsStoreStock = namespace('stock/stockDetail')

@Component({
  layout: 'dashboard',
})
class StockDetail extends Vue {
  @nsStoreStock.State
  stockDetail!: {}

  @nsStoreStock.Action
  actGetStockDetail!: (params: Stock.StockDetailId) => Promise<void>

  backToStockList() {
    this.$router.push('/stock')
  }

  async mounted() {
    await this.actGetStockDetail({ id: 4 })
    console.log('stock id page', this.stockDetail)
  }
}
export default StockDetail
</script>
<style lang="sass">
$large: 1440px
$small: 1025px

.left__information--stock
  .stock__information
    border-bottom: 1px solid #eeeff2

  .sender__email
    max-width: 70%

.right__information--stock
  display: flex
  flex-direction: column

.stockLogInformation
  flex-grow: 1

::-webkit-scrollbar
 width: 7px
 background-color: #F5F5F5

::-webkit-scrollbar-track
 -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3)
 border-radius: 10px
 background-color: #F5F5F5

::-webkit-scrollbar-thumb
 border-radius: 10px
 -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3)
 background-color: #979AA4

@media (max-width: $large) and (min-width: $small)
  .stock__information--image
    width: 100%
  .stock__information--icon
    margin-right: 1rem
  .sender__information--logs
    width: 100%
  .sender__information--name
    margin-right: 2rem
</style>
