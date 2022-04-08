<template lang="pug">
  .stock
    .stock__header
      div
        h1.text-heading Stock list
        span.text-subheading {{ total }} product found
      div.stock__header-action
        div.stock__search
          span.p-input-icon-left
            .icon.icon--left.icon-search
            input#inputSearch(type='text' placeholder='Search' @input="debounceSearchName")
        .stock__btn-filter.border-round.cursor-pointer(:class="{'active': isShowFilter}")
          div.bg-white.btn-filter-toggle.flex.align-items-center.h-full.flex-1(@click="toggleShowFilter")
            .icon.icon-filter( v-if="!isShowFilter")
            .icon.icon-chevron-up.bg-primary(v-else)
            span Filter
          div.refresh-filter(@click="handleRefreshFilter")
            img(:src="require(`~/assets/icons/rotate-left.svg`)")
        .stock__btn-add.flex.align-items-center.bg-primary.border-round.cursor-pointer
          .icon.icon-add-items.bg-white
          span Add Stock
    .stock__filter(:class='{ "active": isShowFilter }')
      .stock__filter-item.bg-white.border-round
        .stock__filter-title Warehouse
        Dropdown.stock__filter-action.w-full.border-0(v-model="filter.warehouse" :options="warehouseList" optionLabel="name" placeholder="Select")
      .stock__filter-item.bg-white.border-round
        .text-sm.stock__filter-title Catagory
        MultiSelect#MultiSelectCatagory.stock__filter-action.w-full.border-0(v-model='filter.categories' :options='categoryList' optionLabel="name" placeholder='Select' :filter='true')
      .stock__filter-item.bg-white.border-round
        .text-sm.stock__filter-title Code
        span.p-input-icon-right.w-full
            input#inputSearchCode.w-full(type="text" @input="debounceSearchCode" placeholder="Search code" )
            i.icon.icon-search
      .stock__filter-item.bg-white.border-round
        .text-sm.stock__filter-title Status
        Dropdown.w-full.border-0(v-model="filter.status"  :options="statusList" optionLabel="name" placeholder="Select")
    .stock__table.bg-white.flex-1.relative.overflow-hidden
        DataTable.table__sort-icon.h-full.flex.flex-column(@sort="sortData($event)" :class="{ 'table__empty': !stockList || stockList.length <= 0 }" :rowClass="rowClass" :value='stockList' responsiveLayout="scroll" @row-dblclick='rowdbClick' :selection.sync='selectedStock' dataKey='id' :rows='10' :rowHover='true')
          Column(selectionMode='multiple' :styles="{'width': '1%'}" :headerClass="`${!stockList || stockList.length <= 0 || checkStockDisable ? 'checkbox-disable' : ''}`")
          Column(field='no' header='NO' :styles="{'width': '1%'}" )
            template(#body='{ index }')
              span.grid-body-center.stock__table-no.text-white-active.text-900.font-bold {{ (index + 1) + paginate.pageNumber * paginate.pageSize  }}
          Column(field='imageUrl' header='Image' :styles="{'width': '5%'}")
            template(#body='{ data }')
              .grid-body-center.stock__table__image.overflow-hidden
                img.h-2rem.w-2rem.border-round(:src='data.imageUrl' alt='' width='100%' style="object-fit: cover;")
          Column(header='Name' field='name' :sortable="true" sortField="_name")
            template(#body='{ data }')
              .stock__table-name.text-white-active.text-base.text-900.text-overflow-ellipsis.overflow-hidden {{ data.name }}
          Column(header='Code' field='barCode' :sortable="true" :styles="{'width': '5%'}" headerClass="grid-heading-end" sortField="_barCode")
            template(#body='{ data }')
              div.grid-body-end.stock__table-barcode {{ data.barCode }}
          Column(header='Category' :sortable="true" field='category' :styles="{'width': '5%'}" sortField="_category")
              template(#body='{ data }')
                div.grid-body-end {{ data.category.name }}
          Column(field='status' header="Status" :styles="{'width': '5%'}" headerClass="grid-heading-content")
            template(#body='{ data }')
              div.grid-body-end
                span.table__status.table__status--available(v-if="!data.deleted") Available
                span.table__status.table__status--disable(v-else) Disable
          Column(field='action' header="action" :styles="{'width': '2%'}" headerClass="grid-heading-content")
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
              Paginator(:first.sync="firstPage" :rows="paginate.pageSize" :totalRecords="total" @page="onPage($event)" :rowsPerPageOptions="[10,20,30]")
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
import _ from 'lodash'
import { Component, Vue, namespace, Watch } from 'nuxt-property-decorator'
import ConfirmDialogCustom from '~/components/dialog/ConfirmDialog.vue'
import { Stock as StockModel } from '~/models/Stock'
const nsCategoryStock = namespace('category/category-list')
const nsWarehouseStock = namespace('warehouse/warehouse-list')
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

  @nsWarehouseStock.State
  warehouseList!: any

  @nsStoreStock.Action
  actGetStockList!: (params?: any) => Promise<void>

  @nsStoreStock.Action
  actDeleteStockByIds!: (ids: string[]) => Promise<void>

  @nsCategoryStock.Action
  actCategoryList!: () => Promise<void>

  @nsWarehouseStock.Action
  actWarehouseList!: () => Promise<void>

  firstPage:any = 0

  paginate: any = {
    pageNumber: 0,
    pageSize: 10
  }

  filter: any = {
    name: null,
    warehouse: null,
    categories: null,
    barCode: null,
    status: null
  }

  statusList: any = [
    { name: 'Disable', value: true },
    { name: 'Available', value: false }
  ]

  sort: any = {
    sortByColumn: null,
    sortDescending: null
  }

  selectedStock: StockModel.Model[] = []
  isShowFilter: boolean = false
  loading: boolean = false
  isModalDelete: boolean = false
  ids: string[] = []
  loadingSubmit: boolean = false
  isFilter: boolean = false

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
    const { pageNumber, pageSize } = this.paginate
    const start = (pageNumber + 1) * pageSize - (pageSize - 1)
    const convertStart = ('0' + start).slice(-2)
    const end = Math.min(start + pageSize - 1, this.total)
    return `Showing ${convertStart} - ${end} of ${this.total}`
  }

  rowClass(data: any) {
    return data.deleted ? 'row-disable' : ''
  }

  toggleShowFilter() {
    this.isShowFilter = !this.isShowFilter
  }

  redirectToDetail({ data }) {
    this.$router.push(`stock/${data.id}`)
  }

  editStockDetail(id:any) {
    this.$router.push(`stock/${id}`)
  }

  mounted() {
    this.getProductList()
    this.actCategoryList()
    this.actWarehouseList()
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
    this.$router.push({ path: `/stock/${id}`,  query: { edit: id }})
  }

  rowdbClick({ data }) {
    this.$router.push(`/stock/${data.id}`)
  }

  sortData(e: any){
    const { sortField, sortOrder } = e;
    if(sortOrder){
      this.sort.sortDescending = sortOrder !== 1
      this.sort.sortByColumn = sortField.replace('_', '');
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
  display: flex
  flex-direction: column
  height: 100%
  &__header
    display: flex
    align-items: center
    justify-content: space-between
    margin-bottom: 24px
    &-action
      display: flex
      align-items: center
      gap: 0 16px
  &__btn-filter
    display: flex
    height: 48px
    width: 166px
    .refresh-filter
      background-color: $primary
      display: flex
      align-items: center
      width: 50px
      justify-content: center
      border-top-right-radius: 4px
      border-bottom-right-radius: 4px
    .btn-filter-toggle
      gap: 18px
      border-top-left-radius: 4px
      border-bottom-left-radius: 4px
      display: flex
      justify-content: center
  &__btn-add
    gap: 18px
    height: 48px
    padding: 0 32px 0 20px
    white-space: nowrap
    span
      line-height: calc(24 / 14)
  &__btn-filter.active
    .btn-filter-toggle
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
.stock__table
  border-radius: 4px
  &-no
    font-size: $font-size-medium
  &-barcode
    text-transform: uppercase
</style>
