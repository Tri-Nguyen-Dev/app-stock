<template lang="pug">
  .grid.grid-nogutter.stock__information-detail
    .col-2.p-0.surface-0.border-round.h-full.overflow-y-auto.overflow-x-hidden(v-if='model.data')
      .grid.border-bottom-1.border-gray-300
       .col.p-4.flex.align-items-center
        Button(@click='backToStockList').p-button-link.mr-2
          .icon.icon-btn-back.bg-blue-700
        span.font-semibold.text-base Stock list / Stock Detail
      .stock__information--gerenal.p-4.border-bottom-1.border-gray-300
        .grid.mb-3.align-items-center
          .col-9.pl-0.flex
            .icon.icon-box-info.mr-1.bg-blue-700
            span.uppercase.font-bold.text-sm general infomation
          .col.flex.justify-content-end
            .surface-hover.border-round.cursor-pointer.p-2(@click='editStockDetail' :class='isEditStockDetail ? "hidden" : " "')
              .icon.icon-btn-edit
        .grid.mb-3(:class='isEditStockDetail ? "opacity-40" : "opacity-100"')
          img(:src='model.data.imagePath').border-round.w-full
        .grid.my-2(:class='isEditStockDetail ? "opacity-40" : "opacity-100"')
          Tag(severity="success" v-show='model.data.stockStatus === "STOCK_STATUS_AVAILABLE"').uppercase Available
          Tag(v-show='model.data.stockStatus === "STOCK_STATUS_DISABLE"').uppercase.surface-200 Disable
          Tag(v-show='model.data.stockStatus === "STOCK_STATUS_DRAFT"').uppercase Draft
        .grid.mb-2(:class='isEditStockDetail ? "opacity-40" : "opacity-100"')
          h3.font-bold.my-2 {{model.data.name}}
        .grid(:class='isEditStockDetail ? "opacity-40" : "opacity-100"').align-items-center
          p.uppercase.inline.font-semibold.text-400.mr-2 code:
          span.uppercase.font-semibold.text-blue-700 {{model.data.barCode}}
        .grid(:class='isEditStockDetail ? "opacity-40" : "opacity-100"').align-items-center
          p.uppercase.inline.font-semibold.text-400.mr-2 unit:
          span.uppercase.font-semibold.text-blue-700 {{model.data.unit.name}}
        .grid.surface-hover.mb-3(:class='isEditStockDetail ? "opacity-40" : "opacity-100"')
          .col-2.flex.align-items-center.justify-content-end
            .icon--large.icon-total-inventory.bg-blue-700
          .col-10
            div.text-500 Total inventory quantity
            span.font-semibold.mr-1.uppercase {{model.data.totalInventoryQuantity}}
        .grid.surface-hover.mb-3
            .col-2.flex.align-items-center.justify-content-end
              div.icon--large.icon-size.bg-blue-700
            .col-10
              div.text-500 Size (L*W*H)
              .grid(v-if='isEditStockDetail')
                .col-4.p-0.pl-2.pt-1
                  InputNumber(:disabled='isEditStockDetail == 0' v-model='model.data.length').w-full
                .col-4.p-0.pt-1
                  InputNumber(:disabled='isEditStockDetail == 0' v-model='model.data.width').w-full
                .col-4.p-0.pt-1
                  InputNumber(:disabled='isEditStockDetail == 0' v-model='model.data.height').w-full
              span.font-semibold.mr-1.uppercase(v-else) {{model.data.length}}*{{model.data.width}}*{{model.data.height}}
        .grid.surface-hover.mb-3
            .col-2.flex.align-items-center.justify-content-end
              div.icon--large.icon-weight.bg-blue-700
            .col-10
              div.text-500 Weight
              InputNumber(:disabled='isEditStockDetail == 0' v-model='model.data.weight')
        .grid.mt-1(:class='isEditStockDetail ? " " : "hidden"')
          .col
            .text-center.surface-hover.cursor-pointer.border-round.p-1(@click='cancelEditStockDetail')
              span.uppercase.font-semibold cancel
          .col
            .text-center.bg-blue-500.cursor-pointer.border-round.text-white.p-1(@click='saveEditStockDetail')
              span.uppercase save
    .col-10.pl-5.py-0.h-full.overflow-y-auto.overflow-x-hidden
      StockDetailTable

</template>
<script lang="ts">
import { Component, Vue, namespace} from 'nuxt-property-decorator'
import { Stock as StockModel } from '~/models/Stock'
const nsStoreStock = namespace('stock/stock-detail')
const _ = require('lodash')

@Component({
  layout: 'dashboard'
})
class StockDetail extends Vue {
  isEditStockDetail: boolean = false
  model: StockModel.ModelDetail | any = {}

  @nsStoreStock.State
  stockDetail!: StockModel.ModelDetail

  @nsStoreStock.State
  total!: number

  @nsStoreStock.Action
  actGetStockDetail

  @nsStoreStock.Action
  actUpdateStock!: (params: StockModel.ModelDetailEdit) => Promise<any>

  backToStockList() {
    this.$router.push('/stock')
  }

  editStockDetail() {
    this.isEditStockDetail = true
  }

  saveEditStockDetail() {
    this.actUpdateStock({
      height: this.model.data.height,
      length: this.model.data.length,
      weight: this.model.data.weight,
      width: this.model.data.width
    })
    this.isEditStockDetail = false
  }

  cancelEditStockDetail() {
    this.isEditStockDetail = false
  }

  async mounted() {
    if(this.$route.query.plan === 'edit') {
      this.isEditStockDetail = true
    }
    await this.actGetStockDetail({ id: this.$route.params.sid })
    this.model = _.cloneDeep(this.stockDetail)
  }
}
export default StockDetail
</script>

<style lang="sass" scoped>
.stock__information-detail
  height: calc(100vh - 64px)
  .stock__information--gerenal
    ::v-deep.p-inputnumber-input
      box-shadow: none !important
    ::v-deep.p-component:disabled
      opacity: 1
    ::v-deep.p-disabled, .p-component:disabled
        opacity: 1

    ::v-deep.p-inputtext
      border: none
      background: transparent
      padding: 0
      color: #000
      font-weight: 600

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

.grid.surface-hover
  background-color: #F8F7FA !important
</style>
