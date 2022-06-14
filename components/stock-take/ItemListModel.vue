<template lang="pug">
  Dialog.item-list-dialog(:visible.sync='visibleVue', :modal='true' :showHeader='false')
    .stock
      .stock__header
        div
          h1.text-heading Item list
          span.text-subheading {{ total }} product found
        .header__action
          .btn__filter(:class="{'active': isShowFilter}")
            .btn-toggle(@click="isShowFilter = !isShowFilter")
              .icon.icon-filter(v-if="!isShowFilter")
              .icon.icon-chevron-up.bg-primary(v-else)
              span Filter
            .btn-refresh(@click="handleRefreshFilter")
              .icon.icon-rotate-left.bg-white
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
            :value='stockList' responsiveLayout="scroll"
            :selection='selectedStock'
            dataKey='id'
            :rows='20'
            :rowHover='true'
            @row-select-all="rowSelectAll"
            @row-unselect-all="rowUnSelectAll"
            @row-select="rowSelect"
            @row-unselect="rowUnselect"
          )
            Column(
              selectionMode='multiple'
              :styles="{'width': '1%'}")
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
                NuxtLink.stock__table-name.text-white-active.text-base.text-900.text-overflow-ellipsis.overflow-hidden(:to="`/stock/${data.id}`" class="no-underline hover:underline") {{ data.name }}
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
            template(#footer)
              Pagination(
                type="items selected"
                :paging="paging"
                :total="total"
                @onPage="onPage")
    template(#footer)
      Button.p-button-secondary(label="Close" icon="pi pi-times" @click="handleClose")
      Button.p-button-primary(label="Apply" icon="pi pi-check" @click="handleApply")
</template>

<script lang="ts">
import { Component, Vue, namespace, Prop, Watch } from 'nuxt-property-decorator'
import ConfirmDialogCustom from '~/components/dialog/ConfirmDialog.vue'
import { Stock as StockModel } from '~/models/Stock'
import {
  PAGINATE_DEFAULT,
  calculateIndex,
  StockConstants
} from '~/utils'
import { Paging } from '~/models/common/Paging'
import Pagination from '~/components/common/Pagination.vue'
const nsCategoryStock = namespace('category/category-list')
const nsStoreStock = namespace('stock/stock-list')

@Component({
  components: {
    ConfirmDialogCustom,
    Pagination
  }
})
class ItemListModel extends Vue {
  selectedStock: StockModel.Model[] = []
  isShowFilter: boolean = false
  isFilter: boolean = false
  paging: Paging.Model = { ...PAGINATE_DEFAULT, first: 0 }
  statusList = StockConstants.STOCK_STATUS_OPTIONS
  filter: any = {
    name: null,
    barCode: null,
    warehouse: null,
    categories: null,
    status: null,
    sortBy: null,
    desc: null
  }

  @Prop({ default: false }) isShow!: boolean

  @Watch('isShow')
  getStockList() {
    if(this.isShow) {
      this.getProductList()
      this.actCategoryList()
    }
  }

  @nsStoreStock.State
  total!: number

  @nsStoreStock.State
  stockList!: StockModel.Model[]

  @nsCategoryStock.State
  categoryList!: any

  @nsStoreStock.Action
  actGetStockList!: (params?: any) => Promise<void>

  @nsCategoryStock.Action
  actCategoryList!: () => Promise<void>

  // -- [ Getters ] -------------------------------------------------------------
  get checkIsFilter() {
    const params = _.omit(this.getParamApi(), ['pageNumber', 'pageSize'])
    return Object.values(params).some((item) => item)
  }
  
  get visibleVue() {
    return this.isShow
  }

  // -- [ Setters ] -------------------------------------------------------------
  set visibleVue(value) {
    this.$emit('hideDialog', value)
  }

  // -- [ Functions ] ------------------------------------------------------------
  getParamApi() {
    const categoryIds = this.filter.categories
      ? this.filter.categories.map((item: any) => item?.id).toString()
      : null
    return {
      name: this.filter.name || null,
      barCode: this.filter.barCode || null,
      warehouseId: this.filter.warehouse?.id,
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

  handleFilter(e: any, name: string){
    this.filter[name] = e
    this.getProductList()
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
  }

  onPage(event: any) {
    this.paging.pageSize = event.rows
    this.paging.pageNumber = event.page
    this.getProductList()
  }

  sortData(e: any) {
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

  handleRefreshFilter() {
    this.filter.name = null
    this.filter.barCode = null
    this.filter.categories = null
    this.filter.status = null
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

  handleApply() {
    this.$emit('onApply', this.selectedStock)
  }

  handleClose() {
    this.$emit('hideDialog', false)
    this.selectedStock = []
  }
}

export default ItemListModel
</script>
<style lang="sass" scoped>
.item-list-dialog
  ::v-deep.p-dialog-content
    background-color: #E8EAEF
    width: 80vw
    padding-bottom: 5px
    height: 80vh
  .stock
    @include flex-column
    @include mobile
      min-height: calc(100vh - 32px)
    @include tablet
      min-height: calc(100vh - 32px)
    @include desktop
      height: 100%
    &__header
      flex-direction: column
      flex-wrap: wrap
      margin-bottom: 8px
      @include desktop
        flex-direction: row
        @include flex-center-space-between
    .header__filter.active
      margin-bottom: 8px
  .stock__table
    border-radius: 4px
    flex: 1
    position: relative
    overflow: hidden
    &-no
      font-size: $font-size-medium
    &-barcode
      text-transform: uppercase
  .filter__dropdown, .filter__multiselect
    @include size(100%, 40px)
    border: none
</style>
