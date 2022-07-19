<template lang="pug">
  .stock__take
    .stock__take__header
      div
        h1.text-heading Stock-take note list
        span.text-subheading {{ totalItem }}
      .header__action
        .btn__filter(:class="{'active': isShowFilter}")
          .btn-toggle(@click="isShowFilter = !isShowFilter")
            .icon.icon-filter(v-if="!isShowFilter")
            .icon.icon-chevron-up.bg-primary(v-else)
            span Filter
          .btn-refresh(@click="handleRefeshFilter")
            .icon.icon-rotate-left.bg-white
        Button.btn.btn-primary(class="drop-option" @click="isShowOptionAddNote = !isShowOptionAddNote")
          .icon.icon-add-items
          span ADD NOTE
          ul.option-note-list(:class="{'active': isShowOptionAddNote}")
            li.option-item
              NuxtLink(to="/stock-take/box/create") Add Box
            li.option-item
              NuxtLink(to="/stock-take/item/create") Add Item
        .btn__filter(class='active' @click="handleExportReceipt")
          .btn.btn-toggle.bg-white
            .icon-download.icon--large.bg-primary
            span.text-900.text-primary EXPORT FILE
    .grid.header__filter.mt-1(:class='{ "active": isShowFilter }')
      div(class="col-12 lg:col-12 xl:col-4")
        .grid
          div(class="col-12 md:col-3")
            FilterTable(
              title="Note ID"
              :value="filter.id"
              placeholder="Enter ID"
              name="id"
              :searchText="true"
              @updateFilter="handleFilter"
              :isShowFilter="isShowFilter")
          div(class="col-12 md:col-9")
            .grid.grid-nogutter
              .col
                  FilterCalendar(
                    title="Created Time From"
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
                    :minDate="filter.dateFrom"
                  )
      div(class="col-12 lg:col-3 xl:col-2")
        FilterTable(
          title="Warehouse"
          :value="filter.warehouse"
          :options="warehouseOption"
          name="warehouse"
          @updateFilter="handleFilter"
          :isDisabled="user.role !== 'admin'"
          :isClear="false")
      div(class="col-12 lg:col-3 xl:col-2")
        FilterTable(
          title="Check Type"
          :value="filter.checkType"
          :options="typeList"
          name="checkType"
          @updateFilter="handleFilter")
      div(class="col-12 lg:col-3 xl:col-2")
        FilterTable(
          title="Result"
          :value="filter.result"
          :options="resultList"
          name="result"
          @updateFilter="handleFilter")
      div(class="col-12 lg:col-3 xl:col-2")
        FilterTable(
          title="Status"
          :value="filter.status"
          :options="statusList"
          name="status"
          @updateFilter="handleFilter")
    .grid.grid-nogutter.flex-1.relative.overflow-hidden.m-h-700
      .col.h-full.absolute.top-0.left-0.right-0.bg-white
        DataTable(
          @sort="sortData($event)"
          :class="{ 'table-wrapper-empty': !stockTakeList || stockTakeList.length <= 0 }"
          :rowClass="rowClass" :value='stockTakeList' responsiveLayout="scroll"
          :selection='selectedStockTake'
          @row-click='rowdbClick'
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
          Column(field='id' header='NOTE ID' headerClass="grid-header-center" sortable sortField="_id")
          Column(header='Created Time' field='createdAt' sortable sortField="_createdAt")
            template(#body='{ data }') {{ data.createdAt | dateTimeHour24 }}
          Column(header='UPDATE time' field='updatedAt' sortable sortField="_updatedAt")
            template(#body='{ data }') {{ data.createdAt | dateTimeHour24 }}
          Column(header='Creator ID' field='creatorId' sortable sortField="_createdBy.staffId")
            template(#body='{ data }')
              .stock__table-name.text-white-active.text-base.text-900.text-overflow-ellipsis.overflow-hidden {{ data.createdBy.staffId }}
          Column(header='PIC ID' field='picId' sortable sortField="_assignee.staffId")
            template(#body='{ data }')
              .stock__table-name.text-white-active.text-base.text-900.text-overflow-ellipsis.overflow-hidden(
                v-if="data.assignee") {{ data.assignee.staffId }}
              .stock__table-name.text-white-active.text-base.text-900.text-overflow-ellipsis.overflow-hidden(v-else) N/A
          Column(header='Result' sortable field='result' sortField="_resultStatus" headerClass="grid-header-right")
              template(#body='{ data }')
                div.grid-cell-right
                  span.stock-take-result.result-ng(v-if="data.finalResultStatus === 'NG'") NG
                  span.stock-take-result.result-ok(v-if="data.finalResultStatus === 'OK'") OK
                  span.stock-take-result.result-waiting(v-if="data.finalResultStatus === 'WAITING'") N/A
          Column(header='nOTE' sortable field='note' sortField="_note" headerClass="grid-header-right")
              template(#body='{ data }')
                div.grid-cell-right {{  data.approveNote || data.submitNote || data.note }}
          Column(field='status' sortable header="Status" sortField="_status" headerClass="grid-header-right")
            template(#body='{ data }')
              div.grid-cell-right
                span.table__status.table__status--available(v-if="data.status === 'NEW'") NEW
                span.table__status.table__status--draft(v-if="data.status === 'IN_PROGRESS'") In Progress
                span.table__status.table__status--disable(v-if="data.status === 'CANCELLED'") Cancelled
                span.table__status.table__status--available(v-if="data.status === 'COMPLETED'") Completed
                span.table__status.table__status--draft(v-if="data.status === 'APPROVING'") Approving
                span.table__status.table__status--available(v-if="data.status === 'APPROVED'") Approved
                span.table__status.table__status--draft(v-if="data.status === 'DRAFT'") Draft
          Column(header='CHECK Type' :sortable="true" field='checkType' sortField="_checkType" headerClass="grid-header-right")
            template(#body='{ data }')
                div.grid-cell-right {{ data.checkType }}
          Column(field='action' header="action" :styles="{'width': '2%'}")
            template(#body='{ data }')
              .table__action.grid-cell-center(:class="{'action-disabled': disableButtonDetete(data)}")
                span.action-item(@click.stop="showModalDelete([data])" :class="{'disable-button': selectedStockTakeFilter.length > 0}")
                  .icon.icon-btn-delete
          template(#footer)
            Pagination(
              type="ST note selected"
              :paging="paging"
              :total="total"
              :deleted-list="selectedStockTakeFilter"
              @onDelete="showModalDelete"
              @onPage="onPage"
              title="Cancel"
            )
          template(#empty)
            div.table__empty
              img(:srcset="`${require('~/assets/images/table-empty.png')} 2x`" v-if="!checkIsFilter")
              img(:srcset="`${require('~/assets/images/table-notfound.png')} 2x`" v-else)
              p.empty__text(v-if="!checkIsFilter") List is empty!
              p.notfound__text(v-else) Item not found!
    ConfirmDialogCustom(
      title="Cancel confirm"
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
import {
  PAGINATE_DEFAULT, calculateIndex, StockTakeConstants, exportFileTypePdf,
  getCancelMessage, resetScrollTable, getTotalQuantityLabel
} from '~/utils'
import Pagination from '~/components/common/Pagination.vue'
import ConfirmDialogCustom from '~/components/dialog/ConfirmDialog.vue'
import { Paging } from '~/models/common/Paging'
const nsWarehouseStock = namespace('warehouse/warehouse-list')
const nsStoreStockTake = namespace('stock-take/note-list')
const nsStoreUser = namespace('user-auth/store-user')
const dayjs = require('dayjs')

@Component({
  components: {
    ConfirmDialogCustom,
    Pagination
  }
})
class StockTake extends Vue {
  loadingSubmit: boolean = false
  selectedStockTake: any = []
  isShowFilter: boolean = false
  isShowOptionAddNote: boolean = false
  isModalDelete: boolean = false
  onEventDeleteList: any = []
  sortByColumn: string = ''
  isDescending: boolean | null = null
  statusList = StockTakeConstants.STATUS_STOCK_TAKE_OPTIONS
  resultList = StockTakeConstants.RESULT_STOCK_TAKE_OPTIONS
  typeList = StockTakeConstants.TYPE_STOCK_TAKE_OPTIONS
  paging: Paging.Model = { ...PAGINATE_DEFAULT, first: 0 }
  warehouseOption: any = []
  filter: any = {
    id: null,
    dateFrom: null,
    dateTo: null,
    warehouse: null,
    status: null,
    result: null,
    checkType: null
  }

  @nsWarehouseStock.State
  warehouseList!: any

  @nsStoreStockTake.State
  stockTakeList!: any

  @nsStoreStockTake.State
  total!: number

  @nsStoreUser.State
  user!: any

  @nsWarehouseStock.Action
  actWarehouseList!: () => Promise<void>

  @nsStoreStockTake.Action
  actGetStockTakeList!: (params: any) => Promise<void>

  @nsStoreStockTake.Action
  actDeleteStockTakeList!: (ids: any) => Promise<any>

  @nsStoreStockTake.Action
  actGetReceiptLable!: (params: any) => Promise<string>

  async handleFilter(e: any, name: string) {
    this.filter[name] = e
    await this.getStockTakeList()
    this.selectedStockTake = []
  }

  // -- [ Getters ] -------------------------------------------------------------
  get selectedStockTakeFilter() {
    const user = this.user?.staffId
    const isCheckDeleteOther = _.find(this.selectedStockTake, function(o) {
      return o.status !== 'IN_PROGRESS' && o.status !== 'NEW'
    })
    const isCheckDeletePIC = _.find(this.selectedStockTake, function(o) {
      return o.status === 'IN_PROGRESS' && o.assignee?.staffId !== user
    })
    if(isCheckDeleteOther || isCheckDeletePIC) {
      return []
    }
    else {
      return _.filter(this.selectedStockTake, (item: any) => {
        return item.status !== 'CANCELLED'
      })
    }
  }

  get checkIsFilter() {
    const params = _.omit(this.getParamApi(), ['pageNumber', 'pageSize'])
    return Object.values(params).some((item) => item)
  }

  // -- [ Functions ] ------------------------------------------------------------
  async getStockTakeList() {
    await this.actGetStockTakeList({
      pageSize: this.paging.pageSize,
      pageNumber: this.paging.pageNumber,
      ...this.getParamApi()
    })
  }

  get classHeaderMuti() {
    return !this.stockTakeList ||
      this.stockTakeList.length <= 0 ? 'checkbox-disable' : ''
  }

  rowdbClick({ data }) {
    const type = data.checkType === 'BOX' ? 'box' : 'item'
    if(data.status === 'APPROVED') {
      this.$router.push(`/stock-take/${type}/${data.id}/approve`)
    }
    else if(data.status === 'APPROVING') {
      if(data.approver && data.approver?.staffId === this.user?.staffId) {
        this.$router.push(`/stock-take/${type}/${data.id}/approve`)
      }
    }
    else if(data.status === 'NEW' || data.status === 'COMPLETED') {
      this.$router.push(`/stock-take/${type}/${data.id}/note-detail`)
    }
    else if(!data.assignee || data.assignee?.staffId === this.user?.staffId) {
      this.$router.push(`/stock-take/${type}/${data.id}/note-detail`)
    }
    else {
      this.$toast.add({
        severity: 'error',
        summary: 'Error Message',
        detail: 'This ST note you do not have the right to handle!',
        life: 3000
      })
    }
  }

  get deleteMessage() {
    return getCancelMessage(this.onEventDeleteList, 'ST note selected')
  }

  handleExportReceipt() {
    if(this.selectedStockTake.length > 0) {
      _.forEach(this.selectedStockTake, async ({ id }) => {
        const result = await this.actGetReceiptLable({ id })
        if (result) {
          exportFileTypePdf(result, `stock-take-${id}`)
          this.selectedStockTake = []
        }
      })
    } else {
      this.$toast.add({
        severity: 'error',
        summary: 'Error Message',
        detail: 'No records have been selected yet!',
        life: 3000
      })
    }
  }

  onPage(event: any) {
    resetScrollTable()
    this.paging.pageSize = event.rows
    this.paging.pageNumber = event.page
    this.getStockTakeList()
  }

  showModalDelete(data: any) {
    this.onEventDeleteList = data || this.selectedStockTakeFilter
    this.isModalDelete = true
    if(data) {
      this.selectedStockTake = []
    }
  }

  getParamApi() {
    return {
      id: this.filter.id || null,
      from: this.filter.dateFrom
        ? dayjs(new Date(this.filter.dateFrom)).format('YYYY-MM-DD')
        : null,
      to: this.filter.dateTo
        ? dayjs(new Date(this.filter.dateTo)).format('YYYY-MM-DD')
        : null,
      status: this.filter.status?.value,
      checkType: this.filter.checkType?.value,
      warehouseId: this.filter.warehouse?.id,
      resultStatus: this.filter.result?.value,
      sortBy: this.sortByColumn || null,
      desc: this.isDescending
    }
  }

  getIndexPaginate(index: number) {
    return calculateIndex(index, this.paging.pageNumber, this.paging.pageSize)
  }

  rowClass(data: any) {
    return data.status === 'CANCELLED' ? 'row-disable' : ''
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

  async sortData(e: any) {
    resetScrollTable()
    const { sortField, sortOrder } = e
    if (sortOrder) {
      this.isDescending = sortOrder !== 1
      this.sortByColumn = sortField.replace('_', '')
    } else {
      this.isDescending = null
      this.sortByColumn = ''
    }
    await this.getStockTakeList()
  }

  handleCancel() {
    this.isModalDelete = false
  }

  async handleDeleteStock() {
    try {
      this.loadingSubmit = true
      const stockTakeIds = _.map(this.onEventDeleteList, 'id')
      const data = await this.actDeleteStockTakeList(stockTakeIds)
      if (data) {
        this.loadingSubmit = false
        this.isModalDelete = false
        this.$toast.add({
          severity: 'success',
          summary: 'Success Message',
          detail: 'Successfully deleted stock take!',
          life: 3000
        })
        await this.getStockTakeList()
      }
      this.selectedStockTake = []
    } catch (error) {
      this.loadingSubmit = false
    }
  }

  disableButtonDetete(data) {
    return (data.status === 'IN_PROGRESS' && data.assignee?.staffId !== this.user?.staffId)
      || !['IN_PROGRESS', 'NEW'].includes(data.status)
  }

  async handleRefeshFilter() {
    const adminFilter = _.omit(_.cloneDeep(this.filter), 'warehouse')
    for (const items in adminFilter) this.filter[items] = null
    await this.getStockTakeList()
  }

  async mounted() {
    const { role, warehouse } = this.user
    if(role === 'admin') {
      await this.actWarehouseList()
      this.warehouseOption = _.cloneDeep(this.warehouseList)
      this.filter.warehouse = this.warehouseList[0]
    } else {
      this.warehouseOption = [warehouse]
      this.filter.warehouse = warehouse
    }
    this.getStockTakeList()
  }

  get totalItem() {
    return getTotalQuantityLabel(this.total, 'result', '<%= quantity%> found')
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
        border-bottom: 1px solid #dee2e6
        transition: all 0.25s ease
        &:hover
          background-color: $primary
          a
            color: $color-white
        a
          padding: 12px 0
          display: block
          color: $text-color-base
          text-decoration: none
  .stock-take-result
    &.result-ng
      color: #F31818
    &.result-ok
      color: $text-color-status
    &.result-waiting
      color: $primary
</style>
