<template lang="pug">
  .stock
    h1.text-heading Delivery order list
    .stock__header.grid.mt-3
      div.col-12(class="lg:col-6")
        TabView(@tab-click="handleTab($event)")
          TabPanel
            template(#header)
              .icon.icon-truck.mr-2.surface-600
              span New
          TabPanel
            template(#header)
              .icon.icon-horiz.mr-2.surface-600
              span Delivery setting
          TabPanel
            template(#header)
              .icon.icon-check-circle.mr-2.surface-600
              span Delivered
      div.col-12(class="lg:col-6")
        .header__action
          .btn__filter(:class="{'active': isShowFilter}")
            .btn-toggle(@click.stop="isShowFilter = !isShowFilter")
              .icon.icon-filter(v-if="!isShowFilter")
              .icon.icon-chevron-up.bg-primary(v-else)
              span Filter
            .btn-refresh(@click="handleRefreshFilter")
              .icon.icon-rotate-left.bg-white
          .btn.btn-primary(v-if="activeTab === 0" @click="handleAddNew")
            .icon.icon-add-items
            span Add New
          Button.btn.btn-primary.border-0(v-show="activeTab === 1" :disabled='!isSetDelivery' @click="setDelivery")
            span  Set delivery
          Button.btn.btn-primary.border-0(v-show="activeTab ===1" :disabled='!isResetDelivery' @click="setDelivery")
            span  Reset delivery
          .btn__filter(class='active' @click="handleExportReceipt")
            .btn.btn-toggle.bg-white
              .icon-download.icon--large.bg-primary
              span.text-900.text-primary Export file
    .grid.header__filter(:class='{ "active": isShowFilter }')
      div(class='col-12 md:col-4 lg:col-4 xl:col-2')
        FilterTable(title="ID" placeholder="Search" name="id" :value="filter.id" :searchText="true" @updateFilter="handleFilter" :isShowFilter="isShowFilter")
      div(class='col-12 md:col-8 lg:col-8 xl:col-5')
        .grid.grid-nogutter
          .col
            FilterCalendar(
              title="Create time from"
              border="left"
              :value="filter.createTimeFrom"
              name="createTimeFrom"
              inputClass="border-0"
              dateFormat="dd-mm-yy"
              :showIcon="true"
              @updateFilter="handleFilter"
              :maxDate="filter.createTimeTo"
            )
          .col.ml-1
            FilterCalendar(
              title="To"
              border="createTimeTo"
              :value="filter.createTimeTo"
              name="createTimeTo"
              inputClass="border-0"
              dateFormat="dd-mm-yy"
              :showIcon="true"
              @updateFilter="handleFilter"
              :minDate="filter.createTimeFrom"
            )
      div(class='col-12 md:col-8 lg:col-8 xl:col-5')
        .grid.grid-nogutter
          .col
            FilterCalendar(
              title="Due Date From"
              border="left"
              :value="filter.dueDeliveryDateFrom"
              name="dueDeliveryDateFrom"
              inputClass="border-0"
              dateFormat="dd-mm-yy"
              :showIcon="true"
              @updateFilter="handleFilter"
              :maxDate="filter.dueDeliveryDateTo"
            )
          .col.ml-1
            FilterCalendar(
              title="To"
              border="right"
              :value="filter.dueDeliveryDateTo"
              name="dueDeliveryDateTo"
              inputClass="border-0"
              dateFormat="dd-mm-yy"
              :showIcon="true"
              @updateFilter="handleFilter"
              :minDate="filter.dueDeliveryDateFrom"
            )
      div(class='col-12 md:col-4 xl:col-3')
        FilterTable(
          title="Warehouse"
          :value="filter.warehouseId"
          :options="warehouseOption"
          name="warehouseId"
          @updateFilter="handleFilter"
          :isDisabled="user.role !== 'admin'"
          :isClear="false"
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
        FilterTable(
          title="PIC"
          placeholder="Search"
          :value="filter.assigneeId"
          :searchText="true"
          name="assigneeId"
          @updateFilter="handleFilter"
        )
      div(class='col-12 md:col-4 xl:col-3')
        FilterTable(
          title="Status"
          :value="filter.status"
          :options="statusList"
          name="status"
          @updateFilter="handleFilter")
    .stock__table
      DataTable(
        :value='deliveryList'
        @sort="sortData($event)"
        :class="{ 'table-wrapper-empty': !deliveryList || deliveryList.length <= 0 }"
        :rowClass="rowClass"
        responsiveLayout="scroll"
        @row-click='rowdbClick'
        :selection='selectedDelivery'
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
          :exportable="false"
          :headerClass="classHeaderMuti"
        )
        Column(field='no' header='NO' :styles="{'width': '1%'}" )
          template(#body='{ index }')
            span.grid-cell-center.stock__table-no.text-white-active.text-900.font-bold {{ getIndexPaginate(index) }}
        Column(field='id' header='ID' sortable headerClass="grid-header-center")
          template(#body='{ data }')
            .stock__table-name.text-white-active.text-base.text-900.text-overflow-ellipsis.overflow-hidden.font-bold {{ data.id }}
        Column(header='Creator ID' field='creatorId' sortable sortField="_createdBy.staffId")
          template(#body='{ data }')
            .stock__table-name.text-white-active.text-base.text-900.text-overflow-ellipsis.overflow-hidden {{ data.creatorId }}
        Column(header='Create time' field='createTime' sortable  sortField="_createdAt" )
          template(#body='{ data }')
            div {{ data.createTime | dateTimeHour24 }}
        Column(header='Seller email' sortable field='sellerEmail' sortField="_seller.email" )
          template(#body='{ data }')
            div.grid-cell-fix-width {{ data.sellerEmail }}
        Column(header='Receiver Address' sortable field='receiverAddress' sortField="_receiverAddress")
          template(#body='{ data }')
            div.grid-cell-fix-width {{ data.receiverAddress }}
        Column( sortable field='dueDeliveryDate' sortField="_dueDeliveryDate" headerClass="grid-header-right")
          template(#header)
            div
              div.text-end Due
              div Delivery Date
          template(#body='{ data }')
            div.grid-cell-right {{ data.dueDeliveryDate | dateTimeHour24 }}
        Column( sortable field='estimatedDeliveryTime' sortField="_estimatedDeliveryTime" headerClass="grid-header-right")
          template(#header)
            div
              div.text-end Estimated
              div Delivery Time
          template(#body='{ data }')
            div.grid-cell-right {{ data.estimatedDeliveryTime | estimateDayConvert }} {{(data.estimatedDeliveryTime/fullDayTime) < 2 ? 'day' : 'days'}}
        Column( sortable field='lastedUpdateTime' sortField="_updatedAt" headerClass="grid-header-right")
          template(#header)
            div
              div.text-end Latest
              div update time
          template(#body='{ data }')
            div.grid-cell-right {{ data.lastedUpdateTime | dateTimeHour24 }}
        Column(header='Warehouse' sortable field='warehouseName' sortField="_warehouse.name" headerClass="grid-header-right")
          template(#body='{ data }')
            .flex.align-items-center.cursor-pointer.justify-content-end
              span.text-primary.font-bold.font-sm.text-white-active {{ data.warehouseName }}
              .icon.icon-arrow-up-right.bg-primary.bg-white-active
        Column(header='PIC' sortable field='assigneeId' sortField="_assignee.displayName" headerClass="grid-header-right")
          template(#body='{ data }')
            div.grid-cell-right {{ data.pic }} {{data.pic === null ? 'N/A' : ''}}
        Column(v-if="activeTab == 1"
          header='Driver' sortable field='driverPhone' sortField="_driverPhone" headerClass="grid-header-right")
          template(#body='{ data }')
            div.grid-cell-right {{ data.driverPhone === null ? 'N/A' : data.driverPhone }}
        Column(v-if="activeTab == 2"
          header='Receipt Date' sortable field='receiptDate' sortField="_receiptDate" headerClass="grid-header-right")
          template(#body='{ data }')
        Column(field='status' header="Status" sortable sortField="_status" headerClass="grid-header-right")
          template(#body='{ data }')
            div.grid-cell-right
              span.table__status.table__status--available {{ nameStatus(data.status) }}
        template(#footer)
          Pagination(
            title="Cancel"
            type="D/O selected"
            :paging="paging"
            :total="total"
            @onDelete="showModalDelete"
            :deleted-list="selectedDeliveryFilter"
            @onPage="onPage")
        template(#empty)
          div.table__empty
            img(:srcset="`${require('~/assets/images/table-empty.png')} 2x`" v-if="!checkIsFilter")
            img(:srcset="`${require('~/assets/images/table-notfound.png')} 2x`" v-else)
            p.text-900.font-bold.mt-3 Item not found!
    ConfirmDialogCustom(
      title="Cancel Confirm"
      image="confirm-delete"
      :isShow="isModalDelete"
      :onOk="handleDeleteDelivery"
      :onCancel="handleCancel"
      :loading="loadingSubmit"
    )
      template(v-slot:message)
        p {{ deleteMessage }}

    Toast
    DriverDialog(
      :isModalDriverList='isModalDriverList',
      @hideDialog='hideDialog($event)',
      @assigned='assignedDriver($event)'
      :orderIds='orderIds'
    )
</template>
<script lang="ts">
import { Component, Vue, namespace } from 'nuxt-property-decorator'
import ConfirmDialogCustom from '~/components/dialog/ConfirmDialog.vue'
import { DeliveryList } from '~/models/Delivery'

import {
  LIMIT_PAGE_OPTIONS,
  PAGINATE_DEFAULT,
  calculateIndex,
  DeliveryConstants,
  getCancelMessage,
  exportFileTypePdf,
  resetScrollTable
} from '~/utils'
import { Paging } from '~/models/common/Paging'
import { User } from '~/models/User'
import Pagination from '~/components/common/Pagination.vue'
import DriverDialog from '~/components/stock-out/driver/DriverDialog.vue'
import { ORDER_STATUS } from '~/utils/constants/stock-out'
const nsStoreDelivery = namespace('delivery/delivery-list')
const nsStoreWarehouse = namespace('warehouse/warehouse-list')
const nsStoreExportReceipt = namespace('delivery/export-receipt')
const nsStoreUser = namespace('user-auth/store-user')

@Component({
  components: {
    ConfirmDialogCustom,
    Pagination,
    DriverDialog
  }
})
class DeliveryOrderList extends Vue {
  selectedDelivery: DeliveryList.Model[] = []
  isShowFilter: boolean = false
  activeTab: number = 0
  loading: boolean = false
  isModalDelete: boolean = false
  onEventDeleteList: DeliveryList.Model[] = []
  loadingSubmit: boolean = false
  isFilter: boolean = false
  paging: Paging.Model = { ...PAGINATE_DEFAULT, first: 0 }
  statusList = DeliveryConstants.DELIVERY_STATUS_OPTIONS
  limitOptions = LIMIT_PAGE_OPTIONS
  filter: any = {
    id: null,
    assigneeId: null,
    createTimeFrom: null,
    createTimeTo: null,
    dueDeliveryDateFrom: null,
    dueDeliveryDateTo: null,
    status: null,
    sortBy: null,
    desc: null,
    sellerEmail: null,
    warehouseId: null
  }

  fullDayTime: number = 24 * 60 * 60
  orderIds: any

  isModalDriverList = false
  warehouseOption: any = []

  @nsStoreDelivery.State
  total!: number

  @nsStoreDelivery.State
  deliveryList!: DeliveryList.Model[]

  @nsStoreDelivery.Action
  getDeliveryList!: (params?: any) => Promise<void>

  @nsStoreDelivery.Action
  actDeleteDeliveryByIds!: (ids: string[]) => Promise<any>

  @nsStoreWarehouse.State
  warehouseList!: any

  @nsStoreWarehouse.Action
  actWarehouseList!: () => Promise<void>

  @nsStoreExportReceipt.Action
  actGetReceiptLable!: (params: any) => Promise<string>

  @nsStoreExportReceipt.State
  receiptUrl!: any

  @nsStoreUser.State
  user!: User.Model

  get activeStatus() {
    return DeliveryConstants.MapDeliveryTab.get(this.activeTab)
  }

  nameStatus(status) {
    return DeliveryConstants.MapStatusDelivery.get(status)
  }

  get selectedDeliveryFilter() {
    return _.filter(this.selectedDelivery, (delivery: DeliveryList.Model) => {
      if(this.activeTab === 0) {
        return delivery.status === 'DELIVERY_ORDER_STATUS_NEW' || delivery.status !== 'DELIVERY_ORDER_STATUS_CANCELLED' && (delivery.status === 'DELIVERY_ORDER_STATUS_IN_PROGRESS' && delivery.assigneeId === this.user.id)
      } else return delivery
    })
  }

  get classHeaderMuti() {
    return !this.deliveryList ||
      this.deliveryList.length <= 0 ||
      this.checkStockDisable
      ? 'checkbox-disable'
      : ''
  }

  get checkStockDisable() {
    return this.deliveryList.every(
      (item) => item.status === 'STOCK_STATUS_DISABLE'
    )
  }

  get checkIsFilter() {
    const params = _.omit(this.filter, ['pageNumber', 'pageSize'])
    return Object.values(params).some((item) => item)
  }

  get deleteMessage() {
    return getCancelMessage(this.onEventDeleteList, 'delivery order')
  }

  // -- [ Functions ] ------------------------------------------------------------

  handleExportReceipt() {
    _.forEach(this.selectedDelivery, async ({ id }) => {
      const result = await this.actGetReceiptLable({ id })
      if ( result ) {
        exportFileTypePdf(result, `receipt-${id}`)
      }
    })
  }

  getIndexPaginate( index: number ) {
    return calculateIndex(
      index,
      this.paging.pageNumber,
      this.paging.pageSize
    )
  }

  rowClass(data: DeliveryList.Model) {
    if(data.status === ORDER_STATUS.CANCELED ) {
      return 'row-disable'
    } else {
      return ''
    }
  }

  async mounted() {
    const { role, warehouse } = this.user
    if(role === 'admin') {
      await this.actWarehouseList()
      this.warehouseOption = _.cloneDeep(this.warehouseList)
      this.filter.warehouseId = this.warehouseList[0]
    } else {
      this.warehouseOption = [warehouse]
      this.filter.warehouseId = warehouse
    }
    this.getList()
  }

  async handleFilter( e: any, name: string ) {
    this.filter[name] = e
    await this.getProductList()
    this.selectedDelivery = []
  }

  async getProductList() {
    await this.getDeliveryList({
      id: this.filter.id || null,
      assigneeId: this.filter.assigneeId || null,
      createTimeFrom: this.filter.createTimeFrom || null  ,
      createTimeTo: this.filter.createTimeTo ||null ,
      dueDeliveryDateFrom: this.filter.dueDeliveryDateFrom || null,
      dueDeliveryDateTo: this.filter.dueDeliveryDateTo || null,
      sortBy: this.filter.sortBy ||null,
      desc: this.filter.desc,
      sellerEmail: this.filter.sellerEmail || null,
      warehouseId: this.filter.warehouseId?.id,
      pageSize: this.paging.pageSize,
      pageNumber: this.paging.pageNumber,
      status: this.activeStatus?.includes(this.filter.status?.value) ? this.filter.status?.value : this.activeStatus
    })
  }

  onPage( event: any ) {
    resetScrollTable()
    this.paging.pageSize = event.rows
    this.paging.pageNumber = event.page
    this.getProductList()
  }

  showModalDelete( data: DeliveryList.Model[] ) {
    this.onEventDeleteList = data || this.selectedDeliveryFilter
    this.isModalDelete = true
  }

  async handleDeleteDelivery() {
    try {
      this.loadingSubmit = true
      const data = await this.actDeleteDeliveryByIds(_.map(this.onEventDeleteList, 'id'))
      if ( data ) {
        this.isModalDelete = false
        this.$toast.add({
          severity: 'success',
          summary: 'Success Message',
          detail: 'Successfully cancelled D/O',
          life: 3000
        })
        this.selectedDelivery = []
        await this.getProductList()
      }
    } catch (error) {
      this.$toast.add({
        severity: 'error',
        summary: 'Error Message',
        detail: error,
        life: 3000
      })
    } finally {
      this.loadingSubmit = false
    }
  }

  handleCancel() {
    this.isModalDelete = false
  }

  rowdbClick({ data }) {
    if(!data.assigneeId || data.assigneeId === this.user.id) {
      this.$router.push(`/stock-out/order/${data.id}`)
    }
  }

  sortData(e: any) {
    resetScrollTable()
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
    const adminFilter = _.omit(_.cloneDeep(this.filter), 'warehouseId')
    for (const items in adminFilter) this.filter[items] = null
    this.getProductList()
  }

  rowSelectAll({ data }) {
    this.selectedDelivery = _.union(this.selectedDelivery, data)
  }

  rowUnSelectAll() {
    this.selectedDelivery = _.differenceWith(
      this.selectedDelivery,
      this.deliveryList,
      _.isEqual
    )
  }

  rowSelect({ data }) {
    this.selectedDelivery.push(data)
  }

  rowUnselect({ originalEvent, data }) {
    originalEvent.originalEvent.stopPropagation()
    this.selectedDelivery = _.filter(
      this.selectedDelivery,
      (item: any) => item.id !== data.id
    )
  }

  handleTab({ index }: any) {
    this.handleRefreshFilter()
    this.isShowFilter = false
    this.activeTab = index
    this.handleRefreshFilter()
    this.getList()
  }

  handleAddNew() {
    this.$router.push('/stock-out/order')
  }

  getList() {
    this.selectedDelivery = []
    this.paging.pageSize = 20
    this.paging.pageNumber = 0
    this.statusList = DeliveryConstants.DELIVERY_STATUS_OPTIONS.filter((item: any) => {
      return this.activeStatus?.split(',').includes(item.value.toString())
    })
    this.getDeliveryList({
      ...this.filter,
      warehouseId: this.filter.warehouseId?.id ,
      pageSize: this.paging.pageSize,
      pageNumber: this.paging.pageNumber,
      status: this.activeStatus
    })
  }

  setDelivery() {
    this.isModalDriverList = true
    this.orderIds = _.map(this.selectedDelivery, ( item:any ) => {
      return item.id
    })
  }

  hideDialog( event:any ) {
    this.isModalDriverList = !event
  }

  get isSetDelivery() {
    if(this.selectedDelivery.length > 0) {
      return this.selectedDelivery.every((item) => {
        return item.status === ORDER_STATUS.READY
      })
    } else {
      return false
    }
  }

  get isResetDelivery() {
    if(this.selectedDelivery.length > 0) {
      return this.selectedDelivery.every(
        (item) => item.status === ORDER_STATUS.SETTED || item.status === ORDER_STATUS.ACCEPTED
      ) && this.selectedDelivery.find( (item) => item.driverId === this.selectedDelivery[0].driverId)
    } else {
      return false
    }

  }

  assignedDriver( event:any ) {
    if (event) {
      this.$toast.add({
        severity: 'success',
        summary: 'Success Message',
        detail: 'Successfully set Delivery',
        life: 3000
      })
      const packingInfo = this.$el.querySelector('.packing__detail--left')
      if (packingInfo) {
        const scrollHeight = packingInfo.scrollHeight
        packingInfo.scrollTop = scrollHeight
      }
      this.selectedDelivery = []
    }

  }
}

export default DeliveryOrderList
</script>
<style lang="sass" scoped>
.text-end
  display: flex
  justify-content: flex-end

.stock
  @include flex-column
  @include mobile
    min-height: calc(100vh - 32px)
  @include tablet
    min-height: calc(100vh - 32px)
  @include desktop
    height: calc(100vh - 32px)

  ::v-deep.pi-calendar:before
    content: url('~/assets/icons/calendar.svg')

  ::v-deep.p-calendar-w-btn
    .p-button
      background: none
      border: none

  ::v-deep.text-right
    text-align: right !important

    .p-column-header-content
      justify-content: flex-end !important

  ::v-deep.disable-button
    pointer-events: none
    background-color: $text-color-300

    .icon
      background-color: $text-color-500

  &__header
    @include flex-center-space-between
    margin-bottom: 24px

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
    gap: 10px 16px
    @include desktop
      justify-content: flex-end
      flex-direction: row
      // flex-wrap:  wrap
      margin-top: 0

.stock__table
  border-radius: 4px
  flex: 1
  position: relative
  overflow: hidden

  &-no
    font-size: $font-size-medium

  &-barcode
    text-transform: uppercase

  ::v-deep.disable-button
    pointer-events: none
    background-color: $text-color-300

    .icon
      background-color: $text-color-500

.filter__dropdown, .filter__multiselect
  @include size(100%, 40px)
  border: none
.btn__filter
  width: 100%
  @include desktop
    width: 166px
</style>
