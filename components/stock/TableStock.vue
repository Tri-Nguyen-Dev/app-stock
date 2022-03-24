<template lang="pug">
  div.h-full
    DataTable#datatable--stock-list.text-sm(:value='stockList' responsiveLayout="scroll" :selection.sync='selectedProduct' dataKey='id' :rows='10' :rowHover='true' :resizableColumns='true')
      Column(selectionMode='multiple')
      Column(field='no' header='NO')
        template(#body='{ index }')
          span.stock__table-no.text-900.font-bold {{ index + 1 }}
      Column(field='imageUrl' header='Image')
        template(#body='{ data }')
          .stock__table__image.w-2rem.h-2rem.overflow-hidden
            img.w-full.h-full.border-round(:src='data.imageUrl' alt='' width='100%' style="object-fit: cover;")
      Column(field='name' header='Name' sortable)
        template(#body='{ data }')
          .stock__table__name.text-base.text-900.text-overflow-ellipsis.overflow-hidden {{ data.name }}
      Column(field='barcode' header='Code' sortable)
      Column(field='category' header='Category' sortable)
          template(#body='{ data }') {{ data.category.name }}
      Column(field='status' header='Status')
        template(#body='{ data }')
          span.stock__status.stock__status--available(v-if="data.status === '1'") Available
          span.stock__status.stock__status--disable(v-if="data.status === '0'") Disable
      Column(field='action' header='Action')
        template(#body='{ data }')
          .table__action.flex.align-items-center
            span.cursor-pointer.bg-gray-200.flex.align-items-center.justify-content-center.border-round.w-2rem.h-2rem
              .icon-btn.icon-pencil(:class="{ 'surface-400': data.status === '0' }")
            span.ml-2.cursor-pointer.bg-gray-200.flex.align-items-center.justify-content-center.border-round.w-2rem.h-2rem(@click="handleDeleteStockById(data.id)")
              .icon-btn.icon-trash(:class="{ 'surface-400': data.status === '0' }")
    div.flex.align-items-center.justify-content-center.flex-column.h-full(v-if="!stockList.length > 0")
      img(:srcset="`${require('~/assets/images/table-empty.png')} 2x`")
      p.text-900.font-bold.mt-3 List is empty!, Click 
       span.text-primary.underline here 
       span to add item.
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'nuxt-property-decorator'
import { Stock } from '~/models/Stock'

@Component
class Table extends Vue {
  @Prop() stockList!: Stock.Model[]

  selectedProduct: Stock.Model[] = []

  @Watch('selectedProduct')
  emitSelectedProduct() {
    this.$emit('getProductSelected', this.selectedProduct)
  }

  handleDeleteStockById() {}

  handelDelete() {}
}
export default Table
</script>

<style lang="sass">

#datatable--stock-list .p-datatable-tbody > tr.p-highlight
  .stock__table__name, .stock__table-no
    color: #fff !important
    
.stock__table
  &__name
    max-width: 138px

  &-no
    font-size: $font-size-medium

.stock__status
  background: #EAF3EB
  border-radius: 3px
  padding: 2px 8px
  font-size: $font-size-small

  &--available
    color: #00A469

  &--disable
    color: #979AA4

</style>
