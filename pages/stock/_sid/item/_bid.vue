<template lang="pug">
 .grid.grid-nogutter.item__detail-container.overflow-hidden(v-if='model.data')
    .col-4.p-0.surface-0.border-round.left__information--stock.h-full.overflow-y-auto.overflow-x-hidden
      .grid.border-bottom-1.border-gray-300
       .col.p-4.flex.align-items-center
        Button(@click='backToStockList').p-button-link.mr-2
          .icon.icon-btn-back.bg-blue-700
        span.font-semibold.text-lg Stock list / Stock Detail / Item Detail
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
            img(:src='model.data.stock.imagePath' alt="stock").border-round.w-full
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
            StockUnit(title="Receipt note ID" link="https://rikkei.vn" :value="model.data.box.request.id" :isEdit="false" icon="icon-receipt-note")
          .col-6(class='xl:col-6 lg:col-12 md:col-12 sm:col-12 p-3')
            StockUnit(title="Creator ID" :value="model.data.box.request.createBy" :isEdit="false" icon="icon-tag-user")
          .col-6(class='xl:col-6 lg:col-12 md:col-12 sm:col-12 p-3')
            StockUnit(title="Warehouse" link="https://rikkei.vn" :isEdit="false" icon="icon-warehouse")
          .col-6(class='xl:col-6 lg:col-12 md:col-12 sm:col-12 p-3')
            StockUnit(title="Location" link="https://rikkei.vn" :isEdit="false" icon="icon-location-2")
          .col-6(class='xl:col-6 lg:col-12 md:col-12 sm:col-12 p-3')
            StockUnit(title="Size (L*W*H)" type ="size" :height="model.data.stock.height" :length="model.data.stock.length" :width="model.data.stock.width" :isEdit="isEditStockDetail" icon="icon-size")
          .col-6(class='xl:col-6 lg:col-12 md:col-12 sm:col-12 p-3')
            StockUnit(title="Weight (Kg)" :value="model.data.stock.weight" :isEdit="false" icon="icon-weight")
          .col-6(class='xl:col-6 lg:col-12 md:col-12 sm:col-12 p-3')
            StockUnit(title="Boxcode" :value="model.data.box.barCode" :isEdit="false" icon="icon-delivery")
          .col-6(class='xl:col-6 lg:col-12 md:col-12 sm:col-12 mt-2')
            .surface-hover.wapprer-unit
              .grid.align-items-center
                .col-3.flex.justify-content-end
                  .icon--large.icon-price.bg-blue-700
                .col
                  div.text-500 Value
                  InputText(:disabled='isEditItemDetail == 0' v-model='model.data.value').w-6
            //- StockUnit(title="Value" type ="weight" :weight="model.data.value" :isEdit="isEditItemDetail" icon="icon-price" @updateUnit='handleUpdateUnit')
        .grid.mt-1(:class='isEditItemDetail ? " " : "hidden"')
          .col
            .text-center.surface-hover.cursor-pointer.border-round.p-1(@click='cancelEditItemDetail')
              span.uppercase.font-semibold cancel
          .col
            .text-center.bg-blue-500.cursor-pointer.border-round.text-white.p-1(@click='saveEditItemDetail')
              span.uppercase save
      .sender__information.p-4(:class='isEditItemDetail ? "opacity-40" : "opacity-100"')
        .grid.mb-3
          .col
            .icon.icon-sender-info.mr-2.bg-blue-700.inline-block
            span.uppercase.font-bold Seller information
        .surface-hover.mb-5
          .grid.p-3.align-items-center
            .col-1(class='xl:col-1 lg:col-2').sender__information--name
              .icon--large.icon-sender-name.bg-blue-700
            .col
              div.text-500 Seller
              span.font-semibold {{model.data.box.request.seller.name}}
        .surface-hover.mb-5
          .grid.p-3.align-items-center
            .col-1(class='xl:col-1 lg:col-2').sender__information--name
              .icon--large.icon-sender-email.bg-blue-700
            .col
              div.text-500 Email Address
              span.font-semibold {{model.data.box.request.seller.email}}
        .surface-hover.mb-5
          .grid.p-3.align-items-center
            .col-1(class='xl:col-1 lg:col-2').sender__information--name
              .icon--large.icon-sender-phone.bg-blue-700
            .col
              div.text-500 Phone number
              span.font-semibold {{model.data.box.request.seller.phone}}
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
const _ = require('lodash')

@Component({
  layout: 'dashboard'
})
class ItemDetail extends Vue {
  isEditItemDetail: boolean = false
  model: StockModel.ModelDetail | any = {}

  @nsStoreStock.State
  itemDetail!: StockModel.ModelDetail

  @nsStoreStock.Action
  actGetItemsDetail

  @nsStoreStock.Action
  actUpdateItem!: (any) => Promise<any>

  backToStockList() {
    this.$router.push(`/stock/${this.$route.params.sid}`)
  }

  editItemDetail() {
    this.isEditItemDetail = true
  }

  saveEditItemDetail() {
    const pathParams = {
      stockId: this.$route.params.sid,
      boxId: this.$route.params.bid
    }
    this.actUpdateItem({path: pathParams, body: {
      value: this.model.data.value
    }})
    this.isEditItemDetail = false
  }

  cancelEditItemDetail() {
    this.isEditItemDetail = false
  }

  handleUpdateUnit() {

  }

  async mounted() {
    if(this.$route.query.plan === 'edit') {
      this.isEditItemDetail = true
    }
    await this.actGetItemsDetail({ stockId: this.$route.params.sid, boxId: this.$route.params.bid })
    this.model = _.cloneDeep(this.itemDetail)
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

      .p-inputtext
        border: none
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

      .icon-btn
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
