<template lang="pug">
  DataTable.bg-white.table__sort-icon.w-full.h-full.flex.flex-column(responsiveLayout="scroll" dataKey="id" :resizableColumns="true" :rows="20" :scrollable="false" @sort="sortData($event)")
    Column(field="no" header="NO" :styles="{'width': '1%'}")
      template(#body="{ index }")
        span.font-semibold {{ (index + 1) + paginate.pageNumber * paginate.pageSize  }}
    Column(field="sku" header="TIME" sortable :styles="{'width': '100%'}")
    Column(field="sku" header="ORIGINAL LOCATION" sortable)
    Column(field="sku" header="NEW LOCATION" sortable)
    Column(field="sku" header="ID CREATOR" sortable)
    template(#footer)
      .pagination
        div.pagination__info
          img(:src="require('~/assets/icons/filter-left.svg')")
          span.pagination__total
        Paginator(rows=2 totalRecords=10 @page="onPage($event)")
    template(#empty)
      div.flex.align-items-center.justify-content-center.flex-column
        img(:srcset="`${require('~/assets/images/table-empty.png')} 2x`" )
        p.text-900.font-bold.mt-3 List is empty!
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
class StockDetailHistoryTable extends Vue {
}

export default StockDetailHistoryTable
</script>
<style lang="sass" scoped></style>
