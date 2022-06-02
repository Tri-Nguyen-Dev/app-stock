<template lang='pug'>
  .inventory
    .inventory__filter.grid(v-if='isShowFilter')
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
        :resizableColumns="true"
        :class="{ 'table-wrapper-empty': !driverList || driverList.length <= 0 }"
        @sort="sortData($event)"
        @row-select="rowSelect"
        :selection="selectedDriver"
        @row-unselect="rowUnselect"
      )
        Column(selectionMode='single')
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
            p.text-900.font-bold.mt-3(v-else) Item not found!
</template>

<script lang='ts'>
import { Component, namespace, Vue } from 'nuxt-property-decorator'
import { Paging } from '~/models/common/Paging'
import { PAGINATE_DEFAULT, refreshAllFilter } from '~/utils'
import Pagination from '~/components/common/Pagination.vue'
const nsStoreOrder = namespace('stock-out/create-order')
const nsStoreWarehouse = namespace('warehouse/warehouse-list')

@Component({
  components: {
    Pagination
  }
})
class DriverList extends Vue {
  selectedDriver: any = []
  paging: Paging.Model = { ...PAGINATE_DEFAULT, first: 0 }
  isShowFilter: boolean = true
  sellerEmail: string = ''
  warehouse: any = null
  filter: any = {
    phone: null,
    name: null,
    email: null,
    warehouse: null
  }

  data: any = {
    total: 16,
    items: [
      {
        'id':'af17a3a0-e548-4d65-9bf7-bf46a4bdd4ff',
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
        'id':'af17a3a0-e548-4d65-9bf7-bf46a4bdd4f1',
        'driverPhone': '03261321321',
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
      },
      {
        'id':'af17a3a0-e548-4d65-9bf7-bf46a4bdd4f2',
        'driverPhone': '03261321322',
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
      },
      {
        'driverPhone': '03261321323',
        'id':'af17a3a0-e548-4d65-9bf7-bf46a4bdd4f3',
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
      },
      {
        'driverPhone': '03261321324',
        'id':'af17a3a0-e548-4d65-9bf7-bf46a4bdd4f4',
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
      },
      {
        'driverPhone': '03261321325',
        'id':'af17a3a0-e548-4d65-9bf7-bf46a4bdd4f5',
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
      },
      {
        'driverPhone': '03261321326',
        'id':'af17a3a0-e548-4d65-9bf7-bf46a4bdd4f6',
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
      },
      {
        'driverPhone': '03261321327',
        'id':'af17a3a0-e548-4d65-9bf7-bf46a4bdd4f7',
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
      },
      {
        'driverPhone': '03261321328',
        'id':'af17a3a0-e548-4d65-9bf7-bf46a4bdd4f8',
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
      },
      {
        'driverPhone': '03261321329',
        'id':'af17a3a0-e548-4d65-9bf7-bf46a4bdd4f9',
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
      },
      {
        'driverPhone': '032613213210',
        'id':'af17a3a0-e548-4d65-9bf7-bf46a4bdd4f10',
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
      },
      {
        'driverPhone': '032613213211',
        'id':'af17a3a0-e548-4d65-9bf7-bf46a4bdd4f11',
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
  @nsStoreOrder.State
  inventoryStore!: any

  @nsStoreWarehouse.State
  warehouseList!: any

  // -- [ Action ] ------------------------------------------------------------

  @nsStoreWarehouse.Action
  actWarehouseList!: any

  // -- [ Functions ] ------------------------------------------------------------
  async mounted() {
    await this.actWarehouseList()
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
::v-deep.bg-white
  background: $text-color-100 !important
</style>
