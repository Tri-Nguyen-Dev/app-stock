<template lang="pug">
  .wapper
    .sidebar
    .main.pt-5.px-5.max-h-screen.overflow-hidden
      .stock
        .stock__header.h-4rem.mb-5.flex.align-items-center.justify-content-between
          div
            h1.text-900.font-bold.text-header.m-0 Stock list
            span.text-700.font-normal.text-sm 1280 product found
          .flex.align-items-center
            div
              span.p-input-icon-left
                .icon.icon--left.icon-search
                InputText#inputSearch.h-full.border-none.w-full.text-900.text-sm(type='text' v-model='filter.search' placeholder='Search')
            .ml-3.flex.align-items-center.bg-white.border-round.cursor-pointer.p-2.pr-5
              img(:src="require('~/assets/icons/filter.svg')" alt='')
              span.ml-3.white-space-nowrap Filter
            .ml-3.flex.align-items-center.bg-primary.border-round.cursor-pointer.p-2.pr-5
              img(:src="require('~/assets/icons/plus.svg')" alt='')
              span.ml-3.white-space-nowrap Add Items
        .stock__filter.h-5rem.mb-4
          .grid
            div(class='col-12 md:col-3 lg:col-3') 
              .bg-white.border-round
                .text-700.font-normal.text-sm.px-3 Warehouse
                Dropdown#dropdownWarehouse.w-full.border-0(v-model="filter.warehouse" :options="warehouseList" optionLabel="name" placeholder="Select") 
            div(class='col-12 md:col-3 lg:col-3')
              .bg-white.border-round
                .text-700.font-normal.text-sm.px-3 Catagory
                MultiSelect#mutiselectCategory.w-full.border-0(v-model='filter.category' :options='categoryList' optionLabel="name" placeholder='Select' :filter='true')
            div(class='col-12 md:col-3 lg:col-3')
              .bg-white.border-round
                .text-700.font-normal.text-sm.px-3 Code
                span#inputCode.p-input-icon-right.w-full
                  InputText.w-full(type='text' v-model='filter.code')
                  .icon.icon-search
            div(class='col-12 md:col-3 lg:col-3')
              .bg-white.border-round
                .text-700.font-normal.text-sm.px-3 Status
                Dropdown.w-full.border-0(v-model="filter.status"  :options="statusList" optionLabel="name" placeholder="Select")
        .stock__table
          TableStock(@getProductSelected="getProductSelected" :stockList="stockList")
        .stock__footer.absolute.px-3.h-4rem.bg-white.bottom-0.w-full.flex.align-items-center.justify-content-between
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

  mounted() {
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
  position: relative

  &__filter
    #inputSearch.p-inputtext::placeholder
      font-size: 14px
      color: #D2D2E0

    #dropdownWarehouse .p-dropdown-trigger-icon::before, #mutiselectCategory .p-multiselect-trigger-icon::before
      content: url('~/assets/icons/chevron-down.svg')

    #inputCode .icon
      right: 0.75rem

  &__table
    background-color: #fff
    height: calc(100vh - 14.5rem)

    #datatable--stock-list .p-datatable-wrapper
      max-height: calc(100vh - 18.5rem)

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

  &__footer--mutidelete
    background-color: #FF7171
</style>
