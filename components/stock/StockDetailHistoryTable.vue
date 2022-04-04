<template lang="pug">
  DataTable(v-if="boxData" :value="boxData" responsiveLayout="scroll" dataKey="id"
            :resizableColumns="true" :paginator="true" :rows="100").h-full.flex.flex-column.airtag-datatable
            Column(field="no" header="NO" sortable)
              template(#body="slotProps")
                span.font-semibold {{slotProps.index +1}}
            Column(field="code" header="TIME" sortable bodyClass="font-semibold")
            Column(field="sender" header="ORIGINAL LOCATION" sortable)
            Column(field="size" header="NEW LOCATION" sortable bodyClass="font-semibold")
            Column(field="weight" header="CREATOR ID" sortable bodyClass="font-semibold")
            template(#paginatorstart)
              .flex.align-items-cente
                .icon--large.icon-footer-paginator.surface-400
                span.ml-3.text-400.text-sm Showing 01 - 50 of 80
</template>
<script lang="ts">
import { Component, namespace, Vue } from 'nuxt-property-decorator'
const nsStoreStock = namespace('stock/stock-detail')

@Component
class StockDetailHistoryTable extends Vue {
  @nsStoreStock.State
  boxData!: any

  @nsStoreStock.Action
  actGetBoxData!: () => Promise<void>

  async mounted() {
    await this.actGetBoxData()
  }
}

export default StockDetailHistoryTable
</script>
<style lang="sass" scoped></style>
