<template lang="pug">
.report-page-container.flex.flex-column
  .box__header
    div
      h1.text-heading Report list
      span.text-subheading(v-if="reportList") {{ totalReportRecords }} products found
    .header__action
      .header__search
        .icon.icon--left.icon-search
        InputText(type="text" placeholder="Search" v-model="filter.id" v-on:input="validateText")
      .btn__filter
        .btn-toggle(@click="isShowFilter = !isShowFilter")
          .icon(:class="isShowFilter ? 'icon-chevron-up' : 'icon-filter'")
          span Filter
        .btn-refresh(@click="handleRefeshFilter")
          .icon.icon-rotate-left.bg-white
      .btn.btn-primary(@click='addReport')
        .icon.icon-add-items
        span Add Report
      Button.btn.btn-primary(@click="handleExportReceipt")
        span Export File
  .grid.header__filter(:class='{ "active": isShowFilter }')
    .col-12(class='xl:col-2 lg:col-2 md:col-4 sm:col-12')
        FilterTable(
          title="Seller email"
          placeholder="Search"
          :value="filter.sellerEmail"
          :searchText="true"
          name="sellerEmail"
          @updateFilter="handleFilterReport"
        )
    .col-12(class='xl:col-2 lg:col-2 md:col-4 sm:col-12')
      FilterTable(
        title="Report ID"
        :value="filter.id"
        placeholder="Enter code"
        name="id"
        :searchText="true"
        @updateFilter="handleFilterReport"
        :isShowFilter="isShowFilter"
      )
    .col-12(class='xl:col-2 lg:col-2 md:col-4 sm:col-12')
      FilterCalendar(
        title="From"
        :value="filter.dateFrom"
        name="dateFrom"
        inputClass="border-0"
        dateFormat="dd-mm-yy"
        :showIcon="true"
        @updateFilter="handleFilterReport"
      )
    .col-12(class='xl:col-2 lg:col-2 md:col-4 sm:col-12')
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
    .col-12(class='xl:col-2 lg:col-2 md:col-4 sm:col-12')
      FilterTable(
        title="Box Code"
        :value="filter.barCode"
        placeholder="Enter code"
        name="barCode"
        :searchText="true"
        @updateFilter="handleFilterReport"
      )
    .col-12(class='xl:col-2 lg:col-2 md:col-4 sm:col-12')
      FilterTable(title="Status" :value="filter.status" :options="statusList" name="status" @updateFilter="handleFilter")
  DataTable.relative.overflow-hidden.m-h-700(:value="data" responsiveLayout="scroll"
      :selection="selectedReportes" :rows="20" :scrollable="false"
      :rowClass="rowClass" @sort="sortData($event)"
      @row-select-all="rowSelectAll"
      @row-unselect-all="rowUnSelectAll"
      @row-select="rowSelect"
      @row-unselect="rowUnselect"
      groupRowsBy="id"
      rowGroupMode="rowspan"
      showGridlines
      @row-dblclick="rowClick"
      )
      Column(selectionMode="multiple" :styles="{width: '3rem'}")
      Column(field="id" header="Report ID"  bodyClass="font-semibold"  className="text-center" headerClass="grid-header-center" sortField="_id")
          template(#body="slotProps")
            span {{slotProps.data.id}}
      Column(field="createdAt" header="CREATE TIME" :sortable="true"  sortField="_createdAt")
        template(#body='{ data }')
          span {{ data.createdAt | dateTimeHour24 }}
      Column(field="boxNote.box.id" header="BOX CODE" bodyClass="font-semibold")
      Column(field="boxNote.box.request.seller.email" :sortable="true" header="SELLER EMAIL" className="w-3" sortField="_sellerEmail")
      Column(field="boxNote.stockTakeId" header="stock take note id" className="uppercase")
      Column(field="boxNote.note" header="note" className="uppercase" bodyClass="font-semibold" )
      Column(field="createId" header="creator id" className="uppercase" bodyClass="font-semibold" )
      Column(field="id" header="STATUS"  className="text-right")
        template(#body='{ data }')
              span.border-round.py-2.px-3.uppercase.font-bold.font-sm(
                :class="checkStatus(data.status)")
                | {{ data.status | reportStatus }}
      Column( field="id" :exportable="false" header="ACTION" className="text-center")
        template(#body="{data}")
          .table__action(:class="{'action-disabled': checkDisabledAction(data)}" style= 'justify-content: center')
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
          template(#action)
            Button.btn.btn-primary(@click='createStockTake' style="height: 34px") Create stock-take note
      template(#empty)
        div.flex.align-items-center.justify-content-center.flex-column
          img(:srcset="`${require('~/assets/images/table-empty.png')} 2x`" v-if="!isFilter")
          img(:srcset="`${require('~/assets/images/table-notfound.png')} 2x`" v-else)
          p.text-900.font-bold.mt-3(v-if="!isFilter") List is empty!, Click
            span.text-primary.underline.cursor-pointer(@click='addReport') &nbsp;here
            span &nbsp;to add item.
          p.text-900.font-bold.mt-3(v-else) Item not found!
  Dialog.report-detail(:visible.sync='isShowModalDetail' :modal='true' :contentStyle='{"background-color": "#E8EAEF;", "width": "50vw", "padding-bottom":"5px"}' @hide='hideModalDetail()')
    ReportDetail(@closeModal="hideModalDetail" :reportDetail="reportDetail" @createStockTakeFromDatail='createStockTakeFromDatail')
  Dialog(:visible.sync='showModal' :modal='true' :contentStyle='{"background-color": "#E8EAEF;", "width": "80vw", "padding-bottom":"5px"}' @hide='hideDialog()')
    template(#header)
      h1.text-heading Report detail
    BoxDataTable(@selectBox='selectBox($event)' :box='boxShow' v-if='!isConfirm')
    .confirm.grid(v-if='isConfirm')
      .col-12
        DataTable.w-full.table__sort-icon.h-full(:value="boxShow" responsiveLayout="scroll")
          Column(field="id" header="box code" className="uppercase")
          Column(field="sellerEmail" header="seller email" className="uppercase")
          Column(field="note" header="note" className="uppercase" :styles="{width: '50%'}")
            template(#body="{ data }")
              InputText.w-full(v-model='data.note' autofocus)
          Column(header="action" className="text-center" headerClass="grid-header-center")
            template(#body="{data}")
              .table__action(style='justify-content: center')
                span.action-item(@click="removeBox(data.id)")
                  .icon.icon-btn-delete
    template(#footer)
      Button.p-button-secondary(label="Close" icon="pi pi-times" @click="closeDialog()")
      Button.p-button-primary(label="Back" icon="pi pi-arrow-left" @click="isConfirm = false;" v-if='isConfirm')
      Button.p-button-success(label="Save" icon="pi pi-check" @click="saveReport()" v-if='isConfirm')
      Button.p-button-success(label="Save" icon="pi pi-check" @click="saveReport()" v-if='isConfirm && isUpdate')
      Button.p-button-success(label="Apply" icon="pi pi-check" :disabled='disabledApply'  @click="applyBox()" v-if='!isConfirm')
  ConfirmDialogCustom(
    title="Confirm delete"
    image="confirm-delete"
    :isShow="isModalDelete"
    :onOk="handleDeleteReport"
    :onCancel="handleCancel"
    :loading="loadingSubmit"
  )
    template(v-slot:message)
      p {{ deleteMessage }}
</template>

<script lang="ts">
import { Component, namespace, Vue, Watch } from 'nuxt-property-decorator'
import ConfirmDialogCustom from '~/components/dialog/ConfirmDialog.vue'
import ReportDetail from '~/components/report/ReportDetail.vue'
import Pagination from '~/components/common/Pagination.vue'
import { Paging } from '~/models/common/Paging'
import { exportFileTypePdf, getDeleteMessage, PAGINATE_DEFAULT, resetScrollTable } from '~/utils'
import { REPORT_STATUS } from '~/utils/constants/report'
import BoxDataTable from '~/components/box/BoxDataTable.vue'
const nsStoreReport = namespace('report/report-list')
const nsStoreReportDetail = namespace('report/report-detail')
const nsStoreWarehouse = namespace('warehouse/warehouse-list')
const dayjs = require('dayjs')

@Component({
  components: {
    ConfirmDialogCustom,
    Pagination,
    BoxDataTable,
    ReportDetail
  }
})
class ReportList extends Vue {
  selectedReportes: any[] = []
  isModalDelete: boolean = false
  loadingSubmit: boolean = false
  onEventDeleteList: any = []
  isShowFilter = false
  paging: Paging.Model = { ...PAGINATE_DEFAULT, first: 0 }
  sortByColumn: string = ''
  isDescending: boolean | null = null
  reportCodeDelete: string = ''
  showModal = false
  isShowModalDetail: boolean = false
  disabledApply = true
  boxSelected: any[] = []
  boxShow: any[] = []
  isUpdate = false
  statusList: any = [
    { name: 'New', value: REPORT_STATUS.NEW },
    { name: 'Solved', value: REPORT_STATUS.SOLVED }
  ]

  isConfirm = false
  filter: any = {
    sellerEmail: '',
    boxCode: '',
    dateFrom: null,
    dateTo: null,
    status: ''
  }

  data: any[] = []

  @nsStoreReport.State
  reportList!: any[]

  @nsStoreReport.State
  reportCreate!: any[]

  @nsStoreReport.State
  listBoxTakeNote!: any[]

  @nsStoreReport.State
  totalReportRecords!: number

  @nsStoreWarehouse.State
  warehouseList!: any

  @nsStoreReportDetail.State
  reportDetail!: any

  @nsStoreReport.Action
  actGetReportList!: (params: any) => Promise<void>

  @nsStoreWarehouse.Action
  actWarehouseList!: () => Promise<void>

  @nsStoreReport.Action
  actDeleteReportById!: (params: { ids: string[] }) => Promise<any>

  @nsStoreReport.Mutation
  setListBoxTakeNote!: (data: any) => Promise<any>

  @nsStoreReport.Action
  actAddTransferReport!: (params: { ids: string[] }) => Promise<any>

  @nsStoreReport.Action
  actCreateReport!: (data: any) => Promise<any>

  @nsStoreReportDetail.Action
  actGetReportDetail!: (id: any) => Promise<any>

  @nsStoreReportDetail.Action
  actGetReceiptLable!: (id: any) => Promise<any>

  async mounted() {
    await this.actGetReportList({ pageNumber: this.paging.pageNumber , pageSize: this.paging.pageSize })
  }

  // -- [ Getters ] -------------------------------------------------------------
  get isFilter() {
    const params = _.omit(this.getParamAPi(), ['pageNumber', 'pageSize'])
    return Object.values(params).some((item) => item)
  }

  get selectedReportFilter() {
    return _.filter(this.selectedReportes, ({ status }) => {
      return status !== 'BOX_STATUS_DISABLE' && status !== 'BOX_STATUS_OUTGOING'
    })
  }

  get deleteMessage() {
    return getDeleteMessage(this.onEventDeleteList, 'report')
  }

  // -- [ Watch ] -----------------------------------------------------------

  @Watch('reportList')
  changeReportList(){
    this.data = []
    this.reportList.forEach(report => {
      report.boxNote.forEach(boxNote => {
        this.data.push({
          id: report.id,
          boxNote,
          createdAt: report.createdAt,
          createId: report.createdBy.staffId,
          status:'REPORT_NEW'
        })
      })
    })
  }

  // -- [ Functions ] ------------------------------------------------------------
  getParamAPi() {
    return {
      pageNumber: this.paging.pageNumber, pageSize: this.paging.pageSize,
      'sellerEmail': this.filter.sellerEmail || null,
      'id': this.filter.id || null,
      'warehouseId': this.filter.warehouse?.id,
      'location': this.filter.location || null,
      'from': this.filter.dateFrom ? dayjs(new Date(this.filter.dateFrom)).format('YYYY-MM-DD') : null,
      'to': this.filter.dateTo ? dayjs(new Date(this.filter.dateTo)).format('YYYY-MM-DD') : null,
      'sortBy': this.sortByColumn || null,
      'desc': this.isDescending
    }
  }

  async handleFilterReport(e: any, name: string) {
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

  async handleDeleteReport() {
    const ids = _.map(this.onEventDeleteList, 'id')
    const result = await this.actDeleteReportById({ ids })
    if (result) {
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
      await this.actGetReportList(this.getParamAPi())
    }
  }

  handleCancel() {
    this.isModalDelete = false
  }

  showModalDelete(data?: any) {
    this.onEventDeleteList = data || this.selectedReportFilter
    this.isModalDelete = true
  }

  rowClass({ boxNote }) {
    if(boxNote.status === REPORT_STATUS.NEW) {
      return ''
    } else {
      return 'row-disable'
    }
  }

  validateText = _.debounce(this.handleFilter, 500)

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
    await this.actGetReportList(this.getParamAPi())
  }

  handleEditReport(id: any) {
    this.showModal = true
    this.isConfirm = true
    this.isUpdate = true
    this.boxShow = this.reportList.find( element=> {
      return element.id===id
    }).boxNote.map(element => {
      return {
        id : element.box.id,
        note:element.note,
        sellerEmail: element.box.request.seller.email
      }
    })
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
    this.selectedReportes = []
  }

  rowSelect({ data }) {
    this.selectedReportes.push(data)
  }

  rowUnselect({ originalEvent, data }) {
    originalEvent.originalEvent.stopPropagation()
    this.selectedReportes = _.filter(this.selectedReportes, (report: any) => report.id !== data.id)
  }

  addReport() {
    this.showModal = true
  }

  selectBox(event) {
    this.boxSelected = _.cloneDeep(event)
    if (this.boxSelected.length > 0) {
      this.disabledApply = false
    } else {
      this.disabledApply = true
    }
  }

  hideDialog() {
    this.showModal = false
  }

  hideModalDetail() {
    this.isShowModalDetail = false
  }

  applyBox() {
    this.boxShow = this.boxSelected.map((element) => {
      return {
        id : element.id,
        note: element.note,
        sellerEmail: element.sellerEmail
      }
    })
    this.isConfirm = true
  }

  async saveReport(){
    const data = this.boxShow.map(element =>{
      return {
        box: {
          id : element.id
        },
        note: element.note
      }
    })
    await this.actCreateReport({ boxNote: data })
    if(this.reportCreate){
      this.$toast.add({
        severity: 'success',
        summary: 'Success Message',
        detail: 'Successfully submitted Report',
        life: 3000
      })
      this.showModal = false
      await this.actGetReportList(this.getParamAPi())
      this.resetData()
    }
  }

  async rowClick({ data }) {
    await this.actGetReportDetail(data.id)
    this.selectedReportes = []
    this.isShowModalDetail = true
  }

  createStockTake() { 
    if (this.selectedReportes.length > 0) {
      this.setListBoxTakeNote(this.selectedReportes)
      this.$router.push('/stock-take/box/create')
    }
  }

  removeBox(id){
    this.boxShow = _.filter(this.boxShow, (box: any) => box.id !== id)
  }

  closeDialog(){
    this.showModal = false
    this.resetData()
  }

  resetData(){
    this.boxShow = []
    this.boxSelected = []
    this.isConfirm = false
  }
  
  checkDisabledAction(data){
    return !data
  }

  createStockTakeFromDatail(data) {
    const listReport = [{
      ...this.reportDetail,
      boxNote: data
    }]
    const dataReport:any = []
    listReport.forEach(report => {
      report.boxNote.forEach(boxNote => {
        dataReport.push({
          id: report.id,
          boxNote,
          createdAt: report.createdAt,
          createId: report.createdBy.staffId
        })
      })
    })
    this.setListBoxTakeNote(dataReport)
    this.$router.push('/stock-take/box/create')
  }
  
  checkStatus(status){
    switch(status){
    case REPORT_STATUS.NEW:{
      return 'text-green-400 bg-green-100 '
    }
    case REPORT_STATUS.SOLVED:{
      return 'text-primary bg-blue-100 '
    }
    case REPORT_STATUS.CANCELED:{
      return 'text-gray-400 bg-gray-100 '
    }
    }
  }

  handleExportReceipt() {
    if(this.selectedReportes.length > 0) {
      _.forEach(this.selectedReportes, async ({ id }) => {
        const result = await this.actGetReceiptLable({ id })
        if (result) {
          exportFileTypePdf(result, `report-${id}`)
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
}
export default ReportList
</script>

<style lang="sass" scoped>
.header__filter
  ::v-deep.p-calendar-w-btn
    .p-button
      background: none !important
      border: none !important
  ::v-deep.pi-calendar:before
    content: url('~/assets/icons/calendar.svg')
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
::v-deep.report-detail
  .p-dialog
    overflow: hidden
  .p-dialog-header
    display: none
  .report-heading
    .report-title
      display: flex
      flex-direction: column
      align-items: center
    .report-title h3
      margin: 0
      font-size: 20px
  .report-status
    position: absolute
    left: 10px
  .report-close
    cursor: pointer
    position: absolute
    right: 10px
    &:hover
      i
        color: red !important
    i
      transition: 0.25s all ease
      font-size: 1.2rem
  .info-box
    .info-box-item
      display: flex
      .box-code
        flex: 1
      .box-note
        flex: 1
      .box-note-id
        flex: 1
      .info-item
        margin-top: 6px
      .info-content
        margin-left: 4px
  .p-dialog-footer
    display: flex
    justify-content: center
  .main-info
    margin: 24px 0
    .info-item
      color: $text-color-base
      margin-top: 10px
      font-size: 14px
      font-weight: 400
    .info-content
      margin-left: 6px
::v-deep.confirm
  .p-datatable-table
    .p-datatable-tbody
      & > tr
        height: 3.5rem !important
</style>
