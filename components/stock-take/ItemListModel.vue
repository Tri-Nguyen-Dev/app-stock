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
        div(class="col-12 md:col-2")
          FilterTable(
            title="Warehouse"
            :value="filter.warehouse"
            :options="warehouseList"
            name="warehouse"
            @updateFilter="handleFilter"
          )
        .div(class="col-12 md:col-2")
          FilterTable(
            title="Seller"
            placeholder="Search barcode"
            name="email"
            :value="filter.email"
            :searchText="true"
            @updateFilter="handleFilter"
            :isShowFilter="isShowFilter"
          )
        .div(class="col-12 md:col-2")
          FilterTable(title="Status" :value="filter.status" :options="statusList" name="status" @updateFilter="handleFilter")
        .div(class="col-12 md:col-2")
          FilterTable(
            title="Barcode"
            placeholder="Search barcode"
            name="barCode"
            :value="filter.barCode"
            :searchText="true"
            @updateFilter="handleFilter"
            :isShowFilter="isShowFilter"
          )
        .div(class="col-12 md:col-2")
          FilterTable(
            title="Item name"
            placeholder="Search barcode"
            name="stockName"
            :value="filter.stockName"
            :searchText="true"
            @updateFilter="handleFilter"
            :isShowFilter="isShowFilter"
          )
        div(class='col-12 md:col-2')
          .grid.grid-nogutter
            .col
              FilterCalendar(
                title="From"
                border="left"
                :value="filter.dateFrom"
                name="dateFrom"
                inputClass="border-0"
                dateFormat="dd-mm-yy"
                :showIcon="true"
                @updateFilter="handleFilter"
              )
            .col.ml-1
              FilterCalendar(
                title="To"
                border="right"
                :value="filter.dateTo"
                name="dateTo"
                inputClass="border-0"
                dateFormat="dd-mm-yy"
                :showIcon="true"
                @updateFilter="handleFilter"
              ) 
      .grid.grid-nogutter.flex-1.relative.overflow-hidden.m-h-700
        .col.h-full.absolute.top-0.left-0.right-0.bg-white
          DataTable(
            @sort="sortData($event)"
            :class="{ 'table-wrapper-empty': !inventoryStore || inventoryStore.length <= 0 }"
            :value='inventoryStore' responsiveLayout="scroll"
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
                span {{ getIndexPaginate(index) }}
            Column(header='Barcode' field='stock.barCode' :sortable="true" sortField="_stock.barCode")
              template(#body='{ data }')
                span.text-white-active.text-900.font-bold {{ data.stock.barCode }}
            Column(field='box.id' header='BOX CODE' :sortable='true' sortField='_box.id')
            Column(field='stock.name' header='ITEM NAME' :sortable='true' sortField='_stock.name')
            Column(field="box.rackLocation.name" header="LOCATION" :sortable="true" className="text-right" 
              sortField="_box.rackLocation.name"
            )
              template(#body="{data}")
                div(v-if="data.box.rackLocation")
                  .flex.align-items-center.cursor-pointer.justify-content-end
                    span.text-primary.font-bold.font-sm.text-white-active {{ data.box.rackLocation.name }}
                    .icon.icon-arrow-up-right.bg-primary.bg-white-active
            Column(field="stock.createdAt" header="CREATE TIME" :sortable="true" className="text-right" sortField="_stock.createdAt")
              template(#body="{data}") {{ data.stock.createdAt | dateTimeHour12 }}
            Column(field='status' header="Status" headerClass="grid-header-right")
              template(#body='{ data }')
                div.grid-cell-right
                  span.table__status.table__status--available(v-if="data.stock.stockStatus === 'STOCK_STATUS_AVAILABLE'") Available
                  span.table__status.table__status--disable(v-if="data.stock.stockStatus === 'STOCK_STATUS_DISABLE' ") Disable
            template(#footer)
              Pagination(
                type="items selected"
                :paging="paging"
                :total="total"
                @onPage="onPage")
            template(#empty)
              div.table__empty
                img(:srcset="`${require('~/assets/images/table-empty.png')} 2x`" v-if="!checkIsFilter")
                img(:srcset="`${require('~/assets/images/table-notfound.png')} 2x`" v-else)
                p.text-900.font-bold.mt-3 Order not found!
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
const nsStoreOrder = namespace('stock-out/create-order')
const nsStoreWarehouse = namespace('warehouse/warehouse-list')

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
    warehouse: null,
    email: null,
    status: null,
    barCode: null,
    stockName: null,
    dateFrom: null,
    dateTo: null,
    sortBy: null,
    desc: null
  }

  // -- [ State ] ------------------------------------------------------------
  @nsStoreOrder.State
  inventoryStore!: any

  @nsStoreOrder.State
  total!: any

  @nsStoreWarehouse.State
  warehouseList!: any

  // -- [ Action ] ------------------------------------------------------------
  @nsStoreOrder.Action
  actGetInventoryList!: (params: any) => Promise<void>

  @nsStoreWarehouse.Action
  actWarehouseList!: () => Promise<void>

  @Prop({ default: false }) isShow!: boolean
  @Prop({ default: [] }) itemSelected!: any

  @Watch('isShow')
  getStockList() {
    if(this.isShow) {
      this.getProductList()
      this.actWarehouseList()
      this.selectedStock = _.cloneDeep(this.itemSelected)
    }
  }

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
    return {
      warehouseId: this.filter.warehouse?.id,
      email: this.filter.email || null,
      stockStatus: this.filter.status?.value,
      barCode: this.filter.barCode || null,
      stockName: this.filter.stockName || null,
      from: this.filter.dateFrom,
      to: this.filter.dateTo,
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
    await this.actGetInventoryList({
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
    this.filter.warehouse = null
    this.filter.email = null
    this.filter.status = null
    this.filter.barCode = null
    this.filter.stockName = null
    this.filter.dateFrom = null
    this.filter.dateTo = null
    this.getProductList()
  }

  rowSelectAll({ data }) {
    this.selectedStock = _.union(this.selectedStock, data)
  }

  rowUnSelectAll() {
    this.selectedStock = _.differenceWith(
      this.selectedStock,
      this.inventoryStore,
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
    height: 85vh
  ::v-deep.pi-calendar:before
    content: url('~/assets/icons/calendar.svg')
  ::v-deep.p-calendar-w-btn
    .p-button
      background: none
      border: none
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
  ::v-deep.text-right
    text-align: right !important
    .p-column-header-content
      justify-content: end !important
</style>
