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
            Button.border-0.p-0.h-2rem.w-2rem.justify-content-center.surface-200.shadow-none( @click="btnEdit" v-if='!isEditBox' )
              .icon-edit-btn.icon
      div
        .col.px-3
          div( v-if='boxDetail.status' :class='isEditBox? "opacity-40" : "opacity-100"')
              span.table__status.table__status--available(
                v-if="data.status === 'BOX_STATUS_AVAILABLE'"
              ) {{ data.status | boxStatus }}
              span.table__status.table__status--disable(
                v-else-if="data.status === 'BOX_STATUS_DISABLE'"
              ) {{ data.status | boxStatus }}
              span.table__status.table__status--draft(v-else) {{ data.status | boxStatus }}
          .font-bold.my-3
            div(:class='isEditBox? "opacity-40" : "opacity-100"')
              span Box Code:
                span.text-primary.uppercase.ml-2 {{ boxDetail.barCode }}
      div.sub--scroll
          div.wrap-unit.px-4
            StockUnit(title="Receipt note ID" link="https://rikkei.vn" :value="receiptNoteId" :isEdit="isEditBox" icon="icon-receipt-note")
          div.wrap-unit.px-4
            StockUnit(title="Create ID" :value="boxDetail.createBy" :isEdit="isEditBox" icon="icon-tag-user")
          div.wrap-unit.px-4
            StockUnit(title="Warehouse" link="https://rikkei.vn" :value="boxWarehouse" :isEdit="isEditBox" icon="icon-warehouse")
          div.wrap-unit.px-4
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
                        span.font-bold.text-small {{ slotProps.item.name }}
                        .icon-arrow-up-right.icon
          div.wrap-unit.px-4
            StockUnit(title="Create Time" :value="boxDetail.createdAt | dateTimeHour12" :isEdit="isEditBox" icon="icon-calendar")
          div.wrap-unit.px-4(v-if='boxDetail.listStockWithAmount')
            StockUnit(title="Box Items" :value="boxDetail.listStockWithAmount.length" :isEdit="isEditBox" icon="icon-frame")
          div.wrap-unit.px-4
            StockUnit(title="Estimated inventory Fee" :value="boxDetail.inventoryFee" :isEdit="isEditBox" icon="icon-price")
          div.wrap-unit.px-4(v-if="boxDetail.boxSize" :class='isEditBox ? "opacity-40" : "opacity-100"')
            StockUnit(
              title="Box size:" 
              type ="size" 
              :height="boxDetail.boxSize.height" 
              :length="boxDetail.boxSize.length" 
              :width="boxDetail.boxSize.width" 
              icon="icon-size")
              template(v-slot:size)
                span.font-bold.text-small.mt-1.uppercase 
                | {{ boxDetail.boxSize.length }}*{{ boxDetail.boxSize.width }}*{{ boxDetail.boxSize.height }}
              template(v-slot:button-size='')
                span.font-bold.text-micro.text-600.bg-primary.ml-1.border-round(
                  :class='boxDetail.boxSize.name ? "p-1" : ""') {{ boxDetail.boxSize.name }}
          div.col-12(:class='isEditBox? "opacity-40" : "opacity-100"')
            .col.border-bottom-1.border-gray-300
            .col.flex.my-3.mx-1
              .col.flex.align-items-center
                .icon-sender-info.icon.bg-primary.mr-2
                span.font-bold.text-800.uppercase Seller Information
          .wrap-unit.px-4
            StockUnit(title="Sender" :value="boxSellerInfor.name" :isEdit="isEditBox" icon="icon-sender-name")
          .wrap-unit.px-4
            StockUnit(title="Email Address" :value="boxSellerInfor.email" :isEdit="isEditBox" icon="icon-sender-email")
          .wrap-unit.px-4
            StockUnit(title="Phone number" :value="boxSellerInfor.phone" :isEdit="isEditBox" icon="icon-sender-phone")
          .grid.m-1(v-if='isEditBox')
            .col
              .text-center.surface-hover.cursor-pointer.border-round.p-1(@click='btnEdit')
                span.uppercase.font-semibold cancel
            .col
              .text-center.bg-blue-500.cursor-pointer.border-round.text-white.p-1(@click='handleUpdateData')
                span.uppercase save
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
                span Item list
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
                      MultiSelect#MultiSelectCatagory.w-full.border-0.mb-1.text-900.font-bold(
                        v-model="filterParams.category" 
                        :options='categoryList' 
                        optionLabel="name" 
                        optionValue="id" 
                        placeholder="Select" 
                        :filter='true')
              BoxDetailTable(:listStockWithAmount='filteredBoxDetailData' :totalItems='totalItems')
            TabPanel
              template(#header)
                .icon.icon-location-2.mr-2.surface-600
                span Location history
              .overflow-auto.box__detail--history
                //- BoxDetailHistory( 
                  v-if="listStockWithAmount.length > 0" 
                  :listStockWithAmount='listStockWithAmount' 
                  :totalStockRecords='totalStockRecords' )
        .grid.tabview-left(:class='isItemHistory? "hidden" : "" ')
          div.mr-3
            span.p-input-icon-left
              .icon.icon--left.icon-search.surface-900
              InputText.w-23rem.font-bold.h-3rem.py-4.text-900(type="text" placeholder="Search" v-model='filterParams.name' )
          div
            Button.border-0.bg-white.w-7rem.shadow-none.border-primary.h-3rem.py-4(@click="isFilter = !isFilter")
              .icon-filter.bg-primary.icon
              span.text-900.ml-3.text-primary Filter
          div.refresh-filter(@click="handleRefreshFilter")
            img(:src="require(`~/assets/icons/rotate-left.svg`)")
</template>

<script lang="ts">
import { Component, namespace, Vue, Watch } from 'nuxt-property-decorator'
import { ITEM_SELLER_INFO } from '~/utils/constants/box'
const nsStoreBoxDetail = namespace('box/box-detail')
const nsStoreCategoryList = namespace('category/category-list')
const nsStoreLocationList = namespace('location/location-list')

@Component
class BoxDetail extends Vue {
  isFilter: boolean = false
  isEditBox: boolean = false
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
    await this.actGetBoxDetail({ id: this.$route.params.id })
    await this.actCategoryList()
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

  onTabClick() {
    this.isItemHistory = !this.isItemHistory
    this.isFilter = false
  }

  handleRefreshFilter() {
    for (const items in this.filterParams) this.filterParams[items] = null
  }

  searchLocation = _.debounce(async (e) => {
    await this.actLocationList({
      location: e.query
    })
  }, 400)

  async handleUpdateData() {
    await this.actUpdateBoxDetail({
      id: this.boxDetail.id,
      shelfBinId: this.boxLocation.id?this.boxLocation.id:this.boxDetail.rackLocation?.id
    })
  }

  get boxWarehouse() {
    return this.boxDetail.request?.warehouse.name || null
  }

  get boxSellerInfor() {
    return this.boxDetail.request?.seller || ''
  }

  get boxLocation() {
    return this.boxDetail.rackLocation?.name || null
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

.refresh-filter
  background-color: $primary
  display: flex
  align-items: center
  width: 50px
  justify-content: center
  border-top-right-radius: 4px
  border-bottom-right-radius: 4px

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
.wrap-unit 
  width: 300px
  margin-bottom: 16px
</style>
