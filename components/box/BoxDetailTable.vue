<template lang="pug">
    DataTable.h-full.flex.flex-column.p-datatable-customers.airtag-datatable.table__sort-icon.bg-white(
      :resizableColumns='true'
      :rows='pagination.rows'
      :value='dataRenderItems'
      dataKey='id'
      :paginator='false'
      :row-hover='true'
      filterDisplay='menu'
      responsiveLayout="scroll"
      columnResizeMode="fit"
    )
      template(#empty)
          div.flex.align-items-center.justify-content-center.flex-column
              img(:srcset="`${require('~/assets/images/table-empty.png')} 2x`")
              p.text-900.font-bold.mt-3 List is empty!
      column(field='no', header='NO', sortable='')
        template(#body="slotProps")
          span.font-bold {{ pagination.rows * pagination.page + slotProps.index + 1 }}
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
          span.text-primary.font-bold {{data.barCode}}
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
            span.font-bold.text-right {{data.amount}}
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
            span.pagination__total Showing {{pagination.page * pagination.rows + 1}} - {{(pagination.page + 1) * pagination.rows}} of {{listStockWithAmount.length}}
          Paginator(v-if="listStockWithAmount.length > 0" :rows="pagination.rows" :totalRecords="listStockWithAmount.length" @page="onPage($event)" :first="pagination.first").p-0
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'nuxt-property-decorator';

@Component
class BoxDetailHistory extends Vue {
  @Prop() listStockWithAmount!: any[]
  @Prop() getParam: () => any

  pagination: any = {
    first: 0,
    page: 0,
    pageCount: 1,
    rows: 1
  }

  get dataRenderItems() {
    const lastIndex = this.pagination.first + this.pagination.rows;
    return this.listStockWithAmount.filter((_, index) => index >= this.pagination.first && index < lastIndex);
  }

  onPage(event: any) {
    this.pagination = event;
  }

  @Watch('listStockWithAmount')
  resetPaging() {
    this.pagination.first = 0;
  }
}

export default BoxDetailHistory;
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
