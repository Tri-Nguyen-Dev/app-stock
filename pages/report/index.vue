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
      Button.btn.btn-primary(@click='createStockTake') Create stock-take note
  .grid.header__filter(:class='{ "active": true }')
    .col-12(class='xl:col-3 lg:col-3 md:col-4 sm:col-12')
        FilterTable(
          title="Seller email"
          placeholder="Search"
          :value="filter.sellerEmail"
          :searchText="true"
          name="sellerEmail"
          @updateFilter="handleFilter"
        )
    .col-12(class='xl:col-3 lg:col-3 md:col-4 sm:col-12')
      FilterTable(
        title="Report Code"
        :value="filter.barCode"
        placeholder="Enter code"
        name="barCode"
        :searchText="true"
        @updateFilter="handleFilterReport"
        :isShowFilter="isShowFilter"
      )
    .col-12(class='xl:col-3 lg:col-3 md:col-4 sm:col-12')
      FilterCalendar(
        title="From"
        :value="filter.dateFrom"
        name="dateFrom"
        inputClass="border-0"
        dateFormat="dd-mm-yy"
        :showIcon="true"
        @updateFilter="handleFilterReport"
      )
    .col-12(class='xl:col-3 lg:col-3 md:col-4 sm:col-12')
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
  .grid.header__filter(:class='{ "active": isShowFilter }')
    .col-12(class='xl:col-3 lg:col-3 md:col-4 sm:col-12')
      FilterTable(
        title="Box Code"
        :value="filter.barCode"
        placeholder="Enter code"
        name="barCode"
        :searchText="true"
        @updateFilter="handleFilterReport"
        :isShowFilter="isShowFilter"
      )
    .col-12(class='xl:col-3 lg:col-3 md:col-4 sm:col-12')
      FilterTable(title="Status" :value="filter.status" :options="statusList" name="status" @updateFilter="handleFilter")
  DataTable(:value="data" responsiveLayout="scroll"
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
      Column(selectionMode="multiple" :styles="{width: '3rem'}" :exportable="false")
      Column(field="id" header="ID"  bodyClass="font-semibold"  className="text-center" headerClass="grid-header-center" sortField="_id")
          template(#body="slotProps")
            span {{slotProps.data.id}}
      Column(field="createdAt" header="CREATE TIME" :sortable="true"  sortField="_createdAt")
        template(#body='{ data }')
          span {{ data.createdAt | dateTimeHour24 }}
      Column(field="boxNote.id" header="BOX CODE" :sortable="true" bodyClass="font-semibold" sortField="_id")
      Column(field="boxNote.sellerEmail" header="SELLER EMAIL" :sortable="true" className="w-3" sortField="_request.seller.email")
      Column(field="boxNote.id" header="stock take note id" className="uppercase")
      Column(field="boxNote.note" header="note" className="uppercase" bodyClass="font-semibold" )
      Column(field="createId" header="create id" className="uppercase" bodyClass="font-semibold" )
      Column(field="status" header="STATUS" :sortable="true"  sortField="_status" className="text-center")
        template(#body='{ data }')
              span.border-round.py-2.px-3.uppercase.font-bold.font-sm(
                :class=" data.status === 'REPORT_RESOLVED' ? 'text-green-400 bg-green-100 ' : 'text-primary bg-blue-100' ")
                | {{ data.status | reportStatus }}
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
  Dialog.report-detail(:visible.sync='isShowModalDetail' :modal='true' :contentStyle='{"background-color": "#E8EAEF;", "width": "60vw", "padding-bottom":"5px"}' @hide='hideModalDetail()')
    ReportDetail(@closeModal="hideModalDetail" :reportDetail="reportDetail")
    template(#footer)
      Button.btn.btn-primary.h-3rem(@click='createStockTake') Create stock-take note
  Dialog(:visible.sync='showModal' :modal='true' :contentStyle='{"background-color": "#E8EAEF;", "width": "80vw", "padding-bottom":"5px"}' @hide='hideDialog()')
    template(#header)
      h1.text-heading Select Box
    BoxDataTable(@selectBox='selectBox($event)' :box='boxShow' v-if='!isConfirm')
    .confirm.grid(v-if='isConfirm')
      .col-12.text-center
        h3 Report detail
      .col-12
        DataTable.w-full.table__sort-icon.h-full(:value="boxShow" responsiveLayout="scroll")
          Column(field="id" header="box code" className="uppercase")
          Column(field="sellerEmail" header="seller email" className="uppercase")
          Column(field="note" header="note" className="uppercase")
            template(#body="{ data }")
              InputText(v-model='data.note' autofocus)
          Column(header="action" className="uppercase")
    template(#footer)
      Button.p-button-secondary(label="Close" icon="pi pi-times" @click="showModal = false;disabledApply = true")
      Button.p-button-primary(label="Back" icon="pi pi-arrow-left" @click="isConfirm = false;" v-if='isConfirm')
      Button.p-button-success(label="Save" icon="pi pi-check" @click="saveReport()" v-if='isConfirm')
      Button.p-button-success(label="Apply" icon="pi pi-check" :disabled='disabledApply'  @click="applyBox()" v-if='!isConfirm')
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
import ConfirmDialogCustom from '~/components/dialog/ConfirmDialog.vue'
import ReportDetail from '~/components/report/ReportDetail.vue'
import Pagination from '~/components/common/Pagination.vue'
import { Paging } from '~/models/common/Paging'
import { getDeleteMessage, PAGINATE_DEFAULT, resetScrollTable } from '~/utils'
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
  isDescending: boolean|null = null
  reportCodeDelete: string = ''
  showModal = false
  isShowModalDetail: boolean = false
  disabledApply = true
  boxSelected: any[] = []
  boxShow : any[] = []
  statusList: any = [
    { name: 'new', value: REPORT_STATUS.NEW },
    { name: 'In progress', value: REPORT_STATUS.IN_PROGRESS }
  ]

  isConfirm = false
  filter: any = {
    sellerEmail:  '',
    boxCode: '',
    dateFrom: null,
    dateTo: null,
    status:''
  }

  data: any[] = []
  @nsStoreReport.State
  reportList!: any[]

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
  actDeleteReportById!: (params: {ids: string[]}) => Promise<any>

  @nsStoreReport.Action
  setListBoxTakeNote!: (data: any) => Promise<any>

  @nsStoreReport.Action
  actAddTransferReport!: (params: {ids: string[]}) => Promise<any>

  @nsStoreReportDetail.Action
  actGetReportDetail !: (id: any) => Promise<any>

  async mounted() {
    await this.actGetReportList({ pageNumber: this.paging.pageNumber , pageSize: this.paging.pageSize })
    this.reportList.forEach(report => {
      report.boxNote.forEach(box => {
        this.data.push({
          id: report.id,
          boxNote: box,
          createdAt: report.createdAt,
          createId: report.createdBy.id,
          status:'REPORT_NEW'
        })
      })
    })
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
    } else {
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
    this.selectedReportes = _.filter(this.selectedReportes, (report: any) => report.id !== data.id)
  }

  routeLinkAddReport() {
    this.showModal = true
  }

  selectBox(event){
    this.boxSelected = _.cloneDeep(event)
    if(this.boxSelected.length>0){
      this.disabledApply = false
    } else {
      this.disabledApply = true
    }
  }

  hideDialog(){
    this.showModal = false
  }

  hideModalDetail() {
    this.isShowModalDetail = false
  }

  async showModalDetail(id: any) {
    this.isShowModalDetail = true
    await this.actGetReportDetail(id)
  }
  
  applyBox(){
    this.boxShow = this.boxSelected.map(element=>{
      return {
        id : element.id,
        note:'',
        sellerEmail: element.sellerEmail
      }
    })
    this.isConfirm = true
  }

  saveReport(){
    this.showModal = false
  }

  rowClick({ data }) {
    this.showModalDetail(data.id)
  }

  createStockTake() {
    if(this.selectedReportes.length > 0) {
      this.setListBoxTakeNote(this.selectedReportes)
      this.$router.push('/stock-take/box/create')
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
    display: flex
    justify-content: space-between
    align-items: center
    .report-title
      display: flex
      flex-direction: column
      align-items: center
    .report-title h3
      margin: 0
      font-size: 20px
    .report-close
      cursor: pointer
      &:hover
        i
          color: red !important
      i
        transition: 0.25s all ease
        font-size: 1.2rem
  .p-dialog-footer
    display: flex
    justify-content: center
  .main-info
    margin: 24px 0
    display: flex
    .info-creator
      width: 50%
    .info-seller
      width: 50%
    .info-item
      color: $text-color-base
      margin-top: 10px
      font-size: 14px
      font-weight: 400
    .info-content
      margin-left: 6px
  .box-code
    display: flex
    gap: 0 6px
::v-deep.confirm
  .p-datatable-table
    .p-datatable-tbody
      & > tr
        height: 3.5rem !important
</style>
