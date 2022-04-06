<template lang="pug">
    DataTable.h-full.flex.flex-column.p-datatable-customers.airtag-datatable.table__sort-icon.bg-white(
      responsiveLayout="scroll"
      dataKey="id"
      :value='stockList'
      :resizableColumns="true"
      :paginator="false" :rows="100"
      )
      Column(field="no" header="NO" sortable)
        template(#body='slotProps')
          span.font-bold {{slotProps.index + 1 }}
      Column(field="" header="TIME" sortable bodyClass="font-semibold" style=" width: 700px")
        template(#body='{data}')
          span.font-bold {{data.createdAt}}
      Column(field="" header="ORIGINAL LOCATION" sortable)
      Column(field="" header="NEW LOCATION" sortable bodyClass="font-semibold")
      Column(field="" header="CREATOR ID" sortable bodyClass="font-semibold")
        template(#body='{data}')
          span.font-bold {{data.creatorId}}
      template(#footer)
                .pagination
                  div.pagination__info
                    img(:src="require('~/assets/icons/filter-left.svg')")
                    span.pagination__total {{(pageNumber - 1) * pageSize + 1}} - {{(pageNumber - 1) * pageSize + stockList.length}} of {{totalStockRecords}}
                  Paginator(:rows="20" :totalRecords="totalStockRecords" @page="onPageHistory($event)").p-0

</template>
<script lang="ts">
import { Component, Vue, namespace, Prop } from 'nuxt-property-decorator'
const nsStoreBoxDetail = namespace('box/box-detail')


@Component
class BoxDetailHistory extends Vue {
  @Prop() stockList!: () => any
  @Prop() totalStockRecords: () => any

  totalItemsCount = 32
  pageSize: number = 20
  pageNumber: number = 1

  getParamApi(){
    return {
      pageNumber: this.pageNumber, pageSize: this.pageSize
    }
  }

  @nsStoreBoxDetail.Action
  actGetBoxDetailFilter!: (params: any) => Promise<void>

  async mounted() {
   await this.actGetBoxDetailFilter({ pageNumber: this.pageNumber, pageSize: this.pageSize })
  }


  async onPageHistory(event: any) {
    this.pageNumber = event.page + 1;
    await this.actGetBoxDetailFilter(this.getParamApi())
  }
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
  ::-webkit-input-placeholder
    color: $text-color-900
  .p-disabled, .p-component:disabled
    opacity: 1
</style>

