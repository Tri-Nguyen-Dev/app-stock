<template lang="pug">
    DataTable.h-full.flex.flex-column.p-datatable-customers.airtag-datatable(
      :resizableColumns='true',
      :rows='15',
      :value='stockList'
      dataKey='id',
      :paginator='false',
      :row-hover='true',
      filterDisplay='menu',
      responsiveLayout="scroll"
      columnResizeMode="fit"
    )
      template(#empty)
        | dsadsads
      column(field='no', header='NO', sortable='')
        template(#body="slotProps") 
          span.font-bold {{ slotProps.index + 1 }}
      column(
        field='',
        header='IMAGE',
        sortable='',
        filter-match-mode='contains'
      )
        template(#body="slotProps")
          img(:src="slotProps.data.imageUrl" :alt="slotProps.data.image" style="width:3rem; height: 3rem")
      column.text-overflow-ellipsis(
        field='barCode'
        header='BARCODE',
        sortable='',
        filter-field='representative',
        sort-field='representative.name',
        :show-filter-match-modes='false'
      )
        template(#body='{data}')
          span.text-primary.font-bold {{data.barcode}}
      column(
        field='sku',
        header='SKU',
        sortable='',
        data-type='numeric'
      )
        template(#body='{data}')
          span.uppercase {{data.sku}}
      column(
        field='name',
        header='NAME',
        sortable='', 
        )
          template(#body='{data}')
            span.font-bold.text-right {{data.name}}
      column(
        field='quantity',
        header='QUANTITY',
        sortable='',
        :show-filter-match-modes='false'
        className="p-text-right"
      )
        template(#body='{data}')
            span.font-bold.text-right {{data.quantity}}
      column(
        field='unit',
        header='UNIT',
        sortable='',
        :show-filter-match-modes='false'
        className="p-text-right"
      )
        template(#body='{data}')
          span.font-bold {{data.unit}}
      column(
        field='size',
        header='SIZE',
        sortable='',
        :show-filter-match-modes='false'
        className="p-text-right"
      )
        template(#body='{data}')
          span.font-bold {{data.length}}*{{data.width}}*{{data.height}}
      column(
        field='weight',
        header='WEIGHT(KG)',
        sortable='',
        :show-filter-match-modes='false'
        className="p-text-right"
      )
        template(#body='{data}')
          span.font-bold {{data.weight}}
      column(
        field='category',
        header='CATEGORY',
        sortable='',
        :show-filter-match-modes='false'
        className="p-text-right"

      )
        template(#body='{data}')
          span.font-bold {{data.category.name}}
      template(#footer)
        div
          .flex.align-items-center
            span.ml-3.text-400.font-size-small Showing 01 - 100 of 1280
        Paginator(:rows="20" :totalRecords="totalItemsCount" @page="onPage($event)").p-0
</template>


<script lang="ts">
import { Component, namespace, Prop, Vue } from 'nuxt-property-decorator'
import { Box } from '~/models/Box'
const nsStoreSubmission = namespace('box/box-detail')
@Component
class BoxDetailHistory extends Vue {
  @Prop() stockList!: () => any
  totalItemsCount = 32
  @nsStoreSubmission.State
  boxDetail!: Box.Model[]

  @nsStoreSubmission.Action
  actGetBoxList!: () => Promise<void>

  async mounted() {
    await this.actGetBoxList()
  }
  // onPage(event: any) {
  //   // console.log(event.page);
  // }

}

export default BoxDetailHistory
</script>


<style lang="sass" scoped >

  .p-column-header-content
    .p-column-title
      color: #464D64
      font-weight: 700
      text-transform: uppercase
      letter-spacing: 1px
  .p-datatable
    .p-datatable-thead
      tr
        th
          background: var(--surface-300)
  .p-paginator
    justify-content: end
    .p-paginator-first , .p-paginator-last
      display: none
    .p-paginator-element
      border: none
      color: var(--surface-900)
    .p-paginator-pages
      .p-paginator-page.p-highlight
        background-color: var(--surface-0)
        box-shadow: none
        color: var(--primary-color) !important
      .p-paginator-page.p-paginator-element
        font-weight:  bold
        border: none
        color: var(--surface-500)


</style>