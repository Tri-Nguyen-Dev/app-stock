<template lang="pug">
  .grid.p-4.surface-300.h-srceen.stock__information-detail
    .col-3.p-0.surface-0.border-round.h-screen.overflow-y-auto.overflow-x-hidden
      .grid.border-bottom-1.border-gray-300
       .col.p-4.flex.align-items-center
        Button(@click='backToStockList').p-button-link.mr-2
          .icon.icon-btn-back.bg-blue-700
        span.font-semibold.text-base Stock list / Stock Detail
      .stock__information--gerenal.p-4
        .grid.mb-3
          .col-9.pl-0.flex
            .icon-btn.icon-box-info.inline-block.mr-1.bg-blue-700
            span.uppercase.font-bold.text-sm general infomation
          .col.flex.justify-content-end
            .surface-hover.border-round.cursor-pointer.p-2(@click='editStockDetail' :class='isEditStockDetail ? "hidden" : " "')
              .icon-btn.icon-btn-edit
            Button(:class='isEditStockDetail ? " " : "hidden"' @click='saveEditStockDetail')
              .icon-btn.icon-check-lg.bg-white.mr-1
              span.uppercase save
        .grid.mb-3(:class='isEditStockDetail ? "opacity-40" : "opacity-100"')
          img(:src='require("~/assets/images/sample.png")').border-round.w-full
        .grid.my-2(:class='isEditStockDetail ? "opacity-40" : "opacity-100"')
          Tag(severity="success").uppercase Available
        .grid.mb-2(:class='isEditStockDetail ? "opacity-40" : "opacity-100"')
          h5.font-bold.my-2 Apple Macbook Pro
        .grid(:class='isEditStockDetail ? "opacity-40" : "opacity-100"')
          p.uppercase.inline.font-semibold.text-400.mr-2 code:
          span.uppercase.font-semibold.text-blue-700 ABH123
        .grid(:class='isEditStockDetail ? "opacity-40" : "opacity-100"')
          p.uppercase.inline.font-semibold.text-400.mr-2 unit:
          span.uppercase.font-semibold.text-blue-700 piece
        .grid.surface-hover.mb-3
          .col-2.flex.align-items-center
            .icon-btn.icon-size.bg-blue-700
          .col
            div.text-500 Size (cm)
            InputText( :disabled='isEditStockDetail == 0')
        .grid.surface-hover.mb-3
          .col-2.flex.align-items-center
            .icon-btn.icon-weight.bg-blue-700
          .col
            div.text-500 Weight (kg)
            InputText( :disabled='isEditStockDetail == 0')
        .grid.surface-hover.mb-3(:class='isEditStockDetail ? "opacity-40" : "opacity-100"')
          .col-2.flex.align-items-center
            .icon-btn.icon-inventory-quantity.bg-blue-700
          .col
            div.text-500 Inventory quantity
            span.font-semibold.mr-1.uppercase 2
        .grid.surface-hover.mb-3(:class='isEditStockDetail ? "opacity-40" : "opacity-100"')
          .col-2.flex.align-items-center
            .icon-btn.icon-total-inventory.bg-blue-700
          .col
            div.text-500 Total inventory quantity
            span.font-semibold.mr-1.uppercase 80
    .col-9.pl-5.h-screen.py-0
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
            Dropdown.w-full.border-0.mb-1(v-model="selectWarehouse" :options="warehouse" optionLabel="name" placeholder="Select")
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
            Dropdown.w-full.border-0.mb-1(v-model="selectStatus" :options="status" optionLabel="name" placeholder="Select")
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
import { Component, Vue, namespace } from 'nuxt-property-decorator'
const nsStoreStockTable = namespace('stock/stock-detail')

@Component({
  layout: 'dashboard'
})
class StockDetail extends Vue {
  selectedWarehouse = null

  selectedStatus = null

  isShowFilter: boolean = false

  isEditStockDetail: boolean = false

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

  backToStockList() {
    this.$router.push('/stock')
  }

  showFilter() {
    this.isShowFilter = !this.isShowFilter
  }

  editStockDetail() {
    this.isEditStockDetail = true
  }

  saveEditStockDetail() {
    this.isEditStockDetail = false
  }

  async mounted() {
    await this.actGetBoxData()
  }
}
export default StockDetail
</script>

<style lang="sass">

body
  background: #e8eaef

.stock__information-detail
  .stock__information--gerenal
    .p-disabled, .p-component:disabled
        opacity: 1

    .p-inputtext
      border: none
      background: transparent
      padding: 0
      color: #000
      font-weight: 600

.p-inputtext,
.p-dropdown,
.p-button
  box-shadow: none !important

.stock__detail--table
  height: calc(100vh - 148px)

.p-paginator.p-component.p-paginator-bottom
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

.pi-sort-alt:before
  content: url('~/assets/icons/sort.svg')
.pi-sort-amount-up-alt:before
    content: url('~/assets/icons/sort.svg')
.pi-sort-amount-down:before
  content: url('~/assets/icons/sort.svg')
.p-datatable .p-datatable-thead > tr > th
  background: #F9F9FC
  border: none
  color: #464D64

.p-datatable .p-sortable-column:focus
    box-shadow: none
::-webkit-scrollbar
 width: 7px
 height: 7px
 background-color: #F5F5F5

::-webkit-scrollbar-track
 -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3)
 border-radius: 10px
 background-color: #F5F5F5

::-webkit-scrollbar-thumb
 border-radius: 10px
 -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3)
 background-color: #979AA4
</style>
