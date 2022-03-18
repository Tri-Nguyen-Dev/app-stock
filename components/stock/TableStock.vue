<template lang="pug">
  .table
    DataTable(:value='stockList' :selection.sync='selectedProduct' dataKey='id' responsiveLayout='scroll' :rows='10' :rowHover='true' :resizableColumns='true' columnResizeMode="expand")
      Column(selectionMode='multiple' :headerStyle="{ width: '3em' }")
      Column(field='no' header='NO')
        template(#body='{ index }')
          span.text-900.font-bold {{ index + 1 }}
      Column(field='image' header='Image')
        template(#body='{ data }')
          .table-image.w-2rem.h-2rem.overflow-hidden
            img.w-full.h-full.border-round(:src='data.image' alt='' width='100%')
      Column(field='name' header='Name' sortable)
        template(#body='{ data }')
          .table-name.text-sm.text-900 {{ data.name }}
      Column(field='inventory_level' header='Inventory Level' sortable)
        template(#body='{ data }')
          .flex.align-items-center.justify-content-end.text-sm.text-900  {{ data.inventory_level }}
      Column(field='box_code' header='Box code' sortable)
        template(#body='{ data }')
          .flex.align-items-center.cursor-pointer
            span.text-primary.font-bold.text-sm {{ data.box_code }}
            img.ml-1(:src="require('~/assets/icons/arrow-up-right.svg')")
      Column(field='warehouse' header='Warehouse' sortable)
        template(#body='{ data }')
          .flex.align-items-center.cursor-pointer
            span.text-primary.font-bold.text-sm {{ data.warehouse }}
            img.ml-1(:src="require('~/assets/icons/arrow-up-right.svg')")
      Column(field='localtion' header='Localtion' sortable)
        template(#body='{ data }')  
          .flex.align-items-center.cursor-pointer
            span.text-primary.font-bold.text-sm {{ data.warehouse }}
            img.ml-1(:src="require('~/assets/icons/arrow-up-right.svg')")
      Column(field='code' header='Code' sortable)
      Column(field='sku' header='Sku' sortable)
      Column(field='category' header='Category' sortable)
      Column(field='sender' header='Quantity' sortable)
      Column(field='status' header='Status' sortable)
        template(#body='{ data }')
          span.table__status Available
      Column(field='action' header='Action')
        template(#body='{ data }')
          .table__action.flex.align-items-center
            span.cursor-pointer.bg-gray-100.flex.align-items-center.justify-content-center.border-round.w-2rem.h-2rem
              img(:src="require('~/assets/icons/pencil.svg')" alt='')
            span.cursor-pointer.bg-gray-100.flex.align-items-center.justify-content-center.border-round.w-2rem.h-2rem(@click="handleDeleteStockById(data.id)")
              img(:src="require('~/assets/icons/trash.svg')" alt='')
    .table__footer.bg-white.flex.align-items-center.justify-content-between
      .table__footer-info.flex.align-items-center(v-if='!selectedProduct.length > 0')
        img(:src="require('~/assets/icons/filter-left.svg')" alt='')
        span.ml-2.text-400 Showing 01 - 100 of 1280
      .table__btn-delete.flex.align-items-center.cursor-pointer(v-else @click="handelDelete()" )
        img(:src="require('~/assets/icons/trash-white.svg')" alt='')
        span.ml-2.text-sm.text-white.border-round Delete {{ selectedProduct.length }} items selected
      .table__footer-paginate
        Paginator(:rows='10' :totalRecords='totalRecords' @page="onPage($event)")
    ConfirmDialog
</template>

<script lang="ts">
import { Component, Vue, namespace } from 'nuxt-property-decorator'
const nsStoreStock = namespace('stock')

@Component
class Table extends Vue {
  @nsStoreStock.State
  stockList!: any

  @nsStoreStock.Action
  actGetProductList!: () => Promise<void>

  selectedProduct: any = []

  currentPage: number = 1
  totalRecords: number = 50

  mounted() {
    this.actGetProductList()
  }

  onPage(event: any) {
    this.currentPage = event.page + 1
  }

  handleDeleteStockById(id: number) {
    console.log(id)
  }

  handelDelete() {
    const productIds =this.selectedProduct.map((item: { id?: number }) => item.id)
    console.log(productIds)
  }
}
export default Table
</script>

<style lang="sass">

.table
  &-name
    overflow: hidden
    text-overflow: ellipsis
    max-width: 138px

  &__status
    color: #00A469
    background: #EAF3EB
    border-radius: 3px
    padding: 2px 8px

  &__action
    gap: 0 8px

  &-image
    img
      object-fit: cover
      
  &__footer
    height: 66px
    padding: 0 24px

  &__footer-info
    span
      font-size: 12px

  &__btn-delete
    padding: 5px 10px
    background: #ff7171
    border: 1.5px solid #fff

.p-paginator .p-paginator-pages .p-paginator-page.p-highlight
  background: $primary
  border-color: $primary

.p-paginator .p-paginator-pages .p-paginator-page
  color: $primary

</style>
