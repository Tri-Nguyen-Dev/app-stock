<template lang='pug'>
  .inventory
    .inventory__header
      div
        h1.text-heading Driver list
        span.text-subheading {{ totalList }} results found
      .inventory__header--action
        .btn__filter(:class="{'active': isShowFilter}")
          .btn-toggle(@click.stop="isShowFilter = !isShowFilter")
            .icon.icon-filter(v-if="!isShowFilter")
            .icon.icon-chevron-up.bg-primary(v-else)
            span Filter
          .btn-refresh(@click="refreshFilter")
            .icon.icon-rotate-left.bg-white
        .btn.bg-white(@click='$router.go(-1)') Back
        Button.btn.btn-primary.border-0(@click='handleAssign' :disabled='selectedDriver.length > 0 ? null : "disabled"') Assign Delivery
    .inventory__filter.grid(v-if='isShowFilter')
      .col
        FilterTable(
          title="Driver Phone"
          :value="filter.driverPhone"
          placeholder="Enter Phone"
          name="driverPhone"
          :searchText="true"
          @updateFilter="handleFilter"
        )
      .col
        FilterTable(
          title="Driver Email"
          :value="filter.driverEmail"
          placeholder="Enter Email"
          name="driverEmail"
          :searchText="true"
          @updateFilter="handleFilter"
        )
      .col
        FilterTable(
          title="Driver Name"
          :value="filter.driverName"
          placeholder="Enter Name"
          name="driverName"
          :searchText="true"
          @updateFilter="handleFilter"
        )
      .col
        FilterTable(title="Warehouse" name="warehouseId" :value="filter.warehouseId"  @updateFilter="handleFilter")
          template(v-slot:multi-select)
            MultiSelect.filter__multiselect(
              v-model='filter.warehouseId'
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
        :resizableColumns="true"
        :class="{ 'table-wrapper-empty': !driverList || driverList.length <= 0 }"
        @sort="sortData($event)"
        @row-select="rowSelect"
        :selection="selectedDriver"
        @row-unselect="rowUnselect"
        @row-dblclick="onRowClick($event)"
      )
        Column(selectionMode='multiple' class="selected-header")
        Column(field='no' header='NO' :styles="{'width': '3rem'}" bodyClass='text-bold')
          template(#body='slotProps') {{ (paging.pageNumber) * paging.pageSize + slotProps.index + 1 }}
        Column(field='driverPhone' header='Driver Phone' :sortable='true' sortField='_driver.phoneNumber')
        Column(field='driverEmail' header='Driver Email' :sortable='true' sortField='_driver.email')
        Column(field='driverName' header='Driver Name' :sortable='true' bodyClass='font-semibold' sortField='_driver.displayName')
        Column(field='totalDelivered' header='Total Delivered D/0' :sortable='true' className="text-right" sortField='_totalDelivered')
        Column(field='totalDelivering' header='Total Delivering D/0' :sortable='true' className="text-right" sortField='_totalDelivering')
        Column(field='warehouse.name' header='Warehouse' :sortable='true' className="text-right" sortField='_warehouse.name')
          template(#body='{data}')
            span.text-primary {{data.warehouse.name}}
        template(#footer)
          Pagination(
            :paging="paging"
            :total="totalList"
            @onPage="onPage"
          )
        template(#empty)
          div.flex.align-items-center.justify-content-center.flex-column
            img(:srcset="`${require('~/assets/images/table-empty.png')} 2x`" v-if="!checkIsFilter")
            img(:srcset="`${require('~/assets/images/table-notfound.png')} 2x`" v-else)
            p.text-900.font-bold.mt-3(v-if="!checkIsFilter") List is empty!, Click
              span.text-primary.underline.cursor-pointer &nbsp;here
              span &nbsp;to add item.
            p.text-900.font-bold.mt-3(v-else) Item not found!
</template>

<script lang='ts'>
import { Component, namespace, Vue } from 'nuxt-property-decorator'
import { Paging } from '~/models/common/Paging'
import { PAGINATE_DEFAULT, refreshAllFilter } from '~/utils'
import Pagination from '~/components/common/Pagination.vue'
const nsStoreDriver = namespace('driver/driver-list')
const nsStoreWarehouse = namespace('warehouse/warehouse-list')

@Component({
  components: {
    Pagination
  }
})
class DriverList extends Vue {
  selectedDriver: Array = []
  paging: Paging.Model = { ...PAGINATE_DEFAULT, first: 0 }
  isShowFilter: boolean = false
  isIdSelected: string
  sortByColumn: string = ''
  isDescending: boolean | null = null
  filter: any = {
    driverPhone: null,
    driverName: null,
    driverEmail: null,
    warehouseId: null,
    pageSize: 20,
    pageNumber: 0
  }

  // -- [ State ] ------------------------------------------------------------

  @nsStoreWarehouse.State
  warehouseList!: any

  @nsStoreDriver.State
  driverList!: any

  @nsStoreDriver.State
  totalList!: any

  // -- [ Action ] ------------------------------------------------------------

  @nsStoreDriver.Action
  actDriverList!: (params: any) => Promise<string>

  @nsStoreDriver.Action
  actSetAssignDriver!: (params: any) => Promise<string>

  @nsStoreWarehouse.Action
  actWarehouseList!: any

  // -- [ Functions ] ------------------------------------------------------------
  async mounted() {
    await this.actWarehouseList()
    await this.getDriverList()

  }

  handleFilter(e: any, name: string){
    this.filter[name] = e
    this.getDriverList()
  }

  async onPage(event: any) {
    this.paging.pageSize = event.rows
    this.paging.pageNumber = event.page
    await this.getDriverList()
  }

  get checkIsFilter() {
    const params = _.omit(this.filter, ['pageNumber', 'pageSize'])
    return Object.values(params).some((item) => item)
  }

  async refreshFilter() {
    refreshAllFilter(this.filter)
    await this.getDriverList()
  }

  async getDriverList(){
    const warehouseId = this.filter.warehouseId
      ? this.filter.warehouseId.map((item: any) => item?.id).toString()
      : null
    await this.actDriverList({
      ...this.filter,
      warehouseId: warehouseId || null,
      pageSize: this.paging.pageSize,
      pageNumber: this.paging.pageNumber
    })
  }

  onRowClick({ data }) {
    this.$router.push({
      path: `/stock-out/order/${this.$route.params.id}/driver/${data.id}`
    })
  }

  async sortData(e: any) {
    const { sortField, sortOrder } = e
    if(sortOrder){
      this.isDescending = sortOrder !== 1
      this.sortByColumn = sortField.replace('_', '')
    }else{
      this.isDescending = null
      this.sortByColumn = ''
    }
    await this.getDriverList()
  }

  rowSelect({ data }) {
    this.isIdSelected = data.id
    const selected = this.selectedDriver
    selected.push(data)
    if (selected.length > 1 ) {
      selected.splice(0)
      selected.push(data)
    }
  }

  rowUnselect() {
    this.selectedDriver.splice(0)
  }

  handleAssign() {
    const result = this.actSetAssignDriver({ id : this.isIdSelected  } )
    if(result) {
      this.$router.push('/stock-out/order-list')
      this.$toast.add({
        severity: 'success',
        summary: 'Success Message',
        detail: 'Successfully Assign Driver',
        life: 3000
      })
    } else {
      this.$toast.add({
        severity: 'error',
        summary: 'Error  Message',
        detail: 'Error Assign Driver',
        life: 3000
      })
    }
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
  height: calc(100vh - 32px)
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
          background: $text-color-100
          .text-bold
            color: $text-color-700
            .p-inputnumber-input
              color: $text-color-700
      .p-datatable-thead > tr > th
        white-space: unset
        .p-column-header-content
          .p-checkbox
            display: none
  .text-right
    text-align: right !important
    .p-column-header-content
      justify-content: end !important
.filter__dropdown, .filter__multiselect
  @include size(100%, 40px)
  border: none
.selected-header
  display: none
</style>
