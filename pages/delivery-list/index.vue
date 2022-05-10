<template lang="pug">
  .stock
    h1.text-heading Delivery order list
    .stock__header.grid.mt-3
      div.col-12(class="xl:col-6")
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
      div.col-12(class="xl:col-6")
        .header__action
          .btn__filter(:class="{'active': isShowFilter}")
            .btn-toggle(@click.stop="isShowFilter = !isShowFilter")
              .icon.icon-filter(v-if="!isShowFilter")
              .icon.icon-chevron-up.bg-primary(v-else)
              span Filter
            .btn-refresh(@click="handleRefreshFilter")
              .icon.icon-rotate-left.bg-white
          .btn__filter(class='active' @click="handleExportReceipt")
            .btn.btn-toggle.bg-white
              .icon-download.icon--large.bg-primary
              span.text-900.text-primary Export file
    .grid.header__filter(:class='{ "active": isShowFilter }')
      .col-1
        FilterTable(title="ID" placeholder="Search ID" name="id" :value="filter.id" :searchText="true" @updateFilter="handleFilter")
      .col-3
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
      .col-3
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
      .col
          FilterTable(
            title="Warehouse"
            :value="filter.warehouse"
            :options="warehouseList"
            name="warehouse"
            @updateFilter="handleFilter"
          )
      .col
          FilterTable(
            title="Seller email"
            :value="filter.sellerEmail"
            :searchText="true"
            name="sellerEmail"
            @updateFilter="handleFilter"
          )
      .col
          FilterTable(
            title="Assignee"
            :value="filter.assignee"
            :searchText="true"
            name="assignee"
            @updateFilter="handleFilter"
          )
      .col
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
            :headerClass="classHeaderMuti")
          Column(field='no' header='NO' :styles="{'width': '1%'}" )
            template(#body='{ index }')
              span.grid-cell-center.stock__table-no.text-white-active.text-900.font-bold {{ getIndexPaginate(index) }}
          Column(field='id' header='ID' sortable headerClass="grid-header-center")
            template(#body='{ data }')
             .stock__table-name.text-white-active.text-base.text-900.text-overflow-ellipsis.overflow-hidden.font-bold {{ data.id }}
          Column(header='Creator ID' field='creatorId' sortable sortField="_creatorId")
            template(#body='{ data }')
              .stock__table-name.text-white-active.text-base.text-900.text-overflow-ellipsis.overflow-hidden {{ data.creatorId }}
          Column(header='Create Name' field='creatorName' sortable sortField="_creatorName" headerClass="grid-header-right")
            template(#body='{ data }')
              .stock__table-barcode.grid-cell-right {{ data.creatorName }}
          Column(header='Create time' field='createTime' sortable  sortField="_createTime" headerClass="grid-header-right")
              template(#body='{ data }')
                div.grid-cell-right {{ data.createTime | dateTimeHour12 }}
          Column(header='Seller email' sortable field='sellerEmail' sortField="_sellerEmail" headerClass="grid-header-right")
              template(#body='{ data }')
                div.grid-cell-right {{ data.sellerEmail }}
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
          Column( sortable field='lastedUpdateTime' sortField="_lastedUpdateTime" headerClass="grid-header-right")
              template(#header)
                div
                  div.text-end Latest 
                  div update time
              template(#body='{ data }')
                div.grid-cell-right {{ data.lastedUpdateTime | dateTimeHour12 }}
          Column(header='Warehouse' sortable field='warehouseName' sortField="_warehouseName" headerClass="grid-header-right")
              template(#body='{ data }')
               .flex.align-items-center.cursor-pointer.justify-content-end
                  span.text-primary.font-bold.font-sm.text-white-active {{ data.warehouseName }}
                  .icon.icon-arrow-up-right.bg-primary.bg-white-active
          Column(header='PIC' sortable field='warehouseId' sortField="_warehouseId" headerClass="grid-header-right")
              template(#body='{ data }')
                div.grid-cell-right {{ data.warehouseId }}
          Column(v-if="activeTab == 1" 
            header='Driver' sortable field='driverName' sortField="_driverName" headerClass="grid-header-right")
              template(#body='{ data }')
                div.grid-cell-right {{ data.driverName }}
          Column(v-if="activeTab == 2"  
          header='Receipt Date' sortable field='receiptDate' sortField="_receiptDate" headerClass="grid-header-right")
              template(#body='{ data }')
                div.grid-cell-right {{ data.receiptDate }}
          Column(field='status' header="Status" headerClass="grid-header-right")
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
              :paging="paging"
              :total="total"
              @onDelete="showModalDelete"
              :deleted-list="selectedDelivery"

              @onPage="onPage")
          template(#empty)
            div.table__empty
              img(:srcset="`${require('~/assets/images/table-empty.png')} 2x`" v-if="!checkIsFilter")
              img(:srcset="`${require('~/assets/images/table-notfound.png')} 2x`" v-else)
              //- p.empty__text(v-if="!checkIsFilter") List is empty!, Click
              //-   span &nbsp;here
              //-   span(@click="handleAddDelivery") &nbsp;to add item.
              //- p.notfound__text(v-else) Item not found!
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
import { Component, Vue, namespace } from 'nuxt-property-decorator'
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
import Pagination from '~/components/common/Pagination.vue'
const nsStoreDelivery = namespace('delivery/delivery-list')
const nsStoreWarehouse = namespace('warehouse/warehouse-list')
const nsStoreExportReceipt = namespace('delivery/export-receipt')

@Component({
  components: {
    ConfirmDialogCustom,
    Pagination
  }
})
class DeliveryOrder extends Vue {
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
    sellerEmail:null,
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

  // -- [ Getters ] -------------------------------------------------------------
  get selectedDeliveryFilter() {
    return  _.filter(this.selectedDelivery, (delivery: DeliveryList.Model) => {
      return delivery.status !== 'STOCK_STATUS_DISABLE'
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
    return getDeleteMessage(this.onEventDeleteList, 'stock')
  }
  
  // -- [ Functions ] ------------------------------------------------------------

  handleExportReceipt() {
    _.forEach(this.selectedDelivery, async({ id }) => {
      const result = await this.actGetReceiptLable({ id })
      if(result) {
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

  rowClass(data: any) {
    return data.stockStatus === 'STOCK_STATUS_DISABLE' ? 'row-disable' : ''
  }

  async mounted() {
    this.getProductList()
    await this.actWarehouseList()
  }

  handleFilter(e: any, name: string){
    this.filter[name] = e
    this.getProductList()
  }

  async getProductList() {
    await this.getDeliveryList({
      ...this.filter,
      pageSize: this.paging.pageSize,
      pageNumber: this.paging.pageNumber,
      status: this.filter.status?.value
    })
  }

  handleChangeFilter() {
    this.getProductList()
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
    }finally {
      this.loadingSubmit = false
    }
  }

  handleCancel() {
    this.isModalDelete = false
  }

  // handleEditStock(id: any) {
  //   this.$router.push({ path: `/stock/${id}`, query: { plan: 'edit' } })
  // }

  rowdbClick({ data }) {
    this.$router.push(`/order/${data.id}`)
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

  debounceSearchName = _.debounce((value) => {
    this.filter.name = value
    this.getProductList()
  }, 500)

  debounceSearchCode = _.debounce((value) => {
    this.filter.barCode = value
    this.getProductList()
  }, 500)

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
      (stock: any) => stock.id !== data.id
    )
  }
 
  handleTab({ index }:any) {
    this.activeTab = index
  }

  handleAddStock() {
    this.$router.push('/stock-in/create-receipt')
  }

}
export default DeliveryOrder
</script>
<style lang="sass" scoped>
.text-end 
  display: flex
  justify-content: end
.stock
  @include flex-column
  height: 100%
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
      @include flex-center-vert
      justify-content: flex-end
      gap: 0 16px
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
</style>