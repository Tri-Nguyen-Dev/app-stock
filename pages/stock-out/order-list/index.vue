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
          .btn__filter(class='active' @click="handleExportReceipt")
            .btn.btn-toggle.bg-white
              .icon-download.icon--large.bg-primary
              span.text-900.text-primary Export file
    .grid.header__filter(:class='{ "active": isShowFilter }')
      div(class='col-12 md:col-4 lg:col-2 xl:col-2')
        FilterTable(title="ID" placeholder="Search ID" name="id" :value="filter.id" :searchText="true" @updateFilter="handleFilter")
      div(class='col-12 md:col-8 lg:col-4 xl:col-5')
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
            )
          .col.ml-1
            FilterCalendar(
              title="To"
              border="createTimeTo"
              :value="filter.createTimeTo"
              name="dateTo"
              inputClass="border-0"
              dateFormat="dd-mm-yy"
              :showIcon="true"
              @updateFilter="handleFilter"
            )
      div(class='col-12 md:col-8 lg:col-4 xl:col-5')
        .grid.grid-nogutter
          .col
            FilterCalendar(
              title="Due Delivery Date from"
              border="left"
              :value="filter.dueDeliveryDateFrom"
              name="dueDeliveryDateFrom"
              inputClass="border-0"
              dateFormat="dd-mm-yy"
              :showIcon="true"
              @updateFilter="handleFilter"
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
            )
      div(class='col-12 md:col-4 lg:col-2 xl:col-3')
        FilterTable(
          title="Warehouse"
          :value="filter.warehouse"
          :options="warehouseList"
          name="warehouse"
          @updateFilter="handleFilter"
        )
      div(class='col-12 md:col-4 lg:col-2 xl:col-3')
        FilterTable(
          title="Seller email"
          :value="filter.sellerEmail"
          :searchText="true"
          name="sellerEmail"
          @updateFilter="handleFilter"
        )
      div(class='col-12 md:col-4 lg:col-2 xl:col-3')
        FilterTable(
          title="Assignee"
          :value="filter.assignee"
          :searchText="true"
          name="assignee"
          @updateFilter="handleFilter"
        )
      div(class='col-12 md:col-4 lg:col-2 xl:col-3')
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
          :exportable="false")
        Column(field='no' header='NO' :styles="{'width': '1%'}" )
          template(#body='{ index }')
            span.grid-cell-center.stock__table-no.text-white-active.text-900.font-bold {{ getIndexPaginate(index) }}
        Column(field='id' header='ID' sortable headerClass="grid-header-center")
          template(#body='{ data }')
            .stock__table-name.text-white-active.text-base.text-900.text-overflow-ellipsis.overflow-hidden.font-bold {{ data.id }}
        Column(header='Creator ID' field='creatorId' sortable sortField="_assignee.id")
          template(#body='{ data }')
            .stock__table-name.text-white-active.text-base.text-900.text-overflow-ellipsis.overflow-hidden {{ data.creatorId }}
        Column(header='Create time' field='createTime' sortable  sortField="_createdAt" )
          template(#body='{ data }')
            div {{ data.createTime | dateTimeHour12 }}
        Column(header='Seller email' sortable field='sellerEmail' sortField="_seller.email" headerClass="grid-header-right")
          template(#body='{ data }')
            div.grid-cell-right {{ data.sellerEmail }}
            div.grid-cell-right {{ data.receiptDate }}
        Column(header='Receiver Address' sortable field='receiverAddress' sortField="_receiverAddress" headerClass="grid-header-right")
          template(#body='{ data }')
            div.grid-cell-right {{ data.receiverAddress }}
        Column( sortable field='dueDeliveryDate' sortField="_dueDeliveryDate" headerClass="grid-header-right")
          template(#header)
            div
              div.text-end Due
              div Delivery Date
          template(#body='{ data }')
            div.grid-cell-right {{ data.dueDeliveryDate | dateTimeHour12 }}
        Column( sortable field='estimatedDeliveryTime' sortField="_estimatedDeliveryTime" headerClass="grid-header-right")
          template(#header)
            div
              div.text-end Estimated
              div Delivery Time
          template(#body='{ data }')
            div.grid-cell-right {{ data.estimatedDeliveryTime | dateTimeHour12 }}
        Column( sortable field='lastedUpdateTime' sortField="_updatedAt" headerClass="grid-header-right")
          template(#header)
            div
              div.text-end Latest
              div update time
          template(#body='{ data }')
            div {{ data.lastedUpdateTime | dateTimeHour12 }}
        Column(header='Warehouse' sortable field='warehouseName' sortField="_warehouse.id" headerClass="grid-header-right")
          template(#body='{ data }')
            .flex.align-items-center.cursor-pointer.justify-content-end
              span.text-primary.font-bold.font-sm.text-white-active {{ data.warehouseName }}
              .icon.icon-arrow-up-right.bg-primary.bg-white-active
        Column(header='PIC' sortable field='creatorId' sortField="_assignee.id" headerClass="grid-header-right")
          template(#body='{ data }')
            div.grid-cell-right {{ data.creatorId }}
        Column(v-if="activeTab == 1"
          header='Driver' sortable field='driverName' sortField="_driverName" headerClass="grid-header-right")
          template(#body='{ data }')
            div.grid-cell-right {{ data.driverName }}
        Column(v-if="activeTab == 2"
          header='Receipt Date' sortable field='receiptDate' sortField="_receiptDate" headerClass="grid-header-right")
          template(#body='{ data }')
        Column(field='status' header="Status" sortable sortField="_status" headerClass="grid-header-right")
          template(#body='{ data }')
            div.grid-cell-right
              span.table__status.table__status--available(v-if="data.status === 'DELIVERY_ORDER_STATUS_NEW'") NEW
              span.table__status.table__status--draft(v-if="data.status === 'DELIVERY_ORDER_STATUS_IN_PROGRESS'") In Progress
              span.table__status.table__status--disable(v-if="data.status === 'DELIVERY_ORDER_STATUS_CANCELLED'") Cancelled
              span.table__status.table__status--available(v-if="data.status === 'DELIVERY_ORDER_STATUS_READY'") Ready
              span.table__status.table__status--draft(v-if="data.status === 'DELIVERY_ORDER_STATUS_DELIVERING'") Delivering
              span.table__status.table__status--available(v-if="data.status === 'DELIVERY_ORDER_STATUS_DELIVERED' ") Delivered
              span.table__status.table__status--disable(v-if="data.status === 'DELIVERY_ORDER_STATUS_RETURNED' ") Returned
        template(#footer)
          Pagination(
            v-if="activeTab == 0"
            title="Cancel"
            :paging="paging"
            :total="total"
            @onDelete="showModalDelete"
            :deleted-list="selectedDeliveryFilter"
            @onPage="onPage")
        template(#empty)
          div.table__empty
            img(:srcset="`${require('~/assets/images/table-empty.png')} 2x`" v-if="!checkIsFilter")
            img(:srcset="`${require('~/assets/images/table-notfound.png')} 2x`" v-else)
    ConfirmDialogCustom(
      title="Confirm delete"
      image="confirm-delete"
      :isShow="isModalDelete"
      :onOk="handleDeleteDelivery"
      :onCancel="handleCancel"
      :loading="loadingSubmit"
    )
      template(v-slot:message)
        p {{ deleteMessage }}

    Toast
</template>
<script lang="ts">
import { Component, Vue, namespace, Watch } from 'nuxt-property-decorator'
import ConfirmDialogCustom from '~/components/dialog/ConfirmDialog.vue'
import { DeliveryList } from '~/models/Delivery'

import {
  LIMIT_PAGE_OPTIONS,
  PAGINATE_DEFAULT,
  calculateIndex,
  DeliveryConstants,
  getDeleteMessage,
  exportFileTypePdf
} from '~/utils'
import { Paging } from '~/models/common/Paging'
import { User } from '~/models/User'
import Pagination from '~/components/common/Pagination.vue'
const nsStoreDelivery = namespace('delivery/delivery-list')
const nsStoreWarehouse = namespace('warehouse/warehouse-list')
const nsStoreExportReceipt = namespace('delivery/export-receipt')
const nsStoreUser = namespace('user-auth/store-user')

@Component({
  components: {
    ConfirmDialogCustom,
    Pagination
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

  // -- [ Getters ] -------------------------------------------------------------
  @Watch ('activeTab',{ immediate: true, deep: true })
  getList(){
    this.selectedDelivery = []
    this.paging.pageSize = 20
    this.paging.pageNumber = 0
    this.statusList = DeliveryConstants.DELIVERY_STATUS_OPTIONS
    this.statusList = this.statusList.filter((item: any) => {
      return this.activeStatus?.split(',').includes(item.value.toString())
    })
    this.getDeliveryList({
      ...this.filter,
      warehouseId: this.filter.warehouse?.id,
      pageSize: this.paging.pageSize,
      pageNumber: this.paging.pageNumber,
      status: this.activeStatus
    })
  }

  get activeStatus() {
    return DeliveryConstants.MapDeliveryTab.get(this.activeTab)
  }

  get selectedDeliveryFilter() {
    return _.filter(this.selectedDelivery, (delivery: DeliveryList.Model) => {
      if(this.activeTab === 0) {
        return delivery.status === 'DELIVERY_ORDER_STATUS_NEW' || delivery.status !== 'DELIVERY_ORDER_STATUS_CANCELLED' && (delivery.status === 'DELIVERY_ORDER_STATUS_IN_PROGRESS' && delivery.assigneeId === this.user.id)
      }else return delivery
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
    return getDeleteMessage(this.onEventDeleteList, 'delivery order')
  }

  // -- [ Functions ] ------------------------------------------------------------

  handleExportReceipt() {
    _.forEach(this.selectedDelivery, async ({ id }) => {
      const result = await this.actGetReceiptLable({ id })
      if (result) {
        exportFileTypePdf(result, `receipt-${id}`)
      }
    })
  }

  getIndexPaginate(index: number) {
    return calculateIndex(
      index,
      this.paging.pageNumber,
      this.paging.pageSize
    )
  }

  rowClass(data: DeliveryList.Model) {
    return data.status === 'DELIVERY_ORDER_STATUS_IN_PROGRESS' && data.assigneeId !== this.user.id || data.status === 'DELIVERY_ORDER_STATUS_CANCELLED' ? '' :''
  }

  mounted() {
    // this.getProductList()
    this.actWarehouseList()
  }

  handleFilter(e: any, name: string) {
    this.filter[name] = e
    this.getProductList()
  }

  async getProductList() {
    await this.getDeliveryList({
      ...this.filter,
      warehouseId: this.filter.warehouse?.id,
      pageSize: this.paging.pageSize,
      pageNumber: this.paging.pageNumber,
      status: this.activeStatus?.includes(this.filter.status?.value) ? this.filter.status?.value : this.activeStatus
    })
  }

  onPage(event: any) {
    this.paging.pageSize = event.rows
    this.paging.pageNumber = event.page
    this.getProductList()
  }

  showModalDelete(data: DeliveryList.Model[]) {
    this.onEventDeleteList = data || this.selectedDeliveryFilter
    this.isModalDelete = true
  }

  async handleDeleteDelivery() {
    try {
      this.loadingSubmit = true
      const data = await this.actDeleteDeliveryByIds(_.map(this.onEventDeleteList, 'id'))
      if (data) {
        this.isModalDelete = false
        this.$toast.add({
          severity: 'success',
          summary: 'Success Message',
          detail: 'Successfully deleted delivery order',
          life: 3000
        })
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
    if(data.status !== 'DELIVERY_ORDER_STATUS_CANCELLED') {
      this.$router.push(`/stock-out/order/${data.id}`)
    }
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
    this.filter.name = null
    this.filter.barCode = null
    this.filter.categories = null
    this.filter.status = null
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
    this.activeTab = index
  }

  handleAddNew() {
    this.$router.push('/stock-out/order')
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
  height: 100vh

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
