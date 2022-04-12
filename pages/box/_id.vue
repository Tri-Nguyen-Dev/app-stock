<template lang="pug">
  .grid.flex.grid-nogutter.box-page-container
    div.bg-white.border-round-top.sub-tab(class='col-3 md:col-3 lg:col-3 xl:col-3')
      .col.flex.align-items-center.p-3
        Button(@click='backToBox').p-button-link
          .icon-arrow-left.icon.bg-primary.mr-3.align-items-center
        span.font-normal( @click='backToBox') Box list /
        span.font-normal.text-primary &nbsp;  Box Detail
      .border-bottom-1.border-gray-300.grid-nogutter
      .grid.flex.my-4.p-3.grid-nogutter
        .col.flex.align-items-center
          .icon-box-info.icon.bg-primary.mr-2
          span.font-bold.text-800.uppercase Box Detail
        .col-fixed
          Button.border-0.p-0.h-2rem.w-2rem.justify-content-center.surface-200.shadow-none( @click="btnEdit" :class='isEditBox? "hidden " : "" ' )
            .icon-edit-btn.icon
          Button.border-1.p-0.h-2rem.w-5rem.justify-content-center.bg-primary.shadow-none(@click="btnEdit" :class='isEditBox? "" : "hidden"'  )
            .icon-check-lg.icon.bg-white.mr-1
            span Save
      div
        .col.px-3
          div( v-if='boxDetail.status' :class='isEditBox? "opacity-40" : "opacity-100"')
            Tag(:class="boxDetail.status === 'BOX_STATUS_AVAILABLE' ? 'bg-green-500' : boxDetail.status === 'BOX_STATUS_DRAFT' ? 'bg-blue-100' : 'surface-200'").py-1
                span.text-base.font-bold.px-3.border-round(:class="boxDetail.status === 'BOX_STATUS_AVAILABLE' ? 'text-white' : boxDetail.status === 'BOX_STATUS_DRAFT' ? 'text-primary' : 'text-400'") {{ boxDetail.status | boxStatus }}
          .font-bold.my-3
            div(:class='isEditBox? "opacity-40" : "opacity-100"')
              span Box Code:
                span.text-primary.uppercase.ml-2 {{boxDetail.barCode}}
      .grid.grid-nogutter.sub--scroll
        .col.px-3
          .grid.align-items-center.m-0.px-2.py-1.border-round.surface-100.mb-2(:class='isEditBox? "opacity-40" : "opacity-100"')
            .col-fixed.mr-2
              .icon-receipt-note.bg-primary.icon--large
            div(class='col-12 lg:col-12 xl:col-8')
              span.font-bold.text-600 Receipt note ID
              div.mt-1.flex.align-items-center.w-7rem.overflow-hidden.white-space-nowrap.text-overflow-ellipsis
                span.font-bold.uppercase {{ receiptNoteId }}
                .icon-arrow-up-right.icon--base
          .grid.align-items-center.m-0.px-2.py-1.border-round.surface-100.mb-2(v-if='boxDetail.createBy' :class='isEditBox? "opacity-40" : "opacity-100"')
            .col-fixed.mr-2
              .icon-tag-user.bg-primary.icon--large
            div(class='col-12 lg:col-12 xl:col-8')
              span.font-bold.text-600 Create ID
              .mt-1.flex.align-items-center
                span.font-bold.uppercase {{ boxDetail.createBy }}
          .grid.align-items-center.m-0.px-2.py-1.border-round.surface-100.mb-2(:class='isEditBox? "opacity-40" : "opacity-100"')
            .col-fixed.mr-2
              .icon-warehouse.bg-primary.icon--large
            div(class='col-12 lg:col-12 xl:col-8')
              span.font-bold.text-600 Warehouse
              .mt-1.flex.align-items-center
                span.font-bold.uppercase {{ boxWarehouse }}
                .icon-arrow-up-right.icon
          .grid.align-items-center.m-0.px-2.py-1.border-round.surface-100.mb-2
            .col-fixed.mr-2
              .icon-location-2.icon--large.bg-primary
            div(class='col-12 lg:col-12 xl:col-8')
              span.font-bold.text-600 Location
              .mt-1.flex.align-items-center
                AutoComplete.edit-location( v-model="isLocation" :suggestions='locationList'  :disabled='isEditBox == 0' :placeholder='boxLocation'  )
                  template(#item="slotProps")
                    .grid.align-items-center.grid-nogutter
                      span.font-bold {{ slotProps.item.name }}
                      .icon-arrow-up-right.icon
          .grid.align-items-center.m-0.px-2.py-1.border-round.surface-100.mb-2(:class='isEditBox? "opacity-40" : "opacity-100"')
            .col-fixed.mr-2
              .icon-calendar.icon--large.bg-primary
            div(class='col-12 lg:col-12 xl:col-8')
              span.font-bold.text-600 Create Time
              .mt-1
                span.font-bold  {{ boxDetail.createdAt | dateTimeHour12 }}
            div
          .grid.align-items-center.m-0.px-2.py-1.border-round.surface-100.mb-2(:class='isEditBox? "opacity-40" : "opacity-100"')
            .col-fixed.mr-2
              .icon-frame.icon--large.bg-primary
            div(class='col-12 lg:col-12 xl:col-8')
              span.font-bold.text-600 Box Items
              .mt-1
                span.font-bold {{ boxDetail.length }}
          .grid.align-items-center.m-0.pl-2.py-1.border-round.surface-100.mb-2(:class='isEditBox? "opacity-40" : "opacity-100"')
            .col-fixed.mr-2
              .icon-price.icon--large.bg-primary
            div(class='col-12 lg:col-12 xl:col-9')
              span.font-bold.text-600 Estimated inventory Fee
              .mt-1
                span.font-bold {{ boxDetail.inventoryFee }}$ PER DAY
          .grid.align-items-center.m-0.px-2.py-1.border-round.surface-100.mb-2(:class='isEditBox? "opacity-40" : "opacity-100"')
            .col-fixed.mr-2
              .icon-size.icon--large.bg-primary
            div.align-items(class='col-12 lg:col-12 xl:col-8')
              span.font-bold.text-600 Box Size:
              span.font-bold.text-600.bg-primary.ml-1.border-round(:class='boxDetail.boxSize? "p-1" : ""') {{ boxDetail.boxSize | boxSize }}
              .mt-1
                span.font-bold {{ boxDetail.length }}*{{ boxDetail.width }}*{{ boxDetail.height }}
        .col(:class='isEditBox? "opacity-40" : "opacity-100"')
          .div.mb-6
            .col.border-bottom-1.border-gray-300
            .col.flex.my-3
              .col.flex.align-items-center
                .icon-sender-info.icon.bg-primary.mr-2
                span.font-bold.text-800.uppercase Seller Information
            BoxDetailValue(v-for='item in sellerInfor' :key='item.id' :item='item' :boxSellerInfor='boxSellerInfor')
    div.ml-5.flex-1(class=' col-7  md:col-8  lg:col-8 xl:col-8')
      .grid.justify-content-between
        .col-fixed
          h1.m-0.mb-1 Box Detail
      .grid.w-full.grid-nogutter.right__information--stock.relative.tabview-relative
        .col(class=' col-12  md:col-12 lg:col-12 xl:col-12')
          TabView( @tab-change="onTabClick($event)" )
            TabPanel
              template(#header)
                .icon.icon-history.mr-2.surface-600
                span Item history
              .grid(v-if="isFilter")
                .col
                  .bg-white.border-round
                    div.pt-2.pl-1.pb-1
                      span.text-600.text-sm.pl-2 SKU
                    span.p-input-icon-right.w-full
                      .icon.icon--right.icon-search.surface-900
                      InputText.border-0.w-full.mb-1.text-900.font-bold(type="text" placeholder="SKU" v-model="filterParams.sku")
                .col
                  .bg-white.border-round
                    div.pt-2.pl-1.pb-1
                      span.text-600.text-sm.pl-2 Barcode
                    span.p-input-icon-right.w-full
                      .icon.icon--right.icon-search.surface-900
                      InputText.border-0.w-full.mb-1.text-900.font-bold(type="text" placeholder="Barcode" v-model="filterParams.barCode")
                .col
                  .bg-white.border-round
                    div.pt-1.pl-1.pb-1
                      span.text-600.text-sm.pl-2 Category
                      Dropdown.w-full.border-0.mb-1.text-900.font-bold(v-model="filterParams.category" :options='categoryList' optionLabel="name" optionValue="id" placeholder="Select")
              BoxDetailTable(:listStockWithAmount='filteredBoxDetailData' :totalItems='totalItems')
            TabPanel
              template(#header)
                .icon.icon-location-2.mr-2.surface-600
                span Location history
              .overflow-auto.box__detail--history
                //- BoxDetailHistory( v-if="listStockWithAmount.length > 0" :listStockWithAmount='listStockWithAmount' :totalStockRecords='totalStockRecords' )
        .grid.tabview-left(:class='isItemHistory? "hidden" : "" ')
          .col
            span.p-input-icon-left
              .icon.icon--left.icon-search.surface-900
              InputText.w-23rem.font-bold.h-3rem.py-4.text-900(type="text" placeholder="Search" v-model='filterParams.name' )
          .col
            Button.border-0.bg-white.w-7rem.shadow-none.border-primary.h-3rem.py-4(@click="isFilter = !isFilter")
              .icon-filter.bg-primary.icon
              span.text-900.ml-3.text-primary Filter
</template>

<script lang="ts">
import { Component, namespace, Vue, Watch } from 'nuxt-property-decorator'
import { ITEM_BOX_DETAIL, ITEM_SELLER_INFOR } from '~/utils'
const nsStoreBoxDetail = namespace('box/box-detail')
const nsStoreCategoryList = namespace('category/category-list')
const nsStoreLocationList = namespace('location/location-list')

@Component
class BoxDetail extends Vue {
  isFilter: boolean = false
  isEditBox: boolean = false
  isItemHistory: boolean = false
  isLocation: any = null
  isEditStockDetail: boolean = false
  filterParams: any = {
    sku: null,
    category: null,
    barCode: null,
    name: null
  }

  pageNumber: number = 1
  pageSize: number = 20
  boxDetailData: any = []

  itemBoxDetail = ITEM_BOX_DETAIL
  sellerInfor = ITEM_SELLER_INFOR

  @nsStoreLocationList.State
  locationList: []

  @nsStoreBoxDetail.State
  totalItems!: number

  @nsStoreBoxDetail.State
  boxDetail!: {
    warehouse: string
    request: any
    location: any
    listStockWithAmount: []
    shelfBin: any
  }

  @nsStoreCategoryList.State
  categoryList!:any

  @nsStoreBoxDetail.Action
  actGetBoxDetail!: (params: any) => Promise<void>

  @nsStoreCategoryList.Action
  actCategoryList!: () => Promise<void>

  @nsStoreLocationList.Action
  actLocationList!: (params: any) => Promise<void>

  get convertBoxDetailData() {
    if (this.boxDetail && this.boxDetail.listStockWithAmount) {
      return [
        ...this.boxDetail.listStockWithAmount.map((item: any) => ({
          ...(item.stock || []),
          amount: item.amount
        }))
      ]
    }
    return []
  }

  get filteredBoxDetailData() {
    return this.convertBoxDetailData.filter(item => {
      let filter = true
      Object.keys(this.filterParams).map(key => {
        if (this.filterParams[key]) {
          if (key === 'category') {
            filter = filter && item[key]?.id === this.filterParams[key]
          } else {
            filter = filter && item[key]?.includes(this.filterParams[key])
          }
        }
        return filter
      })
      return filter
    })
  }

  saveEditStockDetail() {
    this.isEditStockDetail = false
  }

  async mounted() {
    if(this.$route.query.plan === 'edit') {
      this.isEditStockDetail = false
    }
    await this.actGetBoxDetail({ id: this.$route.params.id })
    await this.actCategoryList()
    await this.actLocationList({name: null})
  }

  backToBox() {
    this.$router.push('/box')
  }

  btnEdit() {
    this.isEditBox = !this.isEditBox
    this.saveEditStockDetail()
  }

  onTabClick() {
    this.isItemHistory = !this.isItemHistory
    this.isFilter = false
  }

  @Watch('isLocation')
  async filterLocation() {
    await this.actLocationList({
      name: this.isLocation === '' ? null : this.isLocation
    })
  }

  get boxWarehouse() {
    return this.boxDetail.request?.warehouse.name || ''
  }

  get boxSellerInfor() {
    return this.boxDetail.request?.seller || ''
  }

  get boxLocation() {
    return this.boxDetail.shelfBin?.name || null
  }

  get receiptNoteId() {
    return this.boxDetail.request?.id || null
  }
}

export default BoxDetail
</script>

<style lang="sass" scoped>
@media (max-width: 1024px)
  .tabview-left
    top: -4rem !important
    .input-absolute
      width: 15rem !important
@media (max-width: 768px)
  .tabview-left
    top: -3rem !important
    .input-absolute
      width: 15rem !important
  .tabview-relative
    margin-top: 3rem
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
    overflow: hidden
.sub--scroll
  height: calc(100vh - 280px)
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
      background-color: var(--primary-color) !important

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
  ::-webkit-input-placeholder
    color: var(--surface-900)

::-webkit-input-placeholder
  font-weight: normal

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
.p-disabled, .p-component:disabled
  opacity: 1
</style>