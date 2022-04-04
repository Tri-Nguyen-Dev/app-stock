<template lang="pug">
.box-page-container.flex.flex-column
  .grid.justify-content-between
    .col-fixed
      h1.font-bold.m-0.font-size-4xlarge.line-height-1 Box list
      span.text-600.font-sm(v-if="boxList") {{totalBoxRecords}} products found
    .col-fixed
      .grid
        .col-fixed
          span.p-input-icon-left
            .icon.icon--left.icon-search.surface-900
            InputText.w-21rem.h-3rem(type="text" placeholder="Search" v-model="textSearch" v-on:input="validateText")
        .col-fixed
          Button.border-0.bg-white.w-8rem.h-3rem.border-primary(@click="isFilter = !isFilter")
            .icon.bg-primary(:class="isFilter ? 'icon-chevron-up' : 'icon-filter'")
            span.text-900.ml-3.text-primary Filter
        .col-fixed
          Button.w-9rem.h-3rem.bg-primary
            .icon.icon-add-items.surface-900.bg-white
            span.text-900.ml-3.text-white Add box
  .grid(v-if="isFilter")
    .col-8
      .grid
        .col
          .bg-white.border-round
            div.pt-2.pl-3.pb-1
              span.text-600.font-sm Warehouse
            Dropdown.w-full.border-0.mb-1(v-model="selectedWarehouse" :options="warehouseList" optionLabel="name" placeholder="Select")
        .col
          .bg-white.border-round
            div.pt-2.pl-3.pb-1
              span.text-600.font-sm Location
            span.p-input-icon-right.w-full
              .icon.icon--right.icon-search.surface-900.icon--absolute
              InputText.border-0.w-full.mb-1(type="text" placeholder="Enter location" v-model="textLocation" v-on:input="validateText")
        .col
          .bg-white.border-round
            div.pt-2.pl-3.pb-1
              span.text-600.font-sm Code
            span.p-input-icon-right.w-full
              .icon.icon--right.icon-search.surface-900.icon--absolute
              InputText.border-0.w-full.mb-1(type="text" placeholder="Enter code" v-model="textCode" v-on:input="validateText")
    .col-4
      .grid.grid-nogutter
        .col
          .bg-white.border-round-left
            div.pt-2.pl-3.pb-1
              span.text-600.font-sm From
            Calendar.w-full.mb-1(v-model="dateFrom" :showIcon="true" inputClass="border-0" placeholder="Select" dateFormat="dd-mm-yy")
        .col.ml-1
          .bg-white.border-round-right
            div.pt-2.pl-3.pb-1
              span.text-600.font-sm To
            Calendar.w-full.mb-1(v-model="dateTo" :showIcon="true" inputClass="border-0" placeholder="Select" dateFormat="dd-mm-yy")
  .grid.grid-nogutter.flex-1.relative.overflow-hidden
    .col.h-full.absolute.top-0.left-0.right-0
      DataTable.w-full.airtag-datatable.h-full.flex.flex-column(v-if="boxList" :value="boxList" responsiveLayout="scroll" :selection.sync="selectedBoxes"
      dataKey="id" :resizableColumns="true" :rows="20" :scrollable="false" :class="boxList.length === 0 && 'datatable-empty'" :rowClass="rowClass" @sort="sortData($event)")
        Column(selectionMode="multiple" :styles="{width: '3rem'}" :exportable="false")
        Column(field="no" header="NO")
          template(#body="slotProps")
            span.font-semibold {{(pageNumber - 1) * pageSize + slotProps.index +1}}
        Column(field="barCode" header="CODE" :sortable="true" bodyClass="font-semibold")
        Column(field="id" header="ID" :sortable="true" bodyClass="font-semibold")
        Column(field="seller.email" header="SELLER EMAIL" :sortable="true" className="w-3")
        Column(field="createdAt" header="CREATE TIME" :sortable="true" className="p-text-right")
          template(#body="{data}") {{new Date(data.createdAt).toLocaleDateString("en-US")}}
        Column(field="attributes" header="SIZE(CM)" className="p-text-right" bodyClass="font-semibold")
          template(#body="{data}") {{data.length}}*{{data.width}}*{{data.height}}
        Column(field="weight" header="WEIGHT(KG)" className="p-text-right" bodyClass="font-semibold")
          template(#body="{data}") {{data.weight}}
        Column(field="warehouse.name" header="WAREHOUSE" :sortable="true" className="p-text-right")
          template(#body="{data}")
            .flex.align-items-center.cursor-pointer.justify-content-end
              span.text-primary.font-bold.font-sm {{data.warehouse.name}}
              .icon.icon-arrow-up-right.bg-primary
        Column(field="location.name" header="LOCATION" :sortable="true" className="p-text-right")
          template(#body="{data}")
            .flex.align-items-center.cursor-pointer.justify-content-end
              span.text-primary.font-bold.font-sm {{data.location.name}}
              .icon.icon-arrow-up-right.bg-primary
        Column(field="status" header="STATUS" :sortable="true" className="p-text-right")
          template(#body="{data}")
            div
              Tag(v-if="data.status" severity="success").px-2.bg-green-100
                span.font-bold.text-green-400.font-sm AVAILABLE
              Tag(v-else severity="success").px-2.surface-200
                span.font-bold.text-400.font-sm DISABLE
        Column(:exportable="false" header="ACTION" className="p-text-right")
          template(#body="{data}")
            Button.border-0.p-0.h-2rem.w-2rem.justify-content-center.surface-200(:disabled="!data.status")
              .icon.icon-btn-edit
            Button.border-0.p-0.ml-1.h-2rem.w-2rem.justify-content-center.surface-200(@click="showModalDelete(data.id)" :disabled="!data.status")
              .icon.icon-btn-delete
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
              span.ml-3.text-400.font-sm Showing {{(pageNumber - 1) * pageSize + 1}} - {{(pageNumber - 1) * pageSize + boxList.length}} of {{totalBoxRecords}}
            Button(@click="showModalDelete(null)" v-if="selectedBoxes.length>0").p-button-danger.opacity-70
              .icon--small.icon-delete.bg-white
              span.ml-3 Delete {{itemBoxDelete.length}} items selected
          Paginator(:first.sync="firstPage" :rows="pageSize" :totalRecords="totalBoxRecords" @page="onPage($event)").p-0
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
const nsStoreWarehouse = namespace('warehouse/warehouse-list')
const _ = require('lodash')

@Component({
  components: {
    ConfirmDialogCustom
  }
})
class BoxList extends Vue {
  selectedBoxes = [];
  selectedWarehouse : any = null
  textLocation: any = null
  textSearch: any = null
  textCode: any = null
  dateFrom: any = null
  dateTo: any = null
  pageNumber: number = 1
  pageSize: number = 20
  isModalDelete: boolean = false
  loadingSubmit: boolean = false
  ids: number[] = []
  isFilter = false
  firstPage = 1
  sort: string|null = null
  order: string|null = null

  @nsStoreBox.State
  boxList!: Box.Model[]

  @nsStoreBox.State
  totalBoxRecords!: number

  @nsStoreWarehouse.State
  warehouseList!: any

  @nsStoreBox.Action
  actGetBoxList!: (params: any) => Promise<void>

  @nsStoreWarehouse.Action
  actWarehouseList!: () => Promise<void>

  @nsStoreBox.Action
  actDeleteBoxById!: (params: {ids: number[]}) => Promise<any>

  async mounted() {
    await this.actGetBoxList({ pageNumber: this.pageNumber, pageSize: this.pageSize })
    this.actWarehouseList()
  }

  @Watch('selectedWarehouse')
  @Watch('dateFrom')
  @Watch('dateTo')
  async filterChange() {
    this.firstPage = 1
    this.pageNumber = 1
    await this.actGetBoxList(this.getParamAPi())
  }

  getParamAPi(){
    return {
      pageNumber: this.pageNumber, pageSize: this.pageSize,
      'sellerName': this.textSearch === '' ? null : this.textSearch,
      'barCode': this.textCode === '' ? null : this.textCode,
      'warehouseId': this.selectedWarehouse?.id,
      'binName': this.textLocation === '' ? null : this.textLocation,
      'from': this.dateFrom ? this.formatDate(this.dateFrom): null,
      'to': this.dateTo ? this.formatDate(this.dateTo): null,
      'sort': this.sort === '' ? null : this.sort,
      'order': this.order
    }
  }

  formatDate(date: any) {
    const d = new Date(date);
      let month = '' + (d.getMonth() + 1);
      let day = '' + d.getDate();
      const year = d.getFullYear();
    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;
    return [year, month, day].join('-');
  }

  async onPage(event: any) {
    this.pageNumber = event.page + 1;
    await this.actGetBoxList(this.getParamAPi())
  }

  async handleDeleteStock() {
    const result = await this.actDeleteBoxById({ ids: this.ids })
    if(result) {
      // console.log("success");
    }
  }

  handleCancel() {
    this.isModalDelete = false
  }
  
  get itemBoxDelete(){
    return _.filter(this.selectedBoxes, function(box: Box.Model) { return box.status });
  }

  showModalDelete(id?: string) {
    this.ids = id? [id] : this.itemBoxDelete;
    this.isModalDelete = true
  }

  rowClass(data: Box.Model) {
    return !data.status && 'row-disable';
  }

  validateText =  _.debounce(async ()=>{
    await this.actGetBoxList(this.getParamAPi())
  }, 500);

  async sortData(e: any){
    const {sortField, sortOrder} = e;
    this.sort = sortField
    this.order = sortOrder === 1 ? 'asc' : 'desc'
    await this.actGetBoxList(this.getParamAPi())
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
