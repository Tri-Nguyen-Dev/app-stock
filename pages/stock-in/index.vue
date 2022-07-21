<template lang="pug">
  .receipt
    .receipt__header
      div
        h1.text-heading Receipt note list
        span.text-subheading {{ total }} receipts found
      .header__action
        .btn__filter(:class="{'active': isShowFilter}")
          .btn-toggle(@click="isShowFilter = !isShowFilter")
            .icon.icon-filter(v-if="!isShowFilter")
            .icon.icon-chevron-up.bg-primary(v-else)
            span Filter
          .btn-refresh(@click="refreshFilter")
            .icon.icon-rotate-left.bg-white
        .btn.btn-primary(@click='createStockIn')
            .icon.icon-add-items.surface-900.bg-white
            span.text-900.text-white.mr-3 Add receipt note
        .btn__filter(class='active' @click="handleExportReceipt")
          .btn.btn-toggle.bg-white
            .icon-download.icon--large.bg-primary
            span.text-900.text-primary Export file
      div.col-12(class="lg:col-6")
        TabView(@tab-click="handleTab($event)")
          TabPanel
            template(#header)
              .icon.icon-truck.mr-2.surface-600
              span Incoming
          TabPanel
            template(#header)
              .icon.icon-horiz.mr-2.surface-600
              span Transferring
    .grid.header__filter(:class='{ "active": isShowFilter }')
      div(class="col-12 lg:col-12 xl:col-6")
        .grid
          div(class="col-12 md:col-4")
            FilterTable(
              title="ID"
              :value="filter.id"
              placeholder="Enter ID"
              name="id" :searchText="true"
              @updateFilter="handleFilter"
              :isShowFilter="isShowFilter")
          div(class="col-12 md:col-8")
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
          title="Seller Email"
          placeholder="Enter Seller Email"
          name="sellerEmail"
          :value="filter.sellerEmail"
          :searchText="true"
          @updateFilter="handleFilter")
      div(class="col-12 lg:col-3 xl:col-2")
        FilterTable(
          title="Creator ID"
          placeholder="Enter ID"
          name="creatorId"
          :value="filter.creatorId"
          :searchText="true"
          @updateFilter="handleFilter")
      div(class="col-12 lg:col-3 xl:col-2")
        FilterTable(title="Status" :value="filter.status" :options="statusRequest" name="status" @updateFilter="handleFilter")
    .grid.grid-nogutter.flex-1.relative.overflow-hidden.m-h-700
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
          Column(header='Created Time' field='data.createdAt' :sortable="true" sortField="_createdAt")
            template(#body='{ data }') {{ data.createdAt | dateTime }}
          Column(header='SELLER NAME' field='sellerName' :sortable="true" sortField="_seller.name")
            template(#body='{ data }') {{ data.sellerName }}
          Column(header='SELLER EMAIL' field='sellerEmail' :sortable="true" sortField="_seller.email")
            template(#body='{ data }') {{ data.sellerEmail }}
          Column(header='CREATOR ID' field='data.creatorId' :sortable="true" sortField="_createdBy.id" className="text-right")
            template(#body='{ data }')
                  span.text-white-active {{ data.creatorId }}
          Column(
          header='CREATOR NAME'
          field='data.creatorName'
          :sortable="true"
          sortField="_createdBy.displayName"
          className="text-right")
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
              type="note selected"
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
import {
  REQUEST_STATUS, refreshAllFilter, calculateIndex, PAGINATE_DEFAULT,
  exportFileTypePdf, getDeleteMessage, resetScrollTable
} from '~/utils'
import Pagination from '~/components/common/Pagination.vue'
import { Paging } from '~/models/common/Paging'
import { User } from '~/models/User'
const nsStoreStockIn = namespace('stock-in/request-list')
const nsStoreExportReceipt = namespace('stock-in/export-receipt')
const nsStoreUser = namespace('user-auth/store-user')
const nsStoreWarehouse = namespace('warehouse/warehouse-list')
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
  activeTab: number = 0
  filter: any = {
    id: null,
    dateFrom: null,
    dateTo: null,
    sellerEmail: null,
    creatorId: null,
    status: null
  }

  warehouseOption: any = []

  @nsStoreStockIn.State
  stockIn!: Request.Model[]

  @nsStoreStockIn.State
  total!: number

  @nsStoreExportReceipt.State
  receiptUrl!: any

  @nsStoreWarehouse.State
  warehouseSelected!: any

  @nsStoreStockIn.Action
  actGetStockIn!: (params: any) => Promise<void>

  @nsStoreStockIn.Action
  actDeleteStockInByIds!: (params: {ids: string[]}) => Promise<any>

  @nsStoreExportReceipt.Action
  actGetReceiptLable!: (params: any) => Promise<string>

  @nsStoreUser.State
  user!: User.Model

  getParamApi() {
    return {
      params: {
        pageNumber: this.paging.pageNumber, pageSize: this.paging.pageSize,
        'id': this.filter.id || null,
        'sellerEmail': this.filter.sellerEmail || null,
        'creatorId': this.filter.creatorId || null ,
        'from': this.filter.dateFrom ? dayjs(new Date(this.filter.dateFrom)).format('YYYY-MM-DD') : null,
        'to': this.filter.dateTo ? dayjs(new Date(this.filter.dateTo)).format('YYYY-MM-DD') : null,
        'sortBy': this.sortByColumn || null,
        'desc': this.isDescending,
        'status': this.filter.status?.value,
        'warehouseId': this.warehouseSelected?.id
      },
      type: this.activeTab
    }
  }

  rowSelectAll({ data }) {
    this.selectedStockIn = _.union(this.selectedStockIn, data)
  }

  rowUnSelectAll() {
    this.selectedStockIn = _.differenceWith(this.selectedStockIn,this.stockIn,_.isEqual)
  }

  async onPage(event: any) {
    resetScrollTable()
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
    if(this.warehouseSelected) {
      await this.actGetStockIn(this.getParamApi())
    }
  }

  async refreshFilter() {
    const adminFilter = _.omit(_.cloneDeep(this.filter), 'warehouse')
    for (const items in adminFilter) this.filter[items] = null
    // refreshAllFilter(this.filter)
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
    const params = _.omit(this.getParamApi(), ['pageNumber', 'pageSize', 'warehouseId'])
    return Object.values(params).some((item) => item)
  }

  async sortData(e: any) {
    resetScrollTable()
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
    if(this.activeTab) {
      this.$router.push('box')
    } else {
      this.$router.push('stock-in/create-receipt')
    }
  }

  handleExportReceipt() {
    _.forEach(this.selectedStockIn, async({ id }) => {
      const result = await this.actGetReceiptLable({ id })
      if(result) {
        exportFileTypePdf(result, `receipt-${ id }`)
      }
    })
  }

  get deleteMessage() {
    return getDeleteMessage(this.onEventDeleteList, 'receipt note')
  }

  async handleTab({ index }: any) {
    this.activeTab = index
    refreshAllFilter(this.filter)
    this.selectedStockIn = []
    await this.actGetStockIn(this.getParamApi())
  }
}

export default StockIn
</script>

<style lang="sass" scoped>
.receipt
  @include flex-column
  min-height: calc(100vh - 32px)
  margin-bottom: 24px
  ::v-deep.p-component
    font-family: $font-family-primary
  ::v-deep.pi-calendar:before
    content: url('~/assets/icons/calendar.svg')
  ::v-deep.p-calendar-w-btn
    .p-button
      background: none
      border: none
  ::v-deep.text-right
    text-align: right !important
    .p-column-header-content
      justify-content: end !important
.receipt__header
  flex-direction: column
  flex-wrap: wrap
  margin-bottom: 16px
  @include desktop
    flex-direction: row
    @include flex-center-space-between
  ::v-deep.p-tabview .p-tabview-nav li:not(.p-highlight):not(.p-disabled)
    &:hover
      .p-tabview-nav-link
        background-color: transparent !important
        color: #000 !important
      .icon
        background-color: var(--primary-color) !important
  ::v-deep.p-tabview .p-tabview-nav li
    .p-tabview-nav-link
      background: var(--bg-body-bas)
      border: none
      box-shadow: none !important
      color: $text-color-700
  ::v-deep.p-tabview .p-tabview-panels
    background: var(--bg-body-bas)
    padding: 1.25rem 0 0 0
    display: none
  ::v-deep.p-highlight .p-tabview-nav-link
    color: #000 !important
    border-bottom: 2px solid #486AE2 !important
    .icon
      background-color: var(--primary-color) !important
.header__action
    margin-top: 12px
    display: flex
    @include flex-column
    flex-wrap:  wrap
    gap: 10px 16px
    @include desktop
      @include flex-center
      flex-direction: row
      margin-top: 0
.btn__filter
  width: 100%
  @include desktop
    width: 166px
</style>
