<template lang="pug">
DataTable.bg-white.table__sort-icon.w-full.h-full.flex.flex-column(
  :resizableColumns='true' 
  :rows='pagination.rows' 
  :value='dataRenderItems' 
  dataKey='id' 
  :paginator='false' 
  :row-hover='true' 
  filterDisplay='menu' 
  responsiveLayout="scroll" 
  columnResizeMode="fit" 
  @row-dblclick="onRowClick($event)" )
  template(#empty)
      div.flex.align-items-center.justify-content-center.flex-column
          img(:srcset="`${require('~/assets/images/table-empty.png')} 2x`")
          p.text-900.font-bold.mt-3 List is empty!
  column(field='no', header='NO')
    template(#body="slotProps")
      span.font-bold {{ pagination.rows * pagination.page + slotProps.index + 1 }}
  column( field='imageUrl', header='IMAGE', :sortable='true', filter-match-mode='contains' )
    template(#body="slotProps")
      img(:src="slotProps.data.imageUrl" :alt="slotProps.data.image" style="width:3rem; height: 3rem")
  column.text-overflow-ellipsis( field='barCode' header='BARCODE', :sortable='true', :show-filter-match-modes='false' )
    template(#body='{ data }')
      span.text-primary.font-bold {{data.barCode}}
  column( field='sku', header='SKU', sortable='', data-type='numeric' )
    template(#body='{ data }')
      span.uppercase {{ data.sku }}
  column( field='name', header='NAME', :sortable='true', )
      template(#body='{ data }')
        span.font-bold.text-right {{data.name}}
  column( field='amount', header='QUANTITY', :sortable='true', className="p-text-right" )
    template(#body='{ data }')
        span.font-bold.text-right {{data.amount}}
  column( field='unit', header='UNIT', :show-filter-match-modes='false' className="p-text-right" )
    template(#body='{ data }')
      span.font-bold {{ data.unit.name }}
  column( field='size', header='SIZE', :show-filter-match-modes='false' className="p-text-right" )
    template(#body='{ data }')
      span.font-bold {{ data.length }}*{{ data.width }}*{{ data.height }}
  column( field='weight', header='WEIGHT(KG)', :show-filter-match-modes='false' className="p-text-right" )
    template(#body='{ data }')
      span.font-bold {{data.weight}}
  column( field='category.name', header='CATEGORY', sortable='', :show-filter-match-modes='false' className="p-text-right" )
    template(#body='{ data }')
      span.font-bold {{ data.category.name }}
  template(#footer)
    Pagination(
      :paging="paging"
      :total="listStockWithAmount.length"
      @onPage="onPage")
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'nuxt-property-decorator'
import { PAGINATE_DEFAULT } from '~/utils'
import Pagination from '~/components/common/Pagination.vue'
import { Paging } from '~/models/common/Paging'

@Component({
  components: {
    Pagination
  }
})
class BoxDetailHistory extends Vue {
  paging: Paging.Model = { ...PAGINATE_DEFAULT, first: 0 }
  @Prop() listStockWithAmount!: any[]
  @Prop() getParam: () => any

  pagination: any = {
    first: 0,
    page: 0,
    pageCount: 1,
    rows: 20
  }

  get dataRenderItems() {
    const lastIndex = this.pagination.first + this.pagination.rows
    return this.listStockWithAmount.filter(
      (_, index) => index >= this.pagination.first && index < lastIndex
    )
  }

  onPage(event: any) {
    this.pagination = event
  }

  @Watch('listStockWithAmount')
  resetPaging() {
    this.pagination.first = 0
  }

  onRowClick({ data }) {
    this.$router.push({
      path: `/stock/${data.id}/item/${this.$route.params.id}`
    })
  }

}

export default BoxDetailHistory
</script>

<style lang="sass" scoped>
.box-page-container
  height: calc(100vh - 18rem)
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
