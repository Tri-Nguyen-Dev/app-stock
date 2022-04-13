<template lang="pug">
 .grid.grid-nogutter.item__detail-container.overflow-hidden
    .col-4.p-0.surface-0.border-round.left__information--stock.h-full.overflow-y-auto.overflow-x-hidden
      .grid.border-bottom-1.border-gray-300
       .col.p-4.flex.align-items-center
        Button(@click='backToStockList').p-button-link.mr-2
          .icon.icon-btn-back.bg-blue-700
        span.font-semibold.text-lg Stock list / Stock Detail / Item Detail
      .stock__information.p-4(v-if='itemDetail.data')
        .grid.mb-3
          .col-9.flex
            .icon.icon-box-info.inline-block.mr-1.bg-blue-700
            span.uppercase.font-bold Item Detail
          .col.flex.justify-content-end
            .surface-hover.border-round.cursor-pointer.p-2(@click='editItemDetail' :class='isEditItemDetail ? "hidden" : " "')
              .icon.icon-btn-edit
            Button(:class='isEditItemDetail ? " " : "hidden"' @click='saveEditItemDetail')
              .icon-btn.icon-check-lg.bg-white.mr-1
              span.uppercase save
        .grid.mb-3(:class='isEditItemDetail ? "opacity-40" : "opacity-100"')
          .col(class='xl:col-4').stock__information--image
            img(:src='itemDetail.data.stock.imageUrl').border-round.w-full
          .col
            //- Tag(severity="success").uppercase {{itemDetail.deleted ? 'Disable' : 'Available'}}
            //- h3.font-bold.my-2 {{itemDetail.name}}
            Tag(severity="success").uppercase Available
            h3.font-bold.my-2 Macbook ProMax 1TB
            div.mb-2
              p.uppercase.inline.font-semibold.text-400.mr-2 code:
              //- span.uppercase.font-semibold.text-blue-700 {{itemDetail.boxCode}}
              span.uppercase.font-semibold.text-blue-700 sdf090s
            div.mb-2
              p.uppercase.inline.font-semibold.text-400.mr-2 sku:
              //- span.uppercase.font-semibold.text-blue-700 {{itemDetail.sku}}
              span.uppercase.font-semibold.text-blue-700 lgjlk9
            div
              p.uppercase.inline.font-semibold.text-400.mr-2 unit:
              span.uppercase.font-semibold.text-blue-700 piece
        .grid.mb-3(:class='isEditItemDetail ? "opacity-40" : "opacity-100"')
          .col-6(class='xl:col-6 lg:col-12 md:col-12 sm:col-12')
           div.surface-hover.p-3
            .grid.align-items-center
              .col-3.flex.justify-content-end
                .icon--large.icon-receipt-note.bg-blue-700
              .col
                div.text-500 Receipt note ID
                //- span.font-semibold {{itemDetail.receiptNote}}
                span.font-semibold.uppercase asadfgkl80
                .icon-btn.icon-export.inline-block
          .col-6(class='xl:col-6 lg:col-12 md:col-12 sm:col-12')
           div.surface-hover.p-3
            .grid.align-items-center
              .col-3.flex.justify-content-end
                .icon--large.icon-tag-user.bg-blue-700
              .col
                div.text-500 Creator ID
                //- span.font-semibold {{itemDetail.creatorId}}
                span.font-semibold.uppercase asdgasga56
        .grid.mb-3(:class='isEditItemDetail ? "opacity-40" : "opacity-100"')
          .col(class='xl:col-6 lg:col-12 md:col-12 sm:col-12')
           div.surface-hover.p-3
            .grid.align-items-center
              .col-3.flex.justify-content-end
                .icon--large.icon-warehouse.bg-blue-700
              .col
                div.text-500 Warehouse
                //- span.font-semibold.mr-1.uppercase {{itemWarehouse}}
                span.font-semibold.mr-1.uppercase asdgasg43
                .icon-btn.icon-arrow-up-right.inline-block
          .col-6(class='xl:col-6 lg:col-12 md:col-12 sm:col-12')
           div.surface-hover.p-3
            .grid.align-items-center
              .col-3.flex.justify-content-end
                .icon--large.icon-location-2.bg-blue-700
              .col
                div.text-500 Location
                //- span.font-semibold.mr-1.uppercase {{itemLocation}}
                span.font-semibold.mr-1.uppercase asdf-35-g
                .icon-btn.icon-arrow-up-right.inline-block
        .grid.mb-3(:class='isEditItemDetail ? "opacity-40" : "opacity-100"')
          .col-6(class='xl:col-6 lg:col-12 md:col-12 sm:col-12')
           div.surface-hover.p-3
            .grid.align-items-center
              .col-3.flex.justify-content-end
                .icon--large.icon-size.bg-blue-700
              .col
                div.text-500 Size (cm)
                span.font-semibold 180x180x180
          .col-6(class='xl:col-6 lg:col-12 md:col-12 sm:col-12')
           div.surface-hover.p-3
            .grid.align-items-center
              .col-3.flex.justify-content-end
                .icon--large.icon-weight.bg-blue-700
              .col
                div.text-500 Weight (Kg)
                span.font-semibold  20.8
        .grid
          .col(:class='isEditItemDetail ? "opacity-40" : "opacity-100"' class='xl:col-6 lg:col-12 md:col-12 sm:col-12')
            .surface-hover.p-3
              .grid.align-items-center
                .col-3.flex.justify-content-end
                  .icon--large.icon-boxcode.bg-blue-700
                .col
                  div.text-500 Boxcode
                  //- span.font-semibold.mr-1.uppercase {{itemDetail.boxCode}}
                  span.font-semibold.mr-1.uppercase asdg543
                  .icon-btn.icon-export.inline-block
          .col(class='xl:col-6 lg:col-12 md:col-12 sm:col-12')
            .surface-hover.p-3
              .grid.align-items-center
                .col-3.flex.justify-content-end
                  .icon--large.icon-price.bg-blue-700
                .col
                  div.text-500 Value
                  //- InputText(:disabled='isEditItemDetail == 0' v-model='itemDetail.price').w-6
                  InputText(:disabled='isEditItemDetail == 0' v-model='isEditItemDetail').w-6
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
              //- span.font-semibold {{sellerName}}
              span.font-semibold Obama Yamaha
        .surface-hover.mb-5
          .grid.p-3.align-items-center
            .col-1(class='xl:col-1 lg:col-2').sender__information--name
              .icon--large.icon-sender-email.bg-blue-700
            .col
              div.text-500 Email Address
              //- span.font-semibold {{sellerEmail}}
              span.font-semibold DonaldTrump@JoeBiden.com
        .surface-hover.mb-5
          .grid.p-3.align-items-center
            .col-1(class='xl:col-1 lg:col-2').sender__information--name
              .icon--large.icon-sender-phone.bg-blue-700
            .col
              div.text-500 Phone number
              //- span.font-semibold {{sellerPhone}}
              span.font-semibold 091234567
    .col-8.px-5.right__information--stock
      TabView
        TabPanel
          template(#header)
            .icon.icon-history.mr-2.surface-600
            span Stock history
          .overflow-auto.stock__log--history
            StockLogInformation(v-for='item in 4' :key='item.index').mb-3
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

@Component({
  layout: 'dashboard'
})
class ItemDetail extends Vue {
  isEditItemDetail: boolean = false

  @nsStoreStock.State
  itemDetail!: StockModel.ModelDetail

  @nsStoreStock.Action
  actGetItemsDetail

  backToStockList() {
    this.$router.push(`/stock/${this.$route.params.sid}`)
  }

  editItemDetail() {
    this.isEditItemDetail = true
  }

  saveEditItemDetail() {
    this.isEditItemDetail = false
  }

  // get itemLocation() {
  //   return this.itemDetail.data.location?.name
  // }

  // get itemWarehouse() {
  //   return this.itemDetail.data.warehouse?.name
  // }

  // get sellerName() {
  //   return this.itemDetail.data.seller?.name
  // }

  // get sellerEmail() {
  //   return this.itemDetail.data.seller?.email
  // }

  // get sellerPhone() {
  //   return this.itemDetail.data.seller?.phone
  // }

  async mounted() {
    if(this.$route.query.plan === 'edit') {
      this.isEditItemDetail = true
    }
    await this.actGetItemsDetail({ stockId: this.$route.params.sid, boxId: this.$route.params.bid })
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
