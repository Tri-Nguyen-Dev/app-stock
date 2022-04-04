/* eslint-disable import/named */
<template lang="pug">
  .grid.flex.grid-nogutter
    div.bg-white.border-round-top.sub-tab(class=' col-3  md:col-3 lg:col-3 xl:col-3')
      .col.flex.align-items-center.p-3
        Button(@click='backToBox').p-button-link
          .icon-arrow-left.icon.bg-primary.mr-3.align-items-center
        span.font-normal Box list  /  
        span.font-normal.text-primary &nbsp;  Box Detail
      .border-bottom-1.border-gray-300.grid-nogutter
      .grid.flex.my-4.p-3.grid-nogutter
        .col.flex.align-items-center
          .icon-box-info.icon.bg-primary.mr-2
          span.font-bold.text-800(style='font-size: 18px' ) Box Detail
        .col-fixed
          Button.border-0.p-0.h-2rem.w-2rem.justify-content-center.surface-200.shadow-none( @click="btnEdit" :class='isEditBox? "hidden " : "" ' )
            .icon-btn-edit.icon
          Button.border-1.p-0.h-2rem.w-5rem.justify-content-center.bg-primary.shadow-none(@click="btnEdit" :class='isEditBox? "" : "hidden"' )
            .icon-check-lg.icon.bg-white.mr-1
            span Save
      .grid-nogutter
        .col.px-3
          div(:class='isEditBox? "opacity-40" : "opacity-100"')
            span.font-bold.text-white.bg-green-500.p-2.border-round AVAILABLE
          .font-bold.my-3
            .col(:class='isEditBox? "opacity-40" : "opacity-100"')
              span Box Code: 
                span.text-primary 2301321321
          .grid.align-items-center.m-0.px-2.py-1.border-round.surface-100.mb-2(:class='isEditBox? "opacity-40" : "opacity-100"')
            .col-fixed.mr-2
              .icon-receipt.bg-primary.icon--large
            div(class=' col-12  lg:col-12 xl:col-8')
              span.font-bold.text-600 Receipt note ID 
              .mt-1.flex.align-items-center
                span.font-bold NTH001
                .icon-arrow-up-right.icon--base
          .grid.align-items-center.m-0.px-2.py-1.border-round.surface-100.mb-2(:class='isEditBox? "opacity-40" : "opacity-100"')
            .col-fixed.mr-2
              .icon-tag-user.bg-primary.icon--large
            div(class=' col-12  lg:col-12 xl:col-8')
              span.font-bold.text-600 Create ID
              .mt-1.flex.align-items-center
                span.font-bold NTH001
          .grid.align-items-center.m-0.px-2.py-1.border-round.surface-100.mb-2(:class='isEditBox? "opacity-40" : "opacity-100"')
            .col-fixed.mr-2
              .icon-warehouse.bg-primary.icon--large
            div(class=' col-12  lg:col-12 xl:col-8')
              span.font-bold.text-600 Warehouse
              .mt-1.flex.align-items-center
                span.font-bold NTH001
                .icon-arrow-up-right.icon
          .grid.align-items-center.m-0.px-2.py-1.border-round.surface-100.mb-2
            .col-fixed.mr-2
              .icon-location-2.icon--large.bg-primary
            div(class=' col-12  lg:col-12 xl:col-8')
              span.font-bold.text-600 Location
              .mt-1.flex.align-items-center
                AutoComplete.edit-location( v-model="isLocation"  :suggestions="locationList" @item-select="searchLocation($event)"   field="name" :disabled='isEditBox == 0')
                  template(#item="slotProps")
                    .grid.align-items-center.grid-nogutter
                      span.font-bold {{slotProps.item.name}}
                      .icon-arrow-up-right.icon
          .grid.align-items-center.m-0.px-2.py-1.border-round.surface-100.mb-2(:class='isEditBox? "opacity-40" : "opacity-100"')
            .col-fixed.mr-2
              .icon-calendar.icon--large.bg-primary
            div(class=' col-12  lg:col-12 xl:col-8')
              span.font-bold.text-600 Create Time
              .mt-1
                span.font-bold 19-09-2020 9:20AM
            div
          .grid.align-items-center.m-0.px-2.py-1.border-round.surface-100.mb-2(:class='isEditBox? "opacity-40" : "opacity-100"')
            .col-fixed.mr-2
              .icon-frame.icon--large.bg-primary
            div(class=' col-12  lg:col-12 xl:col-8')
              span.font-bold.text-600 Box Items
              .mt-1
                span.font-bold 1280
          .grid.align-items-center.m-0.pl-2.py-1.border-round.surface-100.mb-2(:class='isEditBox? "opacity-40" : "opacity-100"')
            .col-fixed.mr-2
              .icon-dollar-square-2.icon--large.bg-primary
            div(class=' col-12  lg:col-12 xl:col-9')
              span.font-bold.text-600 Estimated inventory Fee
              .mt-1
                span.font-bold 20$ PER DAY
          .grid.align-items-center.m-0.px-2.py-1.border-round.surface-100.mb-5(:class='isEditBox? "opacity-40" : "opacity-100"')
            .col-fixed.mr-2
              .icon-resize.icon--large.bg-primary
            div(class=' col-12  lg:col-12 xl:col-8')
              span.font-bold.text-600 Box Size:
              span.font-bold.text-600.text-primary  Small
              .mt-1
                span.font-bold 180*180*180
      .grid-nogutter(:class='isEditBox? "opacity-40" : "opacity-100"')
        .col.border-bottom-1.border-gray-300
        .grid.flex.my-2.p-3.grid-nogutter
          .col.flex.align-items-center
            .icon-seller-information.icon--base.bg-primary.mr-2
            span.font-bold.text-800(style='font-size: 18px' ) Seller Information
        .col.p-3
          .grid.align-items-center.m-0.px-2.py-1.border-round.surface-100.mb-2
            .col-fixed.mr-2
              .icon-user-octagon-2.icon--large.bg-primary
            div(class=' col-12  lg:col-12 xl:col-8')
              span.font-bold.text-600 Sender
              .mt-1 
                span.font-bold Apple Inc
          .grid.align-items-center.m-0.px-2.py-1.border-round.surface-100.mb-2
            .col-fixed.mr-2
              .icon-sms-notification.icon--large.bg-primary
            div(class=' col-12  lg:col-12 xl:col-8')
              span.font-bold.text-600 Email Address
              .mt-1
                span.font-bold pỏn@gmail.com
          .grid.align-items-center.m-0.px-2.py-1.border-round.surface-100.mb-5
            .col-fixed.mr-2
              .icon-phone.icon--large.bg-primary
            div(class=' col-12  lg:col-12 xl:col-8')
              span.font-bold.text-600 Phone number
              .mt-1
                span.font-bold +84 333 666 9999
    div.ml-5.flex-1(class=' col-7  md:col-8  lg:col-8 xl:col-8')
      .grid.justify-content-between
        .col-fixed
          h1.m-0.mb-1 Box List
      .grid.w-full.grid-nogutter.right__information--stock.relative.tabview-relative
        .col(class=' col-12  md:col-12 lg:col-12 xl:col-12')
          TabView( @tab-click="onTabClick($event)" )
            TabPanel
              template(#header)
                .icon.icon-history.mr-2.surface-600
                span Stock history
              .grid(v-if="isFilter")
                .col
                  .bg-white.border-round
                    div.pt-2.pl-1.pb-1
                      span.text-600.text-sm.pl-2 SKU
                    span.p-input-icon-right.w-full
                      .icon.icon--right.icon-search-input.surface-900
                      InputText.border-0.w-full.mb-1.text-900.font-bold(type="text" placeholder="SKU" v-model="skuFilter")
                .col
                  .bg-white.border-round
                    div.pt-2.pl-1.pb-1
                      span.text-600.text-sm.pl-2 Bar code
                    span.p-input-icon-right.w-full
                      .icon.icon--right.icon-search-input.surface-900
                      InputText.border-0.w-full.mb-1.text-900.font-bold(type="text" placeholder="Barcode" v-model="barcodeFilter")
                .col
                  .bg-white.border-round
                    div.pt-2.pl-1.pb-1
                      span.text-600.text-sm.pl-2 Category
                      Dropdown.w-full.border-0.mb-1.text-900.font-bold( v-model="categorySelected" :options='categoryList' optionLabel="name" placeholder="Select")
              .overflow-auto.item__log--history
                BoxDetailTable(v-if="stockList.length > 0" :stockList='stockList')
            TabPanel
              template(#header)
                .icon.icon-location-2.mr-2.surface-600
                span Location history
              .overflow-auto.box__detail--history
                BoxDetailHistory(v-if="stockList.length > 0" :stockList='stockList')
        .grid.tabview-left(:class='isItemHistory? "hidden" : "" ')
          .col
            span.p-input-icon-left
              .icon.icon--left.icon-search-input.surface-900
              InputText.w-23rem.font-bold.h-3rem.py-4(type="text" placeholder="Search")
          .col
            Button.border-0.bg-white.w-7rem.shadow-none.border-primary.h-3rem.py-4(@click="isFilter = !isFilter")
              .icon-filter.bg-primary.icon
              span.text-900.ml-3.text-primary Filter

</template>

<script lang="ts">
import { Component,  Vue, Watch, namespace } from 'nuxt-property-decorator'

const nsStoreSubmission = namespace('box/box-detail')
const nsStoreCategoryList = namespace('category/category-list')
const nsStoreLocationList = namespace('location/location-list')

@Component
class boxDetail extends Vue {
  isFilter: boolean = false
  isEditBox: boolean = false
  isItemHistory: boolean = false
  isLocation : any = null
  suggestions: any = []
  locations: any = null
  skuFilter: any = null
  categorySelected: any = null
  barcodeFilter: any = null
  pageNumber: number = 1
  pageSize: number = 20
   test: any = {}

  @nsStoreLocationList.State
  locationList!: any

  @nsStoreSubmission.State
  stockList!: any

  @nsStoreCategoryList.State
  categoryList!:any

  @nsStoreSubmission.Action
  actGetBoxDetailFilter!: (params: any) => Promise<void>

  @nsStoreCategoryList.Action
  actCategoryList!: () => Promise<void>

  @nsStoreLocationList.Action
  actLocationList!: (params: any) => Promise<void>

  async mounted() {
    await this.actGetBoxDetailFilter( { pageNumber: this.pageNumber, pageSize: this.pageSize} )
    this.actCategoryList()
    this.actLocationList({name: null})
  }

  backToBox() {
    this.$router.push('/box')
    
  }

  btnEdit() {
    this.isEditBox = !this.isEditBox
  }

  onTabClick(){
      this.isItemHistory = !this.isItemHistory
      this.isFilter = false
  }


  
  @Watch('skuFilter')
  @Watch('barcodeFilter')
  @Watch('categorySelected')
   async filtersChange(){
    await this.actGetBoxDetailFilter({
      pageNumber: 1, pageSize: this.pageSize,
      'sku' : this.skuFilter,
      'barcode' : this.barcodeFilter,
      'category.id': this.categorySelected?.id
    }) 
  }

  @Watch('isLocation')
  async filterLocation(){
    await this.actLocationList({
      'name': this.isLocation
    })
  }

  // searchLocation(event){
  // }
}

export default boxDetail
</script>

<style lang="sass" scoped >
@media (max-width: 1024px) 
  .tabview-left
    top: -4rem !important

.tabview-relative
  position: relative
  .tabview-left
    position: absolute
    top: -0.5rem
    right: 0
.grid
  ::v-deep.sub-tab 
    height: calc(100vh - 32px)
    max-width: 21.5rem
    overflow: auto
.right__information--stock
  display: flex
  flex-direction: column
  ::v-deep.item__log--history
    height: calc(100vh - 228px)
  .box__detail--history
    height: calc(100vh - 148px)
  ::v-deep.p-tabview .p-tabview-nav li
    .p-tabview-nav-link
      background: var(--bg-body-bas)
      border: none
      box-shadow: none !important

  ::v-deep.p-tabview .p-tabview-panels
    background: var(--bg-body-bas)
    padding: 1.25rem 0 0 0

  ::v-deep.p-highlight .p-tabview-nav-link
    color: #000 !important
    border-bottom: 2px solid #486AE2 !important
    .icon
      background-color:  var(--primary-color) !important

.edit-location
  ::v-deep input
    border: none
    box-shadow: none !important
    text-transform: uppercase
    font-weight: bold
    color: var(--surface-900)
    padding: 0
    background-color: var(--surface-100)
    opacity: 1


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

::-webkit-input-placeholder
  color: $text-color-900
.p-disabled, .p-component:disabled
  opacity: 1

</style>
