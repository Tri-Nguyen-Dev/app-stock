<template lang="pug">
div.box-page-container
  DataTable.w-full.flex.flex-column.bg-white(
    :value='dataRenderItems',
    dataKey='id',
    responsiveLayout='scroll',
    v-if='dataRenderItems && !isPack',
    :selection.sync='selectedItem',
    @row-select='selectRow()',
    @row-unselect='unSelectRow'
    rowGroupMode="rowspan"
    groupRowsBy="stockBox.box.id"
  )
    template(#empty)
      .flex.align-items-center.justify-content-center.flex-column
        img(:srcset='`${require("~/assets/images/table-empty.png")} 2x`')
        p.text-900.font-bold.mt-3 List is empty!
    Column(field='no', header='NO')
      template(#body='slotProps')
        span.font-bold {{ slotProps.index + 1 }}
    Column(field='imageUrl' header='IMG' headerClass="grid-header-center")
            template(#body='{ data }')
              .stock__table__image.overflow-hidden.grid-cell-center
                img.h-2rem.w-2rem.border-round(
                  :src="data.stockBox.stock.imagePath | getThumbnailUrl" alt='' width='100%' style="object-fit: cover;")
    Column.text-overflow-ellipsis(
      field='stockBox.stock.barCode',
      header='BARCODE',
      :sortable='true',
      :show-filter-match-modes='false'
    )
      template(#body='{ data }')
        span.text-primary.font-bold {{ data.stockBox.stock.barCode }}
    Column(field='stockBox.sku', header='SKU', :sortable='true')
      template(#body='{ data }')
        span.uppercase {{ data.stockBox.sku }}
    Column(field='stockBox.stock.name', header='STOCK NAME', :sortable='true')
      template(#body='{ data }')
        span.font-bold.text-right {{ data.stockBox.stock.name }}
    Column(field='stockBox.box.id', header='BOXCODE', sortable)
      template(#body='{ data }')
        span.font-bold.text-right {{ data.stockBox.box.id }}
    Column(
      field='stockBox.amount',
      header='Q.TY',
      :sortable='true',
      headerClass='grid-header-center'
    )
      template(#body='{ data }')
        .font-bold.grid-cell-center {{ data.stockBox.amount }}
    Column(field='airtag', header='TAG', headerClass='grid-header-center')
      template(#body='{ data }')
        .grid-cell-center
          span.font-bold.text-right {{data.hasAirtag ? 'Yes' : 'No'}} 
    template( #footer )
      Pagination(
        :paging="paging"
        :total="total"
        @onPage="onPage")
  DataTable.w-full.flex.flex-column.bg-white(
    :value='dataRenderItems',
    dataKey='id',
    responsiveLayout='scroll',
    v-if='dataRenderItems && isPack',
    :selection.sync='selectedItem',
    @row-select='selectRow()',
    @row-unselect='unSelectRow'
    rowGroupMode="rowspan"
    groupRowsBy="stockBox.box.id"
  )
    template(#empty)
      .flex.align-items-center.justify-content-center.flex-column
        img(:srcset='`${require("~/assets/images/table-empty.png")} 2x`')
        p.text-900.font-bold.mt-3 List is empty!
    Column(field='no', header='NO')
      template(#body='slotProps')
        span.font-bold {{ slotProps.index + 1 }}
    Column(
      field='picked',
      header='PICKED',
      selectionMode='multiple',
      styles='width: 3rem',
      headerClass='grid-header-center'
    )
    Column(field='stockBox.box.id', header='BOXCODE', sortable)
      template(#body='{ data }')
        span.font-bold.text-right {{ data.stockBox.box.id }}
    Column(
      field='stockBox.box.rackLocation.name',
      :header='isPack ? "LOCATION" : ""',
      sortable
    )
      template(#body='{ data }')
        span.font-bold.text-primary.text-right(
          v-if='data.stockBox.box.rackLocation'
        ) {{ data.stockBox.box.rackLocation.name }}
    Column.text-overflow-ellipsis(
      field='stockBox.stock.barCode',
      header='BARCODE',
      :sortable='true',
      :show-filter-match-modes='false'
    )
      template(#body='{ data }')
        span.text-primary.font-bold {{ data.stockBox.stock.barCode }}
    Column(field='stockBox.sku', header='SKU', :sortable='true')
      template(#body='{ data }')
        span.uppercase {{ data.stockBox.sku }}
    Column(field='stockBox.stock.name', header='NAME', :sortable='true')
      template(#body='{ data }')
        span.font-bold.text-right {{ data.stockBox.stock.name }}
    Column(
      field='stockBox.amount',
      header='Q.TY',
      :sortable='true',
      headerClass='grid-header-center'
    )
      template(#body='{ data }')
        .font-bold.grid-cell-center {{ data.stockBox.amount }}
    Column(field='airtag', header='TAG', headerClass='grid-header-center')
      template(#body='{ data }')
        .grid-cell-center
          Checkbox(v-model='data.hasAirtag', :binary='true', :disabled='true')
    template( #footer )
      Pagination(
        :paging="paging"
        :total="total"
        @onPage="onPage")
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator'
import { STOCK_OUT_ACTION } from '~/utils/constants/stock-out'
import { Paging } from '~/models/common/Paging'
import Pagination from '~/components/common/Pagination.vue'
import { 
  PAGINATE_DEFAULT,
  calculateIndex 
} from '~/utils'
@Component({ 
  components: {
    Pagination 
  }
})
class ItemList extends Vue {
  [x: string]: any
  @Prop() listItems!: any[]
  @Prop() getParam: () => any
  @Prop({ default: STOCK_OUT_ACTION.ORDER_DETAIL }) action: string
  @Prop({ default: false }) isReady: boolean
  isPack = false
  selectedItem: any[] = []
  enablePack = false
  paging: Paging.Model = { ...PAGINATE_DEFAULT, first: 0 }
   
  // -- [ Getters ] -------------------------------------------------------------
  get total(){
    return this.listItems.length
  }

  get dataRenderItems() {
    const start = this.paging.pageSize * this.paging.pageNumber
    const end = start + this.paging.pageSize
    const result = this.listItems.slice(start,end)
    return result
  }

  onPage(event: any) {
    this.paging.pageSize = event.rows
    this.paging.pageNumber = event.page
  }

  getIndexPaginate(index: number) {
    return calculateIndex(
      index,
      this.paging.pageNumber,
      this.paging.pageSize
    )
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
}

export default ItemList
</script>

<style lang="sass" scoped>
.box-page-container
  @include tablet
    height: calc(100vh - 150px)  
  @include desktop
    height: calc(100vh - 32px)
::v-deep.p-datatable .p-column-header-content .p-checkbox-box.p-component
  display: none !important
::v-deep.p-datatable 
  .p-datatable-tbody 
    tr.p-highlight:not(.row-disable)
      background-color: $color-white !important
      color: var(--surface-900) !important
::v-deep.p-datatable
  height: 92% !important
::v-deep.p-checkbox-disabled:hover
  cursor: default !important
</style>
