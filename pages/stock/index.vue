<template lang="pug">
  .wapper
    .sidebar
    .main.pt-5.px-5.overflow-hidden
      .stock
        .stock__header.h-4rem.mb-5.flex.align-items-center.justify-content-between
          div
            h1.text-900.font-bold.text-header.m-0 Stock list
            span.text-700.font-normal.text-sm 1280 product found
          .flex.align-items-center
            div
              span.p-input-icon-left.h-3rem
                .icon.icon--left.icon-search
                InputText#inputSearch.h-full.border-none.w-full.text-900.text-sm(type='text' v-model='filter.search' placeholder='Search')
            .ml-3.flex.align-items-center.bg-white.border-round.cursor-pointer.pl-2.pr-5.h-3rem(@click="toggleShowFilter" :class="{'border-primary border-2 text-primary': isShowFilter}")
              img(:src="require('~/assets/icons/filter.svg')" alt='' v-if="!isShowFilter")
              img(:src="require('~/assets/icons/arrow-up.svg')" alt='' v-else)
              span.ml-3.white-space-nowrap Filter
            .ml-3.flex.align-items-center.bg-primary.border-round.cursor-pointer.pl-2.pr-5.h-3rem
              img(:src="require('~/assets/icons/plus.svg')" alt='')
              span.ml-3.white-space-nowrap Add Items
        .stock__filter.h-6rem(:class='{ active: isShowFilter }')
          .grid
            div(class='col-12 md:col-3 lg:col-3') 
              .bg-white.border-round.p-2
                .text-700.font-normal.text-sm.stock__filter--title Warehouse
                Dropdown#dropdownWarehouse.w-full.border-0(v-model="filter.warehouse" :options="warehouseList" optionLabel="name" placeholder="Select") 
            div(class='col-12 md:col-3 lg:col-3')
              .bg-white.border-round.p-2
                .text-700.font-normal.text-sm.stock__filter--title Catagory
                MultiSelect#mutiselectCategory.w-full.border-0(v-model='filter.category' :options='categoryList' optionLabel="name" placeholder='Select' :filter='true')
            div(class='col-12 md:col-3 lg:col-3')
              .bg-white.border-round.p-2
                .text-700.font-normal.text-sm.stock__filter--title Code
                span#inputCode.p-input-icon-right.w-full
                  InputText.w-full.border-none(type='text' v-model='filter.code')
                  .icon.icon-search
            div(class='col-12 md:col-3 lg:col-3')
              .bg-white.border-round.p-2
                .text-700.font-normal.text-sm.stock__filter--title Status
                Dropdown#dropdownWarehouse.w-full.border-0(v-model="filter.status"  :options="statusList" optionLabel="name" placeholder="Select")
        .stock__table
          TableStock(@getProductSelected="getProductSelected" :stockList="stockList")
        .stock__footer.px-3.h-4rem.bg-white.w-full.flex.align-items-center.justify-content-between
          .flex.align-items-center(v-if='!selectedStock.length > 0')
            img(:src="require('~/assets/icons/filter-left.svg')")
            span.text-xs.ml-2.text-500 Showing 01 - 100 of 1280
          .stock__footer--mutidelete.flex.cursor-pointer.py-2.px-2.border-round.text-white.text-sm(v-else)
            img(:src="require('~/assets/icons/trash-white.svg')")
            span.ml-2 Delete {{ selectedStock.length }} items selected
          Paginator(:rows="filter.pageSize" :totalRecords="stockTotal" @page="onPage($event)") 
</template>
<script lang="ts">
import { Component, Vue, namespace } from 'nuxt-property-decorator'
import TableStock from '~/components/stock/TableStock.vue'
import { StockModel } from '~/models/Stock'
const nsCategoryStock = namespace('category')
const nsWarehouseStock = namespace('warehouse')
const nsStoreStock = namespace('stock')

@Component({
  components: {
    TableStock,
  },
})
class Stock extends Vue {
  @nsStoreStock.State
  stockList!: any[]

  @nsStoreStock.State
  stockTotal!: number

  @nsCategoryStock.State
  categoryList!: any

