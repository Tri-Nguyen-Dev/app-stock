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
        title="RN ID"
        :value="filter.receiptId"
        placeholder="Enter ID"
        name="receiptId"
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
      :class="{ 'table-wrapper-empty': !inventoryList || inventoryList.length <= 0 }"
      @sort="sortData($event)"
    )
      Column(field='no' header='NO' :styles="{'width': '3rem'}" bodyClass='text-bold')
        template(#body='slotProps') {{ (paging.pageNumber) * paging.pageSize + slotProps.index + 1 }}
      Column(field='amount' header='INVENTORY QUANTITY' bodyClass='text-bold' 
        :sortable='true' :styles="{'width': '5%'}" sortField='_amount'
      )
      Column(field='delivery' header='DELIVERY QUANTITY' bodyClass='text-bold' :sortable='true' :styles="{'width': '5%'}" sortField='_')
        template(#body='{data}')
          InputNumber.w-7rem(v-model="data.delivery" mode="decimal" :min="0" 
            :max="data.amount" inputClass="w-full" @input='handleDeliveryChange'
          )
      Column(field='image' header='IMAGE')
        template(#body='{data}')
          .stock__table__image.overflow-hidden
            img.h-2rem.w-2rem.border-round(
              :src='data.stock.imagePath | getThumbnailUrl' alt='' width='100%' style='object-fit: cover;')
      Column(field='barCode' header='BARCODE' :sortable='true' sortField='_stock.barCode')
        template(#body='{data}')
          span.text-primary {{data.stock.barCode}}
      Column(field='sku' header='SKU' :sortable='true' sortField='_sku')
      Column(field='box.request.seller.email' header='SELLER EMAIL' :sortable='true' 
        :styles="{'width': '15%'}" sortField='_box.request.seller.email'
      )
      Column(field='box.id' header='BOX CODE' :sortable='true' className="text-right" bodyClass='font-semibold' sortField='_box.id')
      Column(field='requestId' header='RECEIPT NODE ID' :sortable='true' className="text-right" sortField='_box.request.id')
        template(#body='{data}')
          span.text-primary {{data.box.request.id}}
      Column(field='createdAt' header='STOCK-IN-TIME' :sortable='true' className="text-right" sortField='_stock.createdAt')
        template(#body='{ data }') {{ data.stock.createdAt | dateTimeHour12 }}
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
import { PAGINATE_DEFAULT } from '~/utils'
import Pagination from '~/components/common/Pagination.vue'
const nsStoreOrder = namespace('stock-out/create-order')
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
  sellerEmail: string = ''
  warehouse: any = null
  filter: any = {
    receiptId: null,
    barCode: null,
    sku: null,
    stockName: null,
    boxCode: null,
    dateFrom: null,
    dateTo: null,
    sortBy: '',
    desc: null
  }

  // -- [ State ] ------------------------------------------------------------
  @nsStoreOrder.State
  inventoryStore!: any

  @nsStoreOrder.State
  total!: any

  @nsStoreOrder.State
  outGoingListStore!: any

  @nsStoreOrder.State
  listInfor!: any

  // -- [ Action ] ------------------------------------------------------------
  @nsStoreOrder.Action
  actGetInventoryList!: (params: any) => Promise<void>

  @nsStoreOrder.Action
  actOutGoingList: (params: any) => Promise<void>

  // -- [ Functions ] ------------------------------------------------------------
  mounted() {
    this.sellerEmail = _.get(this.listInfor, 'seller[0].value')
    this.warehouse = _.get(this.listInfor, 'warehouse[0].warehouseId')
    if(!this.sellerEmail || !this.warehouse) {
      this.$router.push({ path: '/stock-out/order' })
      return
    }
    this.outGoingList = this.outGoingListStore.map((x: any) => ({ ..._.cloneDeep(x) }))
    this.isDisabled =  _.size(this.outGoingList) < 1 ? 'disabled' : null
    this.getDataList()
  }

  get checkIsFilter() {
    const params = _.omit(this.getParamAPi(), ['email', 'warehouseId', 'pageNumber', 'pageSize'])
    return Object.values(params).some((item) => item)
  }

  getParamAPi() {
    return {
      pageNumber: this.paging.pageNumber, pageSize: this.paging.pageSize,
      email: this.sellerEmail || null,
      warehouseId: this.warehouse || null,
      'receiptId': this.filter.receiptId || null,
      'barCode': this.filter.barCode || null,
      'sku': this.filter.sku || null,
      'stockName': this.filter.stockName || null,
      'boxCode': this.filter.boxCode || null,
      'from': this.filter.dateFrom ? dayjs(new Date(this.filter.dateFrom)).format('YYYY-MM-DD') : null,
      'to': this.filter.dateTo ? dayjs(new Date(this.filter.dateTo)).format('YYYY-MM-DD') : null,
      'sortBy': this.filter.sortBy || null,
      'desc': this.filter.desc
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
    this.filter.receiptId = null
    this.filter.barCode = null
    this.filter.sku = null
    this.filter.stockName = null
    this.filter.boxCode = null
    this.filter.dateFrom = null
    this.filter.dateTo = null
    this.getDataList()
  }

  handleDeliveryChange() {
    this.outGoingList = _.filter(this.inventoryList, ({ delivery }) => {
      return delivery && delivery > 0
    })
    this.isDisabled =  _.size(this.outGoingList) < 1 ? 'disabled' : null
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
    this.getDataList()
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
