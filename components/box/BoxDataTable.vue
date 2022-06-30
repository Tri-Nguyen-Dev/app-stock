<template lang="pug">
.BoxdataTableContainer
  .inventory__header
    div
      h1.text-heading Box list
      span.text-subheading {{ totalBoxRecords }} product found
    .header__action.flex
      Button.btn.btn-primary.border-0.mr-2(
        @click='handleApplyFilter'
      ) Apply
      .btn__filter(:class="{'active': isShowFilter}")
        .btn-toggle(@click="isShowFilter = !isShowFilter")
          .icon.icon-filter(v-if="!isShowFilter")
          .icon.icon-chevron-up.bg-primary(v-else)
          span Filter
        .btn-refresh(@click="handleRefreshFilter")
          .icon.icon-rotate-left.bg-white
  div(v-if= 'isShowFilter')
    .grid.mb-1
      .col-12(class='xl:col-2 lg:col-2 md:col-4 sm:col-12')
        FilterTable(
          title='Seller Email',
          placeholder='Enter Seller Email',
          name='sellerEmail',
          :value='filter.sellerEmail',
          :searchText='true',
          @updateFilter='handleFilterBox'
          :isShowFilter="isShowFilter"
        )
      .col-12(class='xl:col-2 lg:col-2 md:col-4 sm:col-12')
        FilterTable(
          title='Location',
          :value='filter.location',
          placeholder='Enter location',
          name='location',
          :searchText='true',
          @updateFilter='handleFilterBox'
          :isShowFilter="isShowFilter"
        )
      .col-12(class='xl:col-2 lg:col-2 md:col-4 sm:col-12')
        FilterTable(
          title='Box Code',
          :value='filter.barCode',
          placeholder='Enter code',
          name='barCode',
          :searchText='true',
          @updateFilter='handleFilterBox'
          :isShowFilter="isShowFilter"
        )
      .col-12(class='xl:col-3 lg:col-3 md:col-4 sm:col-12')
        FilterCalendar(
          title='From',
          border='left'
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
      @row-unselect='rowUnselect',
      :rowClass='rowClass'
    )
      Column(
        selectionMode='multiple',
        :styles='{ width: "3rem" }',
        :selection='selectedBoxes'
      )
      Column(field='no', header='NO' :styles='{ width: "3rem" }')
        template(#body='slotProps')
          span.font-semibold {{ paging.pageNumber * paging.pageSize + slotProps.index + 1 }}
      Column(
        field='id',
        header='BOX CODE',
        :sortable='true',
        bodyClass='font-semibold',
        sortField='_id'
        :styles='{ width: "15rem" }'
      )
      Column(
        field='sellerEmail',
        header='SELLER EMAIL',
        :sortable='true',
        sortField='_request.seller.email'
      )
      Column(field='usedCapacity' header='USED CAPACITY' :styles='{ width: "10rem" }' className="text-right")
        template(#body='{ data }') {{ data.usedCapacity | capacityPercent }}
      Column(
        field='location',
        header='LOCATION',
        :sortable='true',
        sortField='_rackLocation.name'
        :styles='{ width: "10rem" }'
      )
        template(#body='{ data }')
          div(v-if='data.location')
            .flex.align-items-center.cursor-pointer.justify-content-end
              span.font-bold {{ data.location }}
      Column(
        field='status',
        header='STATUS',
        :sortable='true',
        className='text-center'
        headerClass="grid-header-center"
        :styles='{ width: "10rem" }'
      )
        template(#body='{ data }')
          .flex.justify-content-center
            span.table__status.table__status--available(
              v-if='data.status === "BOX_STATUS_AVAILABLE"'
            ) {{ data.status | boxStatus }}
            span.table__status.table__status--disable(
              v-else-if='data.status === "BOX_STATUS_DISABLE"'
            ) {{ data.status | boxStatus }}
            span.table__status.table__status--draft(
              v-else-if='data.status === "BOX_STATUS_DRAFT"'
            ) {{ data.status | boxStatus }}
            span.table__status.table__status--reported(
              v-else-if='data.status === "BOX_STATUS_REPORTED"'
            ) {{ data.status | boxStatus }}
            span.table__status.table__status--outgoing(v-else) {{ data.status | boxStatus }}
      template(#footer)
        Pagination(:paging='paging', :total='totalBoxRecords', @onPage='onPage')
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
import { BOX_STATUS } from '~/utils'
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
  isShowFilter: boolean = false
  paging: Paging.Model = { pageNumber: 0, pageSize: 10, first: 0 }
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
    await this.actGetBoxList(this.getParamAPi())
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

  async handleRefreshFilter() {
    this.filter.warehouse = null
    this.filter.location = ''
    this.filter.sellerEmail = ''
    this.filter.barCode = ''
    this.filter.dateFrom = null
    this.filter.dateTo = null
    await this.actGetBoxList(this.getParamAPi())
  }

  rowSelectAll({ data }) {
    const dataValid = _.filter(data, function (o) {
      return o.status === BOX_STATUS.BOX_STATUS_AVAILABLE
    })
    this.selectedBoxes = _.unionWith(this.selectedBoxes, dataValid, _.isEqual)
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

  updateSelectedBox() {
    this.$emit('selectBox', this.selectedBoxes)
  }

  rowClass(data: any) {
    return data.status === BOX_STATUS.BOX_STATUS_AVAILABLE ? '' : 'row-disable'
  }

  handleApplyFilter() {
    this.searchBox()
  }
}
export default BoxDataTable
</script>

<style lang="sass" scoped>
::v-deep.inventory
  .bg-white
    background-color: $text-color-100 !important
    padding: 2px 10px
  @include flex-column
  .pi-calendar:before
    content: url('~/assets/icons/calendar.svg')
  .p-calendar-w-btn
    .p-button
      background: none
      border: none
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
  &__header
    display: flex
    justify-content: space-between
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
