<template lang="pug">
.box-page-container.p-2
  .grid.justify-content-between
    .col-fixed
      h1.m-0.mb-1 Box List
      span.text-600.text-sm(v-if="boxData") {{boxData.length}} products found
    .col-fixed
      .grid
        .col-fixed
          span.p-input-icon-left
            .icon.icon--left.icon-search-input.surface-900.icon--absolute
            InputText.w-23rem(type="text" placeholder="Search")
        .col-fixed
          Button.border-0.bg-white.w-7rem(@click="isFilter = !isFilter")
            .icon.icon--left.icon-filter-btn.surface-900
            span.text-900.ml-3 Filter
        .col-fixed
          Button.w-10rem(label="Add items" icon="pi pi-plus")
  .grid.mt-2(v-if="isFilter")
    .col-9
      .grid
        .col
          .bg-white.border-round
            div.pt-2.pl-3.pb-1
              span.text-600.text-sm Warehouse
            Dropdown.w-full.border-0.mb-1(v-model="selectedWarehouse" :options="warehouse" optionLabel="name" placeholder="Select")
        .col
          .bg-white.border-round
            div.pt-2.pl-3.pb-1
              span.text-600.text-sm Size
            Dropdown.w-full.border-0.mb-1(v-model="selectedSize" :options="size" optionLabel="name" placeholder="Select")
        .col
          .bg-white.border-round
            div.pt-2.pl-3.pb-1
              span.text-600.text-sm Code
            span.p-input-icon-right.w-full
              i.pi.pi-search
              InputText.border-0.w-full.mb-1(type="text" placeholder="Enter code")
        .col
          .bg-white.border-round
            div.pt-2.pl-3.pb-1
              span.text-600.text-sm Location
            Dropdown.w-full.border-0.mb-1(v-model="selectedLocation" :options="location" optionLabel="name" placeholder="Select")
    .col-3
      .grid.grid-nogutter
        .col
          .bg-white.border-round-left
            div.pt-2.pl-3.pb-1
              span.text-600.text-sm From
            Calendar.w-full.mb-1(v-model="dateFrom" :showIcon="true" inputClass="border-0" placeholder="Select")
        .col.ml-1
          .bg-white.border-round-right
            div.pt-2.pl-3.pb-1
              span.text-600.text-sm To
            Calendar.w-full.mb-1(v-model="dateTo" :showIcon="true" inputClass="border-0" placeholder="Select")
  .grid.mt-2
    .col
      DataTable.w-full(v-if="boxData" :value="boxData" responsiveLayout="scroll" :selection.sync="selectedProducts" dataKey="id"
        :resizableColumns="true" :paginator="true" :rows="100")
        Column(selectionMode="multiple" :styless="{width: '3rem'}" :exportable="false")
        Column(field="no" header="NO" sortable)
          template(#body="slotProps")
            span.font-semibold {{slotProps.index +1}} 
        Column(field="code" header="CODE" sortable bodyClass="font-semibold")
        Column(field="sender" header="SENDER" sortable)
        Column(field="size" header="SIZE(CM)" sortable bodyClass="font-semibold")
        Column(field="weight" header="WEIGHT(KG)" sortable bodyClass="font-semibold")
        Column(field="warehouse" header="WAREHOUSE" sortable)
          template(#body="slotProps")
            span.text-primary.font-bold {{slotProps.data.warehouse}}
            img.ml-1(:src='require("~/assets/icons/arrow-up-right.svg")')
        Column(field="location" header="LOCATION" sortable)
          template(#body="slotProps")
            span.text-primary.font-bold {{slotProps.data.location}}
            img.ml-1(:src='require("~/assets/icons/arrow-up-right.svg")')
        Column(field="status" header="STATUS" sortable)
          template(#body="slotProps")
            Tag.px-3.bg-green-100.text-green-400.text-sm(severity="success" :value="slotProps.data.status.toUpperCase()")
        Column(:exportable="false" header="ACTION" :styles="{'min-width':'8rem'}" sortable)
          template(#body="slotProps")
            Button.border-0.p-0.bg-white
              img(:src='require("~/assets/icons/btn-edit.svg")')
            Button.border-0.p-0.ml-1.bg-white
              img(:src='require("~/assets/icons/btn-delete.svg")')
        template(#paginatorstart)
          img(:src='require("~/assets/icons/footer-paginator.svg")')
          span.ml-3.text-400.text-sm Showing 01 - 100 of 1280
    </template>
</template>

<script lang="ts">
import { Component, namespace, Vue } from 'nuxt-property-decorator'
const nsStoreBox = namespace('box/store-box')
@Component
class BoxList extends Vue {
  selectedWarehouse = null
  selectedSize = null
  selectedLocation = null
  isFilter = false
  dateFrom = null
  dateTo = null
  warehouse = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' },
  ]
  size = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' },
  ]
  location = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' },
  ]
  selectedProducts=null

  @nsStoreBox.State
  boxData!: any

  @nsStoreBox.Action
  actGetBoxData!: () => Promise<void>

  async mounted() {
    await this.actGetBoxData()
  }
}
export default BoxList
</script>

<style lang="sass">
body
  background: #E8EAEF
.box-page-container
  .pi-sort-alt:before
    content: url('~/assets/icons/sort.svg')
  .pi-sort-amount-up-alt:before
    content: url('~/assets/icons/sortDesc.svg')
  .pi-sort-amount-down:before 
    content: url('~/assets/icons/sortAsc.svg')
  .p-datatable .p-datatable-thead > tr > th
    background: #F9F9FC
    border: none
    color: #464D64
  .pi-calendar:before
    content: url('~/assets/icons/calendar.svg')
  .p-calendar-w-btn
    .p-button
      background: none
      border: none
      
</style>