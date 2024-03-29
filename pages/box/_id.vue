<template lang="pug">
  .grid.grid-nogutter.flex
    CommonTabDetail(:homeItem="homeItem" :breadcrumbItem="breadcrumbItem" :isBack="true")
      template(v-slot:title)
        .grid.flex.my-3.grid-nogutter
          .col.flex.align-items-center
            .icon-box-info.icon.bg-primary.mr-2
            span.font-bold.text-700 Box Detail
          .col-fixed
            Button.border-0.p-0.h-2rem.w-2rem.justify-content-center.surface-200.shadow-none( @click="btnEdit" v-if='!isEditBox' )
              .icon-edit-btn.icon
        .col.px-0
          div( v-if='boxDetail.status' :class='isEditBox? "opacity-40" : "opacity-100"')
              span.p-2.table__status.table__status--available(
                v-if="boxDetail.status === 'BOX_STATUS_AVAILABLE'"
              ) {{ boxDetail.status | boxStatus }}
              span.p-2.table__status.table__status--disable(
                v-else-if="boxDetail.status === 'BOX_STATUS_DISABLE'"
              ) {{ boxDetail.status | boxStatus }}
              span.p-2.table__status.table__status--draft(
                v-else-if="boxDetail.status === 'BOX_STATUS_DRAFT'"
                ) {{ boxDetail.status | boxStatus }}
              span.p-2.table__status.table__status--outgoing(v-else) {{ boxDetail.status | boxStatus }}
          .font-bold.mt-3
            div(:class='isEditBox? "opacity-40" : "opacity-100"')
              span Box Code:
                span.text-primary.uppercase.ml-2 {{ boxDetail.id }}
        .col-12.py-0.mb-3(:class='isEditBox? "opacity-40" : "opacity-100"')
          .col.border-bottom-1.border-gray-300
      template(v-slot:content)
        .grid.m-0.mt-2.w-full
          .col-12
            StockUnit(title="Receipt ID"  :value="receiptNoteId" :isEdit="isEditBox" icon="icon-receipt-note")
          .col-12(v-if='boxDetail.createdBy')
            StockUnit(title="Creator ID" :value="boxDetail.createdBy.staffId" :isEdit="isEditBox" icon="icon-tag-user")
          .col-12
            StockUnit(title="Warehouse"  :value="boxWarehouse" :isEdit="isEditBox" icon="icon-warehouse")
          .col-12
            StockUnit(title="Location" icon="icon-location-2")
              template(v-slot:auto-complete)
                .mt-1.flex.align-items-center
                  AutoComplete.edit-location(
                    v-model="isLocation"
                    field='name'
                    :suggestions='locationList'
                    forceSelection :readOnly='!isEditBox'
                    :placeholder='boxLocation'
                    @complete="searchLocation($event)"  )
                    template(#item="slotProps")
                      .grid.align-items-center.grid-nogutter
                        span.font-bold.text-lg {{ slotProps.item.name }}
                        .icon-arrow-up-right.icon
          .col-12
            StockUnit(title="CreateD Time" :value="boxDetail.createdAt | dateTime" :isEdit="isEditBox" icon="icon-calendar")
          .col-12(v-if='boxDetail.listStockWithAmount')
            StockUnit(title="Box Items" :value="boxDetail.listStockWithAmount.length" :isEdit="isEditBox" icon="icon-frame")
          .col-12
            StockUnit(title="Storage fee" :value="boxDetail.inventoryFee" :isEdit="isEditBox" icon="icon-price")
          .col-12(v-if="boxDetail.boxSize" :class='isEditBox ? "opacity-40" : "opacity-100"')
            StockUnit(
              title="Box size:"
              type ="size"
              :height="boxDetail.boxSize.height"
              :length="boxDetail.boxSize.length"
              :width="boxDetail.boxSize.width"
              icon="icon-size")
              template(v-slot:size)
                span.font-bold.text-lg.mt-1.uppercase
                  | {{ boxDetail.boxSize.length }}*{{ boxDetail.boxSize.width }}*{{ boxDetail.boxSize.height }}
              template(v-slot:button-size='')
                span.font-bold.text-micro.text-600.bg-primary.ml-1.border-round(
                  :class='boxDetail.boxSize.name ? "p-1" : ""') {{ boxDetail.boxSize.name }}
          .col-12(:class='isEditBox? "opacity-40" : "opacity-100"')
            .col.border-bottom-1.border-gray-300
          .col-12.flex.align-items-center
            .icon-sender-info.icon.bg-primary.mr-2
            span.font-bold.text-800.uppercase Seller Info
          .col-12
            StockUnit(title="Sender" :value="boxSellerInfor.displayName" :isEdit="isEditBox" icon="icon-sender-name")
          .col-12
            StockUnit(title="Email Address" :value="boxSellerInfor.email" :isEdit="isEditBox" icon="icon-sender-email")
          .col-12
            StockUnit(title="Phone number" :value="boxSellerInfor.phoneNumber" :isEdit="isEditBox" icon="icon-sender-phone")
          .col-12.flex.justify-content-around(v-if='isEditBox')
            div(class='col-6 md:col-3 lg:col-6')
              Button.btn.btn-outline.h-3rem.w-full(@click='btnEdit')
                span.uppercase.font-semibold cancel
            div(class='col-6 md:col-3 lg:col-6')
              Button.btn.btn-primary.h-3rem.w-full( @click='handleUpdateData' )
                span.uppercase save
    .py-0.flex-1(class="xl:pl-5 lg:pl-2 col-12 lg:col-5 md:col-12")
      div(class="box-page mt-4 lg:mt-0")
        .grid.justify-content-between
          .col-fixed.mb-2
            h1.text-heading Box Detail
        .grid.w-full.grid-nogutter.right__information--stock.tabview-relative
          div(class='col-12 xl:col-6')
            TabView.flex.flex-column.h-full( @tab-change="onTabClick($event)" )
              TabPanel.h-full
                template(#header)
                  .icon.icon-history.mr-2.surface-600
                  span Item list
              TabPanel.h-full
                template(#header)
                  .icon.icon-location-2.mr-2.surface-600
                  span Location history
              TabPanel.h-full
                template(#header)
                  .icon.icon-box-1.mr-2.surface-600
                  span Box history
          div(class='col-12 xl:col-6' v-if='activeTab ==  0')
            .header__action
              div
                .header__search
                  .icon.icon--left.icon-search
                  InputText(type="text" placeholder="Search" v-model="filterParams.name" )
              div
                .btn__filter(:class="{'active': isFilter}")
                  .btn-toggle(@click="isFilter = !isFilter")
                    .icon.icon-filter(v-if="!isFilter")
                    .icon.icon-chevron-up.bg-primary(v-else)
                    span Filter
                  .btn-refresh(@click="refreshFilter")
                    .icon.icon-rotate-left.bg-white
          .grid.my-2.w-full(v-if="isFilter")
              div(class="col-12 md:col-4")
                .bg-white.border-round
                  div.pt-2.pl-1.pb-1
                    span.text-600.text-sm.pl-2 SKU
                  span.p-input-icon-right.w-full
                    .icon.icon--right.icon-search.surface-900
                    InputText.border-0.w-full.mb-1.text-900.font-bold(type="text" placeholder="SKU" v-model="filterParams.sku")
              div(class="col-12 md:col-4")
                .bg-white.border-round
                  div.pt-2.pl-1.pb-1
                    span.text-600.text-sm.pl-2 Barcode
                  span.p-input-icon-right.w-full
                    .icon.icon--right.icon-search.surface-900
                    InputText.border-0.w-full.mb-1.text-900.font-bold(type="text" placeholder="Barcode" v-model="filterParams.barCode")
              div(class="col-12 md:col-4")
                .bg-white.border-round
                  div.pt-2.pl-1.pb-1
                    span.text-600.text-sm.pl-2 Category
                    MultiSelect#MultiSelectCatagory.w-full.border-0.mb-1.text-900.font-bold(
                      v-model="filterParams.category"
                      :options='categoryList'
                      optionLabel="name"
                      optionValue="id"
                      placeholder="Select"
                      :filter='true')
        .box__table.flex.mt-2(v-if='activeTab ==  0')
          BoxDetailTable.flex-1(:listStockWithAmount='filteredBoxDetailData' :totalItems='totalItems')
        .box__table.mt-2(v-if='activeTab ==  1' )
          BoxDetailHistoryTable
        .box__table.mt-2(v-if='activeTab ==  2' )
          BoxHistory

</template>

<script lang="ts">
import { Component, namespace, Vue, Watch } from 'nuxt-property-decorator'
import { ITEM_SELLER_INFO } from '~/utils/constants/box'
import { refreshAllFilter } from '~/utils'
const nsStoreBoxDetail = namespace('box/box-detail')
const nsStoreCategoryList = namespace('category/category-list')
const nsStoreLocationList = namespace('location/location-list')

@Component
class BoxDetail extends Vue {
  isFilter: boolean = false
  isEditBox: boolean = false
  activeTab: number = 0
  isItemHistory: boolean = false
  isLocation: any = null
  filterParams: any = {
    sku: null,
    category: null,
    barCode: null,
    name: null
  }

  sellerInfor = ITEM_SELLER_INFO

  @nsStoreLocationList.State
  locationList: {}

  @nsStoreBoxDetail.State
  totalItems!: number

  @nsStoreBoxDetail.State
  boxDetail!: {
    id: number
    warehouse: string
    request: any
    location: any
    listStockWithAmount: []
    rackLocation: any
  }

  @nsStoreBoxDetail.State
  updateSuccess!: boolean

  @nsStoreCategoryList.State
  categoryList!: any

  @nsStoreBoxDetail.Action
  actGetBoxDetail!: (params: any) => Promise<void>

  @nsStoreCategoryList.Action
  actCategoryList!: () => Promise<void>

  @nsStoreLocationList.Action
  actLocationList!: (params: any) => Promise<void>

  @nsStoreBoxDetail.Action
  actUpdateBoxDetail!: (params: any) => Promise<void>

  get convertBoxDetailData() {
    if (this.boxDetail && this.boxDetail.listStockWithAmount) {
      return [
        ...this.boxDetail.listStockWithAmount.map((item: any) => ({
          ...(item.stock || []),
          sku: item.sku,
          amount: item.amount
        }))
      ]
    }
    return []
  }

  get filteredBoxDetailData() {
    return this.convertBoxDetailData.filter((item) => {
      let filter = true
      Object.keys(this.filterParams).forEach((key) => {
        if (this.filterParams[key]) {
          if (key === 'category') {
            if (this.filterParams.category.length > 0) {
              filter = filter && this.filterParams[key].includes(item[key]?.id)
            } else {
              return filter
            }
          } else {
            filter = filter && item[key]?.includes(this.filterParams[key])
          }
        }
        return filter
      })
      return filter
    })
  }

  saveEditBoxDetail() {
    this.isEditBox = false
  }

  async mounted() {
    if (this.$route.query.plan === 'edit') {
      this.isEditBox = true
    }
    await this.actGetBoxDetail({ id: this.$route?.params?.id })
    this.actCategoryList()
  }

  backToBox() {
    this.$router.push('/box')
  }

  btnEdit() {
    this.isEditBox = !this.isEditBox
  }

  @Watch('updateSuccess')
  updateBtnSuccess() {
    this.isEditBox = !this.isEditBox
  }

  onTabClick( event : any  ) {
    this.activeTab = event.index
    if(this.activeTab > 0 ) {
      this.isFilter = false
    }
  }

  refreshFilter() {
    refreshAllFilter(this.filterParams)
  }

  searchLocation = _.debounce(async (e) => {
    await this.actLocationList({
      location: e.query
    })
  }, 400)

  async handleUpdateData() {
    await this.actUpdateBoxDetail({
      id: this.boxDetail.id,
      rackLocationId: this.isLocation.id ? this.boxLocationId : this.boxLocationId
    })
    this.isEditBox = false
  }

  get boxWarehouse() {
    return this.boxDetail.request?.warehouse?.name || null
  }

  get boxSellerInfor() {
    return this.boxDetail.request?.seller || ''
  }

  get boxLocation() {
    return this.boxDetail.rackLocation?.name || null
  }

  get boxLocationId() {
    return this.boxDetail.rackLocation?.id || null
  }

  get receiptNoteId() {
    return this.boxDetail.request?.id || null
  }

  get homeItem() {
    return { label: 'Box List', to: '/box' }
  }

  get breadcrumbItem() {
    return [
      { label: 'Box Detail', to: `/box/${this.$route.params.id}` }
    ]
  }
}

export default BoxDetail
</script>

<style lang="sass" scoped>
.box-page
  display: flex
  flex-direction: column
  height: calc( 100vh - 32px )
.box__table
  flex: 1
  overflow: hidden
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
    margin-top: 1rem
.tabview-relative
  position: relative
  .tabview-left
    position: absolute
    top: -0.5rem
    right: 0

.right__information--stock
  ::v-deep.p-tabview-panel
    display: flex
    flex-direction: column
  ::v-deep.p-tabview .p-tabview-nav li
    .p-tabview-nav-link
      background: var(--bg-body-bas)
      border: none
      box-shadow: none !important
  ::v-deep.p-tabview .p-tabview-panels
    height: 100%
    background: var(--bg-body-bas)
    padding: 8px 0 0 0

  ::v-deep.p-highlight .p-tabview-nav-link
    color: #000 !important
    border-bottom: 2px solid #486AE2 !important
    .icon
      background-color: var(--primary-color) !important

.edit-location
  ::v-deep input
    border: none
    box-shadow: none !important
    font-size: $font-size-small
    text-transform: uppercase
    font-weight: bold
    color: var(--surface-900)
    padding: 0
    background-color: var(--surface-100)
    opacity: 1
    font-size: 1.125rem
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
.header__action
    margin-top: 12px
    display: flex
    @include flex-column
    gap: 10px 16px
    @include desktop
      justify-content: flex-end
      flex-direction: row
      margin-top: 0

</style>
