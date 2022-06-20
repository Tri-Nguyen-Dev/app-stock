<template lang="pug">
.inventory
  .inventory__filter.grid.mb-1
    .col-12(class='xl:col-2 lg:col-2 md:col-4 sm:col-12')
      FilterTable(
        title="Seller Email"
        placeholder="Enter Seller Email"
        name="sellerEmail"
        :value="filter.sellerEmail"
        :searchText="true"
        @updateFilter='handleFilterBox'
        )
    .col-12(class='xl:col-2 lg:col-2 md:col-4 sm:col-12')
      FilterTable(
        title='Location',
        :value='filter.location',
        placeholder='Enter location',
        name='location',
        :searchText='true',
        @updateFilter='handleFilterBox'
      )
    .col-12(class='xl:col-2 lg:col-2 md:col-4 sm:col-12')
      FilterTable(
        title='Box Code',
        :value='filter.barCode',
        placeholder='Enter code',
        name='barCode',
        :searchText='true',
        @updateFilter='handleFilterBox'
      )
    .col-12(class='xl:col-3 lg:col-3 md:col-4 sm:col-12')
      FilterCalendar(
        title='From',
        :value='filter.dateFrom',
        name='dateFrom',
        inputClass='border-0',
        dateFormat='dd-mm-yy',
        :showIcon='true',
        @updateFilter='handleFilterBox'
      )
    .col-12(class='xl:col-3 lg:col-3 md:col-4 sm:col-12')
      FilterCalendar(
        title='To',
        border='right',
        :value='filter.dateTo',
        name='dateTo',
        inputClass='border-0',
        dateFormat='dd-mm-yy',
        :showIcon='true',
        @updateFilter='handleFilterBox'
      )
    .col-10
    .col-12.text-right(class='xl:col-2 lg:col-2 md:col-4 sm:col-12' style='align-self: center;')
      Button.p-button-secondary.mr-1(label="Refresh" icon="pi pi-refresh" @click="handleRefeshFilter")
      Button.p-button-primary(label="Search" icon="pi pi-search"   @click="searchBox")
  .inventory__content
    DataTable(
      v-if='boxList',
      :value='boxList',
      responsiveLayout='scroll',
      :selection='selectedBoxes',
      removableSort,
      dataKey='id',
      :rows='20',
      :scrollable='false',
      @sort='sortData($event)',
      :class='{ "table-wrapper-empty": !boxList || boxList.length <= 0 }',
      @row-select-all='rowSelectAll',
      @row-unselect-all='rowUnSelectAll',
      @row-select='rowSelect',
      @row-unselect='rowUnselect'
    )
      Column(
        selectionMode='multiple',
        :styles='{ width: "3rem" }',
        :selection='selectedBoxes'
      )
      Column(field='no', header='NO')
        template(#body='slotProps')
          span.font-semibold {{ paging.pageNumber * paging.pageSize + slotProps.index + 1 }}
      Column(
        field='id',
        header='BOX CODE',
        :sortable='true',
        bodyClass='font-semibold',
        sortField='_id'
      )
      Column(
        field='sellerEmail',
        header='SELLER EMAIL',
        :sortable='true',
        className='w-3',
        sortField='_request.seller.email'
      )
      Column(
        field='usedCapacity',
        header='USED CAPACITY',
        className='text-right'
      )
        template(#body='{ data }') {{ data.usedCapacity | capacityPercent }}
      Column(
        field='rackLocation.name',
        header='LOCATION',
        :sortable='true',
        className='text-right',
        sortField='_rackLocation.name'
      )
        template(#body='{ data }')
          div(v-if='data.location')
            .flex.align-items-center.cursor-pointer.justify-content-end
              span.font-bold {{ data.location }}
      template(#footer)
        Pagination(
          :paging='paging',
          :total='totalBoxRecords',
          @onPage='onPage'
        )
      template(#empty)
        .flex.align-items-center.justify-content-center.flex-column
          img(:srcset='`${require("~/assets/images/table-notfound.png")} 2x`')
          p.text-900.font-bold.mt-3 Item not found!
</template>

<script lang="ts">
import { Component, namespace, Prop, Vue } from 'nuxt-property-decorator'
import { Box } from '~/models/Box'
import Pagination from '~/components/common/Pagination.vue'
import { Paging } from '~/models/common/Paging'
import { User } from '~/models/User'
const nsStoreBox = namespace('box/box-list')
const nsStoreWarehouse = namespace('warehouse/warehouse-list')
const dayjs = require('dayjs')
const nsStoreUser = namespace('user-auth/store-user')
@Component({
  components: {
    Pagination
  }
})
class BoxDataTable extends Vue {
  
  @Prop({ default: [] }) box
  selectedBoxes: Box.Model[] = []
  paging: Paging.Model = { pageNumber:0, pageSize:10, first: 0 }
  sortByColumn: string = ''
  isDescending: boolean | null = null
  boxCodeDelete: string = ''
  filter: any = {
    sellerEmail: '',
    warehouse: null,
    location: '',
    barCode: '',
    dateFrom: null,
    dateTo: null
  }

  @nsStoreBox.State
  boxList!: Box.Model[]

  @nsStoreBox.State
  totalBoxRecords!: number

  @nsStoreWarehouse.State
  warehouseList!: any

  @nsStoreUser.State
  user: User.Model | undefined

  @nsStoreBox.Action
  actGetBoxList!: (params: any) => Promise<void>

  @nsStoreWarehouse.Action
  actWarehouseList!: () => Promise<void>

  async mounted() {
    await this.actGetBoxList({
      pageNumber: this.paging.pageNumber,
      pageSize: this.paging.pageSize
    })
    await this.actWarehouseList()
    this.selectedBoxes = [...this.box]
  }
  // @Watch('box')
  // rerenderView(){

  // }
  // -- [ Getters ] -------------------------------------------------------------

  // -- [ Functions ] ------------------------------------------------------------
  getParamAPi() {
    return {
      pageNumber: this.paging.pageNumber,
      pageSize: this.paging.pageSize,
      sellerEmail: this.filter.sellerEmail || null,
      barCode: this.filter.barCode || null,
      warehouseId: this.user?.warehouse?.id,
      location: this.filter.location || null,
      from: this.filter.dateFrom
        ? dayjs(new Date(this.filter.dateFrom)).format('YYYY-MM-DD')
        : null,
      to: this.filter.dateTo
        ? dayjs(new Date(this.filter.dateTo)).format('YYYY-MM-DD')
        : null,
      sortBy: this.sortByColumn || null,
      desc: this.isDescending
    }
  }

  handleFilterBox(e: any, name: string) {
    this.filter[name] = e
  }

  async onPage(event: any) {
    this.paging.pageSize = event.rows
    this.paging.pageNumber = event.page
    await this.actGetBoxList(this.getParamAPi())
  }

  async sortData(e: any) {
    const { sortField, sortOrder } = e
    if (sortOrder) {
      this.isDescending = sortOrder !== 1
      this.sortByColumn = sortField.replace('_', '')
    } else {
      this.isDescending = null
      this.sortByColumn = ''
    }
    await this.actGetBoxList(this.getParamAPi())
  }

  async searchBox() {
    await this.actGetBoxList(this.getParamAPi())
    this.selectedBoxes = []
  }

  async handleRefeshFilter() {
    this.filter.warehouse = null
    this.filter.location = ''
    this.filter.sellerEmail = ''
    this.filter.barCode = ''
    this.filter.dateFrom = null
    this.filter.dateTo = null
    await this.actGetBoxList(this.getParamAPi())
  }

  rowSelectAll({ data }) {
    this.selectedBoxes = _.unionWith(this.selectedBoxes, data, _.isEqual)
    this.updateSelectedBox()
  }

  rowUnSelectAll() {
    this.selectedBoxes = _.differenceWith(
      this.selectedBoxes,
      this.boxList,
      _.isEqual
    )
    this.updateSelectedBox()
  }

  rowSelect({ data }) {
    this.selectedBoxes.push(data)
    this.updateSelectedBox()
  }

  rowUnselect({ originalEvent, data }) {
    originalEvent.originalEvent.stopPropagation()
    this.selectedBoxes = _.filter(
      this.selectedBoxes,
      (box: Box.Model) => box.id !== data.id
    )
    this.updateSelectedBox()
  }

  updateSelectedBox(){
    this.$emit('selectBox',this.selectedBoxes)
  }
} 
export default BoxDataTable
</script>

<style lang="sass" scoped>
::v-deep.inventory
  .bg-white
    background-color: $text-color-100 !important
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
          height: 3.5rem !important
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
      .p-datatable-thead > tr > th
        white-space: unset
  .text-right
    text-align: right !important
    .p-column-header-content
      justify-content: end !important
.filter__dropdown, .filter__multiselect
  @include size(100%, 40px)
  border: none
.pagination
  padding-top: 0.5rem
  padding-bottom: 0.5rem
.p-datatable-row-expansion
  background: black !important
</style>
