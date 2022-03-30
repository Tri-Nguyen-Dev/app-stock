<template lang="pug">
  div.h-full
    DataTable#datatable__stock-list(:rowClass="rowClass" :value='stockList' responsiveLayout="scroll" :selection.sync='selectedProduct' dataKey='id' :rows='10' :rowHover='true' :resizableColumns='true')
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
          .stock__table-name.text-base.text-900.text-overflow-ellipsis.overflow-hidden {{ data.name }}
      Column(field='barcode' header='Code' sortable)
      Column(field='category' header='Category' sortable)
          template(#body='{ data }') {{ data.category.name }}
      Column(field='status' header='Status')
        template(#body='{ data }')
          span.stock__status.stock__status--available(v-if="data.delete") Available
          span.stock__status.stock__status--disable(v-if="!data.delete") Disable
      Column(field='action' header='Action')
        template(#body='{ data }')
          .table__action.flex.align-items-center(:class="{'action-disabled': !data.delete}")
            span.cursor-pointer.bg-gray-200.flex.align-items-center.justify-content-center.border-round.w-2rem.h-2rem
              .icon-btn.icon-pencil
            span.ml-2.cursor-pointer.bg-gray-200.flex.align-items-center.justify-content-center.border-round.w-2rem.h-2rem(@click="showModalDelete(data.id)")
              .icon-btn.icon-trash
    div.flex.align-items-center.justify-content-center.flex-column.h-full(v-if="stockList && !stockList.length > 0")
      img(:srcset="`${require('~/assets/images/table-empty.png')} 2x`" v-if="!checkIsFilter")
      img(:srcset="`${require('~/assets/images/table-notfound.png')} 2x`" v-else)
      p.text-900.font-bold.mt-3(v-if="!checkIsFilter") List is empty!, Click 
       span.text-primary.underline here 
       span to add item.
      p.text-900.font-bold.mt-3(v-else) Item not found!
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'nuxt-property-decorator'
import { Stock } from '~/models/Stock'

@Component
class Table extends Vue {
  @Prop() stockList!: Stock.Model[]

  @Prop() filter!: any

  selectedProduct: Stock.Model[] = []

  get checkIsFilter () {   
    return Object.values(this.filter).some(item => item)
  }

  @Watch('selectedProduct')
  emitSelectedProduct() {
    this.$emit('getProductSelected', this.selectedProduct.filter(item => !item.delete))
  }

  showModalDelete(id: string) {
    this.$emit('showModalDelete', id)
  }

  rowClass(data: any) {  
    return !data.delete ? 'row-disable': ''
  }
}
export default Table
</script>

<style lang="sass">

#datatable__stock-list  
  tr.p-highlight
    .stock__table-name, .stock__table-no
      color: #fff !important

.stock__table
  &-name
    max-width: 138px

  &-no
    font-size: $font-size-medium

.table__action
  &.action-disabled
    span
      pointer-events: none !important
    .icon-btn
      background-color: #D2D2E0 !important

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
