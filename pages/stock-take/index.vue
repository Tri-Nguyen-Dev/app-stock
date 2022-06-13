<template lang="pug">
  .stock__take
    .stock__take__header
      div
        h1.text-heading Stock-take note list
        span.text-subheading product found
      .header__action
        .header__search
          .icon.icon--left.icon-search
          InputText(type='text' placeholder='Search')
        .btn__filter(:class="{'active': isShowFilter}")
          .btn-toggle(@click="isShowFilter = !isShowFilter")
            .icon.icon-filter(v-if="!isShowFilter")
            .icon.icon-chevron-up.bg-primary(v-else)
            span Filter
          .btn-refresh()
            .icon.icon-rotate-left.bg-white
        Button.btn.btn-primary(class="drop-option" @click="isShowOptionAddNote = !isShowOptionAddNote")
          .icon.icon-add-items
          span ADD NOTE
          ul.option-note-list(:class="{'active': isShowOptionAddNote}")
            li.option-item Add Box
            li.option-item Add Item
        Button.btn.btn-primary()
          span EXPORT FILE
    .grid.header__filter.mt-1(:class='{ "active": isShowFilter }')
      div(class="col-12 lg:col-12 xl:col-4")
        .grid
          div(class="col-12 md:col-3")
            FilterTable(title="Note ID" :value="filter.id" placeholder="Enter ID" name="id" :searchText="true" @updateFilter="handleFilter")
          div(class="col-12 md:col-9")
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
                    @updateFilter="handleFilter")
              .col.ml-1
                  FilterCalendar(
                  title="To"
                  border="right"
                  :value="filter.dateTo"
                  name="dateTo"
                  inputClass="border-0"
                  dateFormat="dd-mm-yy"
                  :showIcon="true"
                  @updateFilter="handleFilter")
      div(class="col-12 lg:col-3 xl:col-2")
        FilterTable(
          title="Warehouse"
          :value="filter.warehouse"
          :options="warehouseList"
          name="warehouse"
          @updateFilter="handleFilter")
      div(class="col-12 lg:col-3 xl:col-2")
        FilterTable(
          title="Check Type"
          :value="filter.status"
          :options="warehouseList"
          name="warehouse"
          @updateFilter="handleFilter") 
      div(class="col-12 lg:col-3 xl:col-2")
        FilterTable(
          title="Result"
          :value="filter.status"
          :options="warehouseList"
          name="warehouse"
          @updateFilter="handleFilter") 
      div(class="col-12 lg:col-3 xl:col-2")
        FilterTable(
          title="Status"
          :value="filter.status"
          :options="warehouseList"
          name="warehouse"
          @updateFilter="handleFilter") 
    .grid.grid-nogutter.flex-1.relative.overflow-hidden.m-h-700
      .col.h-full.absolute.top-0.left-0.right-0.bg-white
        DataTable(
          @sort="sortData($event)"
          :class="{ 'table-wrapper-empty': !stockTakeList || stockTakeList.length <= 0 }"
          :rowClass="rowClass" :value='stockTakeList' responsiveLayout="scroll"
          :selection='selectedStockTake'
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
            :styles="{'width': '1%'}")
          Column(field='no' header='NO' :styles="{'width': '1%'}" )
            template(#body='{ index }')
              span.grid-cell-center.stock__table-no.text-white-active.text-900.font-bold {{ getIndexPaginate(index) }}
          Column(field='imageUrl' header='NOTE ID' headerClass="grid-header-center")
            template(#body='{ data }')
              .stock__table__image.overflow-hidden.grid-cell-center
                NuxtLink(:to="`/stock/${data.id}`")
                  img.h-2rem.w-2rem.border-round(
                    :src="data.imagePath | getThumbnailUrl" alt='' width='100%' style="object-fit: cover;")
          Column(header='cREATE tIME' field='name' :sortable="true" sortField="_name")
            template(#body='{ data }')
              NuxtLink.stock__table-name.text-white-active.text-base.text-900.text-overflow-ellipsis.overflow-hidden(:to="`/stock/${data.id}`" class="no-underline hover:underline") {{ data.name }}
          Column(header='UPDATE time' field='barCode' :sortable="true" sortField="_barCode" headerClass="grid-header-right")
            template(#body='{ data }')
              .stock__table-barcode.grid-cell-right {{ data.barCode }}
          Column(header='cREATor ID' :sortable="true" field='category' sortField="_category" headerClass="grid-header-right")
              template(#body='{ data }')
                div.grid-cell-right {{ data.categoryName }}
          Column(header='PIC ID' :sortable="true" field='category' sortField="_category" headerClass="grid-header-right")
              template(#body='{ data }')
                div.grid-cell-right {{ data.categoryName }}
          Column(header='Result' :sortable="true" field='category' sortField="_category" headerClass="grid-header-right")
              template(#body='{ data }')
                div.grid-cell-right {{ data.categoryName }}
          Column(header='nOTE' :sortable="true" field='category' sortField="_category" headerClass="grid-header-right")
              template(#body='{ data }')
                div.grid-cell-right {{ data.categoryName }}
          Column(field='PIC ID' header="Status" headerClass="grid-header-right")
            template(#body='{ data }')
              div.grid-cell-right
                span.table__status.table__status--available(v-if="data.stockStatus === 'STOCK_STATUS_AVAILABLE'") Available
                span.table__status.table__status--disable(v-if="data.stockStatus === 'STOCK_STATUS_DISABLE' ") Disable
          Column(header='CHECK Type' :sortable="true" field='category' sortField="_category" headerClass="grid-header-right")
            template(#body='{ data }')
              div.grid-cell-right {{ data.categoryName }}
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
</template>
<script lang="ts">
import { Component, Vue, namespace } from 'nuxt-property-decorator'
import {
  PAGINATE_DEFAULT,
  calculateIndex
} from '~/utils'
import Pagination from '~/components/common/Pagination.vue'
import ConfirmDialogCustom from '~/components/dialog/ConfirmDialog.vue'
import { Paging } from '~/models/common/Paging'
const nsWarehouseStock = namespace('warehouse/warehouse-list')
const nsStoreStockTake = namespace('stock-take/note-list')
const dayjs = require('dayjs')

@Component({
  components: {
    ConfirmDialogCustom,
    Pagination
  }
})
class StockTake extends Vue {
  selectedStockTake: any = []
  isShowFilter: boolean = false
  isShowOptionAddNote: boolean = false
  isModalDelete: boolean = false
  onEventDeleteList: any = []
  paging: Paging.Model = { ...PAGINATE_DEFAULT, first: 0 }
  filter: any = {
    id: null,
    dateFrom: null,
    dateTo: null,
    warehouse: null,
    sellerEmail: null,
    creatorId: null,
    status: null
  }

  @nsWarehouseStock.State
  warehouseList!: any

  @nsStoreStockTake.State
  stockTakeList!: any

  @nsStoreStockTake.State
  total!: number

  @nsWarehouseStock.Action
  actWarehouseList!: () => Promise<void>

  @nsStoreStockTake.Action
  actGetStockTakeList!: (params: any) => Promise<void>

  handleFilter(e: any, name: string) {
    this.filter[name] = e
  }

  // -- [ Getters ] -------------------------------------------------------------
  get selectedStockFilter() {
    return  _.filter(this.selectedStockTake, (stock: any) => {
      return stock.stockStatus !== 'STOCK_STATUS_DISABLE'
    })
  }

  async getProductList() {
    await this.actGetStockTakeList({
      pageSize: this.paging.pageSize,
      pageNumber: this.paging.pageNumber,
      ...this.getParamApi()
    })
  }

  onPage(event: any) {
    this.paging.pageSize = event.rows
    this.paging.pageNumber = event.page
    this.getProductList()
  }

  showModalDelete(data: any) {
    this.onEventDeleteList = data || this.selectedStockFilter
    this.isModalDelete = true
  }

  getParamApi() {
    return {
      params: {
        'id': this.filter.id || null,
        'sellerEmail': this.filter.sellerEmail || null,
        'creatorId': this.filter.creatorId || null ,
        'from': this.filter.dateFrom ? dayjs(new Date(this.filter.dateFrom)).format('YYYY-MM-DD') : null,
        'to': this.filter.dateTo ? dayjs(new Date(this.filter.dateTo)).format('YYYY-MM-DD') : null,
        'status': this.filter.status?.value,
        'warehouseId': this.filter.warehouse?.id
      }
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

  rowSelectAll({ data }) {
    this.selectedStockTake = _.union(this.selectedStockTake, data)
  }

  rowUnSelectAll() {
    this.selectedStockTake = _.differenceWith(
      this.selectedStockTake,
      this.stockTakeList,
      _.isEqual
    )
  }

  rowSelect({ data }) {
    this.selectedStockTake.push(data)
  }

  rowUnselect({ originalEvent, data }) {
    originalEvent.originalEvent.stopPropagation()
    this.selectedStockTake = _.filter(
      this.selectedStockTake,
      (stock: any) => stock.id !== data.id
    )
  }

  get checkIsFilter() {
    const params = _.omit(this.getParamApi(), ['pageNumber', 'pageSize'])
    return Object.values(params).some((item) => item)
  }

  mounted() {
    this.actWarehouseList()
  }
}

export default StockTake
</script>
<style scoped lang="sass">
  .stock__take
    @include flex-column
    @include mobile
      min-height: calc(100vh - 32px)
    @include tablet
      min-height: calc(100vh - 32px)
    @include desktop
      height: calc(100vh - 32px)
    ::v-deep.p-component
      font-family: $font-family-primary
    ::v-deep.pi-calendar:before
      content: url('~/assets/icons/calendar.svg')
    ::v-deep.p-calendar-w-btn
      .p-button
        background: none
        border: none
    &__header
      flex-direction: column
      flex-wrap: wrap
      margin-bottom: 24px
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
    .drop-option
      position: relative
      overflow: unset
      .option-note-list
        display: none
        color: $text-color-base
        padding-left: 0
        margin: 0
        position: absolute
        background-color: $color-white
        top: 110%
        border-radius: 4px
        width: 100%
        left: 0
        z-index: 10
        list-style-type: none
        box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px

        &.active
          display: block

        .option-item
          padding: 12px 0
          border-bottom: 1px solid #dee2e6
          transition: all 0.25 ease
          &:hover
            background-color: $primary
            color: $color-white
</style>