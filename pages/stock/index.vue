<template lang="pug">
  .stock
    .stock__header
      div
        h1.text-heading Stock list
        span.text-subheading {{ totalItem }}
      .header__action
        .header__search
          .icon.icon--left.icon-search
          InputText(type='text' placeholder='Search' v-model="filter.name" v-on:input="debounceSearchName")
        .btn__filter(:class="{'active': isShowFilter}")
          .btn-toggle(@click="isShowFilter = !isShowFilter")
            .icon.icon-filter(v-if="!isShowFilter")
            .icon.icon-chevron-up.bg-primary(v-else)
            span Filter
          .btn-refresh(@click="handleRefreshFilter")
            .icon.icon-rotate-left.bg-white
        Button.btn.btn-primary(@click="handleAddStock")
          .icon.icon-add-items
          span Add Stock
    .grid.header__filter(:class='{ "active": isShowFilter }')
      .div(class="col-12 md:col-4")
        FilterTable(title="Catagory" name="categories" :value="filter.categories"  @updateFilter="handleFilter")
          template(v-slot:multi-select)
            MultiSelect.filter__multiselect(
              v-model='filter.categories'
              @change="handleChangeFilter"
              :options='categoryList'
              optionLabel="name"
              placeholder='Select'
              :filter='true'
            )
      .div(class="col-12 md:col-4")
        FilterTable(
          title="Barcode"
          placeholder="Search barcode"
          name="barCode"
          :value="filter.barCode"
          :searchText="true"
          @updateFilter="handleFilter"
          :isShowFilter="isShowFilter"
        )
      .div(class="col-12 md:col-4")
        FilterTable(title="Status" :value="filter.status" :options="statusList" name="status" @updateFilter="handleFilter")
    .grid.grid-nogutter.flex-1.relative.overflow-hidden.m-h-700
      .col.h-full.absolute.top-0.left-0.right-0.bg-white
        DataTable(
          @sort="sortData($event)"
          :class="{ 'table-wrapper-empty': !stockList || stockList.length <= 0 }"
          :rowClass="rowClass" :value='stockList' responsiveLayout="scroll"
          :selection='selectedStock'
          dataKey='id'
          :rows='10'
          :rowHover='true'
          @row-select-all="rowSelectAll"
          @row-unselect-all="rowUnSelectAll"
          @row-select="rowSelect"
          @row-unselect="rowUnselect"
        )
          Column(
            selectionMode='multiple'
            :styles="{'width': '1%'}"
            :headerClass="classHeaderMuti"
          )
          Column(field='no' header='NO' :styles="{'width': '1%'}" )
            template(#body='{ index }')
              span.grid-cell-center.stock__table-no.text-white-active.text-900.font-bold {{ getIndexPaginate(index) }}
          Column(field='imageUrl' header='Image' headerClass="grid-header-center")
            template(#body='{ data }')
              .stock__table__image.overflow-hidden.grid-cell-center
                NuxtLink(:to="`/stock/${data.id}`")
                  img.h-2rem.w-2rem.border-round(
                    :src="data.imagePath | getThumbnailUrl" alt='' width='100%' style="object-fit: cover;")
          Column(header='Name' field='name' :sortable="true" sortField="_name")
            template(#body='{ data }')
              NuxtLink.stock__table-name.text-white-active.text-base.text-900.text-overflow-ellipsis.overflow-hidden(
                :to="`/stock/${data.id}`"
                class="no-underline hover:underline"
              ) {{ data.name }}
          Column(header='Barcode' field='barCode' :sortable="true" sortField="_barCode" headerClass="grid-header-right")
            template(#body='{ data }')
              .stock__table-barcode.grid-cell-right {{ data.barCode }}
          Column(header='Category' :sortable="true" field='category' sortField="_category" headerClass="grid-header-right")
              template(#body='{ data }')
                div.grid-cell-right {{ data.categoryName }}
          Column(field='status' header="Status" headerClass="grid-header-right")
            template(#body='{ data }')
              div.grid-cell-right
                span.table__status.table__status--available(v-if="data.stockStatus === 'STOCK_STATUS_AVAILABLE'") Available
                span.table__status.table__status--disable(v-if="data.stockStatus === 'STOCK_STATUS_DISABLE' ") Disable
          Column(field='action' header="action" :styles="{'width': '2%'}")
            template(#body='{ data }')
              .table__action(:class="{'action-disabled': data.stockStatus === 'STOCK_STATUS_DISABLE'}")
                span.action-item(@click.stop="handleEditStock(data.id)" :class="{'disable-button': selectedStockFilter.length > 0}")
                  .icon.icon-edit-btn
                span.action-item(@click.stop="showModalDelete([data])" :class="{'disable-button': selectedStockFilter.length > 0}")
                  .icon.icon-btn-delete
          template(#footer)
            Pagination(
              type="items selected"
              :paging="paging"
              :total="total"
              :deleted-list="selectedStockFilter"
              @onDelete="showModalDelete"
              @onPage="onPage")
          template(#empty)
            div.table__empty
              img(:srcset="`${require('~/assets/images/table-empty.png')} 2x`" v-if="!checkIsFilter")
              img(:srcset="`${require('~/assets/images/table-notfound.png')} 2x`" v-else)
              p.empty__text(v-if="!checkIsFilter") List is empty!, Click
                span &nbsp;here
                span(@click="handleAddStock") &nbsp;to add item.
              p.notfound__text(v-else) Item not found!
    ConfirmDialogCustom(
      title="Confirm delete"
      image="confirm-delete"
      :isShow="isModalDelete"
      :onOk="handleDeleteStock"
      :onCancel="handleCancel"
      :loading="loadingSubmit"
    )
      template(v-slot:message)
        p {{ deleteMessage }}

    Toast
</template>
<script lang="ts">
import { Component, Vue, namespace } from 'nuxt-property-decorator'
import ConfirmDialogCustom from '~/components/dialog/ConfirmDialog.vue'
import { Stock as StockModel } from '~/models/Stock'
import {
  LIMIT_PAGE_OPTIONS,
  PAGINATE_DEFAULT,
  calculateIndex,
  StockConstants,
  getDeleteMessage,
  resetScrollTable,
  getTotalQuantityLabel
} from '~/utils'
import { Paging } from '~/models/common/Paging'
import Pagination from '~/components/common/Pagination.vue'
const nsCategoryStock = namespace('category/category-list')
const nsStoreStock = namespace('stock/stock-list')
const nsStoreUser = namespace('user-auth/store-user')

@Component({
  components: {
    ConfirmDialogCustom,
    Pagination
  }
})
class Stock extends Vue {
  selectedStock: StockModel.Model[] = []
  isShowFilter: boolean = false
  loading: boolean = false
  isModalDelete: boolean = false
  onEventDeleteList: StockModel.Model[] = []
  loadingSubmit: boolean = false
  isFilter: boolean = false
  paging: Paging.Model = { ...PAGINATE_DEFAULT, first: 0 }
  statusList = StockConstants.STOCK_STATUS_OPTIONS
  limitOptions = LIMIT_PAGE_OPTIONS
  filter: any = {
    name: null,
    barCode: null,
    categories: null,
    status: null,
    sortBy: null,
    desc: null
  }

  @nsStoreStock.State
  total!: number

  @nsStoreStock.State
  stockList!: StockModel.Model[]

  @nsCategoryStock.State
  categoryList!: any

  @nsStoreUser.State
  user!: any

  @nsStoreStock.Action
  actGetStockList!: (params?: any) => Promise<void>

  @nsStoreStock.Action
  actDeleteStockByIds!: (ids: string[]) => Promise<any>

  @nsCategoryStock.Action
  actCategoryList!: () => Promise<void>

  // -- [ Getters ] -------------------------------------------------------------
  get selectedStockFilter() {
    return  _.filter(this.selectedStock, (stock: StockModel.Model) => {
      return stock.stockStatus !== 'STOCK_STATUS_DISABLE'
    })
  }

  get checkStockDisable() {
    return this.stockList.every(
      (item) => item.stockStatus === 'STOCK_STATUS_DISABLE'
    )
  }

  get checkIsFilter() {
    const params = _.omit(this.getParamApi(), ['pageNumber', 'pageSize'])
    return Object.values(params).some((item) => item)
  }

  get deleteMessage() {
    return getDeleteMessage(this.onEventDeleteList, 'stock')
  }

  get classHeaderMuti() {
    return !this.stockList ||
      this.stockList.length <= 0 ||
      this.checkStockDisable
      ? 'checkbox-disable'
      : ''
  }

  // -- [ Functions ] ------------------------------------------------------------
  getParamApi() {
    const categoryIds = this.filter.categories
      ? this.filter.categories.map((item: any) => item?.id).toString()
      : null
    return {
      name: this.filter.name || null,
      barCode: this.filter.barCode || null,
      categoryIds: categoryIds || null,
      stockStatus: this.filter.status?.value,
      sortBy: this.filter.sortBy || null,
      desc: this.filter.desc
    }
  }

  getIndexPaginate(index: number) {
    return calculateIndex(
      index,
      this.paging.pageNumber,
      this.paging.pageSize
    )
  }

  rowClass(data: any) {
    return data.stockStatus === 'STOCK_STATUS_DISABLE' ? 'row-disable' : ''
  }

  mounted() {
    this.getProductList()
    this.actCategoryList()
  }

  handleFilter(e: any, name: string){
    this.filter[name] = e
    this.getProductList()
    this.selectedStock = []
  }

  async getProductList() {
    await this.actGetStockList({
      pageSize: this.paging.pageSize,
      pageNumber: this.paging.pageNumber,
      ...this.getParamApi()
    })
  }

  handleChangeFilter() {
    this.getProductList()
    if(this.filter.categories.length === 0) {
      this.filter.categories = ''
      this.getProductList()
    }
    this.selectedStock = []
  }

  onPage(event: any) {
    resetScrollTable()
    this.paging.pageSize = event.rows
    this.paging.pageNumber = event.page
    this.getProductList()
  }

  showModalDelete(data: StockModel.Model[]) {
    this.onEventDeleteList = data || this.selectedStockFilter
    this.isModalDelete = true
  }

  async handleDeleteStock() {
    try {
      this.loadingSubmit = true
      const data = await this.actDeleteStockByIds(_.map(this.onEventDeleteList, 'id'))
      if (data) {
        this.loadingSubmit = false
        this.isModalDelete = false
        this.$toast.add({
          severity: 'success',
          summary: 'Success Message',
          detail: 'Successfully deleted stock',
          life: 3000
        })
        await this.getProductList()
      }
    } catch (error) {
      this.loadingSubmit = false
    }
  }

  handleCancel() {
    this.isModalDelete = false
  }

  handleEditStock(id: any) {
    this.$router.push({ path: `/stock/${id}`, query: { plan: 'edit' } })
  }

  sortData(e: any) {
    resetScrollTable()
    const { sortField, sortOrder } = e
    if (sortOrder) {
      this.filter.desc = sortOrder !== 1
      this.filter.sortBy = sortField.replace('_', '')
    } else {
      this.filter.desc = null
      this.filter.sortBy = null
    }
    this.getProductList()
  }

  debounceSearchName = _.debounce((value) => {
    this.filter.name = value
    this.getProductList()
  }, 500)

  debounceSearchCode = _.debounce((value) => {
    this.filter.barCode = value
    this.getProductList()
  }, 500)

  handleRefreshFilter() {
    for (const items in this.filter) this.filter[items] = null
    this.getProductList()
  }

  rowSelectAll({ data }) {
    this.selectedStock = _.union(this.selectedStock, data)
  }

  rowUnSelectAll() {
    this.selectedStock = _.differenceWith(
      this.selectedStock,
      this.stockList,
      _.isEqual
    )
  }

  rowSelect({ data }) {
    this.selectedStock.push(data)
  }

  rowUnselect({ originalEvent, data }) {
    originalEvent.originalEvent.stopPropagation()
    this.selectedStock = _.filter(
      this.selectedStock,
      (stock: any) => stock.id !== data.id
    )
  }

  handleAddStock() {
    this.$router.push('/stock-in/create-receipt')
  }

  get totalItem() {
    return getTotalQuantityLabel(this.total, 'result', '<%= quantity%> found')
  }
}
export default Stock
</script>
<style lang="sass" scoped>
.stock
  @include flex-column
  @include mobile
    min-height: calc(100vh - 32px)
  @include tablet
    min-height: calc(100vh - 32px)
  @include desktop
    height: calc(100vh - 32px)
  &__header
    flex-direction: column
    flex-wrap: wrap
    margin-bottom: 16px
    @include desktop
      flex-direction: row
      @include flex-center-space-between
  .header__action
    display: flex
    margin-top: 12px
    @include flex-column
    flex-wrap:  wrap
    gap: 10px 16px
    @include desktop
      @include flex-center
      flex-direction: row
      margin-top: 0
.stock__table
  border-radius: 4px
  flex: 1
  position: relative
  overflow: hidden
  &-no
    font-size: $font-size-medium
  &-barcode
    text-transform: uppercase
  ::v-deep.disable-button
    pointer-events: none
    background-color: $text-color-300
    .icon
      background-color: $text-color-500
.filter__dropdown, .filter__multiselect
  @include size(100%, 40px)
  border: none
</style>
