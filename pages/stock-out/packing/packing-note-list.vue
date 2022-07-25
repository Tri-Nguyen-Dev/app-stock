<template lang="pug">
  .stock
    .stock__header.mb-3
      div
        h1.text-heading Packing note list
      .header__action
        .btn__filter(:class="{'active': true}")
          .btn-toggle(@click="isShowFilter = !isShowFilter")
            .icon.icon-filter(v-if="!isShowFilter")
            .icon.icon-chevron-up.bg-primary(v-else)
            span Filter
          .btn-refresh(@click="handleRefreshFilter")
            .icon.icon-rotate-left.bg-white
        .btn__filter(class='active' @click="handleExportReceipt")
          .btn.btn-toggle.bg-white
            .icon-download.icon--large.bg-primary
            span.text-900.text-primary EXPORT FILE
    .grid.header__filter.mt-1(:class='{ "active": isShowFilter }' )
      div(class='col-12 md:col-2')
        FilterTable(
          title=" (DO)ID"
          name="id"
          :value="filter.id"
          :searchText="true"
          @updateFilter="handleFilter"
        )
      div(class='col-12 md:col-4')
        .grid.grid-nogutter
          .col
            FilterCalendar(
              title="Created time from"
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
      div(class='col-12 md:col-2')
        FilterTable(
          title="Seller email"
          placeholder="Search"
          :value="filter.sellerEmail"
          :searchText="true"
          name="sellerEmail"
          @updateFilter="handleFilter"
        )
      div(class='col-12 md:col-2')
        FilterTable(
          title="PIC"
          placeholder="Search"
          :value="filter.assigneeId"
          :searchText="true"
          name="assigneeId"
          @updateFilter="handleFilter"
        )
      div(class='col-12 md:col-2')
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
        responsiveLayout="scroll"
        :selection='selectedDelivery'
        dataKey='id'
        :rows='10'
        :rowHover='true'
        @row-click='rowClick'
        @row-select-all="rowSelectAll"
        @row-unselect-all="rowUnSelectAll"
        @row-select="rowSelect"
        @row-unselect="rowUnselect"
      )
        Column(
          selectionMode='multiple'
          :styles="{'width': '1%'}"
          :exportable="false"
        )
        Column(field='no' header='NO' :styles="{'width': '1%'}" )
          template(#body='{ index }')
            span.grid-cell-center.stock__table-no.text-white-active.text-900.font-bold {{ getIndexPaginate(index) }}
        Column(field='id' header='ID' sortable headerClass="grid-header-center")
          template(#body='{ data }')
            .stock__table-name.text-white-active.text-base.text-900.text-overflow-ellipsis.overflow-hidden.font-bold {{ data.id }}
        Column(header='Created time' field='createTime' sortable  sortField="_createdAt" )
          template(#body='{ data }')
            div {{ data.createTime | dateTime }}
        Column(header='Seller email' sortable field='sellerEmail' sortField="_seller.email" headerClass="grid-header-right")
          template(#body='{ data }')
            div.grid-cell-right {{ data.seller.email }}
            div.grid-cell-right {{ data.receiptDate }}
        Column(header='Receiver Address' sortable field='receiverAddress' sortField="_receiverAddress" )
          template(#body='{ data }')
            div.grid-cell-fix-width {{ data.receiverAddress }}
        Column(header='PIC' sortable field='creatorId' sortField="_assignee.id" headerClass="grid-header-right")
          template(#body='{ data }')
            div.grid-cell-right(v-if="data.assignee") {{ data.assignee.displayName }}
        Column(field='status' header="Status" headerClass="grid-header-right")
          template(#body='{ data }')
            div.grid-cell-right
              span.table__status.table__status--available(v-if="data.status === 'DELIVERY_ORDER_STATUS_NEW'") NEW
              span.table__status.table__status--draft(v-if="data.status === 'DELIVERY_ORDER_STATUS_IN_PROGRESS'") In Progress
              span.table__status.table__status--disable(v-if="data.status === 'DELIVERY_ORDER_STATUS_CANCELLED'") Cancelled
              span.table__status.table__status--available(v-if="data.status === 'DELIVERY_ORDER_STATUS_READY'") Ready
              span.table__status.table__status--available(v-if="data.status === 'DELIVERY_ORDER_STATUS_SETTED'") Setted
              span.table__status.table__status--draft(v-if="data.status === 'DELIVERY_ORDER_STATUS_DELIVERING'") Delivering
              span.table__status.table__status--available(v-if="data.status === 'DELIVERY_ORDER_STATUS_DELIVERED' ") Delivered
              span.table__status.table__status--disable(v-if="data.status === 'DELIVERY_ORDER_STATUS_RETURNED' ") Returned
              span.table__status.table__status--disable(v-if="data.status === 'DELIVERY_ORDER_STATUS_PENDING' ") Pending
        template(#footer)
          Pagination(
            title="Cancel"
            :paging="paging"
            :total="total"
            @onPage="onPage")
        template(#empty)
          CommonTableEmpty(:isNotFound="isFilter" @addNew="handleAddnew")
    Toast
</template>
<script lang="ts">
import { Component, Vue, namespace } from 'nuxt-property-decorator'
import dayjs from 'dayjs'
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
  paging: Paging.Model = { ...PAGINATE_DEFAULT, first: 0 }
  statusList =  [
    { name: 'Cancelled', value: DeliveryConstants.StatusDelivery.CANCELLED },
    { name: 'Ready', value: DeliveryConstants.StatusDelivery.READY },
    { name: 'Delivering', value: DeliveryConstants.StatusDelivery.DELIVERING },
    { name: 'Delivered', value: DeliveryConstants.StatusDelivery.DELIVERED },
    { name: 'Returned', value: DeliveryConstants.StatusDelivery.RETURNED },
    { name: 'Setted', value: DeliveryConstants.StatusDelivery.SETTED },
    { name: 'Accepted', value: DeliveryConstants.StatusDelivery.ACCEPTED }]

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
    sellerEmail: null
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
  warehouseSelected!: any

  @nsStoreExportReceipt.Action
  actGetReceiptLable!: (params: any) => Promise<string>

  @nsStoreExportReceipt.State
  receiptUrl!: any

  @nsStoreUser.State
  user!: User.Model

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

  mounted() {
    if(this.warehouseSelected) {
      this.getProductList()
    }
  }

  handleFilter(e: any, name: string) {
    this.filter[name] = e
    this.getProductList()
  }

  getParamAPi() {
    return {
      id: this.filter.id || null,
      assigneeId: this.filter.assigneeId || null,
      createTimeFrom: this.filter.createTimeFrom ? dayjs(this.filter.createTimeFrom).format('YYYY-MM-DD') : null,
      createTimeTo: this.filter.createTimeTo ? dayjs(this.filter.createTimeTo).format('YYYY-MM-DD') : null,
      sortBy: this.filter.sortBy || null,
      desc: this.filter.desc,
      sellerEmail: this.filter.sellerEmail || null,
      warehouseId: this.warehouseSelected?.id,
      pageSize: this.paging.pageSize,
      pageNumber: this.paging.pageNumber,
      status: this.filter.status?.value
    }
  }

  async getProductList() {
    await this.getDeliveryList({ ...this.getParamAPi(), isPackingList : true })
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

  get isFilter(){
    const params = _.omit(this.getParamAPi(), ['pageNumber', 'pageSize', 'warehouseId'])
    return Object.values(params).some((item) => item)
  }

  handleAddnew() {
    this.$router.push({ path: '/stock-out/order' })
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
