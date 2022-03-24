<template lang="pug">
.box-page-container.mx-3.mt-3.flex.flex-column
  .grid.justify-content-between
    .col-fixed
      h1.font-bold.m-0.font-size-4xlarge.line-height-1 Box list
      span.text-600.font-size-small(v-if="boxData") {{boxData.length}} products found
    .col-fixed
      .grid
        .col-fixed
          span.p-input-icon-left
            .icon.icon--left.icon-search-input.surface-900
            InputText.w-21rem.h-3rem(type="text" placeholder="Search")
        .col-fixed
          Button.border-0.bg-white.w-8rem.h-3rem.border-primary(@click="isFilter = !isFilter")
            .icon--base.bg-primary(:class="isFilter ? 'icon-chevron-up' : 'icon-filter-btn'")
            span.text-900.ml-3.text-primary Filter
        .col-fixed
          Button.w-9rem.h-3rem
            .icon--base.icon-plus.surface-900.bg-white
            span.text-900.ml-3.text-white Add items
  .grid(v-if="isFilter")
    .col-9
      .grid
        .col
          .bg-white.border-round
            div.pt-2.pl-3.pb-1
              span.text-600.font-size-small Warehouse
            Dropdown.w-full.border-0.mb-1(v-model="selectedWarehouse" :options="masterData.warehouse" optionLabel="name" placeholder="Select")
        .col
          .bg-white.border-round
            div.pt-2.pl-3.pb-1
              span.text-600.font-size-small Size
            Dropdown.w-full.border-0.mb-1(v-model="selectedSize" :options="masterData.size" optionLabel="name" placeholder="Select")
        .col
          .bg-white.border-round
            div.pt-2.pl-3.pb-1
              span.text-600.font-size-small Code
            span.p-input-icon-right.w-full
              .icon.icon--right.icon-search-input.surface-900.icon--absolute
              InputText.border-0.w-full.mb-1(type="text" placeholder="Enter code")
        .col
          .bg-white.border-round
            div.pt-2.pl-3.pb-1
              span.text-600.font-size-small Location
            Dropdown.w-full.border-0.mb-1(v-model="selectedLocation" :options="masterData.location" optionLabel="name" placeholder="Select")
    .col-3
      .grid.grid-nogutter
        .col
          .bg-white.border-round-left
            div.pt-2.pl-3.pb-1
              span.text-600.font-size-small From
            Calendar.w-full.mb-1(v-model="dateFrom" :showIcon="true" inputClass="border-0" placeholder="Select")
        .col.ml-1
          .bg-white.border-round-right
            div.pt-2.pl-3.pb-1
              span.text-600.font-size-small To
            Calendar.w-full.mb-1(v-model="dateTo" :showIcon="true" inputClass="border-0" placeholder="Select")
  .grid.grid-nogutter.flex-1.relative.overflow-hidden
    .col.h-full.absolute.top-0.left-0.right-0
      DataTable.w-full.airtag-datatable.h-full.flex.flex-column(v-if="boxData" :value="boxData" responsiveLayout="scroll" :selection.sync="selectedBoxes" 
      dataKey="id" :resizableColumns="true" :rows="20" :scrollable="false")
        Column(selectionMode="multiple" :styless="{width: '3rem'}" :exportable="false")
        Column(field="no" header="NO" sortable)
          template(#body="slotProps")
            span.font-semibold {{slotProps.index +1}} 
        Column(field="code" header="CODE" sortable bodyClass="font-semibold")
        Column(field="seller.email" header="SENDER EMAIL" sortable className="w-3")
        Column(field="createAt" header="CREATE TIME" sortable className="p-text-right")
          template(#body="{data}") {{new Date(data.createAt).toLocaleDateString("en-US")}}
        Column(field="attribute" header="SIZE(CM)" sortable className="p-text-right" bodyClass="font-semibold")
          template(#body="{data}") {{data.attribute.length}}*{{data.attribute.height}}*{{data.attribute.width}}
        Column(field="attribute.weight" header="WEIGHT(KG)" sortable className="p-text-right" bodyClass="font-semibold")
          template(#body="{data}") {{data.attribute.weight}}
        Column(field="warehouse.name" header="WAREHOUSE" sortable className="p-text-right")
          template(#body="{data}")
            .flex.align-items-center.cursor-pointer.justify-content-end
              span.text-primary.font-bold.font-size-small {{data.warehouse.name}}
              .icon--small.icon-arrow-up-right.bg-primary
        Column(field="location.name" header="LOCATION" sortable className="p-text-right")
          template(#body="{data}")
            .flex.align-items-center.cursor-pointer.justify-content-end
              span.text-primary.font-bold.font-size-small {{data.location.name}}
              .icon--small.icon-arrow-up-right.bg-primary
        Column(field="status" header="STATUS" sortable className="p-text-right")
          template(#body="{data}")
            div
              Tag(v-if="data.status").px-2.bg-green-100(severity="success")
                span.font-bold.text-green-400.font-size-small AVAILABLE
              Tag(v-else).px-2.surface-200(severity="success")
                span.font-bold.text-400.font-size-small DISABLE
        Column(:exportable="false" header="ACTION" sortable className="p-text-right")
          template(#body="{data}")
            Button.border-0.p-0.h-2rem.w-2rem.justify-content-center.surface-200(:disabled="!data.status")
              .icon--small.icon-edit
            Button.border-0.p-0.ml-1.h-2rem.w-2rem.justify-content-center.surface-200(@click="deleteBoxById(data.id)" :disabled="!data.status")
              .icon--small.icon-delete
        template(#footer)
          div
            .flex.align-items-center(v-if="selectedBoxes.length <= 0")
              .icon--large.icon-footer-paginator.surface-400
              span.ml-3.text-400.font-size-small Showing 01 - 100 of 1280
            Button(@click="deleteBoxById(null)" v-if="selectedBoxes.length>0").p-button-danger.opacity-70
              .icon--small.icon-delete.bg-white
              span.ml-3 Delete {{selectedBoxes.length}} items selected
          Paginator(:rows="20" :totalRecords="totalItemsCount").p-0
</template>

<script lang="ts">
import { Component, namespace, Vue } from 'nuxt-property-decorator'
const nsStoreBox = namespace('box/store-box')
const nsStoreMasterData = namespace('box/master-data')
import { Box } from '~/models/Box'

@Component({
  layout: 'dashboard',
})
class BoxList extends Vue {
  selectedBoxes=[];
  selectedWarehouse = null
  selectedSize = null
  selectedLocation = null
  isFilter = false
  dateFrom = null
  dateTo = null
  totalItemsCount = 50

  @nsStoreBox.State
  boxData!: Box.Model[]

  @nsStoreBox.Action
  actGetBoxData!: () => Promise<void>

  @nsStoreMasterData.State
  masterData!: any

  @nsStoreMasterData.Action
  actGetMasterData!: () => Promise<void>

  @nsStoreBox.Action
  actDeleteBoxById!: (
    params: any
  ) => Promise<any>

  async mounted() {
    await this.actGetBoxData()
    await this.actGetMasterData()
  }

  async deleteBoxById(id: any) {
    const ids = id? [id] : this.selectedBoxes.map((box: Box.Model) => box.id)
    const result = await this.actDeleteBoxById({ids})
    if (result) {
      await this.actGetBoxData()
    }
  }
}
export default BoxList
</script>

<style lang="sass">
body
  background: #E8EAEF
  // overflow: hidden
.box-page-container
  height: calc(100vh - 1rem)
  .p-component
    font-family: $font-family-primary
  .pi-calendar:before
    content: url('~/assets/icons/calendar.svg')
  .p-calendar-w-btn
    .p-button
      background: none
      border: none
</style>
