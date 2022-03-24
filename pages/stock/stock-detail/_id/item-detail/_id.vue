<template lang="pug">
 .grid.p-4.surface-300.h-srceen
    .col-4.p-0.surface-0.border-round.left__information--stock.h-screen.overflow-y-auto.overflow-x-hidden
      .grid.border-bottom-1.border-gray-300
       .col.p-4.flex.align-items-center
        Button(@click='backToStockList').p-button-link.mr-2
          .icon.icon-btn-back.bg-blue-700
        span.font-semibold.text-lg Stock list / Stock Detail / Item Detail
      .stock__information.p-4
        .grid.mb-3
          .col-10.flex
            .icon-btn.icon-box-info.inline-block.mr-1.bg-blue-700
            span.uppercase.font-bold Item Detail
          .col.flex.justify-content-end
            .surface-hover.border-round.cursor-pointer.p-2
              .icon-btn.icon-btn-edit
        .grid.mb-3
          .col(class='xl:col-4').stock__information--image
            img(:src='require("~/assets/images/sample.png")').border-round
          .col
            Tag(severity="success").uppercase Available
            h5.font-bold.my-2 Apple Macbook Pro
            div
              p.uppercase.inline.font-semibold.text-400.mr-2 code:
              span.uppercase.font-semibold.text-blue-700 ABH123
            div
              p.uppercase.inline.font-semibold.text-400.mr-2 sku:
              span.uppercase.font-semibold.text-blue-700 ABH123
            div
              p.uppercase.inline.font-semibold.text-400.mr-2 unit:
              span.uppercase.font-semibold.text-blue-700 Piece
        .grid.mb-3
          .col-6(class='xl:col-6 lg:col-12 md:col-12 sm:col-12')
           div.surface-hover.p-3
            .grid.align-items-center
              .col-3
                .icon-btn.icon-location.bg-blue-700
              .col
                div.text-500 Location
                span.font-semibold.mr-1.uppercase MHI45
                .icon-btn.icon-export.inline-block
          .col(class='xl:col-6 lg:col-12 md:col-12 sm:col-12')
           div.surface-hover.p-3
            .grid.align-items-center
              .col-3
                .icon-btn.icon-warehouse.bg-blue-700
              .col
                div.text-500 Warehouse
                span.font-semibold.mr-1.uppercase NTH001
                .icon-btn.icon-export.inline-block
        .grid.mb-3
          .col-6(class='xl:col-6 lg:col-12 md:col-12 sm:col-12')
           div.surface-hover.p-3
            .grid.align-items-center
              .col-3
                .icon-btn.icon-size.bg-blue-700
              .col
                div.text-500 Size (cm)
                span.font-semibold 180x180x180
          .col-6(class='xl:col-6 lg:col-12 md:col-12 sm:col-12')
           div.surface-hover.p-3
            .grid.align-items-center
              .col-3
                .icon-btn.icon-weight.bg-blue-700
              .col
                div.text-500 Weight (Kg)
                span.font-semibold  20.8
        .grid
          .col(class='xl:col-6 lg:col-12 md:col-12 sm:col-12')
            .surface-hover.p-3
              .grid.align-items-center
                .col-3
                  .icon-btn.icon-boxcode.bg-blue-700
                .col
                  div.text-500 Boxcode
                  span.font-semibold.mr-1.uppercase hgn78
                  .icon-btn.icon-export.inline-block
          .col(class='xl:col-6 lg:col-12 md:col-12 sm:col-12')
            .surface-hover.p-3
              .grid.align-items-center
                .col-3
                  .icon-btn.icon-price.bg-blue-700
                .col
                  div.text-500 Value
                  span.font-semibold.mr-1.uppercase $200
      .sender__information.p-4
        .grid.mb-3
          .col
            .icon-btn.icon-sender-info.inline-block.mr-2.bg-blue-700
            span.uppercase.font-bold Seller information
        .surface-hover.mb-5
          .grid.p-3.align-items-center
            .col-1(class='xl:col-1 lg:col-2').sender__information--name
              .icon-btn.icon-sender-name.bg-blue-700
            .col
              div.text-500 Sender
              span.font-semibold {{stockDetail.senderName}}
        .surface-hover.mb-5
          .grid.p-3.align-items-center
            .col-1(class='xl:col-1 lg:col-2').sender__information--name
              .icon-btn.icon-sender-email.bg-blue-700
            .col
              div.text-500 Email Address
              span.font-semibold {{stockDetail.senderName}}
        .surface-hover.mb-5
          .grid.p-3.align-items-center
            .col-1(class='xl:col-1 lg:col-2').sender__information--name
              .icon-btn.icon-sender-phone.bg-blue-700
            .col
              div.text-500 Phone number
              span.font-semibold {{stockDetail.senderName}}
    .col-8.px-5.h-screen.right__information--stock
      TabView
        TabPanel
          template(#header)
            .icon-btn.icon-history.mr-2.surface-600
            span Stock history
          .overflow-auto
            StockLogInformation(v-for='item in 4' :key='item.index').mb-3
        TabPanel
          template(#header)
            .icon-btn.icon-location.mr-2.surface-600
            span Location history
          StockDetailHistoryTable

</template>
<script lang="ts">
import { Component, namespace, Vue } from 'nuxt-property-decorator'
import { Stock } from '~/store/stock/stockDetail'
const nsStoreStock = namespace('stock/stockDetail')

@Component({
  layout: 'dashboard'
})
class ItemDetail extends Vue {
  @nsStoreStock.State
  stockDetail!: {}

  @nsStoreStock.Action
  actGetStockDetail!: (params: Stock.StockDetailId) => Promise<void>

  backToStockList() {
    this.$router.push('/stock/stock-detail/id')
  }

  async mounted() {
    await this.actGetStockDetail({ id: 4 })
  }
}
export default ItemDetail
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

  .p-tabview .p-tabview-nav li
    .p-tabview-nav-link
      background: #dee2e6
      border: none
      box-shadow: none !important

  .p-tabview .p-tabview-panels
    background: #dee2e6
    padding: 1.25rem 0 0 0

  .p-highlight .p-tabview-nav-link
    color: #000 !important
    border-bottom: 2px solid #486AE2 !important

    .icon-btn
      background-color: #094db1 !important

.stockLogInformation
  flex-grow: 1

.pi-sort-alt:before
  content: url('~/assets/icons/sort.svg')
.pi-sort-amount-up-alt:before
    content: url('~/assets/icons/sort.svg')
.pi-sort-amount-down:before
  content: url('~/assets/icons/sort.svg')
.p-datatable .p-datatable-thead > tr > th
  background: #F9F9FC
  border: none
  color: #464D64

::-webkit-scrollbar
 width: 7px
 height: 7px
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
