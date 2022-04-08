<template lang="pug">
.item__detail--table
  DataTable(v-if="boxData" :value="boxData" responsiveLayout="scroll" dataKey="id"
            :resizableColumns="true" :paginator="true" :rows="100")
            Column(field="no" header="NO" sortable)
              template(#body="slotProps")
                span.font-semibold {{slotProps.index +1}}
            Column(field="code" header="TIME" sortable bodyClass="font-semibold")
            Column(field="sender" header="ORIGINAL LOCATION" sortable)
            Column(field="size" header="NEW LOCATION" sortable bodyClass="font-semibold")
            Column(field="weight" header="CREATOR ID" sortable bodyClass="font-semibold")
            template(#paginatorstart)
              //- img(:src='require("~/assets/icons/footer-paginator.svg")')
              span.ml-3.text-400.text-sm Showing 01 - 50 of 80
</template>
<script lang="ts">
import { Component, namespace, Vue } from 'nuxt-property-decorator';
const nsStoreStock = namespace('stock/stock-detail');

@Component
class StockDetailHistoryTable extends Vue {
  @nsStoreStock.State
  boxData!: any

  @nsStoreStock.Action
  actGetBoxData!: () => Promise<void>

  async mounted() {
    await this.actGetBoxData();
  }
}

export default StockDetailHistoryTable;
</script>
<style lang="sass" scoped>
.item__detail--table
  height: calc(100vh - 87px)

::v-deep.p-paginator.p-component.p-paginator-bottom
  .p-paginator-left-content
    display: flex

  .p-paginator-element
    border: none !important

  .p-paginator-first,
  .p-paginator-last
    display: none

  .p-link
    background: #fff
    color: #ced4da

  .p-highlight
    color: #000
</style>
