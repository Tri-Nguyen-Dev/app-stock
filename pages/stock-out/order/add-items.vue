<template lang='pug'>
.inventory
  .inventory__header
    div
      h1.text-heading Inventory Item list
      span.text-subheading {{ total }} results found
    .inventory__header--action
      .btn__filter
        .btn-toggle(@click="isShowFilter = !isShowFilter")
          .icon.icon-filter(v-if="!isShowFilter")
          .icon.icon-chevron-up.bg-primary(v-else)
          span Filter
        .btn-refresh(@click="handleRefreshFilter")
          .icon.icon-rotate-left.bg-white
      .btn.bg-white(@click='handleBack') Back
      Button.btn.btn-primary.border-0(@click='handleOrderDelivery' :disabled='isDisabled') Order delivery
  .inventory__filter.grid(v-if='isShowFilter')
    .col-1
      FilterTable(
        title="ID"
        :value="filter.rnId"
        placeholder="Enter ID"
        name="rnId"
        :searchText="true"
        @updateFilter="handleFilterBox"
      )
    .col
      FilterTable(
        title="Barcode"
        :value="filter.barCode"
        placeholder="Enter barcode"
        name="barCode"
        :searchText="true"
        @updateFilter="handleFilterBox"
      )
    .col
      FilterTable(
        title="SKU"
        :value="filter.sku"
        placeholder="Enter SKU"
        name="sku"
        :searchText="true"
        @updateFilter="handleFilterBox"
      )
    .col
      FilterTable(
        title="Stock name"
        :value="filter.stockName"
        placeholder="Enter stock name"
        name="stockName"
        :searchText="true"
        @updateFilter="handleFilterBox"
      )
    .col
      FilterTable(
        title="Box code"
        :value="filter.boxCode"
        placeholder="Enter box code"
        name="boxCode"
        :searchText="true"
        @updateFilter="handleFilterBox"
      )
    .col-4
      .grid.grid-nogutter
        .col
          FilterCalendar(
            title="Stock-in Time from"
            border="left"
            :value="filter.dateFrom"
            name="dateFrom"
            inputClass="border-0"
            dateFormat="dd-mm-yy"
            :showIcon="true"
            @updateFilter="handleFilterBox"
          )
        .col.ml-1
          FilterCalendar(
            title="To"
            border="right"
            :value="filter.dateTo"
            name="dateTo"
            inputClass="border-0"
            dateFormat="dd-mm-yy"
            :showIcon="true"
            @updateFilter="handleFilterBox"
          )
  .inventory__content
    DataTable(
      :value='inventoryList'
      :rowClass='rowClass'
      dataKey='id'
      :rows='10'
      responsiveLayout="scroll"
      :resizableColumns="true"
    )
      Column(field='no' header='NO' :styles="{'width': '3rem'}" bodyClass='text-bold')
        template(#body='slotProps') {{ (paging.pageNumber) * paging.pageSize + slotProps.index + 1 }}
      Column(field='inventory' header='INVENTORY QUANTITY' bodyClass='text-bold' :sortable='true' :styles="{'width': '5%'}" sortField='_id')
      Column(field='delivery' header='DELIVERY QUANTITY' bodyClass='text-bold' :sortable='true' :styles="{'width': '5%'}" sortField='_id')
        template(#body='{data}')
          InputNumber.w-7rem(v-model="data.delivery" mode="decimal" :min="0" 
            :max="data.inventory" inputClass="w-full" @input='handleDeliveryChange(data)'
          )
      Column(field='image' header='IMAGE' :sortable='true' sortField='_id')
        template(#body='{data}')
          .stock__table__image.overflow-hidden
            img.h-2rem.w-2rem.border-round(
              :src='data.image | getThumbnailUrl' alt='' width='100%' style='object-fit: cover;')
      Column(field='barCode' header='BARCODE' :sortable='true' sortField='_id')
        template(#body='{data}')
          span.text-primary {{data.barCode}}
      Column(field='sku' header='SKU' :sortable='true' sortField='_id')
      Column(field='sellerEmail' header='SELLER EMAIL' :sortable='true' :styles="{'width': '15%'}" sortField='_id')
      Column(field='boxCode' header='BOX CODE' :sortable='true' className="text-right" bodyClass='font-semibold' sortField='_id')
      Column(field='receiptId' header='RECEIPT NODE ID' :sortable='true' className="text-right" sortField='_id')
        template(#body='{data}')
          span.text-primary {{data.receiptId}}
      Column(field='stockInTime' header='STOCK-IN-TIME' :sortable='true' className="text-right" sortField='_id')
        template(#body='{ data }') {{ data.stockInTime | dateTimeHour12 }}
      template(#footer)
        Pagination(
          :paging="paging"
          :total="total"
          @onPage="onPage"
        )
</template>

<script lang='ts'>
import { Component, namespace, Vue } from 'nuxt-property-decorator'
import { Paging } from '~/models/common/Paging'
import { PAGINATE_DEFAULT } from '~/utils'
import Pagination from '~/components/common/Pagination.vue'
const nsStoreInventory = namespace('stock-out/add-items')
const dayjs = require('dayjs')

@Component({
  components: {
    Pagination
  }
})
class AddItems extends Vue {
  inventoryList: any = []
  paging: Paging.Model = { ...PAGINATE_DEFAULT, first: 0 }
  outGoingList: any = []
  isShowFilter: boolean = false
  isDisabled: string | null = 'disabled'
  filter: any = {
    rnId: null,
    barCode: null,
    sku: null,
    stockName: null,
    boxCode: null,
    dateFrom: null,
    dateTo: null,
    sortByColumn: '',
    isDescending: null
  }

  // -- [ State ] ------------------------------------------------------------
  @nsStoreInventory.State
  inventoryStore!: any

  @nsStoreInventory.State
  total!: any

  @nsStoreInventory.State
  outGoingListStore!: any

  // -- [ Action ] ------------------------------------------------------------
  @nsStoreInventory.Action
  actGetInventoryList!: (params: any) => Promise<void>

  @nsStoreInventory.Action
  actOutGoingList: (params: any) => Promise<void>

  // -- [ Functions ] ------------------------------------------------------------
  mounted() {
    this.outGoingList = this.outGoingListStore.map((x: any) => ({ ..._.cloneDeep(x) }))
    this.getDataList()
  }

  getParamAPi() {
    return {
      pageNumber: this.paging.pageNumber, pageSize: this.paging.pageSize,
      'rnId': this.filter.rnId || null,
      'barCode': this.filter.barCode || null,
      'sku': this.filter.sku || null,
      'stockName': this.filter.stockName || null,
      'boxCode': this.filter.boxCode || null,
      'from': this.filter.dateFrom ? dayjs(new Date(this.filter.dateFrom)).format('YYYY-MM-DD') : null,
      'to': this.filter.dateTo ? dayjs(new Date(this.filter.dateTo)).format('YYYY-MM-DD') : null,
      'sortBy': this.filter.sortByColumn || null,
      'desc': this.filter.isDescending
    }
  }

  handleFilterBox(e: any, name: string){
    this.filter[name] = e
    this.getDataList() 
  }

  async getDataList() {
    await this.actGetInventoryList(this.getParamAPi())
    this.inventoryList = this.inventoryStore.map((x: any) => ({ ..._.cloneDeep(x), delivery: 0 }))
    _.map(this.inventoryList, (item: any) => {
      return _.merge(item, _.find(this.outGoingList, { 'id' : item.id }))
    })
  }

  async handleOrderDelivery() {
    await this.actOutGoingList(this.outGoingList)
    this.$router.push({ path: '/stock-out/order' })
  }

  handleBack() {
    this.$router.push({ path: '/stock-out/order' })
  }

  onPage(event: any) {
    this.paging.pageSize = event.rows
    this.paging.pageNumber = event.page
    this.getDataList()
  }

  rowClass(data: any) {
    return data.delivery > 0 && 'outgoing__selected'
  }

  handleRefreshFilter() {

  }

  handleDeliveryChange(data) {
    const item = _.find(this.outGoingList, { id: data.id })
    if(!item && _.get(data, 'delivery', 0))  {
      this.outGoingList.push(data)
    } else if(!data.delivery) {
      _.remove(this.outGoingList, ({ id }) => id === data.id)
    }
    this.isDisabled =  _.size(this.outGoingList) < 1 ? 'disabled' : null
  }
}
export default AddItems
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
</style>
