<template lang="pug">
  .grid.flex.grid-nogutter
    div.bg-white.border-round-top.sub-tab(class='col-3 md:col-3 lg:col-3 xl:col-3')
      .col.flex.align-items-center.px-3
        Button(@click='$router.go(-1)').p-button-link
          .icon-arrow-left.icon.bg-primary.align-items-center
        Breadcrumb.font-bold(:home="homeItem" :model="breadcrumbItem")
      .border-bottom-1.border-gray-300.grid-nogutter
      div.flex.justify-content-center
        .col.my-3.px-3
          img(:src=" driverDetail.avatarUrl | getImageUrl ").border-round.w-full
      div.sub--scroll.col-12
        div.wrap-unit.px-3
          .col.border-bottom-1.border-gray-300
          .col.flex.my-3.mx-1
            .col.flex.align-items-center
              .icon-sender-info.icon.bg-primary.mr-2
              span.font-bold.text-800.uppercase ID Information
        div.wrap-unit.px-4
          StockUnit(title="Citizen ID Number"  :value="driverDetail.citizenNumber" icon="icon-receipt-note")
        div.wrap-unit.px-4
          StockUnit(title="DOB" :value="driverDetail.dateOfBirth | dateMonthYear"  icon="icon-tag-user")
        div.wrap-unit.px-4
          StockUnit(title="Native Place"  :value="driverDetail.driverEmail" icon="icon-warehouse")
        div.wrap-unit.px-4
          StockUnit(title="Place of Permanent"  :value="driverDetail.placeOfPermanent" icon="icon-warehouse")
        div.col-12
          .col.border-bottom-1.border-gray-300
          .col.flex.my-3.mx-1
            .col.flex.align-items-center
              .icon-sender-info.icon.bg-primary.mr-2
              span.font-bold.text-800.uppercase Contact Information
        .wrap-unit.px-4
          StockUnit(title="Name" :value="driverDetail.driverName" icon="icon-sender-name")
        .wrap-unit.px-4
          StockUnit(title="Email" :value="driverDetail.driverEmail" icon="icon-sender-email")
        .wrap-unit.px-4
          StockUnit(title="Phone" :value="driverDetail.driverPhone" icon="icon-sender-phone")
    div.ml-5.flex-1( class=' col-9  md:col-8  lg:col-9 xl:col-9' )
      .inventory.flex.flex-column
        .inventory__header
          div
            h1.text-heading Driver Information
            span.text-subheading {{ totalDetailList }} results found
          .inventory__header--action.flex
            .btn__filter
              .btn-toggle(@click="isShowFilter = !isShowFilter")
                .icon.icon-filter(v-if="!isShowFilter")
                .icon.icon-chevron-up.bg-primary(v-else)
                span Filter
              .btn-refresh(@click="refreshFilter")
                .icon.icon-rotate-left.bg-white
            .btn.bg-white(@click='$router.go(-1)') Back
            Button.btn.btn-primary.border-0(@click='handleAssign') Assign Delivery
        .inventory__filter.grid(v-if='isShowFilter')
          .col
            FilterTable(
              title="D/O ID"
              :value="filter.id"
              placeholder="Enter D/O ID"
              name="id"
              :searchText="true"
              @updateFilter="handleFilter"
            )
          .col
            FilterTable(
              title="Seller Email"
              :value="filter.sellerEmail"
              placeholder="Enter Email"
              name="sellerEmail"
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
                  @change="handleChangeFilter"
                  :options='warehouseList'
                  optionLabel="name"
                  placeholder='Select'
                  :filter='true'
                )
        .inventory__content
          DataTable(
              :value='driverHistory'
              dataKey='deliveryOrderId'
              :rows='10'
              responsiveLayout="scroll"
              :resizableColumns="true"
              :class="{ 'table-wrapper-empty': !driverDetail || driverDetail.length <= 0 }"
              @sort="sortData($event)"
            )
              Column(field='no' header='NO' :styles="{'width': '3rem'}" bodyClass='text-bold')
                template(#body='slotProps') {{ (paging.pageNumber) * paging.pageSize + slotProps.index + 1 }}
              Column(field='deliveryOrderId' header='D/O ID' :sortable='true' sortField='_stock.barCode')
              Column(field='sellerEmail' header='Seller Email' :sortable='true' sortField='_sku')
              Column(field='receiverAddress' header='Receiver Address' :sortable='true' bodyClass='font-semibold' sortField='_box.id')
              Column(field='completeTime' header='Complete time' :sortable='true' className="text-right" sortField='_box.request.id')
                template(#body='{data}')
                  span {{data.completeTime | dateTimeHour12 }}
              Column(field='warehouse.name' header='Warehouse' :sortable='true' className="text-right" sortField='_box.request.id')
                template(#body='{data}')
                  span.text-primary {{data.warehouse.name}}
              template(#footer)
                Pagination(
                  :paging="paging"
                  :total="totalDetailList"
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

<script lang="ts">
import { Component, namespace, Vue } from 'nuxt-property-decorator'
import { Paging } from '~/models/common/Paging'
import { PAGINATE_DEFAULT, refreshAllFilter } from '~/utils'
import Pagination from '~/components/common/Pagination.vue'
const nsStoreWarehouse = namespace('warehouse/warehouse-list')
const nsStoreDriver = namespace('driver/driver-list')

@Component({
  components: {
    Pagination
  }
})
class DriverDetail extends Vue {
  paging: Paging.Model = { ...PAGINATE_DEFAULT, first: 0 }
  isShowFilter: boolean = false
  sortByColumn: string = ''
  isDescending: boolean | null = null
  filter: any = {
    id: null,
    sellerEmail: null,
    warehouseId: null,
    name: null,
    pageSize: 20,
    pageNumber: 0
  }

  // -- [ State ] ------------------------------------------------------------

  @nsStoreDriver.State
  driverDetail!: any

  @nsStoreDriver.State
  driverHistory!: any

  @nsStoreDriver.State
  totalDetailList!: any

  @nsStoreWarehouse.State
  warehouseList!: any

  // -- [ Action ] ------------------------------------------------------------

  @nsStoreWarehouse.Action
  actWarehouseList!: any

  @nsStoreDriver.Action
  actDriverDetail!: (params: any) => Promise<string>

  @nsStoreDriver.Action
  actDriverHistory!: (params: any) => Promise<string>

  @nsStoreDriver.Action
  actSetAssignDriver!: (params: any) => Promise<string>

  async mounted() {
    await Promise.all([
      this.getDriverList(),
      this.actDriverDetail({
        id: this.$route.params.sid
      }),
      this.actWarehouseList()
    ])
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
    const filter = {
      ...this.filter,
      pageSize: this.paging.pageSize,
      pageNumber: this.paging.pageNumber,
      warehouseId: warehouseId || null
    }
    await this.actDriverHistory({
      filter,
      id: this.$route.params.sid
    })
  }

  handleChangeFilter() {
    this.getDriverList()
    if(this.filter.warehouseId.length === 0) {
      this.filter.warehouseId = ''
      this.getDriverList()
    }
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

  get homeItem() {
    return { label: 'D/O List', to: '/stock-out/order-list' }
  }

  get breadcrumbItem() {
    return [
      { label: 'Driver',
        to: `/stock-out/order/${this.$route.params.id}/driver` },
      { label: 'Information',
        to: `/stock-out/order/${this.$route.params.id}/driver/${this.$route.params.sid}`
      }
    ]
  }

  handleAssign() {
    const result = this.actSetAssignDriver({
      id : this.$route.params.sid,
      idDelivery: this.$route.params.id
    } )
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

export default DriverDetail
</script>

<style lang="sass" scoped>

@media (max-width: 1024px)
  .tabview-left
    top: -4rem !important
    .input-absolute
      width: 15rem !important
@media (max-width: 768px)
  .tabview-left
    top: -3rem !important
    .input-absolute
      width: 15rem !important
  .tabview-relative
    margin-top: 3rem
.tabview-relative
  position: relative
  .tabview-left
    position: absolute
    top: -0.5rem
    right: 0

.grid
  ::v-deep.sub-tab
    height: calc(100vh - 32px)
    max-width: 23rem
    overflow: hidden
.sub--scroll
  height: calc(100vh - 280px)
  overflow: auto

::-webkit-input-placeholder
  font-weight: normal

::-webkit-scrollbar
  width: 7px
  height: 7px
  background-color: #F5F5F5

::-webkit-scrollbar-track
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3)
  border-radius: 10px
  background-color: #F5F5F5

::-webkit-scrollbar-thumb
  border-radius: 10px
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3)
  background-color: #979AA4

.wrap-unit
  width: 300px
  margin-bottom: 16px

::v-deep.inventory
  height: calc(100vh - 32px)
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
  .text-right
    text-align: right !important
    .p-column-header-content
      justify-content: end !important
  .filter__dropdown, .filter__multiselect
    @include size(100%, 40px)
    border: none

</style>
