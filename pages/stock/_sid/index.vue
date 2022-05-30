<template lang="pug">
  .grid.grid-nogutter.stock__information-detail
    .p-0.border-round.surface-0.sub-tab(class="lg:col-3 col-12" v-if='model.data')
      .grid.border-bottom-1.border-gray-300
        .col.flex.align-items-center.breadcrumb-section
          Button(@click='backToStockList').p-button-link
            .icon.icon-btn-back.bg-blue-700
          Breadcrumb(:home="homeItem" :model="breadcrumbItem")
      .stock__information--gerenal.border-bottom-1.border-gray-300
        .grid.mb-3.align-items-center.p-4
          .pl-0.flex.col-9
            .icon.icon-box-info.mr-1.bg-blue-700(class='xl:inline lg:hidden md:hidden sm:hidden xs:hidden')
            span.uppercase.font-bold.text-sm general information
          .flex.justify-content-end.col-3
            .surface-hover.border-round.cursor-pointer.p-2.edit__detail--button(@click='editStockDetail' :class='isEditStockDetail ? "hidden" : " "')
              .icon.icon-btn-edit
        .grid.mb-3.px-4(:class='isEditStockDetail ? "opacity-40" : "opacity-100"')
          img(:src="model.data.imagePath | getImageUrl").border-round.w-full
        .grid.my-2.px-4(:class='isEditStockDetail ? "opacity-40" : "opacity-100"')
          Tag(severity="success" v-show='model.data.stockStatus === "STOCK_STATUS_AVAILABLE"').uppercase Available
          Tag(v-show='model.data.stockStatus === "STOCK_STATUS_DISABLE"').uppercase.surface-200 Disable
          Tag(v-show='model.data.stockStatus === "STOCK_STATUS_DRAFT"').uppercase Draft
        .grid.mb-2.px-4(:class='isEditStockDetail ? "opacity-40" : "opacity-100"')
          h3.font-bold.my-2 {{model.data.name}}
        .grid.px-4(:class='isEditStockDetail ? "opacity-40" : "opacity-100"').align-items-center
          p.uppercase.inline.font-semibold.text-400.mr-2 code:
          span.uppercase.font-semibold.text-blue-700 {{model.data.barCode}}
        .grid.px-4(:class='isEditStockDetail ? "opacity-40" : "opacity-100"').align-items-center
          p.uppercase.inline.font-semibold.text-400.mr-2 unit:
          span.uppercase.font-semibold.text-blue-700
        div.sub--scroll
          .wrap-unit.px-4
            StockUnit(title="Total inventory quantity" :value="model.data.totalInventoryQuantity" icon="icon-total-inventory" :isEdit="isEditStockDetail")
          .wrap-unit.px-4
            StockUnit(title="Size (L*W*H)" icon="icon-size")
              template(v-slot:size)
                .grid.mt-1(v-if='isEditStockDetail')
                  div(class="col-4 p-0 pl-2 pt-1")
                    InputNumber.w-full(:disabled='!isEditStockDetail', v-model='lengthBox')
                  .col-4.pl-2.p-0.pt-1
                    InputNumber.w-full(:disabled='!isEditStockDetail', v-model='widthBox')
                  .col-4.pl-2.p-0.pt-1
                    InputNumber.w-full(:disabled='!isEditStockDetail', v-model='heightBox')
                span.font-bold.text-small.mr-1.uppercase(v-else) {{ lengthBox }}*{{ widthBox }}*{{ heightBox }}
          .wrap-unit.px-4
            StockUnit(
              title="Weight"
              name="weightBox"
              :model="weightBox"
              :isEdit="isEditStockDetail"
              icon="icon-weight"
              @updateUnit='handleUpdateUnit'
            )
        div
        .grid.mb-4.px-4(:class='isEditStockDetail ? null : "hidden"')
          div(class='lg:col-6 col-3')
            .text-center.surface-hover.cursor-pointer.border-round.p-1(@click='cancelEditStockDetail')
              span.uppercase.font-semibold cancel
          div(class='lg:col-6 col-3')
            .text-center.bg-blue-500.cursor-pointer.border-round.text-white.p-1(@click='saveEditStockDetail')
              span.uppercase save
    .py-0(class="xl:pl-5 lg:pl-2 col-12 lg:col-9 md:col-12")
      StockDetailTable
</template>
<script lang="ts">
import { Component, Vue, namespace } from 'nuxt-property-decorator'
import { Stock as StockModel } from '~/models/Stock'
const nsStoreStock = namespace('stock/stock-detail')

@Component
class StockDetail extends Vue {
  // -- [ Properties ] ----------------------------------------------------------
  isEditStockDetail: boolean = false
  model: StockModel.ModelDetail | any = {}
  heightBox: any = ''
  weightBox: any = ''
  lengthBox: any = ''
  widthBox: any = ''
  // -- [ Statement Properties ] ------------------------------------------------
  @nsStoreStock.State
  stockDetail!: StockModel.ModelDetail

  @nsStoreStock.State
  total!: number

  @nsStoreStock.Action
  actGetStockDetail

  @nsStoreStock.Action
  actUpdateStock!: (params: StockModel.ModelDetailEdit) => Promise<any>

  // -- [ Getters ] ----------------------------------------------------------

  get sid() {
    return this.$route.params.sid || ''
  }

  get homeItem() {
    return { label: 'Stock List', to: '/stock' }
  }

  get breadcrumbItem() {
    return [
      { label: 'Stock Detail', to: `/stock/${this.sid}` }
    ]
  }

  // -- [ Functions ] ----------------------------------------------------------

  backToStockList() {
    this.$router.push('/stock')
  }

  editStockDetail() {
    this.isEditStockDetail = true
  }

  handleUpdateUnit(val: any, name: string) {
    this[name] = val
  }

  saveEditStockDetail() {
    this.actUpdateStock({
      height: this.heightBox,
      length: this.lengthBox,
      weight: this.weightBox,
      width: this.widthBox
    })
    this.isEditStockDetail = false
  }

  cancelEditStockDetail() {
    this.isEditStockDetail = false
    this.handleAssignValue(this.model?.data)
  }

  handleAssignValue(item: any) {
    this.heightBox = item.height
    this.lengthBox = item.length
    this.weightBox = item.weight
    this.widthBox = item.width
  }

  // -- [ Hooks ] ----------------------------------------------------------
  async mounted() {
    if(this.$route.query.plan === 'edit') {
      this.isEditStockDetail = true
    }
    await this.actGetStockDetail({ id: this.$route.params.sid })
    this.model = _.cloneDeep(this.stockDetail)
    this.handleAssignValue(this.model?.data)
  }
}
export default StockDetail
</script>

<style lang="sass" scoped>
.stock__information-detail
  min-height: calc(100vh - 64px)
  .stock__information--gerenal
    ::v-deep.p-inputnumber-input
      box-shadow: none !important
    ::v-deep.p-component:disabled
      opacity: 1
    ::v-deep.p-disabled, .p-component:disabled
        opacity: 1

    ::v-deep.p-inputtext
      border: 1px solid #b2b2bb
      background: transparent
      color: #000
      padding-left: 4px
      font-weight: 600
      @include desktop
        max-width: 38px

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
.wrap-unit
  width: 100%
  margin-bottom: 16px
.sub-tab
  @include desktop 
    max-width: 21.5rem
    height: calc(100vh - 32px)
    overflow: hidden
    overflow-y: auto !important
    
.sub--scroll
  width: 100%
  @include desktop 
    max-width: 21.5rem
    overflow: auto

.edit__detail--button
    width: 32px
    justify-content: center
    display: flex
</style>
