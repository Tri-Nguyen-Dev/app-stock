<template lang="pug">
  .grid.h-srceen.stock__information-detail
    .col-3.p-0.surface-0.border-round.h-screen.overflow-y-auto.overflow-x-hidden
      .grid.border-bottom-1.border-gray-300
       .col.p-4.flex.align-items-center
        Button(@click='backToStockList').p-button-link.mr-2
          .icon.icon-btn-back.bg-blue-700
        span.font-semibold.text-base Stock list / Stock Detail
      .stock__information--gerenal.p-4
        .grid.mb-3
          .col-9.pl-0.flex
            .icon-btn.icon-box-info.inline-block.mr-1.bg-blue-700
            span.uppercase.font-bold.text-sm general infomation
          .col.flex.justify-content-end
            .surface-hover.border-round.cursor-pointer.p-2(@click='editStockDetail' :class='isEditStockDetail ? "hidden" : " "')
              .icon-btn.icon-btn-edit
            Button(:class='isEditStockDetail ? " " : "hidden"' @click='saveEditStockDetail')
              .icon-btn.icon-check-lg.bg-white.mr-1
              span.uppercase save
        .grid.mb-3(:class='isEditStockDetail ? "opacity-40" : "opacity-100"')
          img(:src='require("~/assets/images/sample.png")').border-round.w-full
        .grid.my-2(:class='isEditStockDetail ? "opacity-40" : "opacity-100"')
          Tag(severity="success").uppercase Available
        .grid.mb-2(:class='isEditStockDetail ? "opacity-40" : "opacity-100"')
          h5.font-bold.my-2 Apple Macbook Pro
        .grid(:class='isEditStockDetail ? "opacity-40" : "opacity-100"')
          p.uppercase.inline.font-semibold.text-400.mr-2 code:
          span.uppercase.font-semibold.text-blue-700 ABH123
        .grid(:class='isEditStockDetail ? "opacity-40" : "opacity-100"')
          p.uppercase.inline.font-semibold.text-400.mr-2 unit:
          span.uppercase.font-semibold.text-blue-700 piece
        .grid.surface-hover.mb-3
          .col-2.flex.align-items-center
            .icon--large.icon-size.bg-blue-700
          .col
            div.text-500 Size (cm)
            InputText( :disabled='isEditStockDetail == 0')
        .grid.surface-hover.mb-3
          .col-2.flex.align-items-center
            .icon--large.icon-weight.bg-blue-700
          .col
            div.text-500 Weight (kg)
            InputText( :disabled='isEditStockDetail == 0')
        .grid.surface-hover.mb-3(:class='isEditStockDetail ? "opacity-40" : "opacity-100"')
          .col-2.flex.align-items-center
            .icon--large.icon-inventory-quantity.bg-blue-700
          .col
            div.text-500 Inventory quantity
            span.font-semibold.mr-1.uppercase 2
        .grid.surface-hover.mb-3(:class='isEditStockDetail ? "opacity-40" : "opacity-100"')
          .col-2.flex.align-items-center
            .icon--large.icon-total-inventory.bg-blue-700
          .col
            div.text-500 Total inventory quantity
            span.font-semibold.mr-1.uppercase 80
    .col-9.pl-5.h-screen.py-0
      StockDetailTable
</template>
<script lang="ts">
import { Component, Vue, namespace } from 'nuxt-property-decorator'
import { Stock } from '~/store/stock/stock-detail'
const nsStoreStock = namespace('stock/stock-detail')

@Component({
  layout: 'dashboard'
})
class StockDetail extends Vue {
  isEditStockDetail: boolean = false

  @nsStoreStock.State
  stockDetail!: {}

  @nsStoreStock.Action
  actGetStockDetail!: (params: Stock.StockDetailId) => Promise<void>

  backToStockList() {
    this.$router.push('/stock')
  }

  editStockDetail() {
    this.isEditStockDetail = true
  }

  saveEditStockDetail() {
    this.isEditStockDetail = false
  }

  buttonEditItemDetail() {
    this.$router.push('/stock')
  }

  async mounted() {
    await this.actGetStockDetail({ id: 4 })
  }
}
export default StockDetail
</script>

<style lang="sass">
.stock__information-detail
  .stock__information--gerenal
    .p-disabled, .p-component:disabled
        opacity: 1

    .p-inputtext
      border: none
      background: transparent
      padding: 0
      color: #000
      font-weight: 600

.p-inputtext,
.p-dropdown,
.p-button
  box-shadow: none !important

.stock__detail--table
  height: calc(100vh - 148px)

.p-paginator.p-component.p-paginator-bottom
  .p-paginator-left-content
    display: flex

  .p-paginator-element
    border: none !important

  .p-paginator-first,
  .p-paginator-last
    display: none

  .p-link
    background: #fff
    color: #ced4da

  .p-highlight
    color: #000

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

.p-datatable .p-sortable-column:focus
    box-shadow: none
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
</style>
