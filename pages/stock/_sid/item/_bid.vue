<template lang="pug">
 .grid.grid-nogutter.item__detail-container.overflow-hidden(v-if='model.data')
    .col-4.p-0.surface-0.border-round.left__information--stock.h-full.overflow-y-auto.overflow-x-hidden
      .grid.border-bottom-1.border-gray-300
       .col.flex.align-items-center.breadcrumb-section
        Button(@click='backToStockList').p-button-link
          .icon.icon-btn-back.bg-blue-700
        Breadcrumb(:home="homeItem" :model="breadcrumbItem")
      .stock__information.p-4
        .grid.mb-3
          .col-9.flex
            .icon.icon-box-info.inline-block.mr-1.bg-blue-700
            span.uppercase.font-bold Item Detail
          .col.flex.justify-content-end
            .surface-hover.border-round.cursor-pointer.p-2(@click='editItemDetail' :class='isEditItemDetail ? "hidden" : " "')
              .icon.icon-btn-edit
        .grid(:class='isEditItemDetail ? "opacity-40" : "opacity-100"')
          .col(class='xl:col-4').stock__information--image
            img(:src="model.data.stock.imagePath | getImageUrl" alt="Stock Image").border-round.w-full
          .col
            Tag(v-show="model.data.itemStatus === 'ITEM_STATUS_AVAILABLE'").px-2.bg-green-100
              span.font-bold.text-green-400.font-sm AVAILABLE
            Tag(v-show="model.data.itemStatus === 'ITEM_STATUS_DISABLE'").px-2.surface-200
              span.font-bold.text-400.font-sm DISABLE
            Tag(v-show="model.data.itemStatus === 'ITEM_STATUS_DRAFT'").px-2.bg-blue-500
              span.font-bold.text-white.font-sm DRAFT
            h3.font-bold.my-2
            div.mb-2
              p.uppercase.inline.font-semibold.text-400.mr-2 code:
              span.uppercase.font-semibold.text-blue-700 {{model.data.stock.barCode}}
            div.mb-2
              p.uppercase.inline.font-semibold.text-400.mr-2 sku:
              span.uppercase.font-semibold.text-blue-700 {{model.data.sku}}
            div
              p.uppercase.inline.font-semibold.text-400.mr-2 unit:
              span.uppercase.font-semibold.text-blue-700 {{model.data.stock.unit.name}}
        .grid.mt-2
          .col-6(class='xl:col-6 lg:col-12 md:col-12 sm:col-12 p-3')
            StockUnit(
              title="Receipt ID"
              :value="requestId"
              :isEdit="isEditItemDetail"
              icon="icon-receipt-note")
          .col-6(class='xl:col-6 lg:col-12 md:col-12 sm:col-12 p-3')
            StockUnit(
              title="Creator ID"
              :value="model.data.box.createdBy.staffId"
              :isEdit="isEditItemDetail"
              icon="icon-tag-user"
            )
          .col-6(class='xl:col-6 lg:col-12 md:col-12 sm:col-12 p-3')
            StockUnit(
              title="Warehouse"
              :isEdit="isEditItemDetail"
              :value="warehouseName"
              icon="icon-warehouse"
            )
          .col-6(class='xl:col-6 lg:col-12 md:col-12 sm:col-12 p-3')
            StockUnit(
              title="Location"
              :isEdit="isEditItemDetail"
              :value="rackLocation"
              icon="icon-location-2"
            )
          .col-6(class='xl:col-6 lg:col-12 md:col-12 sm:col-12 p-3' :class='isEditItemDetail ? "opacity-40" : "opacity-100"')
            StockUnit(title="Size (L*W*H)" icon="icon-size")
              template(v-slot:size)
                span.font-semibold.mr-1.uppercase.text-lg
                | {{ model.data.stock.length }}*{{ model.data.stock.width }}*{{ model.data.stock.height }}
          .col-6(class='xl:col-6 lg:col-12 md:col-12 sm:col-12 p-3')
            StockUnit(title="Weight (Kg)" :value="model.data.stock.weight" :isEdit="isEditItemDetail" icon="icon-weight")
          .col-6(class='xl:col-6 lg:col-12 md:col-12 sm:col-12 p-3')
            StockUnit(title="Boxcode" :value="model.data.box.id" :isEdit="isEditItemDetail" icon="icon-delivery")
          .col-6(class='xl:col-6 lg:col-12 md:col-12 sm:col-12 mt-2')
            StockUnit(
              title="Value"
              name="value"
              :model="value"
              :isEdit="isEditItemDetail"
              icon="icon-price"
              @updateUnit='handleUpdate'
            )
        .grid.mt-1(:class='isEditItemDetail ? " " : "hidden"')
          .col
            Button.btn.btn-outline.h-3rem.w-full(@click='cancelEditItemDetail')
              span.uppercase.font-semibold cancel
          .col
            Button.btn.btn-primary.h-3rem.w-full(@click='saveEditItemDetail')
              span.uppercase save
      .sender__information.p-4(:class='isEditItemDetail ? "opacity-40" : "opacity-100"')
        .grid.mb-3
          .col
            .icon.icon-sender-info.mr-2.bg-blue-700.inline-block
            span.uppercase.font-bold Seller information
        .col-12(class='lg:col-12 md:col-12 sm:col-12 py-3 px-2')
          StockUnit(title="Seller" :value="model.data.box.request.seller.name" :isEdit="isEditItemDetail" icon="icon-sender-name")
        .col-12(class='lg:col-12 md:col-12 sm:col-12 py-3 px-2')
          StockUnit(title="Email Address" :value="model.data.box.request.seller.email" :isEdit="isEditItemDetail" icon="icon-sender-email")
        .col-12(class='lg:col-12 md:col-12 sm:col-12 py-3 px-2')
          StockUnit(title="Phone number" :value="model.data.box.request.seller.phone" :isEdit="isEditItemDetail" icon="icon-sender-phone")
    .col-8.px-5.right__information--stock
      TabView
        TabPanel
          template(#header)
            .icon.icon-history.mr-2.surface-600
            span Stock history
          .overflow-auto.stock__log--history
            StockLogInformation.mb-3
        TabPanel
          template(#header)
            .icon.icon-location-2.mr-2.surface-600
            span Location history
          .overflow-auto.stock__log--history
            StockDetailHistoryTable
</template>
<script lang="ts">
import { Component, Vue, namespace } from 'nuxt-property-decorator'
import { Stock as StockModel } from '~/models/Stock'
const nsStoreStock = namespace('stock/stock-detail')

@Component
class ItemDetail extends Vue {
  // -- [ Statement Properties ] ------------------------------------------------
  @nsStoreStock.State
  itemDetail!: StockModel.ModelDetail

  @nsStoreStock.Action
  actGetItemsDetail

  @nsStoreStock.Action
  actUpdateItem!: (any) => Promise<any>

  // -- [ Properties ] ----------------------------------------------------------
  isEditItemDetail: boolean = false
  model: StockModel.ModelDetail | any = {}
  value: any = ''

  // -- [ Getters ] ----------------------------------------------------------

  get sid() {
    return this.$route.params.sid || ''
  }

  get bid() {
    return this.$route.params.bid || ''
  }

  get homeItem() {
    return { label: 'Stock List', to: '/stock' }
  }

  get breadcrumbItem() {
    return [
      { label: 'Stock Detail', to: `/stock/${this.sid}` },
      { label: 'Item Detail', to: `/stock/${this.bid}` }
    ]
  }

  get requestId() {
    return this.model.data.box.request?.id
  }

  get warehouseName() {
    return this.model.data.box?.request?.warehouse?.name
  }

  get rackLocation() {
    return this.model.data.box.rackLocation.name
  }

  // -- [ Functions ] ----------------------------------------------------------
  handleUpdate(val: any, name: string) {
    this[name] = val
  }

  backToStockList() {
    this.$router.push(`/stock/${this.sid}`)
  }

  editItemDetail() {
    this.isEditItemDetail = true
  }

  saveEditItemDetail() {
    const pathParams = {
      stockId: this.$route.params.sid,
      boxId: this.$route.params.bid
    }
    this.actUpdateItem({ path: pathParams, body: {
      value: this.value
    } })
    this.isEditItemDetail = false
  }

  cancelEditItemDetail() {
    this.isEditItemDetail = false
  }

  // -- [ Hooks ] ----------------------------------------------------------
  async mounted() {
    if(this.$route.query.plan === 'edit') {
      this.isEditItemDetail = true
    }
    await this.actGetItemsDetail({ stockId: this.sid, boxId: this.bid })
    this.model = _.cloneDeep(this.itemDetail)
    this.value = this.model.data.value
  }
}
export default ItemDetail
</script>
<style lang="sass" scoped>
$large: 1440px
$small: 1025px
.item__detail-container
  height: calc(100vh - 64px)
  .left__information--stock
    .stock__information
      border-bottom: 1px solid #eeeff2

      .p-disabled, .p-component:disabled
        opacity: 1

      ::v-deep.p-inputtext
        max-width: 130px
        border: 1px solid #b2b2bb
        background: transparent
        padding: 0
        color: #000
        font-weight: 600

  .right__information--stock
    .stock__log--history
      height: calc(100vh - 130px)
    ::v-deep.p-tabview .p-tabview-nav li
      .p-tabview-nav-link
        background: #e9ecef
        border: none
        box-shadow: none !important

    ::v-deep.p-tabview .p-tabview-panels
      background: #e9ecef
      padding: 1.25rem 0 0 0

    ::v-deep.p-highlight .p-tabview-nav-link
      color: #000 !important
      border-bottom: 2px solid #486AE2 !important

  .icon
    background-color: #094db1 !important

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

.wapprer-unit
  height: 72px
  border-radius: 4px
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
