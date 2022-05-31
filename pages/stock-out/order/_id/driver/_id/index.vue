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
          img(:src="link ").border-round.w-full
          // | getImageUrl
      div.sub--scroll.col-12
        div.wrap-unit.px-3
          .col.border-bottom-1.border-gray-300
          .col.flex.my-3.mx-1
            .col.flex.align-items-center
              .icon-sender-info.icon.bg-primary.mr-2
              span.font-bold.text-800.uppercase Contact Information
        div.wrap-unit.px-4
          StockUnit(title="Citizen ID Number"  :value="receiptNoteId" icon="icon-receipt-note")
        div.wrap-unit.px-4
          StockUnit(title="DOB" :value="receiptNoteId"  icon="icon-tag-user")
        div.wrap-unit.px-4
          StockUnit(title="Native Place"  :value="boxWarehouse" icon="icon-warehouse")
        div.wrap-unit.px-4
          StockUnit(title="Place of Permanent"  :value="boxWarehouse" icon="icon-warehouse")
        div.col-12
          .col.border-bottom-1.border-gray-300
          .col.flex.my-3.mx-1
            .col.flex.align-items-center
              .icon-sender-info.icon.bg-primary.mr-2
              span.font-bold.text-800.uppercase Contact Information
        .wrap-unit.px-4
          StockUnit(title="Name" :value="receiptNoteId" icon="icon-sender-name")
        .wrap-unit.px-4
          StockUnit(title="Email" :value="receiptNoteId" icon="icon-sender-email")
        .wrap-unit.px-4
          StockUnit(title="Phone" :value="receiptNoteId" icon="icon-sender-phone")
    div.ml-5.flex-1( class=' col-9  md:col-8  lg:col-9 xl:col-9' )
      .inventory.flex.flex-column
        .inventory__header
          div
            h1.text-heading Driver Information
            span.text-subheading {{ total }} results found
          .inventory__header--action.flex
            .btn__filter
              .btn-toggle(@click="isShowFilter = !isShowFilter")
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
              :value="filter.phone"
              placeholder="Enter Phone"
              name="phone"
              :searchText="true"
              @updateFilter="handleFilter"
            )
          .col
            FilterTable(
              title="Driver Email"
              :value="filter.email"
              placeholder="Enter Email"
              name="email"
              :searchText="true"
              @updateFilter="handleFilter"
            )
          .col
            FilterTable(
              title="Driver Name"
              :value="filter.name"
              placeholder="Enter Name"
              name="name"
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
              dataKey='driverPhone'
              :rows='10'
              responsiveLayout="scroll"
              :resizableColumns="true"
              :class="{ 'table-wrapper-empty': !driverList || driverList.length <= 0 }"
              @sort="sortData($event)"
              @row-select="rowSelect"
              :selection="selectedDriver"
              @row-unselect="rowUnselect"
            )
              Column(selectionMode='multiple')
              Column(field='no' header='NO' :styles="{'width': '3rem'}" bodyClass='text-bold')
                template(#body='slotProps') {{ (paging.pageNumber) * paging.pageSize + slotProps.index + 1 }}
              Column(field='driverPhone' header='Driver Phone' :sortable='true' sortField='_stock.barCode')
              Column(field='driverEmail' header='Driver Email' :sortable='true' sortField='_sku')
              Column(field='driverName' header='Driver Name' :sortable='true' bodyClass='font-semibold' sortField='_box.id')
              Column(field='totalDelivered' header='Total Delivered D/0' :sortable='true' className="text-right" sortField='_box.request.id')
              Column(field='totalDelivering' header='Total Delivering D/0' :sortable='true' className="text-right" sortField='_stock.createdAt')
              Column(field='warehouse.name' header='Warehouse' :sortable='true' className="text-right" sortField='_box.request.id')
                template(#body='{data}')
                  span.text-primary {{data.warehouse.name}}
              template(#footer)
                Pagination(
                  :paging="paging"
                  :total="total"
                  @onPage="onPage"
                )
              template(#empty)
                div.flex.align-items-center.justify-content-center.flex-column
                  img(:srcset="`${require('~/assets/images/table-empty.png')} 2x`" v-if="!checkIsFilter")
                  img(:srcset="`${require('~/assets/images/table-notfound.png')} 2x`" v-else)
                  p.text-900.font-bold.mt-3(v-if="!checkIsFilter") List is empty!, Click
                    span.text-primary.underline.cursor-pointer &nbsp;here
                    span &nbsp;to add item.
                  p.text-900.font-bold.mt-3(v-else) Item not found!`
</template>

<script lang="ts">
import { Component, namespace, Vue } from 'nuxt-property-decorator'
import { Paging } from '~/models/common/Paging'
import { PAGINATE_DEFAULT, refreshAllFilter } from '~/utils'
import Pagination from '~/components/common/Pagination.vue'
const nsStoreWarehouse = namespace('warehouse/warehouse-list')

@Component({
  components: {
    Pagination
  }
})
class DriverDetail extends Vue {
  paging: Paging.Model = { ...PAGINATE_DEFAULT, first: 0 }
  selectedDriver: any = []
  isShowFilter: boolean = false
  link = 'https://img.cand.com.vn/resize/800x800/NewFiles/Images/2022/02/21/1645405385021-1645411783261.jpg'
  filter: any = {
    phone: null,
    email: null,
    warehouse: null,
    name: null
  }

  data: any = {
    total: 16,
    items: [
      {
        'driverPhone': '0326132131',
        'driverEmail': 'sellerhuan1@gmail.com',
        'driverName': 'Seller Huân1',
        'totalDelivered': 20,
        'totalDelivering': 2,
        'warehouse': {
          'id': '1',
          'name': 'Amazone',
          'icon': null,
          'address': '011 Pawling Junction',
          'description': 'description1',
          'phone': '3811835987',
          'email': 'warehouse1@gmail.com',
          'maxNumberRack': null
        }

      },
      {
        'driverPhone': '0326132132',
        'driverEmail': 'sellerhuan@gmail.com',
        'driverName': 'Seller Huân',
        'totalDelivered': 20,
        'totalDelivering': 2,
        'warehouse': {
          'id': '1',
          'name': 'Zappos',
          'icon': null,
          'address': '011 Pawling Junction',
          'description': 'description1',
          'phone': '3811835987',
          'email': 'warehouse1@gmail.com',
          'maxNumberRack': null
        }
      }
    ]
  }

  get total() {
    return this.data.total
  }

  get driverList(){
    return this.data.items
  }

  // -- [ State ] ------------------------------------------------------------

  @nsStoreWarehouse.State
  warehouseList!: any

  // -- [ Action ] ------------------------------------------------------------

  @nsStoreWarehouse.Action
  actWarehouseList!: any

  refreshFilter(){
    refreshAllFilter(this.filter)
  }

  async mounted() {
    await this.actWarehouseList()
  }

  handleAssign() {
    this.$router.push('/stock-out/order-list')
    this.$toast.add({
      severity: 'success',
      summary: 'Success Message',
      detail: 'Successfully Assign Driver',
      life: 3000
    })
  }

  onPage(event: any) {
    this.paging.pageSize = event.rows
    this.paging.pageNumber = event.page
  }

  rowSelect({ data }) {
    this.selectedDriver.push(data)
    if (this.selectedDriver.length > 1 ) {
      this.selectedDriver = []
      this.selectedDriver.push(data)
    }
  }

  rowUnselect() {
    this.selectedDriver = []
  }

  handleFilter(e: any, name: string){
    this.filter[name] = e
  }

}

export default DriverDetail
</script>

<style lang="sass" scoped>
.box-page
  display: flex
  flex-direction: column
  height: calc( 100vh - 32px )
.box__table
  flex: 1
  overflow : hidden
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
    max-width: 22rem
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
  .text-right
    text-align: right !important
    .p-column-header-content
      justify-content: end !important
  .filter__dropdown, .filter__multiselect
    @include size(100%, 40px)
    border: none
</style>
