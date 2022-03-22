<template lang="pug">
  div.h-full
    DataTable#datatable--stock-list.text-sm(:value='stockList' responsiveLayout="scroll" scrollHeight="flex" :selection.sync='selectedProduct' dataKey='id' :rows='10' :rowHover='true' :resizableColumns='true')
      Column(selectionMode='multiple')
      Column(field='no' header='NO')
        template(#body='{ index }')
          span.text-900.font-bold {{ index + 1 }}
      Column(field='image' header='Image')
        template(#body='{ data }')
          .stock__table--image.w-2rem.h-2rem.overflow-hidden
            img.w-full.h-full.border-round(:src='data.image' alt='' width='100%' style="object-fit: cover;")
      Column(field='name' header='Name' sortable)
        template(#body='{ data }')
          .stock__table--name.text-sm.text-900.text-overflow-ellipsis.overflow-hidden {{ data.name }}
      Column(field='inventory_level' header='Inventory Level' sortable)
        template(#body='{ data }')
          .flex.align-items-center.justify-content-end.text-sm.text-900  {{ data.inventory_level }}
      Column(field='code' header='Code' sortable)
      Column(field='category' header='Category' sortable)
      Column(field='status' header='Status' sortable)
        template(#body='{ data }')
          span.stock__table--status Available
      Column(field='action' header='Action')
        template(#body='{ data }')
          .table__action.flex.align-items-center
            span.cursor-pointer.bg-gray-200.flex.align-items-center.justify-content-center.border-round.w-2rem.h-2rem
              img(:src="require('~/assets/icons/pencil.svg')" alt='')
            span.ml-2.cursor-pointer.bg-gray-200.flex.align-items-center.justify-content-center.border-round.w-2rem.h-2rem(@click="handleDeleteStockById(data.id)")
              img(:src="require('~/assets/icons/trash.svg')" alt='')
    div.flex.align-items-center.justify-content-center.flex-column.h-full(v-if="!stockList.length > 0")
      img(:srcset="`${require('~/assets/images/stock-table-empty.png')} 2x`")
      p.text-900.font-bold.mt-3 List is empty!, Click 
       span.text-primary.underline here 
       span to add item.
</template>

<script lang="ts">
import { Component, Vue, namespace, Watch, Prop } from 'nuxt-property-decorator'
const nsStoreStock = namespace('stock')

@Component
class Table extends Vue {
  @Prop() stockList!: any[]

  selectedProduct: any[] = []

  currentPage: number = 1
  totalRecords: number = 50

  @Watch('selectedProduct')
  emitSelectedProduct() {
    this.$emit('getProductSelected', this.selectedProduct)
  }

  onPage(event: any) {
    this.currentPage = event.page + 1
  }

  handleDeleteStockById(id: number) {}

  handelDelete() {
    const productIds = this.selectedProduct.map(
      (item: { id?: number }) => item.id
    )
  }
}
export default Table
</script>

<style lang="sass">

.stock__table
  &--name
    max-width: 138px

  &--status
    color: #00A469
    background: #EAF3EB
    border-radius: 3px
    padding: 2px 8px
</style>
