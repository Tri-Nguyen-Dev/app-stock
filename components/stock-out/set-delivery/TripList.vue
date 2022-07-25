<template lang="pug">
div.box-page-container
  DataTable.w-full.flex.flex-column.bg-white(
    :value='listItems'
    dataKey='id'
    responsiveLayout='scroll'
  )
    template(#empty)
      .flex.align-items-center.justify-content-center.flex-column
        img(:srcset='`${require("~/assets/images/table-empty.png")} 2x`')
        p.text-900.font-bold.mt-3 List is empty!
    Column(field='no', header='Transit No')
      template(#body='slotProps')
        span.font-bold {{ slotProps.index + 1 }}
    Column.text-overflow-ellipsis(
      field='stockBox.stock.barCode',
      header='pick-up address',
      :sortable='true',
      :show-filter-match-modes='false'
    )
      template(#body='{ data }')
        span.text-primary.font-bold {{ data.stockBox.stock.barCode }}
    Column(field='stockBox.sku' header='destination address' :sortable='true')
      template(#body='{ data }')
        span.uppercase {{ data.stockBox.sku }}
    Column(field='stockBox.stock.name' header='ETA' :sortable='true')
      template(#body='{ data }')
        span.font-bold.text-right {{ data.stockBox.stock.name }}
    Column(field='stockBox.box.id' header='tag' sortable)
      template(#body='{ data }')
        span.font-bold.text-right {{ data.stockBox.box.id }}
    Column(
      field='stockBox.amount'
      header='DRIVER'
      :sortable='true'
      headerClass='grid-header-center'
    )
      template(#body='{ data }')
        .font-bold.grid-cell-center {{ data.stockBox.amount }}
    Column(field='airtag' header='Status' headerClass='grid-header-center')
      template(#body='{ data }')
        .grid-cell-center hjj
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
@Component
class ItemList extends Vue {
  @Prop() listItems!: any[]

  // -- [ Getters ] -------------------------------------------------------------
  get total(){
    return this.listItems.length
  }
}

export default ItemList
</script>

<style lang="sass" scoped>
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
