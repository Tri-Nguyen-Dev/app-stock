<template lang="pug">
  .wapper
    .sidebar
    .main
      .stock
        .stock__header.flex.align-items-center.justify-content-between
          div
            h1.text-heading Stock list
            span.text-subheading 1280 product found
          div.stock__header-action.flex.align-items-center.justify-content-between
            div
              span.stock__search.p-input-icon-left
                .icon.icon--left.icon-search
                InputText#inputSearch(type='text' v-model='filter.name' placeholder='Search')
            .stock__btn-filter.flex.align-items-center.bg-white.border-round.cursor-pointer(@click="toggleShowFilter" :class="{'active': isShowFilter}")
              .icon-btn.icon-filter( v-if="!isShowFilter")
              .icon-btn.icon-chevron-up.bg-primary(v-else)
              span Filter
            .stock__btn-add.flex.align-items-center.bg-primary.border-round.cursor-pointer
              .icon-btn.icon-add-items.bg-white
              span Add Items
        .stock__filter(:class='{ "active": isShowFilter }') 
          .stock__filter-item.bg-white.border-round
            .stock__filter-title Warehouse
            Dropdown.stock__filter-action.w-full.border-0(v-model="filter.warehouse" :options="warehouseList" optionLabel="name" placeholder="Select") 
          .stock__filter-item.bg-white.border-round
            .text-sm.stock__filter-title Catagory
            MultiSelect.stock__filter-action.w-full.border-0(v-model='filter.categories' :options='categoryList' optionLabel="name" placeholder='Select' :filter='true')
          .stock__filter-item.bg-white.border-round
            .text-sm.stock__filter-title Code
            span.p-input-icon-right.w-full
                InputText.w-full(type="text" v-model="filter.barcode" placeholder="Enter code" )
                i.pi.pi-search
          .stock__filter-item.bg-white.border-round
            .text-sm.stock__filter-title Status
            Dropdown.w-full.border-0(v-model="filter.status"  :options="statusList" optionLabel="name" placeholder="Select")
        .stock__table.mt-5.bg-white.flex-1.border-round.overflow-hidden
          TableStock(@getProductSelected="getProductSelected" :stockList="stockList")
        .stock__footer.px-3.h-4rem.bg-white.w-full.flex.align-items-center.justify-content-between
          .flex.align-items-center(v-if='!selectedStock.length > 0')
            img(:src="require('~/assets/icons/filter-left.svg')")
            span.text-xs.ml-2.text-500 Showing 01 - 100 of 1280
          .stock__mutidelete.flex.cursor-pointer.py-2.px-2.border-round.text-white.text-sm(v-else)
            img(:src="require('~/assets/icons/trash-white.svg')")
            span.ml-2 Delete {{ selectedStock.length }} items selected
          Paginator#paginationStock(v-model:first="paginate.pageNumber" :rows="paginate.pageSize" :totalRecords="220" @page="onPage($event)")
</template>
<script lang="ts">
import { Component, Vue, namespace, Watch } from 'nuxt-property-decorator'
import TableStock from '~/components/stock/TableStock.vue'
import { Stock as StockModel } from '~/models/Stock'
import { StockStoreModel } from '~/store/stock'
const nsCategoryStock = namespace('category')
const nsWarehouseStock = namespace('warehouse')
const nsStoreStock = namespace('stock')

@Component({
  components: {
    TableStock
  }
})
class Stock extends Vue {
  @nsStoreStock.State
  stockList!: StockModel.Model[]

  @nsStoreStock.State
  pagination!: StockStoreModel.Pagination

  @nsCategoryStock.State
  categoryList!: any

  @nsWarehouseStock.State
  warehouseList!: any

  @nsStoreStock.Action
  actGetProductList!: (data: any) => Promise<void>

  @nsCategoryStock.Action
  actCategoryList!: () => Promise<void>

  @nsWarehouseStock.Action
  actWarehouseList!: () => Promise<void>

  paginate: any = {
    pageNumber: 1,
    pageSize: 10
  }

  filter: any = {
    name: null,
    warehouse: null,
    categories: [],
    barcode: null,
    status: null
  }

  statusList: any = [
    { name: 'Disable', value: 0 },
    { name: 'Available', value: 1 }
  ]

  selectedStock: StockModel.Model[] = []

  isShowFilter: boolean = false

  loading: boolean = false
  
  toggleShowFilter() {
    this.isShowFilter = !this.isShowFilter
  }

  @Watch('filter.name')
  nameChange() {
    this.getProductList()
  }

  @Watch('filter.barcode')
  barcodeChange() {
    this.getProductList()
  }

  @Watch('filter.warehouse')
  warehouseChange() {
    this.getProductList()
  }

  @Watch('filter.categories')
  categoryChange() {
    this.getProductList()
  }

  @Watch('filter.status')
  statusChange() {
    this.getProductList()
  }

  mounted() {
    this.getProductList()
    this.actCategoryList()
    this.actWarehouseList()
  }

  async getProductList () {   
    const params = this.paginate
    const filter = {
      name: this.filter.name,
      warehouseId: this.filter.warehouse?.id,
      categoryIds: this.filter.categories.map((item: any) => item?.id),
      barcode: this.filter.barcode,
      status: this.filter.status?.value
    }
    await this.actGetProductList({ filter, params})
  }

  getProductSelected(data: any[]) {
    this.selectedStock = data
  }

  onPage(event: any) {
    this.paginate.pageNumber = event.page + 1
    this.getProductList()
  }
}
export default Stock
</script>

<style lang="sass">
body
  background: #e8eaef

.main
  padding: 32px

.stock

  &__btn-filter, &__btn-add
    gap: 18px
    height: 48px
    padding: 0 32px 0 20px

    span
      line-height: calc(24 / 14)

  &__btn-filter.active
    color: $primary,
    border: 1.5px solid $primary

  &__filter
    visibility: hidden
    max-height: 0
    transition: all 0.25s ease-in-out
    display: grid
    grid-template-columns: repeat(4, 1fr)
    grid-gap: 0 16px

    &.active
      max-height: 6rem
      visibility: visible

    &-item
      padding: 13px 0 13px 5.5px

    &-title
      font-size: 12px
      color: $text-color-700
      line-height: calc(16 / 12)
      margin-bottom: 5px
      padding-left: 10.5px

  #inputSearch
    height: 48px
    border: none

  #inputSearch::placeholder
    font-size: $font-size-base
    color: $text-color-500
    line-height: calc(24 / 14)
  
  #inputSearch.p-inputtext:enabled:focus
    box-shadow: none
    border: none

 

  &__mutidelete
    background-color: #FF7171

.stock__header
  margin-bottom: 31px
  &-action
    gap: 0 16px

</style>
