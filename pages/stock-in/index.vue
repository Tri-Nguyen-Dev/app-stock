<template lang="pug">
  .receipt__header
    .grid.justify-content-between
      .col-fixed
        h1.text-heading Receipt note list
        span.text-subheading {{ total }} products found
      .col-fixed
        .grid
          .col-fixed
            .btn__filter(:class="{'active': isShowFilter}")
              .btn-toggle(@click="isShowFilter = !isShowFilter")
                .icon.icon-filter(v-if="!isShowFilter")
                .icon.icon-chevron-up.bg-primary(v-else)
                span Filter
              .btn-refresh(@click="refreshFilter")
                .icon.icon-rotate-left.bg-white
          .col-fixed
            .btn.btn-primary(@click='createStockIn')
                .icon.icon-add-items.surface-900.bg-white
                span.text-900.text-white.mr-3 Add receipt note
          .col-fixed
            .btn__filter(class='active' @click="handleExportReceipt")
              .btn.btn-toggle.bg-white
                .icon-download.icon--large.bg-primary
                span.text-900.text-primary Export file
    .grid.header__filter.mt-1(:class='{ "active": isShowFilter }')
      .col-4
        .grid
          .col-3
            FilterTable(title="ID" :value="filter.id" placeholder="Enter ID" name="id" :searchText="true" @updateFilter="handleFilter")
          .col-9
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
      .col-2
        FilterTable(
          title="Warehouse"
          :value="filter.warehouse"
          :options="warehouseList"
          name="warehouse"
          @updateFilter="handleFilter")

      .col-2
        FilterTable(
          title="Seller Email"
          placeholder="Enter Seller Email"
          name="sellerEmail"
          :value="filter.sellerEmail"
          :searchText="true"
          @updateFilter="handleFilter")
      .col-2
        FilterTable(
          title="Creator ID"
          placeholder="Enter ID"
          name="creatorId"
          :value="filter.creatorId"
          :searchText="true"
          @updateFilter="handleFilter")
      .col-2
        FilterTable(title="Status" :value="filter.status" :options="statusRequest" name="status" @updateFilter="handleFilter")
    .grid.grid-nogutter.flex-1.relative.overflow-hidden
      .col.h-full.absolute.top-0.left-0.right-0.bg-white
        DataTable.w-full.table__sort-icon.h-full.flex.flex-column(
          v-if="stockIn" :value="stockIn"
          responsiveLayout="scroll"
          :selection="selectedStockIn"
          removableSort dataKey="id"
          :resizableColumns="true" :rows="20"
          :scrollable="false"
          @sort="sortData($event)"
          @row-select="rowSelect"
          :class="{ 'table-wrapper-empty': !stockIn || stockIn.length <= 0 }"
          @row-select-all="rowSelectAll"
          @row-unselect-all="rowUnSelectAll" @row-unselect='rowUnselect'
        )
          Column(selectionMode='multiple')
          Column(field='no' header='NO' )
            template(#body="slotProps")
              span.font-semibold {{ (paging.pageNumber) * paging.pageSize + slotProps.index +1 }}
          Column(field='id' header='ID' :sortable="true" sortField="_id" )
            template(#body='{ data }')
              NuxtLink.text-white-active.text-900.font-bold(v-if="data.status === 'REQUEST_STATUS_SAVED'"
              :to="`/stock-in/${data.id}/detail`" class="no-underline hover:underline") {{ data.id }}
              NuxtLink.text-white-active.text-900.font-bold(v-else
              :to="`/stock-in/${data.id}/update`" class="no-underline hover:underline") {{ data.id }}
          Column(header='Create Time' field='data.createdAt' :sortable="true" sortField="_createdAt")
            template(#body='{ data }') {{ data.createdAt | dateTimeHour12 }}
          Column(header='SELLER NAME' field='sellerName' :sortable="true" sortField="_seller.name")
            template(#body='{ data }') {{ data.sellerName }}
          Column(header='SELLER EMAIL' field='sellerEmail' :sortable="true" sortField="_seller.email" )
            template(#body='{ data }') {{ data.sellerEmail }}
          Column(field="warehouse" header="WAREHOUSE" :sortable="true" sortField="_warehouse.name" headerClass="grid-header-right")
            template(#body="{data}")
              div(v-if='data.warehouse')
                .flex.align-items-center.cursor-pointer.justify-content-end
                  span.text-primary.font-bold.text-white-active(v-if='data.warehouse' ) {{ data.warehouse.name }}
                  .icon.icon-arrow-up-right.bg-primary.bg-white-active
          Column(
            header='CREATOR ID'
            field='data.creatorId'
            :sortable="true"
            sortField="_createdBy.id"
            className="text-right"
            headerClass="grid-header-right"
          )
            template(#body='{ data }')
                  span.text-white-active {{ data.creatorId }}
          Column(
            header='CREATOR NAME'
            field='data.creatorName'
            :sortable="true"
            sortField="_createdBy.displayName"
            className="text-right"
            headerClass="grid-header-right"
          )
            template(#body='{ data }')
                  span.text-white-active {{ data.creatorName }}
          Column(header='STATUS' field=' data.status' :sortable="true" sortField="_status")
            template(#body='{ data }')
              span.border-round.py-2.px-3.uppercase.font-bold.font-sm(
                :class=" data.status === 'REQUEST_STATUS_SAVED' ? 'text-green-400 bg-green-100 ' : 'text-primary bg-blue-100' ")
                | {{ data.status | requestStatus }}
          template(#empty)
            div.table__empty
              img(:srcset="`${require('~/assets/images/table-empty.png')} 2x`" v-if="!isFilter")
              img(:srcset="`${require('~/assets/images/table-notfound.png')} 2x`" v-else)
              p.empty__text(v-if="!isFilter") List is empty!, Click
                span(@click='createStockIn') &nbsp;here
                span &nbsp;to add item.
              p.notfound__text(v-else) Item not found!
          template(#footer)
            Pagination(
              :paging="paging"
              :total="total"
              :deleted-list="itemsBoxDelete"
              @onDelete="showModalDelete"
              @onPage="onPage")
      ConfirmDialogCustom(
        title="Confirm delete"
        image="confirm-delete"
        :isShow="isModalDelete"
        :onOk="handleDeleteStockIn"
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
import { Request } from '~/models/RequestList'
import { REQUEST_STATUS, refreshAllFilter, calculateIndex, PAGINATE_DEFAULT, exportFileTypePdf, getDeleteMessage } from '~/utils'
import Pagination from '~/components/common/Pagination.vue'
import { Paging } from '~/models/common/Paging'
const nsWarehouseStock = namespace('warehouse/warehouse-list')
const nsStoreStockIn = namespace('stock-in/request-list')
const nsStoreExportReceipt = namespace('stock-in/export-receipt')
const dayjs = require('dayjs')

@Component({
  components: {
    ConfirmDialogCustom,
    Pagination
  }
})
class StockIn extends Vue {
  selectedStockIn: any = []
  isShowFilter: boolean = false
  selectedWarehouse: any = null
  statusRequest = REQUEST_STATUS
  isModalDelete: boolean = false
  loadingSubmit: boolean = false
  onEventDeleteList: any = []
  sortByColumn: string = ''
  isDescending: boolean | null = null
  boxCodeDelete: string = ''
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

  @nsStoreStockIn.State
  stockIn!: Request.Model[]

  @nsStoreStockIn.State
  total!: number

  @nsWarehouseStock.State
  warehouseList!: any

  @nsStoreExportReceipt.State
  receiptUrl!: any

  @nsStoreStockIn.Action
  actGetStockIn!: (params: any) => Promise<void>

  @nsStoreStockIn.Action
  actDeleteStockInByIds!: (params: {ids: string[]}) => Promise<any>

  @nsWarehouseStock.Action
  actWarehouseList!: () => Promise<void>

  @nsStoreExportReceipt.Action
  actGetReceiptLable!: (params: any) => Promise<string>

  getParamApi() {
    return {
      pageNumber: this.paging.pageNumber, pageSize: this.paging.pageSize,
      'id': this.filter.id || null,
      'sellerEmail': this.filter.sellerEmail || null,
      'creatorId': this.filter.creatorId || null ,
      'from': this.filter.dateFrom ? dayjs(new Date(this.filter.dateFrom)).format('YYYY-MM-DD') : null,
      'to': this.filter.dateTo ? dayjs(new Date(this.filter.dateTo)).format('YYYY-MM-DD') : null,
      'sortBy': this.sortByColumn || null,
      'desc': this.isDescending,
      'status': this.filter.status?.value,
      'warehouseId': this.filter.warehouse?.id
    }
  }

  rowSelectAll({ data }) {
    this.selectedStockIn = _.union(this.selectedStockIn, data)
  }

  rowUnSelectAll() {
    this.selectedStockIn = _.differenceWith(this.selectedStockIn,this.stockIn,_.isEqual)
  }

  async onPage(event: any) {
    this.paging.pageSize = event.rows
    this.paging.pageNumber = event.page
    await this.actGetStockIn(this.getParamApi())
  }

  rowSelect({ data }) {
    this.selectedStockIn.push( data )
  }

  rowUnselect({ originalEvent, data }) {
    originalEvent.originalEvent.stopPropagation()
    this.selectedStockIn = _.filter(
      this.selectedStockIn,
      (stockIn: Request.Model) => stockIn.id !== data.id
    )
  }

  async handleDeleteStockIn() {
    let result : any = []
    result  = await this.actDeleteStockInByIds({ ids: _.map(this.onEventDeleteList, 'id') })
    if(result == null) {
      this.isModalDelete = false
      this.selectedStockIn = []
      this.$toast.add({
        severity: 'success',
        summary: 'Success Message',
        detail: 'Successfully deleted box',
        life: 3000
      })
      this.paging.first = 0
      this.paging.pageNumber = 0
      await this.actGetStockIn({ pageNumber: this.paging.pageNumber , pageSize: this.paging.pageSize })
    }
  }

  async mounted() {
    await this.actGetStockIn({
      pageNumber: this.paging.pageNumber,pageSize: this.paging.pageSize
    })
    this.actWarehouseList()
  }

  async refreshFilter() {
    refreshAllFilter(this.filter)
    await this.actGetStockIn(this.getParamApi())
  }

  async handleFilter(e: any, name: string) {
    this.filter[name] = e
    await this.actGetStockIn(this.getParamApi())
    this.selectedStockIn = []
  }

  debounceSearch = _.debounce(async () => {
    await this.actGetStockIn(this.getParamApi())
  }, 500)

  getIndexPaginate(index: number) {
    return calculateIndex(
      index,
      this.paging.pageNumber,
      this.paging.pageSize
    )
  }

  showModalDelete() {
    this.onEventDeleteList = this.itemsBoxDelete
    this.isModalDelete = true
  }

  handleCancel() {
    this.isModalDelete = false
  }

  get itemsBoxDelete() {
    const [draft, notDraft] = _.partition(this.selectedStockIn, ['status', 'REQUEST_STATUS_DRAFT'])
    return _.size(notDraft) > 0 ? [] : draft
  }

  get isFilter(){
    const params = _.omit(this.getParamApi(), ['pageNumber', 'pageSize'])
    return Object.values(params).some((item) => item)
  }

  async sortData(e: any) {
    const { sortField, sortOrder } = e
    if(sortOrder){
      this.isDescending = sortOrder !== 1
      this.sortByColumn = sortField.replace('_', '')
    }else{
      this.isDescending = null
      this.sortByColumn = ''
    }
    await this.actGetStockIn(this.getParamApi())
  }

  createStockIn() {
    this.$router.push('stock-in/create-receipt')
  }

  handleExportReceipt() {
    _.forEach(this.selectedStockIn, async({ id }) => {
      const result = await this.actGetReceiptLable({ id })
      if(result) {
        exportFileTypePdf(result, `receipt-${id}`)
      }
    })
  }

  get deleteMessage() {
    return getDeleteMessage(this.onEventDeleteList, 'receipt note')
  }
}

export default StockIn
</script>

<style lang="sass" scoped>
.receipt__header
  @include flex-column
  height: calc(100vh - 32px)
  margin-bottom: 24px
  ::v-deep.p-component
    font-family: $font-family-primary
  ::v-deep.pi-calendar:before
    content: url('~/assets/icons/calendar.svg')
  ::v-deep.p-calendar-w-btn
    .p-button
      background: none
      border: none

</style>
