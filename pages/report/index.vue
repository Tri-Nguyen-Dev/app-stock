<template lang="pug">
.box-page-container.flex.flex-column
  .box__header
    div
      h1.text-heading Report list
      span.text-subheading(v-if="reportList") {{ totalReportRecords }} products found
    .header__action
      .header__search
        .icon.icon--left.icon-search
        InputText(type="text" placeholder="Search" v-model="filter.sellerEmail" v-on:input="validateText")
      .btn__filter
        .btn-toggle(@click="isShowFilter = !isShowFilter")
          .icon(:class="isShowFilter ? 'icon-chevron-up' : 'icon-filter'")
          span Filter
        .btn-refresh(@click="handleRefeshFilter")
          .icon.icon-rotate-left.bg-white
      .btn.btn-primary(@click='routeLinkAddReport')
        .icon.icon-add-items
        span Add Report
  .grid.header__filter(:class='{ "active": isShowFilter }')
    div(class="md:col-12 lg:col-8 col-12")
      .grid
        div(class="col-12 md:col-4")
          FilterTable(
            title="Report Code"
            :value="filter.barCode"
            placeholder="Enter code"
            name="barCode"
            :searchText="true"
            @updateFilter="handleFilterReport"
            :isShowFilter="isShowFilter"
          )
        div(class="col-12 md:col-4")
          FilterTable(
            title="Box Code"
            :value="filter.barCode"
            placeholder="Enter code"
            name="barCode"
            :searchText="true"
            @updateFilter="handleFilterReport"
            :isShowFilter="isShowFilter"
          )
    div(class="col-12 lg:col-4")
      .grid
        .col
          FilterCalendar(
            title="From"
            :value="filter.dateFrom"
            name="dateFrom"
            inputClass="border-0"
            dateFormat="dd-mm-yy"
            :showIcon="true"
            @updateFilter="handleFilterReport"
          )
        .col
          FilterCalendar(
            title="To"
            border="right"
            :value="filter.dateTo"
            name="dateTo"
            inputClass="border-0"
            dateFormat="dd-mm-yy"
            :showIcon="true"
            @updateFilter="handleFilterReport"
          )
        div(class='col-12 md:col-4 xl:col-3')
          FilterTable(
            title="Seller email"
            placeholder="Search"
            :value="filter.sellerEmail"
            :searchText="true"
            name="sellerEmail"
            @updateFilter="handleFilter"
          )
        div(class='col-12 md:col-4 xl:col-3')
          FilterTable(title="Status" :value="filter.status" :options="statusList" name="status" @updateFilter="handleFilter")
  .grid.grid-nogutter.flex-1.relative.overflow-hidden.m-h-700
    .col.h-full.absolute.top-0.left-0.right-0.bg-white
      DataTable.w-full.table__sort-icon.h-full(v-if="reportList" :value="reportList" responsiveLayout="scroll"
      :selection="selectedReportes" removableSort dataKey="id" :resizableColumns="true" :rows="20" :scrollable="false"
      :rowClass="rowClass" @sort="sortData($event)"
      :class="{ 'table-wrapper-empty': !reportList || reportList.length <= 0 }" @row-select-all="rowSelectAll"
      @row-unselect-all="rowUnSelectAll" @row-select="rowSelect" @row-unselect="rowUnselect")
        Column(selectionMode="multiple" :styles="{width: '3rem'}" :exportable="false" :headerClass="classHeaderMuti")
        Column(field="no" header="NO")
          template(#body="slotProps")
            span.font-semibold {{ (paging.pageNumber) * paging.pageSize + slotProps.index + 1 }}
        Column(field="id" header="ID" :sortable="true" bodyClass="font-semibold" sortField="_id")
        Column(field="createdAt" header="CREATE TIME" :sortable="true" className="text-right" sortField="_createdAt")
          template(#body="{data}") {{ data.createdAt | dateTimeHour24 }}
        Column(field="id" header="BOX CODE" :sortable="true" bodyClass="font-semibold" sortField="_id")
          template(#body="{data}")
            NuxtLink.stock__table-name.text-white-active.text-base.text-900.text-overflow-ellipsis.overflow-hidden(:to="`/report/${data.id}`"
            class="no-underline hover:underline") {{ data.id }}
        Column(field="sellerEmail" header="SELLER EMAIL" :sortable="true" className="w-3" sortField="_request.seller.email")
        Column(field="usedCapacity" header="stock take note id" className="text-right uppercase")
        Column(field="attributes" header="note" className="text-right uppercase" bodyClass="font-semibold" )
        Column(field="TYPE" header="create id" className="text-right uppercase" bodyClass="font-semibold" )
        Column(field="status" header="STATUS" :sortable="true" className="text-right" sortField="_status")
          template(#body="{data}")
            .flex.justify-content-end
              span.table__status.table__status--available(
                v-if="data.status === 'BOX_STATUS_AVAILABLE'"
              ) {{ data.status | reportStatus }}
              span.table__status.table__status--disable(
                v-else-if="data.status === 'BOX_STATUS_DISABLE'"
              ) {{ data.status | reportStatus }}
              span.table__status.table__status--draft(
                v-else-if="data.status === 'BOX_STATUS_DRAFT'"
                ) {{ data.status | reportStatus }}
              span.table__status.table__status--outgoing(v-else) {{ data.status | reportStatus }}
        Column(:exportable="false" header="ACTION" className="text-center")
          template(#body="{data}")
            .table__action(:class="{'action-disabled': data.status === 'BOX_STATUS_DISABLE'}")
              span.action-item(@click="handleEditReport(data.id)")
                .icon.icon-edit-btn
              span.action-item(:class="{'disable-button': selectedReportFilter.length > 0}" @click="showModalDelete([data])")
                .icon.icon-btn-delete
        template(#footer)
          Pagination(
            type="reportes selected"
            :paging="paging"
            :total="totalReportRecords"
            :deleted-list="selectedReportFilter"
            @onDelete="showModalDelete"
            @onPage="onPage")
        template(#empty)
          div.flex.align-items-center.justify-content-center.flex-column
            img(:srcset="`${require('~/assets/images/table-empty.png')} 2x`" v-if="!isFilter")
            img(:srcset="`${require('~/assets/images/table-notfound.png')} 2x`" v-else)
            p.text-900.font-bold.mt-3(v-if="!isFilter") List is empty!, Click
              span.text-primary.underline.cursor-pointer(@click='routeLinkAddReport') &nbsp;here
              span &nbsp;to add item.
            p.text-900.font-bold.mt-3(v-else) Item not found!
    
    Dialog(:visible.sync='showModal', :modal='true' :contentStyle='{"background-color": "#E8EAEF;", "width": "80vw", "padding-bottom":"5px"}' @hide='hideDialog()')
        template(#header)
          h1.text-heading Select Box
        BoxDataTable(@selectBox='selectBox($event)' :box='boxShow')
        template(#footer)
          Button.p-button-secondary(label="Close" icon="pi pi-times" @click="showModal = false;disabledApply = true")
          Button.p-button-primary(label="Apply" icon="pi pi-check" :disabled='disabledApply'  @click="applyBox()")
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
</template>

<script lang="ts">
import { Component, namespace, Vue } from 'nuxt-property-decorator'
import { Report } from '~/models/Report'
import ConfirmDialogCustom from '~/components/dialog/ConfirmDialog.vue'
import Pagination from '~/components/common/Pagination.vue'
import { Paging } from '~/models/common/Paging'
import { getDeleteMessage, PAGINATE_DEFAULT, resetScrollTable } from '~/utils'
import { REPORT_STATUS } from '~/utils/constants/report'
import BoxDataTable from '~/components/box/BoxDataTable.vue'
const nsStoreReport = namespace('report/report-list')
const nsStoreWarehouse = namespace('warehouse/warehouse-list')
const dayjs = require('dayjs')

@Component({
  components: {
    ConfirmDialogCustom,
    Pagination,
    BoxDataTable
  }
})
class ReportList extends Vue {
  selectedReportes: Report.Model[] = []
  isModalDelete: boolean = false
  loadingSubmit: boolean = false
  onEventDeleteList: any = []
  isShowFilter = false
  paging: Paging.Model = { ...PAGINATE_DEFAULT, first: 0 }
  sortByColumn: string = ''
  isDescending: boolean|null = null
  reportCodeDelete: string = ''
  showModal = false
  disabledApply = true
  boxSelected: any[] = []
  statusList: any = [
    { name: 'new', value: REPORT_STATUS.NEW },
    { name: 'In progress', value: REPORT_STATUS.IN_PROGRESS }
  ]

  filter: any = {
    sellerEmail:  '',
    warehouse: null,
    location: '',
    boxCode: '',
    dateFrom: null,
    dateTo: null,
    status:''
  }

  @nsStoreReport.State
  reportList!: Report.Model[]

  @nsStoreReport.State
  totalReportRecords!: number

  @nsStoreWarehouse.State
  warehouseList!: any

  @nsStoreReport.Action
  actGetReportList!: (params: any) => Promise<void>

  @nsStoreWarehouse.Action
  actWarehouseList!: () => Promise<void>

  @nsStoreReport.Action
  actDeleteReportById!: (params: {ids: string[]}) => Promise<any>

  @nsStoreReport.Action
  actAddTransferReport!: (params: {ids: string[]}) => Promise<any>

  async mounted() {
    // await this.actGetReportList({ pageNumber: this.paging.pageNumber , pageSize: this.paging.pageSize })
  }

  // -- [ Getters ] -------------------------------------------------------------
  get isFilter(){
    const params = _.omit(this.getParamAPi(), ['pageNumber', 'pageSize'])
    return Object.values(params).some((item) => item)
  }

  get selectedReportFilter() {
    return  _.filter(this.selectedReportes, ({ status }) => {
      return status !== 'BOX_STATUS_DISABLE' && status !== 'BOX_STATUS_OUTGOING'
    })
  }

  get deleteMessage() {
    return getDeleteMessage(this.onEventDeleteList, 'report')
  }

  get classHeaderMuti() {
    return !this.reportList ||
      this.reportList.length <= 0
      ? 'checkreport-disable'
      : ''
  }

  // -- [ Functions ] ------------------------------------------------------------
  getParamAPi() {
    return {
      pageNumber: this.paging.pageNumber, pageSize: this.paging.pageSize,
      'sellerEmail': this.filter.sellerEmail || null,
      'barCode': this.filter.barCode || null,
      'warehouseId': this.filter.warehouse?.id,
      'location': this.filter.location || null,
      'from': this.filter.dateFrom ? dayjs(new Date(this.filter.dateFrom)).format('YYYY-MM-DD') : null,
      'to': this.filter.dateTo ? dayjs(new Date(this.filter.dateTo)).format('YYYY-MM-DD') : null,
      'sortBy': this.sortByColumn || null,
      'desc': this.isDescending
    }
  }

  async handleFilterReport(e: any, name: string){
    this.filter[name] = e
    await this.actGetReportList(this.getParamAPi())
    this.selectedReportes = []
  }

  async onPage(event: any) {
    resetScrollTable()
    this.paging.pageSize = event.rows
    this.paging.pageNumber = event.page
    await this.actGetReportList(this.getParamAPi())
  }

  async handleDeleteStock() {
    const ids = _.map(this.onEventDeleteList, 'id')
    const result = await this.actDeleteReportById({ ids })
    if(result) {
      this.isModalDelete = false
      this.selectedReportes = []
      this.$toast.add({
        severity: 'success',
        summary: 'Success Message',
        detail: 'Successfully deleted report',
        life: 3000
      })
      this.paging.first = 0
      this.paging.pageNumber = 0
      await this.actGetReportList({ pageNumber: this.paging.pageNumber , pageSize: this.paging.pageSize })
    }
  }

  handleCancel() {
    this.isModalDelete = false
  }

  showModalDelete(data?: any) {
    this.onEventDeleteList = data || this.selectedReportFilter
    this.isModalDelete = true
  }

  rowClass({ status }) {
    if(status === 'BOX_STATUS_DISABLE' || status === 'BOX_STATUS_OUTGOING') {
      return 'row-disable'
    }
  }

  validateText =  _.debounce(this.handleFilter, 500);

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
    await this.actGetReportList(this.getParamAPi())
  }

  handleEditReport(id: any) {
    this.$router.push({ path: `/report/${id}`, query: { plan: 'edit' } })
  }

  async handleFilter() {
    await this.actGetReportList(this.getParamAPi())
    this.selectedReportes = []
  }

  async handleRefeshFilter() {
    this.filter.warehouse = null
    this.filter.location = ''
    this.filter.sellerEmail = ''
    this.filter.barCode = ''
    this.filter.dateFrom = null
    this.filter.dateTo = null
    await this.actGetReportList(this.getParamAPi())
  }

  rowSelectAll({ data }) {
    this.selectedReportes = _.unionWith(this.selectedReportes, data, _.isEqual)
  }

  rowUnSelectAll() {
    this.selectedReportes = _.differenceWith(this.selectedReportes, this.reportList, _.isEqual)
  }

  rowSelect({ data }) {
    this.selectedReportes.push(data)
  }

  rowUnselect({ originalEvent, data }) {
    originalEvent.originalEvent.stopPropagation()
    this.selectedReportes = _.filter(this.selectedReportes, (report: Report.Model) => report.id !== data.id)
  }

  routeLinkAddReport() {
    this.showModal = true
  }

  selectBox(event){
    this.boxSelected = event
    if(this.boxSelected.length>0){
      this.disabledApply = false
    } else {
      this.disabledApply = true
    }
  }
}
export default ReportList
</script>

<style lang="sass" scoped>
.report-page-container
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
  ::v-deep.text-right
    text-align: right !important
    .p-column-header-content
      justify-content: end !important
  ::v-deep.disable-button
    pointer-events: none
    background-color: $text-color-300
    .icon
      background-color: $text-color-500
.box__header
  flex-direction: column
  flex-wrap: wrap
  margin-bottom: 24px
  @include desktop
    flex-direction: row
    @include flex-center-space-between
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
</style>
