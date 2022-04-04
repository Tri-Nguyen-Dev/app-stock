<template lang="pug">
    DataTable.h-full.flex.flex-column.p-datatable-customers.airtag-datatable(
      responsiveLayout="scroll" 
      dataKey="id" 
      :value='stockList'
      :resizableColumns="true" 
      :paginator="false" :rows="100"
      )
      Column(field="no" header="NO" sortable)
        template(#body='{data}')
          span.font-bold {{data.length  + 1 }} 
      Column(field="" header="TIME" sortable bodyClass="font-semibold" style=" width: 700px")
        template(#body='{data}')
          span.font-bold {{data.createdAt}} 
      Column(field="" header="ORIGINAL LOCATION" sortable)
      Column(field="" header="NEW LOCATION" sortable bodyClass="font-semibold")
      Column(field="" header="CREATOR ID" sortable bodyClass="font-semibold")
      template(#footer)
        div
          .flex.align-items-center
            span.ml-3.text-400.font-size-small Showing 01 - 100 of 1280
        Paginator(:rows="20" :totalRecords="totalItemsCount").p-0

</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
class BoxDetailHistory extends Vue {
@Prop() stockList!: () => any
  totalItemsCount = 32
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

