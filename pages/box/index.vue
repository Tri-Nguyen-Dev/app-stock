<template lang="pug">
.box-page-container.flex.flex-column
  .grid.justify-content-between
    .col-fixed
      h1.font-bold.m-0.font-size-4xlarge.line-height-1 Box list
      span.text-600.font-sm(v-if="boxList") {{boxList.length}} products found
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
            span.text-900.ml-3.text-white Add box
  .grid(v-if="isFilter")
    .col-9
      .grid
        .col
          .bg-white.border-round
            div.pt-2.pl-3.pb-1
              span.text-600.font-sm Warehouse
            Dropdown.w-full.border-0.mb-1(v-model="selectedWarehouse" :options="masterData.warehouse" optionLabel="name" placeholder="Select")
        .col
          .bg-white.border-round
            div.pt-2.pl-3.pb-1
              span.text-600.font-sm Location
            Dropdown.w-full.border-0.mb-1(v-model="selectedLocation" :options="masterData.location" optionLabel="name" placeholder="Select")
        .col
          .bg-white.border-round
            div.pt-2.pl-3.pb-1
              span.text-600.font-sm Size
            Dropdown.w-full.border-0.mb-1(v-model="selectedSize" :options="masterData.size" optionLabel="name" placeholder="Select")
        .col
          .bg-white.border-round
            div.pt-2.pl-3.pb-1
              span.text-600.font-sm Code
            span.p-input-icon-right.w-full
              .icon.icon--right.icon-search-input.surface-900.icon--absolute
              InputText.border-0.w-full.mb-1(type="text" placeholder="Enter code")
    .col-3
      .grid.grid-nogutter
        .col
          .bg-white.border-round-left
            div.pt-2.pl-3.pb-1
              span.text-600.font-sm From
            Calendar.w-full.mb-1(v-model="dateFrom" :showIcon="true" inputClass="border-0" placeholder="Select")
        .col.ml-1
          .bg-white.border-round-right
            div.pt-2.pl-3.pb-1
              span.text-600.font-sm To
            Calendar.w-full.mb-1(v-model="dateTo" :showIcon="true" inputClass="border-0" placeholder="Select")
  .grid.grid-nogutter.flex-1.relative.overflow-hidden
    .col.h-full.absolute.top-0.left-0.right-0
      DataTable.w-full.airtag-datatable.h-full.flex.flex-column(v-if="boxList" :value="boxList" responsiveLayout="scroll" :selection.sync="selectedBoxes"
      dataKey="id" :resizableColumns="true" :rows="20" :scrollable="false" :class="boxList.length === 0 && 'datatable-empty'" :rowClass="rowClass")
        Column(selectionMode="multiple" :styles="{width: '3rem'}" :exportable="false")
        Column(field="no" header="NO" sortable)
          template(#body="slotProps")
            span.font-semibold {{slotProps.index +1}}
        Column(field="barCode" header="CODE" sortable bodyClass="font-semibold")
        Column(field="seller.email" header="SELLER EMAIL" sortable className="w-3")
        Column(field="createdAt" header="CREATE TIME" sortable className="p-text-right")
          template(#body="{data}") {{new Date(data.createdAt).toLocaleDateString("en-US")}}
        Column(field="attribute" header="SIZE(CM)" className="p-text-right" bodyClass="font-semibold")
          template(#body="{data}") {{data.length}}*{{data.width}}*{{data.height}}
        Column(field="attribute" header="WEIGHT(KG)" className="p-text-right" bodyClass="font-semibold")
          template(#body="{data}") {{data.weight}}
        Column(field="warehouse.name" header="WAREHOUSE" sortable className="p-text-right")
          template(#body="{data}")
            .flex.align-items-center.cursor-pointer.justify-content-end
              span.text-primary.font-bold.font-sm {{data.warehouse.name}}
              .icon--small.icon-arrow-up-right.bg-primary
        Column(field="location.name" header="LOCATION" sortable className="p-text-right")
          template(#body="{data}")
            .flex.align-items-center.cursor-pointer.justify-content-end
              span.text-primary.font-bold.font-sm {{data.location.name}}
              .icon--small.icon-arrow-up-right.bg-primary
        Column(field="status" header="STATUS" sortable className="p-text-right")
          template(#body="{data}")
            div
              Tag(v-if="data.status" severity="success").px-2.bg-green-100
                span.font-bold.text-green-400.font-sm AVAILABLE
              Tag(v-else severity="success").px-2.surface-200
                span.font-bold.text-400.font-sm DISABLE
        Column(:exportable="false" header="ACTION" className="p-text-right")
          template(#body="{data}")
            Button.border-0.p-0.h-2rem.w-2rem.justify-content-center.surface-200(:disabled="!data.status")
              .icon--small.icon-edit
            Button.border-0.p-0.ml-1.h-2rem.w-2rem.justify-content-center.surface-200(@click="showModalDelete(data.id)" :disabled="!data.status")
              .icon--small.icon-delete
        template(#empty)
          div.text-center
            img(:src='require("~/assets/icons/empty-table.svg")')
            h5.font-md.font-bold List is empty! Click
              a.text-primary(href="/box") here
              | to add item.
        template(#footer)
          div
            .flex.align-items-center(v-if="selectedBoxes.length <= 0")
              .icon--large.icon-footer-paginator.surface-400
              span.ml-3.text-400.font-sm Showing 01 - {{pageSize}} of {{totalBoxRecords}}
            Button(@click="showModalDelete(null)" v-if="selectedBoxes.length>0").p-button-danger.opacity-70
              .icon--small.icon-delete.bg-white
              span.ml-3 Delete {{selectedBoxes.length}} items selected
          Paginator(:rows="pageSize" :totalRecords="totalBoxRecords" @page="onPage($event)").p-0
    ConfirmDialogCustom(
      title="Confirm delete"
      :message="`Are you sure you want to delete in this list stock?`"
      image="confirm-delete"
      :isShow="isModalDelete"
      :onOk="handleDeleteStock"
      :onCancel="handleCancel"
      :loading="loadingSubmit"
    )

</template>

<script lang="ts">
import { Component, namespace, Vue, Watch } from 'nuxt-property-decorator'
import { Box } from '~/models/Box'
import ConfirmDialogCustom from '~/components/dialog/ConfirmDialog.vue'
const nsStoreBox = namespace('box/box-list')
const nsStoreMasterData = namespace('box/master-data')

@Component({
  components: {
    ConfirmDialogCustom
  }
})
class BoxList extends Vue {
  selectedBoxes=[];
  selectedWarehouse = null
  selectedSize = null
  selectedLocation = null
  isFilter = false
  dateFrom = null
  dateTo = null
  pageNumber: number = 0
  pageSize: number = 20
  isModalDelete: boolean = false
  loadingSubmit: boolean = false
  ids: string[] = []

  @nsStoreBox.State
  boxList!: Box.Model[]

  @nsStoreBox.State
  totalBoxRecords!: number

  @nsStoreMasterData.State
  masterData!: any

  @nsStoreBox.Action
  actGetBoxList!: (params: any) => Promise<void>

  @nsStoreMasterData.Action
  actGetMasterData!: () => Promise<void>

  @nsStoreBox.Action
  actDeleteBoxById!: (
    params: any
  ) => Promise<any>

  async mounted() {
    await this.actGetBoxList({ pageNumber: this.pageNumber, pageSize: this.pageSize })
    // await this.actGetMasterData()
  }

  @Watch('selectedSize')
  @Watch('selectedWarehouse')
  filterChange() {
    // console.log("value");
  }

  async onPage(event: any) {
    await this.actGetBoxList({ pageNumber: event.page + 1, pageSize: this.pageSize })
  }

  async handleDeleteStock() {
    // console.log(this.ids);
  }

  handleCancel() {
    this.isModalDelete = false
  }

  async deleteBoxById(id: any) {
    const ids = id? [id] : this.selectedBoxes.map((box: Box.Model) => box.id)
    const result = await this.actDeleteBoxById({ids})
    if (result) {
      await this.actGetBoxList({ pageNumber: this.pageNumber, pageSize: this.pageSize })
    }
  }

  showModalDelete(id?: string) {
    this.ids = id? [id] : this.selectedBoxes.map((box: Box.Model) => box.id);
    this.isModalDelete = true
  }

  rowClass(data: Box.Model) {
    return !data.status && 'row-disable';
  }
}
export default BoxList
</script>

<style lang="sass" scoped>
.box-page-container
  height: calc(100vh - 32px)
  ::v-deep.p-component
    font-family: $font-family-primary
  ::v-deep.pi-calendar:before
    content: url('~/assets/icons/calendar.svg')
  ::v-deep.p-calendar-w-btn
    .p-button
      background: none
      border: none
</style>
