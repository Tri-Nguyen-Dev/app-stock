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
            div.stock__search
              span.p-input-icon-left
                .icon.icon--left.icon-search
                InputText#inputSearch(type='text' placeholder='Search' @input="debounceSearchName")
            .stock__btn-filter.flex.align-items-center.bg-white.border-round.cursor-pointer(@click="toggleShowFilter" :class="{'active': isShowFilter}")
              .icon-btn.icon-filter( v-if="!isShowFilter")
              .icon-btn.icon-chevron-up.bg-primary(v-else)
              span Filter
            .stock__btn-add.flex.align-items-center.bg-primary.border-round.cursor-pointer
              .icon-btn.icon-add-items.bg-white
              span Add Stock
        .stock__filter(:class='{ "active": isShowFilter }') 
          .stock__filter-item.bg-white.border-round
            .stock__filter-title Warehouse
            Dropdown.dropdownStock.stock__filter-action.w-full.border-0(v-model="filter.warehouse" :options="warehouseList" optionLabel="name" placeholder="Select") 
          .stock__filter-item.bg-white.border-round
            .text-sm.stock__filter-title Catagory
            MultiSelect#MultiSelectCatagory.stock__filter-action.w-full.border-0(v-model='filter.categories' :options='categoryList' optionLabel="name" placeholder='Select' :filter='true')
          .stock__filter-item.bg-white.border-round
            .text-sm.stock__filter-title Code
            span.p-input-icon-right.w-full
                InputText#inputSearchCode.w-full(type="text" @input="debounceSearchCode" placeholder="Search code" )
                i.icon.icon-search.mt-0
          .stock__filter-item.bg-white.border-round
            .text-sm.stock__filter-title Status
            Dropdown.dropdownStock.w-full.border-0(v-model="filter.status"  :options="statusList" optionLabel="name" placeholder="Select")

        .stock__table.bg-white.border-round.overflow-hidden
          TableStock(@getProductSelected="getProductSelected" :stockList="stockList" @showModalDelete="showModalDelete" :filter="filter")

        .pagination
          div.pagination__info(v-if='!selectedStock.length > 0')
            img(:src="require('~/assets/icons/filter-left.svg')")
            span.pagination__total Showing 01 - 100 of 30
          div.pagination__delete(v-else @click="showModalDelete()")
            img(:src="require('~/assets/icons/trash-white.svg')")
            span Delete {{ selectedStock.length }} items selected
          Paginator(v-model:first="paginate.pageNumber" :rows="paginate.pageSize" :totalRecords="220" @page="onPage($event)")

    ConfirmDialogCustom(
      title="Confirm delete" 
      :message="`Are you sure you want to delete ${ids.length} in this list stock?`"
      image="confirm-delete"
      :isShow="isModalDelete"
      :onOk="handleDeleteStock"
      :onCancel="handleCancel"
      :loading="loadingSubmit"
    )
    Toast

</template>
<script lang="ts">
import { debounce } from 'debounce'
import { Component, Vue, namespace, Watch } from 'nuxt-property-decorator'
import TableStock from '~/components/stock/TableStock.vue'
import ConfirmDialogCustom from '~/components/dialog/ConfirmDialog.vue'
import { Stock as StockModel } from '~/models/Stock'
const nsCategoryStock = namespace('category/category-list')
const nsWarehouseStock = namespace('warehouse/warehouse-list')
const nsStoreStock = namespace('stock/stock-list')

@Component({
  components: {
    TableStock,
    ConfirmDialogCustom
  }
})

class Stock extends Vue {
  @nsStoreStock.State
  stockList!: StockModel.Model[]

  @nsStoreStock.State
  total!: number

  @nsCategoryStock.State
  categoryList!: any

  @nsWarehouseStock.State
  warehouseList!: any

  @nsStoreStock.Action
  actGetStockList!: (data?: any) => Promise<void>

  @nsStoreStock.Action
  actDeleteStockByIds!: (ids: string[]) => Promise<void>

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
    categories: null,
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

  isModalDelete: boolean = false

  ids: string[] = []

  loadingSubmit: boolean = false

  isFilter: boolean = false

  toggleShowFilter() {
    this.isShowFilter = !this.isShowFilter
  }

  @Watch('filter', { deep: true })
  filterChange() {
    this.getProductList()
  }

  mounted() {
    this.getProductList()
    this.actCategoryList()
    this.actWarehouseList()
  }

  async getProductList() {
    const params = this.paginate
    const filter = {
      name: this.filter.name,
      warehouseId: this.filter.warehouse?.id,
      categoryIds: this.filter.categories && this.filter.categories.map((item: any) => item?.id),
      barcode: this.filter.barcode,
      status: this.filter.status?.value
    }
    await this.actGetStockList({ filter, params })
  }

  getProductSelected(data: any[]) {
    this.selectedStock = data
  }

  onPage(event: any) {
    this.paginate.pageNumber = event.page + 1
    this.getProductList()
  }

  showModalDelete(id?: string) {
    if (id) {
      this.ids = [id]
    } else {
      this.ids = this.selectedStock.map((item: any) => {
        return item.id
      })
    }
    this.isModalDelete = true
  }

  async handleDeleteStock() {
    try {
      this.loadingSubmit = true
      await this.actDeleteStockByIds(this.ids)
      this.getProductList()
      this.loadingSubmit = false
      this.isModalDelete = false

      this.$toast.add({severity:'success', summary: 'Success Message', detail:'Order submitted', life: 3000})
    } catch (error) {
      this.loadingSubmit = false
    }
  }

  handleCancel() {
    this.isModalDelete = false
  }

  debounceSearchName = debounce((value: any) => {
    this.filter.name = value.trim()
  }, 500)

  debounceSearchCode = debounce((value: any) => {
    this.filter.barcode = value
  }, 500)

}
export default Stock
</script>

<style lang="sass">
body
  background: #e8eaef

.stock
  &__header
    margin-bottom: 31px

    @include mobile
      flex-direction: column
      gap: 16px 0

    &-action
      gap: 0 16px

  &__btn-filter, &__btn-add
    gap: 18px
    height: 48px
    padding: 0 32px 0 20px
    white-space: nowrap

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


    @include mobile
      justify-content: flex-start
      grid-auto-columns: 295px
      grid-auto-flow: column
      overflow: auto
      overflow-y: hidden
      scroll-snap-type: x mandatory
      scroll-snap-stop: always
      -ms-touch-action: manipulation
      touch-action: manipulation
      -webkit-overflow-scrolling: touch
      scroll-padding: 1rem
      grid-template-columns: unset

    &.active
      visibility: visible
      max-height: 200px
      margin-bottom: 24px

    &-item
      padding: 13px 5.5px

    &-title
      font-size: 12px
      color: $text-color-700
      line-height: calc(16 / 12)
      margin-bottom: 5px
      padding-left: 10.5px
</style>
