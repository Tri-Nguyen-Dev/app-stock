<template lang="pug">
DataTable.w-full.flex.flex-column.bg-white.box-page-container(
  :value='dataRenderItems',
  dataKey='id',
  responsiveLayout='scroll',
  v-if='dataRenderItems',
  :selection.sync='selectedItem',
  @row-select='selectRow()',
  @row-unselect='unSelectRow'
)
  template(#empty)
    .flex.align-items-center.justify-content-center.flex-column
      img(:srcset='`${require("~/assets/images/table-empty.png")} 2x`')
      p.text-900.font-bold.mt-3 List is empty!
  column(field='no', header='NO')
    template(#body='slotProps')
      span.font-bold {{ slotProps.index + 1 }}
  column(
    field='picked',
    header='PICKED',
    selectionMode='multiple',
    styles='width: 3rem',
    :hidden='!isPack',
    headerClass='grid-header-center',
    :v-if='!isReady'
  )
  column(
    field='stock.imagePath',
    header='IMAGE',
    filter-match-mode='contains'
  )
    template(#body='slotProps')
      img(:src='slotProps.data.stockBox.stock.imagePath | getThumbnailUrl')
  column.text-overflow-ellipsis(
    field='stockBox.stock.barCode',
    header='BARCODE',
    :sortable='true',
    :show-filter-match-modes='false'
  )
    template(#body='{ data }')
      span.text-primary.font-bold {{ data.stockBox.stock.barCode }}
  column(field='stockBox.sku', header='SKU', :sortable='true')
    template(#body='{ data }')
      span.uppercase {{ data.stockBox.sku }}
  column(field='stockBox.stock.name', header='NAME', :sortable='true')
    template(#body='{ data }')
      span.font-bold.text-right {{ data.stockBox.stock.name }}
  column(
    field='stockBox.box.rackLocation.name',
    :header='isPack ? "LOCATION" : ""',
    sortable
    :rendered='false',
    :hidden='!isPack'
  )
    template(#body='{ data }')
      span.font-bold.text-primary.text-right(
        v-if='data.stockBox.box.rackLocation'
      ) {{ data.stockBox.box.rackLocation.name }}
  column(field='stockBox.box.id', header='BOXCODE', sortable)
    template(#body='{ data }')
      span.font-bold.text-right {{ data.stockBox.box.id }}
  column(
    field='stockBox.amount',
    header='QUANTITY',
    :sortable='true',
    headerClass='grid-header-right'
  )
    template(#body='{ data }')
      .font-bold.grid-cell-right {{ data.stockBox.amount }}
  column(field='airtag', header='TAG', headerClass='grid-header-center')
    template(#body='{ data }')
      .grid-cell-center
        Checkbox(v-model='data.hasAirtag', :binary='true', :disabled='isDetail')
  template( #footer )
    Pagination(
      title="Cancel"
      type="D/O selected"
      :paging="paging"
      :total="total"
      @onPage="onPage")
  template(#empty)
    div.flex.align-items-center.justify-content-center.flex-column
      img(:srcset="`${require('~/assets/images/table-empty.png')} 2x`" v-if="!checkIsFilter")
      img(:srcset="`${require('~/assets/images/table-notfound.png')} 2x`" v-else)
      p.text-900.font-bold.mt-3(v-if="!checkIsFilter") List is empty!, Click
        span.text-primary.underline  &nbsp;here&nbsp;
        span to add item.
      p.text-900.font-bold.mt-3(v-else) Item not found!

</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, namespace } from 'nuxt-property-decorator'
import { STOCK_OUT_ACTION } from '~/utils/constants/stock-out'
import { Paging } from '~/models/common/Paging'
import Pagination from '~/components/common/Pagination.vue'
import { OrderDetail } from '~/models/OrderDetail'
import { 
  LIMIT_PAGE_OPTIONS,
  PAGINATE_DEFAULT,
  calculateIndex 
} from '~/utils'
const nsStoreOrder = namespace('stock-out/order-detail')
@Component({ 
  components: {
    Pagination 
  }
})
class ItemList extends Vue {
  [x: string]: any
  @Prop() listItems!: any[]
  @Prop() getParam: () => any
  @Prop({ default: false }) isDetail!: boolean
  @Prop({ default: STOCK_OUT_ACTION.ORDER_DETAIL }) action: string
  @Prop({ default: false }) isReady: boolean
  isPack = false
  selectedItem: any[] = []
  enablePack = false
  paging: Paging.Model = { ...PAGINATE_DEFAULT, first: 0 }
  
  limitOptions = LIMIT_PAGE_OPTIONS

  // -- [ State ] ------------------------------------------------------------
  paginate: any = {
    pageNumber: 0,
    pageSize: 10
  }
  
  @nsStoreOrder.State
  orderDetail!: OrderDetail.Model

  @nsStoreOrder.Action
  actGetOrderDetail!: (obj: any) => Promise<void>

  // -- [ Getters ] -------------------------------------------------------------
  get total(){
    return this.orderDetail.deliveryItemList?.length
  }

  onPage(event: any) {
    this.paginate.pageSize = event.rows
    this.paginate.pageNumber = event.page
  }

  getIndexPaginate(index: number) {
    return calculateIndex(
      index,
      this.paging.pageNumber,
      this.paging.pageSize
    )
  }

  get dataRenderItems() {
    return this.listItems
  }

  @Watch('action')
  changePack() {
    if (this.action === STOCK_OUT_ACTION.ORDER_DETAIL) {
      this.isPack = false
      this.selectedItem = []
    } else {
      this.isPack = true
    }
  }

  editItemDetail() {}

  showModalDelete() {}

  selectRow() {
    this.$emit('selectRow', this.selectedItem)
    if (this.selectedItem.length === this.dataRenderItems.length) {
      this.$emit('enablePack', true)
    }
  }

  unSelectRow() {
    this.$emit('enablePack', false)
  }

  // sortData(e: any){
  //   const  order = e.sortOrder === 1? 'asc': 'desc'
  //   this.dataRenderItems =  _.orderBy(this.listItems,'stockBox.stock.barCode',order)
  // }
}

export default ItemList
</script>

<style lang="sass" scoped>
.box-page-container
  height: calc(100vh - 18rem)
::v-deep.p-datatable .p-column-header-content .p-checkbox-box.p-component
  display: none !important
::v-deep.p-datatable .p-datatable-tbody > tr.p-highlight
  background-color: $color-white !important
  color: var(--surface-900) !important
::v-deep.p-datatable
  height: 92% !important
::v-deep.p-checkbox-disabled:hover
  cursor: default !important
</style>
