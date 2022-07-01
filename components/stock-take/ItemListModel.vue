<template lang="pug">
  Dialog.item-list-dialog(:visible.sync='visibleVue', :modal='true' :showHeader='false')
    .stock
      .stock__header
        div
          h1.text-heading Item list
          span.text-subheading {{ total }} product found
        .header__action.flex
          Button.btn.btn-primary.border-0.mr-2(
            @click='handleApplyFilter'
          ) Apply
          .btn__filter(:class="{'active': isShowFilter}")
            .btn-toggle(@click="isShowFilter = !isShowFilter")
              .icon.icon-filter(v-if="!isShowFilter")
              .icon.icon-chevron-up.bg-primary(v-else)
              span Filter
            .btn-refresh(@click="handleRefreshFilter")
              .icon.icon-rotate-left.bg-white
      .grid.header__filter(:class='{ "active": isShowFilter }')
        div(class="col-12 md:col-12 xl:col-7")
          .grid
            div(class="col-12 md:col-3")
              FilterTable(
                title="Warehouse"
                :value="filter.warehouse"
                :options="warehouseOption"
                name="warehouse"
                @updateFilter="handleFilter"
                :isClear="user.role === 'admin'"
              )
            .div(class="col-12 md:col-3")
              FilterTable(
                title="Seller"
                placeholder="Search barcode"
                name="email"
                :value="filter.email"
                :searchText="true"
                @updateFilter="handleFilter"
                :isShowFilter="isShowFilter"
              )
            .div(class="col-12 md:col-3")
              FilterTable(
                title="Barcode"
                placeholder="Search barcode"
                name="barCode"
                :value="filter.barCode"
                :searchText="true"
                @updateFilter="handleFilter"
                :isShowFilter="isShowFilter"
              )
            .div(class="col-12 md:col-3")
              FilterTable(
                title="Item name"
                placeholder="Search barcode"
                name="stockName"
                :value="filter.stockName"
                :searchText="true"
                @updateFilter="handleFilter"
                :isShowFilter="isShowFilter"
              )
        div(class="col-12 md:col-12 xl:col-5")
          .grid
            div(class='col-12 md:col-8')
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
            .div(class="col-12 md:col-4")
              FilterTable(title="Status" :value="filter.status" :options="statusList" name="status" @updateFilter="handleFilter")
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
            :rowClass="rowClass"
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
              template(#body="{data}") {{ data.stock.createdAt | dateTimeHour24 }}
            Column(field='status' header="Status" headerClass="grid-header-right")
              template(#body='{ data }')
                div.grid-cell-right
                  span.table__status.table__status--available(
                    v-if="data.itemStatus === 'ITEM_STATUS_AVAILABLE'"
                  ) {{ data.itemStatus | itemStockStatus }}
                  span.table__status.table__status--disable(
                    v-else-if="data.itemStatus === 'ITEM_STATUS_DISABLE'"
                  ) {{ data.itemStatus | itemStockStatus }}
                  span.table__status.table__status--draft(
                    v-else-if="data.itemStatus === 'ITEM_STATUS_DRAFT'"
                    ) {{ data.itemStatus | itemStockStatus }}
                  span.table__status.table__status--outgoing(v-else) {{ data.itemStatus | itemStockStatus }}
            template(#footer)
              Pagination(
                type="items selected"
                :paging="paging"
                :total="total"
                @onPage="onPage"
              )
            template(#empty)
              div.table__empty
                img(:srcset="`${require('~/assets/images/table-empty.png')} 2x`" v-if="!checkIsFilter")
                img(:srcset="`${require('~/assets/images/table-notfound.png')} 2x`" v-else)
                p.text-900.font-bold.mt-3 Order not found!
    template(#footer)
      Button.p-button-secondary(label="Close" icon="pi pi-times" @click="handleClose")
      Button.px-2.p-button-primary(icon="pi pi-check" @click="handleApply" v-if="lableBtnAddStock.length")
        span {{ lableBtnAddStock.label }}
</template>

<script lang="ts">
import { Component, Vue, namespace, Prop, Watch } from 'nuxt-property-decorator'
import ConfirmDialogCustom from '~/components/dialog/ConfirmDialog.vue'
import { Stock as StockModel } from '~/models/Stock'
import {
  PAGINATE_DEFAULT,
  calculateIndex,
  StockTakeConstants
} from '~/utils'
import { Paging } from '~/models/common/Paging'
import Pagination from '~/components/common/Pagination.vue'
const nsStoreOrder = namespace('stock-out/create-order')
const nsStoreWarehouse = namespace('warehouse/warehouse-list')
const nsStoreUser = namespace('user-auth/store-user')
const dayjs = require('dayjs')

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
  statusList = StockTakeConstants.RESULT_ITEM_STOCK_OPTIONS
  warehouseOption: any = []
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

  @nsStoreUser.State
  user: any | undefined

  // -- [ Action ] ------------------------------------------------------------
  @nsStoreOrder.Action
  actGetInventoryList!: (params: any) => Promise<void>

  @nsStoreWarehouse.Action
  actWarehouseList!: () => Promise<void>

  @Prop({ default: false }) isShow!: boolean
  @Prop({ default: [] }) itemSelected!: any

  @Watch('isShow')
  async getStockList() {
    if(this.isShow) {
      this.selectedStock = _.cloneDeep(this.itemSelected)
      const { role, warehouse } = this.user
      if(role === 'admin') {
        await this.actWarehouseList()
        this.warehouseOption = _.cloneDeep(this.warehouseList)
        this.filter.warehouse = this.warehouseList[0]
      } else {
        this.warehouseOption = [warehouse]
        this.filter.warehouse = warehouse
      }
      this.getProductList()
    }
  }

  // -- [ Getters ] -------------------------------------------------------------
  get checkIsFilter() {
    const paramsDefault = ['pageNumber', 'pageSize']
    if(this.user.role === 'staff') {
      paramsDefault.push('warehouseId')
    }
    const params = _.omit(this.getParamApi(), paramsDefault)
    return Object.values(params).some((item) => item)
  }

  get visibleVue() {
    return this.isShow
  }

  get lableBtnAddStock() {
    const length = _.size(this.selectedBoxeSsatisfy)
    let stockQuantity = ''
    if(length === 1 ) {
      stockQuantity = length + ' item'
    } else if(length > 1) {
      stockQuantity = length + ' items'
    }
    return {
      label: `Add ${stockQuantity || 'stock'} to stock-take note`,
      length
    }
  }

  get selectedBoxeSsatisfy() {
    return  _.filter(this.selectedStock, ({ itemStatus }) => {
      return itemStatus !== 'ITEM_STATUS_DRAFT'
    })
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
      itemStatus: this.filter.status?.value,
      barCode: this.filter.barCode || null,
      stockName: this.filter.stockName || null,
      from: this.filter.dateFrom ? dayjs(new Date(this.filter.dateFrom)).format('YYYY-MM-DD') : null,
      to: this.filter.dateTo ? dayjs(new Date(this.filter.dateTo)).format('YYYY-MM-DD') : null,
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
    if(this.user.role === 'admin') {
      this.filter.warehouse = null
    }
    this.filter.email = null
    this.filter.status = null
    this.filter.barCode = null
    this.filter.stockName = null
    this.filter.dateFrom = null
    this.filter.dateTo = null
    this.getProductList()
  }

  rowSelectAll({ data }) {
    this.selectedStock = _.unionWith(this.selectedStock, data, _.isEqual)
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
    if(_.size(this.selectedBoxeSsatisfy) > 1) {
      const warehouseFirstItem = _.get(this.selectedBoxeSsatisfy[0], 'box.request.warehouse.id', null)
      const unsatisfactoryItem =  _.find(this.selectedBoxeSsatisfy, function({ box }) {
        return box?.request?.warehouse?.id !== warehouseFirstItem
      })
      if(unsatisfactoryItem) {
        this.$toast.add({
          severity: 'error',
          summary: 'Error Message',
          detail: 'Please add items from 1 warehouse',
          life: 3000
        })
        return
      }
    }
    this.$emit('onApply', this.selectedBoxeSsatisfy)
  }

  handleClose() {
    this.$emit('hideDialog', false)
    this.selectedStock = []
  }

  handleApplyFilter() {
    this.getProductList()
  }

  rowClass({ itemStatus }) {
    if(itemStatus === 'ITEM_STATUS_DRAFT') {
      return 'row-disable'
    }
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
    .pagination
      padding: 8px
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
