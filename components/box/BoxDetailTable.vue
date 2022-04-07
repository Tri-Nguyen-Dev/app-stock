<template lang="pug">
    DataTable.h-full.flex.flex-column.p-datatable-customers.airtag-datatable.table__sort-icon.bg-white(
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
          span.font-bold {{ pageSize * (pageNumber - 1) + slotProps.index + 1 }}
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
                .pagination
                  div.pagination__info
                    img(:src="require('~/assets/icons/filter-left.svg')")
                    span.pagination__total {{(pageNumber - 1) * pageSize + 1}} - {{(pageNumber - 1) * pageSize + stockList.length}} of {{totalStockRecords}}
                  Paginator( :first.sync="fristPage" :rows="pageSize"  @page="onPage($event)" ).p-0
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
// const nsStoreBoxDetail = namespace('box/box-detail')

@Component
class BoxDetailHistory extends Vue {
  @Prop() stockList!: () => any
  @Prop() getParam: () => any
  // @Prop() listStockWithAmount: () => any



  // pageSize: number = 20
  // pageNumber: number = 1
  // fristPage: number = 1 

  // @nsStoreBoxDetail.Action
  // actGetBoxDetailFilter!: (params: any) => Promise<void>

  // async mounted() {
  //  await this.actGetBoxDetailFilter({ pageNumber: this.pageNumber, pageSize: this.pageSize })
  // }

  // async onPage(event: any) {
  //   await this.actGetBoxDetailFilter(
  //     {
  //     ...this.getParam(),
  //     pageNumber: event.page + 1
  //   })
  // }

}

export default BoxDetailHistory
</script>

<style lang="sass" scoped>
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