  @nsWarehouseStock.State
  warehouseList!: any

  @nsStoreStock.Action
  actGetProductList!: (params: StockModel.GetStockParams) => Promise<void>

  @nsCategoryStock.Action
  actCategoryList!: () => Promise<void>

  @nsWarehouseStock.Action
  actWarehouseList!: () => Promise<void>

  filter: any = {
    warehouse: null,
    category: null,
    code: null,
    status: null,
    search: null,
    pageNumber: 1,
    pageSize: 10,
  }

  statusList: any = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' },
  ]

  warehouse: any = null

  selectedStock: any[] = []

  isShowFilter: boolean = false

  toggleShowFilter() {
    this.isShowFilter = !this.isShowFilter
  }

  async mounted() {
    this.actGetProductList({
      pageNumber: this.filter.pageNumber,
      pageSize: this.filter.pageSize,
    })
    this.actCategoryList()
    this.actWarehouseList()
  }

  getProductSelected(data: any[]) {
    this.selectedStock = data
  }

  onPage(event: any) {
    this.filter.pageNumber = event.page + 1
  }
}
export default Stock
</script>

<style lang="sass">

body
  background: #e8eaef

.sidebar
  width: 270px

.main
  margin-left: 270px

.stock
  &__filter
    visibility: hidden
    max-height: 0
    transition: all 0.25s ease-in-out

    &.active
      max-height: 6rem
      visibility: visible
      margin-bottom: 1.5rem

    #inputSearch.p-inputtext::placeholder
      font-size: 14px
      color: #D2D2E0

    #inputCode .icon
      right: 0.75rem

  &__filter--title
    padding-left: 12px

  &__table
    background-color: #fff

  &__footer--mutidelete
    background-color: #FF7171

  // custom table style
  #datatable--stock-list .p-datatable-wrapper
    max-height: 100%

  #datatable--stock-list .p-datatable-wrapper::-webkit-scrollbar
    width: 6px
    height: 6px

  #datatable--stock-list .p-datatable-wrapper::-webkit-scrollbar-thumb
      border-radius: 10px
      background-color: $text-color-700

  #datatable--stock-list .p-checkbox-box
    border: 1.5px solid $text-color-500
    border-radius: 2px

  #datatable--stock-list .p-checkbox-box.p-highlight
    background-color: $primary


  // custom dropdown and multiselect style
  #dropdownWarehouse .p-dropdown-items-wrapper, #mutiselectCategory .p-multiselect-items-wrapper
    max-height: 288px !important
    box-shadow: none

  #dropdownWarehouse .p-dropdown-trigger-icon::before, #mutiselectCategory .p-multiselect-trigger-icon::before
    content: url('~/assets/icons/chevron-down.svg')

  #dropdownWarehouse .p-dropdown-items, #mutiselectCategory .p-multiselect-items
    padding: 0

  #dropdownWarehouse .p-dropdown-items-wrapper::-webkit-scrollbar, #mutiselectCategory .p-multiselect-items-wrapper::-webkit-scrollbar
    width: 6px

  #dropdownWarehouse .p-dropdown-items-wrapper::-webkit-scrollbar-thumb, #mutiselectCategory .p-multiselect-items-wrapper::-webkit-scrollbar-thumb
    background: $text-color-secondary
    border-radius: 10px
    width: 6px

  #dropdownWarehouse.p-dropdown:not(.p-disable).p-focus, #mutiselectCategory.p-multiselect:not(.p-disable).p-focus
      box-shadow: none !important
      border-color: none !important

  #dropdownWarehouse .p-dropdown-item, #mutiselectCategory .p-multiselect-item
      padding: 12px 0 12px 16px

  #dropdownWarehouse .p-dropdown-items .p-dropdown-item:not(.p-highlight):not(.p-disabled):hover, #mutiselectCategory .p-multiselect-items.p-multiselect-item:not(.p-highlight):not(.p-disabled):hover
      background-color: #E8EAEF

  #dropdownWarehouse .p-dropdown-items .p-dropdown-item.p-highlight, #mutiselectCategory .p-multiselect-item.p-highlight
      background-color: $primary
</style>
