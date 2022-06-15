<template lang="pug">
  .stock
    .stock__header.grid.mt-3
      div(class='col-12 md:col-12 lg:col-9 xl:col-9')
        h1.text-heading Packing note list
      div(class='col-12 md:col-12 lg:col-3 xl:col-3 btn-center')
        ThemeButtonExport.mr-1.w-half(:click='handleExportReceipt')
        Button.p-button-outlined.p-button-primary.bg-white.w-half(
          type='button',
          label='Refresh',
          icon='pi pi-refresh'
          @click='handleRefreshFilter'
        )
    .grid.header__filter(:class='{ "active": true }')
      div(class='col-12 md:col-6 lg:col-4 xl:col-4')
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
              name="createTimeTo"
              inputClass="border-0"
              dateFormat="dd-mm-yy"
              :showIcon="true"
              @updateFilter="handleFilter"
            )
      div(class='col-12 md:col-3 lg:col-3 xl:col-3')
        FilterTable(
          title="Warehouse"
          :value="filter.warehouseId"
          :options="warehouseList"
          name="warehouseId"
          @updateFilter="handleFilter"
        )
      div(class='col-12 md:col-3 lg:col-3 xl:col-3')
        FilterTable(
          title="Seller email"
          placeholder="Search"
          :value="filter.sellerEmail"
          :searchText="true"
          name="sellerEmail"
          @updateFilter="handleFilter" 
        )
      div(class='col-12 md:col-4 lg:col-2 xl:col-2')
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
        :selection='selectedDelivery'
        dataKey='id'
        :rows='10'
        :rowHover='true'
        @row-click='rowClick'
      )
        Column(field='no' header='NO' :styles="{'width': '1%'}" )
          template(#body='{ index }')
            span.grid-cell-center.stock__table-no.text-white-active.text-900.font-bold {{ getIndexPaginate(index) }}
        Column(field='id' header='ID' sortable headerClass="grid-header-center")
          template(#body='{ data }')
            .stock__table-name.text-white-active.text-base.text-900.text-overflow-ellipsis.overflow-hidden.font-bold {{ data.id }}
        Column(header='Create time' field='createTime' sortable  sortField="_createdAt" )
          template(#body='{ data }')
            div {{ data.createTime | dateTimeHour12 }}
        Column(header='Seller email' sortable field='sellerEmail' sortField="_seller.email" headerClass="grid-header-right")
          template(#body='{ data }')
            div.grid-cell-right {{ data.sellerEmail }}
            div.grid-cell-right {{ data.receiptDate }}
        Column(header='Receiver Address' sortable field='receiverAddress' sortField="_receiverAddress" )
          template(#body='{ data }')
            div.grid-cell-fix-width {{ data.receiverAddress }}
        //- Column(header='Warehouse' sortable field='warehouseName' sortField="_warehouse.id" headerClass="grid-header-right")
        //-   template(#body='{ data }')
        //-     .flex.align-items-center.cursor-pointer.justify-content-end
        //-       span.text-primary.font-bold.font-sm.text-white-active {{ data.warehouseName }}
        //-       .icon.icon-arrow-up-right.bg-primary.bg-white-active
        Column(header='PIC' sortable field='creatorId' sortField="_assignee.id" headerClass="grid-header-right")
          template(#body='{ data }')
            div.grid-cell-right {{ data.creatorId }}   
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
            title="Cancel"
            :paging="paging"
            :total="total"
            @onPage="onPage")
        template(#empty)
          div.table__empty
            img(:srcset="`${require('~/assets/images/table-notfound.png')} 2x`")
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
  exportFileTypePdf,
  resetScrollTable
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
class PackingNoteList extends Vue {
  selectedDelivery: DeliveryList.Model[] = []
  isShowFilter: boolean = false
  activeTab: number = 0
  loading: boolean = false
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

  get checkIsFilter() {
    const params = _.omit(this.filter, ['pageNumber', 'pageSize'])
    return Object.values(params).some((item) => item)
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
    this.getProductList()
    this.actWarehouseList()
  }

  handleFilter(e: any, name: string) {
    this.filter[name] = e
    this.getProductList()
  }

  async getProductList() {
    await this.getDeliveryList({
      ...this.filter,
      warehouseId: this.filter.warehouseId?.id,
      pageSize: this.paging.pageSize,
      pageNumber: this.paging.pageNumber
    })
  }

  onPage(event: any) {
    resetScrollTable()
    this.paging.pageSize = event.rows
    this.paging.pageNumber = event.page
    this.getProductList()
  }

  rowClick({ data }) {
    if(data.status !== 'DELIVERY_ORDER_STATUS_CANCELLED') {
      this.$router.push(`/stock-out/order/${data.id}/packing-detail`)
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
    this.filter = {
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
    this.getProductList()
  }

}

export default PackingNoteList
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
.col-fix-length
  width: 20rem
.w-half
  width: 45%
</style>
