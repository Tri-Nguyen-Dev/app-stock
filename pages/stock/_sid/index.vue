<template lang="pug">
  .grid.grid-nogutter.w-full
    CommonTabDetail(:homeItem="homeItem" :breadcrumbItem="breadcrumbItem" v-if='model.data' :isBack="true")
      template(v-slot:content)
        .grid.m-0.my-3.w-full
          .grid.align-items-center.mx-0.w-full.grid-nogutter
            .col.flex
              .icon.icon-box-info.mr-1.bg-blue-700(class='xl:inline lg:hidden md:hidden sm:hidden xs:hidden')
              span.uppercase.font-bold.text-sm general information
            .col-fixed
              .surface-hover.border-round.cursor-pointer.p-2.edit__detail--button(
                @click='editStockDetail'
                :class='isEditStockDetail ? "hidden" : " "'
              )
                .icon.icon-btn-edit
          .col-12.my-2.px-0(:class='isEditStockDetail ? "opacity-40" : "opacity-100"')
            img(:src="model.data.imagePath | getImageUrl").border-round.w-full
          .col-12.px-0(:class='isEditStockDetail ? "opacity-40" : "opacity-100"')
            Tag.table__status.table__status--available(
              severity="success"
              v-show='model.data.stockStatus === "STOCK_STATUS_AVAILABLE"'
            ).uppercase Available
            Tag(v-show='model.data.stockStatus === "STOCK_STATUS_DISABLE"').uppercase.surface-200 Disable
            Tag(v-show='model.data.stockStatus === "STOCK_STATUS_DRAFT"').uppercase Draft
          .col-12.px-0(:class='isEditStockDetail ? "opacity-40" : "opacity-100"')
            h3.font-bold.my-0 {{model.data.name}}
          .col-12.px-0(:class='isEditStockDetail ? "opacity-40" : "opacity-100"').align-items-center
            span.uppercase.inline.font-semibold.text-400.mr-2 code:
            span.uppercase.font-semibold.text-blue-700 {{model.data.barCode}}
          .col-12.px-0(:class='isEditStockDetail ? "opacity-40" : "opacity-100"').align-items-center
            p.uppercase.inline.font-semibold.text-400.mr-2 unit:
            span.uppercase.font-semibold.text-blue-700
          .col-12
            StockUnit(
              title="Total inventory quantity"
              :value="model.data.totalInventoryQuantity"
              icon="icon-total-inventory" :isEdit="isEditStockDetail")
          .col-12
            StockUnit(title="Size (L*W*H)" icon="icon-size")
              template(v-slot:size)
                .grid.mt-1(v-if='isEditStockDetail')
                  div(class="col-4 p-0 pl-2 pt-1")
                    InputNumber.text-lg.w-full(:disabled='!isEditStockDetail', v-model='lengthBox' ref='inputSku' autofocus)
                  .col-4.pl-2.p-0.pt-1
                    InputNumber.text-lg.w-full(:disabled='!isEditStockDetail', v-model='widthBox')
                  .col-4.pl-2.p-0.pt-1
                    InputNumber.text-lg.w-full(:disabled='!isEditStockDetail', v-model='heightBox')
                span.font-bold.text-lg.mr-1.uppercase(v-else) {{ lengthBox }}*{{ widthBox }}*{{ heightBox }}
          .col-12
            StockUnit(
              title="Weight"
              name="weightBox"
              :model="weightBox"
              :isEdit="isEditStockDetail"
              icon="icon-weight"
              @updateUnit='handleUpdateUnit'
            )
          .col-12.flex.justify-content-around(v-if='isEditStockDetail')
            div(class='col-6 md:col-3 lg:col-6')
              Button.btn.btn-outline.h-3rem.w-full(@click='cancelEditStockDetail')
                span.uppercase cancel
            div(class='col-6 md:col-3 lg:col-6')
              Button.btn.btn-primary.h-3rem.w-full(@click='saveEditStockDetail')
                span.uppercase save
    .py-0.flex-1(class="xl:pl-5 lg:pl-2 col-12 lg:col-9 md:col-12")
      StockDetailTable
</template>
<script lang="ts">
import { Component, Vue, namespace, Watch } from 'nuxt-property-decorator'
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

  @Watch('isActive')
  async inputChange() {
    await this.$nextTick()
    if(this.$refs.inputSku) {
      const inputRef = this.$refs.inputSku as any
      await this.$nextTick(() =>  inputRef?.$el.focus())
    }
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

.edit__detail--button
    width: 32px
    justify-content: center
    display: flex
</style>
