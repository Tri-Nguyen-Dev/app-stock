<template lang="pug">
  div
    .grid
      .col
        h3.mb-0 Stock detail
        div.text-600 80 products found
      .col
        .grid
          .col-9.flex.justify-content-end
            span.p-input-icon-left.w-10
              .icon.icon--left.icon-search
              InputText#inputSearch.h-full.border-none.w-full.text-900.text-sm(type='text' placeholder='Search')
          .col
            Button.border-0.bg-white(@click='showFilter')
              .icon-btn.icon--left.icon-filter.surface-900(:class='isShowFilter ? "hidden" : " "')
              .icon-btn.icon--left.icon-chevron-up.surface-900(:class='isShowFilter ? "" : "hidden"')
              span.text-900.ml-3 Filter
    .grid.mt-2(v-show='isShowFilter')
      .col
        .bg-white.border-round
          div.pt-2.pl-3.pb-1
            span.text-600.text-sm Seller
          span.p-input-icon-right.w-full
            .icon.icon--right.icon-search
            InputText.border-0.w-full.mb-1(type="text" placeholder="Enter seller name")
      .col
        .bg-white.border-round
          div.pt-2.pl-3.pb-1
            span.text-600.text-sm SKU
          span.p-input-icon-right.w-full
            .icon.icon--right.icon-search
            InputText.border-0.w-full.mb-1(type="text" placeholder="Enter SKU")
      .col
        .bg-white.border-round
          div.pt-2.pl-3.pb-1
            span.text-600.text-sm Box Code
          span.p-input-icon-right.w-full
            .icon.icon--right.icon-search
            InputText.border-0.w-full.mb-1(type="text" placeholder="Enter code")
      .col
        .bg-white.border-round
          div.pt-2.pl-3.pb-1
            span.text-600.text-sm Warehouse
          Dropdown.w-full.border-0.mb-1( :options="warehouse" optionLabel="name" placeholder="Select")
      .col
        .bg-white.border-round
          div.pt-2.pl-3.pb-1
            span.text-600.text-sm Location
          span.p-input-icon-right.w-full
            .icon.icon--right.icon-search
            InputText.border-0.w-full.mb-1(type="text" placeholder="Enter location")
      .col
        .bg-white.border-round
          div.pt-2.pl-3.pb-1
            span.text-600.text-sm Status
          Dropdown.w-full.border-0.mb-1( :options="status" optionLabel="name" placeholder="Select")
    ScrollPanel.stock__detail--table
      DataTable(v-if="boxData" :value="boxData" responsiveLayout="scroll" :selection.sync="selectedProducts" dataKey="id"
        :resizableColumns="true" :paginator="true" :rows="100")
        Column(selectionMode="multiple" :styless="{width: '3rem'}" :exportable="false")
        Column(field="no" header="NO" sortable)
          template(#body="slotProps")
            span.font-semibold {{slotProps.index +1}}
        Column(field="code" header="SELLER EMAIL" sortable bodyClass="font-semibold")
        Column(field="sender" header="SKU" sortable)
        Column(field="size" header="INVENTORY LEVEL" sortable bodyClass="font-semibold")
        Column(field="weight" header="BOX CODE" sortable bodyClass="font-semibold")
        Column(field="warehouse" header="WAREHOUSE" sortable)
          template(#body="slotProps")
            span.text-primary.font-bold {{slotProps.data.warehouse}}
        Column(field="location" header="LOCATION" sortable)
          template(#body="slotProps")
            span.text-primary.font-bold {{slotProps.data.location}}
        Column(field="status" header="STATUS" sortable)
          template(#body="slotProps")
            Tag.px-3.bg-green-100.text-green-400.text-sm(severity="success" )
        Column(:exportable="false" header="ACTION" :styles="{'min-width':'8rem'}" sortable)
          template(#body="slotProps")
            Button.border-0.p-0.surface-200.p-2
              .icon-btn.icon-btn-edit
            Button.border-0.p-0.ml-1.surface-200.p-2
              .icon-btn.icon-btn-delete
        template(#paginatorstart)
          .icon-btn.icon-footer-paginator.inline-block.surface-400
          span.ml-3.text-400.text-sm Showing 01 - 50 of 80
</template>
<script lang="ts">
import { Component, namespace, Vue } from 'nuxt-property-decorator'
const nsStoreStockTable = namespace('stock/stock-detail')

@Component
class StockDetailTable extends Vue {
  isShowFilter: boolean = false

  selecteWarehouse = null

  selectedStatus = null

  selectedProducts = null

  warehouse = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
  ]

  status = [
    { name: 'New', id: 1 },
    { name: 'Delivery', id: 2 },
    { name: 'Available', id: 3 },
    { name: 'Lost', id: 4 }
  ]

  @nsStoreStockTable.State
  boxData!: any

  @nsStoreStockTable.Action
  actGetBoxData!: () => Promise<void>

  showFilter() {
    this.isShowFilter = !this.isShowFilter
  }

  async mounted() {
    await this.actGetBoxData()
  }
}
export default StockDetailTable
</script>
<style lang="sass"></style>
