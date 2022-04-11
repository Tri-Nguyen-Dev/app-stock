<template lang="pug">
  .stock
    .stock__header
      div
        h1.text-heading Stock list
        span.text-subheading {{ total }} product found
      .stock__header-action
        .header__search
          .icon.icon--left.icon-search
          input(type='text' placeholder='Search' @input="debounceSearchName")
        .btn__filter(:class="{'active': isShowFilter}")
          .btn-toggle(@click="toggleShowFilter")
            .icon.icon-filter(v-if="!isShowFilter")
            .icon.icon-chevron-up.bg-primary(v-else)
            span Filter
          .btn-refresh(@click="handleRefreshFilter")
            .icon.icon-rotate-left.bg-white
        .btn.btn-primary
          .icon.icon-add-items
          span Add Stock
    .header__filter(:class='{ "active": isShowFilter }')
      .filter__item
        .filter__title Catagory
        MultiSelect#MultiSelectCatagory.stock__filter-action.w-full.border-0(v-model='filter.categories' :options='categoryList' optionLabel="name" placeholder='Select' :filter='true')
      .filter__item
        .filter__title Code
        .filter__search
            input(type="text" @input="debounceSearchCode" placeholder="Search code" )
            .icon.icon--right.icon-search
      .filter__item
        .filter__title Status
        Dropdown.filter__dropdown(v-model="filter.status"  :options="statusList" optionLabel="name" placeholder="Select")
    .stock__table.bg-white.flex-1.relative.overflow-hidden
        DataTable.table__sort-icon.h-full.flex.flex-column(@sort="sortData($event)" :class="{ 'table__empty': !stockList || stockList.length <= 0 }" :rowClass="rowClass" :value='stockList' responsiveLayout="scroll" @row-dblclick='rowdbClick' :selection.sync='selectedStock' dataKey='id' :rows='10' :rowHover='true')
          Column(selectionMode='multiple' :styles="{'width': '1%'}" :headerClass="`${!stockList || stockList.length <= 0 || checkStockDisable ? 'checkbox-disable' : ''}`")
          Column(field='no' header='NO' :styles="{'width': '1%'}" )
            template(#body='{ index }')
              span.stock__table-no.text-white-active.text-900.font-bold {{ getIndexPaginate(index) }}
          Column(field='imageUrl' header='Image')
            template(#body='{ data }')
              .stock__table__image.overflow-hidden
                img.h-2rem.w-2rem.border-round(:src='data.imageUrl' alt='' width='100%' style="object-fit: cover;")
          Column(header='Name' field='name' :sortable="true" sortField="_name")
            template(#body='{ data }')
              .stock__table-name.text-white-active.text-base.text-900.text-overflow-ellipsis.overflow-hidden {{ data.name }}
          Column(header='Code' field='barCode' :sortable="true" sortField="_barCode")
            template(#body='{ data }')
              div.stock__table-barcode {{ data.barCode }}
          Column(header='Category' :sortable="true" field='category' sortField="_category")
              template(#body='{ data }')
                div {{ data.category.name }}
          Column(field='status' header="Status")
            template(#body='{ data }')
              div
                span.table__status.table__status--available(v-if="!data.deleted") Available
                span.table__status.table__status--disable(v-else) Disable
          Column(field='action' header="action" :styles="{'width': '2%'}")
            template(#body='{ data }')
              .table__action(:class="{'action-disabled': data.deleted}")
                span(@click="handleEditStock(data.id)")
                  .icon.icon-edit-btn
                span(@click="showModalDelete(data.id)")
                  .icon.icon-btn-delete
          template(#footer)
            .pagination
              div.pagination__info(v-if='!selectedStockFilter.length > 0')
                img(:src="require('~/assets/icons/filter-left.svg')")
                span.pagination__total {{ getInfoPaginate }}
              div.pagination__delete(v-else @click="showModalDelete()")
                img(:src="require('~/assets/icons/trash-white.svg')")
                span Delete {{ selectedStockFilter.length }} items selected
              Paginator(:first.sync="firstPage" :rows="paginate.pageSize" :totalRecords="total" @page="onPage($event)" :rowsPerPageOptions="limitOptions")
          template(#empty)
            div.flex.align-items-center.justify-content-center.flex-column
              img(:srcset="`${require('~/assets/images/table-empty.png')} 2x`" v-if="!checkIsFilter")
              img(:srcset="`${require('~/assets/images/table-notfound.png')} 2x`" v-else)
              p.text-900.font-bold.mt-3(v-if="!checkIsFilter") List is empty!, Click
                span.text-primary.underline.cursor-pointer &nbsp;here
                span &nbsp;to add item.
              p.text-900.font-bold.mt-3(v-else) Item not found!
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
import { Component, Vue, namespace, Watch } from 'nuxt-property-decorator'
import  _ from 'lodash'
import ConfirmDialogCustom from '~/components/dialog/ConfirmDialog.vue'
import { Stock as StockModel } from '~/models/Stock'
import { STOCK_STATUS_LIST, LIMIT_PAGE_OPTIONS, PAGINATE_DEFAULT, calculateInfoPaginate, calculateIndex } from '~/utils'
const nsCategoryStock = namespace('category/category-list')
const nsStoreStock = namespace('stock/stock-list')
@Component({
  components: {
    ConfirmDialogCustom
  }
})
class Stock extends Vue {
  @nsStoreStock.State
  total!: number

  @nsStoreStock.State
  stockList!: StockModel.Model[]

  @nsCategoryStock.State
  categoryList!: any

  @nsStoreStock.Action
  actGetStockList!: (params?: any) => Promise<void>

  @nsStoreStock.Action
  actDeleteStockByIds!: (ids: string[]) => Promise<void>

  @nsCategoryStock.Action
  actCategoryList!: () => Promise<void>

  firstPage:any = 0
  selectedStock: StockModel.Model[] = []
  isShowFilter: boolean = false
  loading: boolean = false
  isModalDelete: boolean = false
  ids: string[] = []
  loadingSubmit: boolean = false
  isFilter: boolean = false

  paginate = PAGINATE_DEFAULT

  filter: any = {
    name: null,
    warehouse: null,
    categories: null,
    barCode: null,
    status: null
  }

  statusList = STOCK_STATUS_LIST
  limitOptions = LIMIT_PAGE_OPTIONS

  sort: any = {
    sortByColumn: null,
    sortDescending: null
  }

  get selectedStockFilter() {
    return this.selectedStock.filter((item) => !item.deleted)
  }

  get checkStockDisable () {
    return this.stockList.every((item) => item.deleted)
  }

  get checkIsFilter() {
    return Object.values(this.filter).some((item) => item)
  }

  get getInfoPaginate() {
    return calculateInfoPaginate(this.paginate.pageNumber, this.paginate.pageSize, this.total)
  }

  getIndexPaginate(index: number) {
    return calculateIndex(index, this.paginate.pageNumber, this.paginate.pageSize)
  }

  rowClass(data: any) {
    return data.deleted ? 'row-disable' : ''
  }

  toggleShowFilter() {
    this.isShowFilter = !this.isShowFilter
  }

  mounted() {
    this.getProductList()
    this.actCategoryList()
  }

  async getProductList() {
    const categoryIds = this.filter.categories && this.filter.categories.map((item: any) => item?.id).toString()
    const filter = {
      name: this.filter.name && this.filter.name !== '' ? this.filter.name : null,
      warehouseId: this.filter.warehouse?.id,
      categoryIds: categoryIds && categoryIds !== '' ? categoryIds : null,
      barCode: this.filter.barCode && this.filter.barCode !== '' ? this.filter.barCode : null,
      deleted: this.filter.status?.value,
      sortByColumn: this.sort?.sortByColumn,
      sortDescending: this.sort.sortDescending && this.sort?.sortDescending
    }
    const params = {
      ...this.paginate,
      ...filter
    }
    await this.actGetStockList(params)
  }

  @Watch('filter', { deep: true })
  @Watch('paginate', { deep: true })
  getNewStock() {
    this.getProductList()
  }

  getProductSelected(data: any[]) {
    this.selectedStock = data
  }

  onPage(event: any) {
    this.paginate.pageSize = event.rows
    this.paginate.pageNumber = event.page
  }

  showModalDelete(id?: string) {
    if (id) {
      this.ids = [id]
    } else {
      this.ids = this.selectedStockFilter.map((item: any) => {
        return item.id
      })
    }
    this.isModalDelete = true
  }

  async handleDeleteStock() {
    try {
      this.loadingSubmit = true
      await this.actDeleteStockByIds(this.ids)
      this.loadingSubmit = false
      this.isModalDelete = false
      this.$toast.add({
        severity: 'success',
        summary: 'Success Message',
        detail: 'Successfully deleted stock',
        life: 3000
      })
      this.paginate.pageNumber = 0
      this.firstPage = 0
      this.getProductList()
      this.selectedStock = []
    } catch (error) {
      this.loadingSubmit = false
    }
  }

  handleCancel() {
    this.isModalDelete = false
  }

  handleEditStock(id: any) {
    this.$router.push({ path: `/stock/${id}`, query: { plan: 'edit' }})
  }

  rowdbClick({ data }) {
    this.$router.push(`/stock/${data.id}`)
  }

  sortData(e: any){
    const { sortField, sortOrder } = e
    if(sortOrder){
      this.sort.sortDescending = sortOrder !== 1
      this.sort.sortByColumn = sortField.replace('_', '')
    }
    this.getProductList()
  }

  debounceSearchName = _.debounce((e) => {
    this.filter.name = e.target.value
  }, 500)

  debounceSearchCode = _.debounce((e) => {
    this.filter.barCode = e.target.value
  }, 500)

  handleRefreshFilter () {
    if (this.checkIsFilter)
      this.filter = {
        name: null,
        warehouse: null,
        categories: null,
        barCode: null,
        status: null
      }
  }
}
export default Stock
</script>
<style lang="sass" scoped>
.stock
  @include flex-column
  height: 100%
  &__header
    @include flex-center-space-between
    margin-bottom: 24px
    &-action
      @include flex-center
      gap: 0 16px    
  .header__filter
    visibility: hidden
    max-height: 0
    transition: all 0.25s ease-in-out
    display: grid
    grid-template-columns: repeat(3, 1fr)
    grid-gap: 0 16px
    &.active
      visibility: visible
      max-height: 200px
      margin-bottom: 24px
    .filter__item
      background-color: $color-white
      border-radius: 4px   
      padding: 13px 8px
    .filter__title
      font-size: 12px
      color: $text-color-700
      line-height: calc(16 / 12)
      margin-bottom: 5px
      margin-left: 8px
.stock__table
  border-radius: 4px
  &-no
    font-size: $font-size-medium
  &-barcode
    text-transform: uppercase
.filter__dropdown
  width: 100%
  border: none
</style>
