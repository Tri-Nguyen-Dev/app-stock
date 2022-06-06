<template lang='pug'>
  .inventory
    .inventory__filter.grid
      .col
        FilterTable(
          title="Driver Phone"
          :value="filter.phone"
          placeholder="Enter Phone"
          name="receiptId"
          :searchText="true"
          @updateFilter="handleFilter"
        )
      .col
        FilterTable(
          title="Driver Email"
          :value="filter.email"
          placeholder="Enter Email"
          name="barCode"
          :searchText="true"
          @updateFilter="handleFilter"
        )
      .col
        FilterTable(
          title="Driver Name"
          :value="filter.name"
          placeholder="Enter Name"
          name="sku"
          :searchText="true"
          @updateFilter="handleFilter"
        )
      .col
        FilterTable(title="Warehouse" name="Warehouse" :value="filter.warehouse"  @updateFilter="handleFilter")
          template(v-slot:multi-select)
            MultiSelect.filter__multiselect(
              v-model='filter.warehouse'
              :options='warehouseList'
              optionLabel="name"
              placeholder='Select'
              :filter='true'
            )
    .inventory__content
      DataTable(
        :value='driverList'
        dataKey='id'
        responsiveLayout="scroll"
        :class="{ 'table-wrapper-empty': !driverList || driverList.length <= 0 }"
        @sort="sortData($event)"
        @row-select="rowSelect"
        :selection="selectedDriver"
        @row-unselect="rowUnselect"
        @row-expand="onRowExpand($event)"
        @row-collapse="onRowCollapse"
        :expandedRows.sync="expandedRows"
      )
        Column(:expander="true" headerStyle="width: 2rem")
        Column(selectionMode='multiple')
        Column(field='no' header='NO' :styles="{'width': '3rem'}" )
          template(#body='slotProps') {{ (paging.pageNumber) * paging.pageSize + slotProps.index + 1 }}
        Column(field='driverPhone' header='Driver Phone' :sortable='true' sortField='_stock.barCode')
        Column(field='driverEmail' header='Driver Email' :sortable='true' sortField='_sku')
        Column(field='driverName' header='Driver Name' :sortable='true' bodyClass='font-semibold' sortField='_box.id')
        Column(field='totalDelivered' header='Total Delivered D/0' :sortable='true' className="text-right" sortField='_box.request.id')
        Column(field='totalDelivering' header='Total Delivering D/0' :sortable='true' className="text-right" sortField='_stock.createdAt')
        Column(field='warehouse.name' header='Warehouse' :sortable='true' className="text-right" sortField='_box.request.id')
          template(#body='{data}')
            span {{data.warehouse.name}}
        template(#footer)
          Pagination(
            :paging="paging"
            :total="total"
            @onPage="onPage"
          )
        template(#empty)
          div.flex.align-items-center.justify-content-center.flex-column
            img(:srcset="`${require('~/assets/images/table-empty.png')} 2x`")
            p.text-900.font-bold.mt-3 List is empty!, Click
              span.text-primary.underline.cursor-pointer &nbsp;here
              span &nbsp;to add item.
        template(#expansion="slotProps")
          div.orders-subtable.pb-2
            h5.mt-1.mb-2 Driver history
            DataTable(
              :value='arrDriverHistory[slotProps.index]'
              dataKey='deliveryOrderId'
              responsiveLayout="scroll"
              stripedRows
              )
              Column(field='no' header='NO' :styles="{'width': '3rem'}" )
                template(#body='slotProps') {{ (paging.pageNumber) * paging.pageSize + slotProps.index + 1 }}
              Column(field='deliveryOrderId' header='D/O ID' )
              Column(field='sellerEmail' header='Seller Email' :sortable='true')
              Column(field='receiverAddress' header='Receiver Address' )
              Column(field='completeTime' header='Complete time' className="text-right" )
                template(#body='{ data }')
                  div.grid-cell-right {{ data.completeTime | dateTimeHour24 }}
              Column(field='warehouse.name' header='Warehouse' className="text-right" )
                template(#body='{data}')
                  span {{data.warehouse.name}}
              template(#empty)
                div.flex.align-items-center.justify-content-center.flex-column
                  img(:srcset="`${require('~/assets/images/table-empty.png')} 2x`")
                  p.text-900.font-bold.mt-3 Information not found!`
</template>

<script lang='ts'>
import { Component, namespace, Vue } from 'nuxt-property-decorator'
import { Paging } from '~/models/common/Paging'
import { refreshAllFilter } from '~/utils'
import Pagination from '~/components/common/Pagination.vue'
const nsStoreOrder = namespace('stock-out/create-order')
const nsStoreWarehouse = namespace('warehouse/warehouse-list')
const nsStoreDriver = namespace('driver/driver-list')
@Component({
  components: {
    Pagination
  }
})
class DriverList extends Vue {
  selectedDriver: any = []
  paging: Paging.Model = { pageNumber:0, pageSize:10, first: 0 }
  sellerEmail: string = ''
  warehouse: any = null
  filter: any = {
    phone: null,
    name: null,
    email: null,
    warehouse: null
  }

  get total() {
    return this.totalList
  }

  arrDriverHistory: any[] =[]
  expandedRows=[]
  // -- [ State ] ------------------------------------------------------------
  @nsStoreOrder.State
  inventoryStore!: any

  @nsStoreDriver.State
  driverList!: any

  @nsStoreDriver.State
  totalList!: any

  @nsStoreDriver.State
  driverHistory!: any

  @nsStoreWarehouse.State
  warehouseList!: any

  // -- [ Action ] ------------------------------------------------------------

  @nsStoreWarehouse.Action
  actWarehouseList!: any

  @nsStoreDriver.Action
  actDriverList!: (params: any) => Promise<string>

  @nsStoreDriver.Action
  actGetDriverHistoryById!: (params: any) => Promise<any>

  // -- [ Functions ] ------------------------------------------------------------
  async mounted() {
    await this.actWarehouseList()
    await this.getDriverList()
  }

  handleFilter(e: any, name: string){
    this.filter[name] = e
  }

  onPage(event: any) {
    this.paging.pageSize = event.rows
    this.paging.pageNumber = event.page
  }

  refreshFilter() {
    refreshAllFilter(this.filter)
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
  }

  rowSelect({ data }) {
    this.selectedDriver.push(data)
    if (this.selectedDriver.length > 1 ) {
      this.selectedDriver = []
      this.selectedDriver.push(data)
    }
    this.$emit('selectDriver',this.selectedDriver)
  }

  rowUnselect() {
    this.selectedDriver = []
    this.$emit('selectDriver',this.selectedDriver)
  }

  handleAssign() {
    this.$router.push('/stock-out/order-list')
  }

  async getDriverList(){
    const warehouseId = this.filter.warehouseId
      ? this.filter.warehouseId.map((item: any) => item?.id).toString()
      : null
    await this.actDriverList({
      ...this.filter,
      warehouseId,
      pageSize: this.paging.pageSize,
      pageNumber: this.paging.pageNumber
    })
  }

  async onRowExpand(event){
    const params = {
      desc: true,
      pageSize: 10
    }
    const id= event.data.id
    await this.actGetDriverHistoryById({ params, id })
    const index = this.driverList.indexOf(event.data)
    if( !this.arrDriverHistory.includes(this.driverHistory)){
      this.arrDriverHistory[index] = this.driverHistory
      this.$forceUpdate()
    }
    
  }

  onRowCollapse(){

  }
}
export default DriverList
</script>

<style lang='sass' scoped>
::v-deep.inventory
  @include flex-column
  .pi-calendar:before
    content: url('~/assets/icons/calendar.svg')
  .p-calendar-w-btn
    .p-button
      background: none
      border: none
  min-height: 60vh
  .p-inputtext
    box-shadow: none
  &__header
    @include flex-center-space-between
    margin-bottom: $space-size-24
    &--action
      @include flex-center
      gap: 0 16px
  &__filter
    margin-bottom: $space-size-24
  &__content
    flex: 1
    border-radius: 4px
    position: relative
    overflow: hidden
    .p-datatable-table
      .text-primary
        color: $primary-dark !important
        font-weight: $font-weight-medium
      .p-datatable-tbody
        & > tr
          //background: $text-color-100
          height: 4rem !important
          .text-bold
            color: $text-color-700
            .p-inputnumber-input
              color: $text-color-700
        & > tr > td
          padding-top: 0
          padding-bottom: 0
        .outgoing__selected
          background: $color-white
          > .text-bold
            font-weight: $font-weight-bold
            color: $text-color-900
            .p-inputnumber-input
              font-weight: $font-weight-bold
              color: $text-color-900 !important
      .p-datatable-thead > tr > th
        white-space: unset
        .p-column-header-content
          .p-checkbox
            display: none
      .p-datatable-thead > tr > th
        white-space: unset
  .text-right
    text-align: right !important
    .p-column-header-content
      justify-content: end !important
.filter__dropdown, .filter__multiselect
  @include size(100%, 40px)
  border: none
::v-deep.bg-white
  background: $text-color-100 !important
.pagination
  padding-top: 0.5rem
  padding-bottom: 0.5rem
.p-datatable-row-expansion
  background: black !important
.orders-subtable 
  ::v-deep.p-datatable-tbody > tr
    height: 3rem !important
  ::v-deep.p-datatable
    border: solid 1px #e9ecef
</style>
