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
          Button.border-0.bg-white.w-8rem.h-3rem.border-primary(@click="isShowFilter = !isShowFilter")
            .icon.bg-primary(:class="isShowFilter ? 'icon-chevron-up' : 'icon-filter'")
            span.text-900.ml-3.text-primary Filter
        .col-fixed
          Button.w-9rem.h-3rem.bg-primary
            .icon.icon-add-items.surface-900.bg-white
            span.text-900.ml-3.text-white Add box
  .grid(v-if="isShowFilter")
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
    .col.h-full.absolute.top-0.left-0.right-0.bg-white
      DataTable.w-full.table__sort-icon.h-full.flex.flex-column(v-if="boxList" :value="boxList" responsiveLayout="scroll" :selection.sync="selectedBoxes" 
      removableSort dataKey="id" :resizableColumns="true" :rows="20" :scrollable="false" :rowClass="rowClass" @sort="sortData($event)"
      @row-click="onRowClick($event)" :class="{ 'table__empty': !boxList || boxList.length <= 0 }")
        Column(selectionMode="multiple" :styles="{width: '3rem'}" :exportable="false")
        Column(field="no" header="NO")
          template(#body="slotProps")
            span.font-semibold {{(pageNumber - 1) * pageSize + slotProps.index +1}}
        Column(field="barCode" header="CODE" :sortable="true" bodyClass="font-semibold" sortField="_barCode")
        Column(field="request.seller.email" header="SELLER EMAIL" :sortable="true" className="w-3" sortField="_sellerEmail")
        Column(field="createdAt" header="CREATE TIME" :sortable="true" className="text-right datatable__head-right" sortField="_createTime")
          template(#body="{data}") {{formatDate(data.createdAt)}}
        Column(field="attributes" header="SIZE(CM)" className="text-right datatable__head-right" bodyClass="font-semibold")
          template(#body="{data}") {{data.length}}*{{data.width}}*{{data.height}}
        Column(field="weight" header="WEIGHT(KG)" className="text-right datatable__head-right" bodyClass="font-semibold")
          template(#body="{data}") {{data.weight}}
        Column(field="warehouse" header="WAREHOUSE" :sortable="true" className="text-right datatable__head-right" sortField="_warehouse")
          template(#body="{data}")
            .flex.align-items-center.cursor-pointer.justify-content-end
              span.text-primary.font-bold.font-sm.text-white-active {{data.request.warehouse.name}}
              .icon.icon-arrow-up-right.bg-primary.bg-white-active
        Column(field="shelfBin.name" header="LOCATION" :sortable="true" className="text-right datatable__head-right" sortField="_location")
          template(#body="{data}")
            .flex.align-items-center.cursor-pointer.justify-content-end
              span.text-primary.font-bold.font-sm.text-white-active {{data.shelfBin.name}}
              .icon.icon-arrow-up-right.bg-primary.bg-white-active
        Column(field="status" header="STATUS" :sortable="true" className="p-text-right datatable__head-right" sortField="_status")
          template(#body="{data}")
            .flex.justify-content-end
              Tag(:class="data.status === 'AVAILABLE' ? 'bg-green-100' : data.status === 'DRAFT' ? 'bg-blue-100' : 'surface-200'").px-2
                span(:class="data.status === 'AVAILABLE' ? 'text-green-400' : data.status === 'DRAFT' ? 'text-primary' : 'text-400'").font-bold.font-sm {{data.status}}
        Column(:exportable="false" header="ACTION" className="text-right datatable__head-right")
          template(#body="{data}")
            Button.border-0.p-0.h-2rem.w-2rem.justify-content-center.surface-200(:disabled="data.status === 'DISABLE'")
              .icon.icon-btn-edit
            Button.border-0.p-0.ml-1.h-2rem.w-2rem.justify-content-center.surface-200(@click="showModalDelete(data.id)" :disabled="data.status === 'DISABLE'")
              .icon.icon-btn-delete
        template(#footer)
          .pagination
            div.pagination__info(v-if="itemsBoxDelete.length <= 0")
              img(:src="require('~/assets/icons/filter-left.svg')")
              span.pagination__total {{(pageNumber - 1) * pageSize + 1}} - {{(pageNumber - 1) * pageSize + boxList.length}} of {{totalBoxRecords}}
            div.pagination__delete(v-else @click="showModalDelete()")
              img(:src="require('~/assets/icons/trash-white.svg')")
              span Delete {{itemsBoxDelete.length}} items selected
            Paginator(v-model:first="firstPage" :rows="pageSize" :totalRecords="totalBoxRecords" @page="onPage($event)")
        template(#empty)
          div.flex.align-items-center.justify-content-center.flex-column
            img(:srcset="`${require('~/assets/images/table-empty.png')} 2x`" v-if="!isFilter")
            img(:srcset="`${require('~/assets/images/table-notfound.png')} 2x`" v-else)
            p.text-900.font-bold.mt-3(v-if="!isFilter") List is empty!, Click
              span.text-primary.underline.cursor-pointer &nbsp;here
              span &nbsp;to add item.
            p.text-900.font-bold.mt-3(v-else) Item not found!

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
import moment from 'moment'
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
  selectedWarehouse : any = null;
  textLocation: any = null;
  textSearch: any = null;
  textCode: any = null;
  dateFrom: any = null;
  dateTo: any = null;
  pageNumber: number = 1;
  pageSize: number = 20;
  isModalDelete: boolean = false;
  loadingSubmit: boolean = false;
  ids: string[] = [];
  isShowFilter = false;
  firstPage = 1;
  sortByColumn: string|null = null;
  isDescending: boolean|null = null;

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
  actDeleteBoxById!: (params: {ids: string[]}) => Promise<any>

  async mounted() {
    await this.actGetBoxList({ pageNumber: this.pageNumber - 1 , pageSize: this.pageSize });
    this.actWarehouseList();
  }

  @Watch('selectedWarehouse')
  @Watch('dateFrom')
  @Watch('dateTo')
  async filterChange() {
    this.firstPage = 1;
    this.pageNumber = 1;
    await this.actGetBoxList(this.getParamAPi());
  }

  getParamAPi(){
    return {
      pageNumber: this.pageNumber - 1, pageSize: this.pageSize,
      'sellerEmail': this.textSearch === '' ? null : this.textSearch,
      'barCode': this.textCode === '' ? null : this.textCode,
      'warehouseId': this.selectedWarehouse?.id,
      'binName': this.textLocation === '' ? null : this.textLocation,
      'from': this.dateFrom ? moment(this.dateFrom).format('yyyy-MM-DD'): null,
      'to': this.dateTo ? moment(this.dateTo).format('yyyy-MM-DD'): null,
      'sortByColumn': this.sortByColumn === '' ? null : this.sortByColumn,
      'isDescending': this.isDescending
    }
  }

  get isFilter(){
    const params = _.omit(this.getParamAPi(), ['pageNumber', 'pageSize']);
    return Object.values(params).some((item) => item);
  }

  formatDateParams(date: any) {
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
    await this.actGetBoxList(this.getParamAPi());
  }

  async handleDeleteStock() {
    const result = await this.actDeleteBoxById({ ids: this.ids })
    if(result) {
      this.isModalDelete = false;
      this.firstPage = 1;
      this.pageNumber = 1;
      await this.actGetBoxList({ pageNumber: this.pageNumber - 1 , pageSize: this.pageSize });
    }
  }

  handleCancel() {
    this.isModalDelete = false;
  }
  
  get itemsBoxDelete(){
    const itemsDelete: string[] = [];
    _.forEach(this.selectedBoxes, function(box: any) {
      if(box.status !== 'DISABLE')
        itemsDelete.push(box.id);
    });
    return itemsDelete;
  }

  showModalDelete(id?: string) {
    this.ids = id? [id] : this.itemsBoxDelete;
    this.isModalDelete = true
  }

  rowClass(data: any) {
    return data.status === 'DISABLE' && 'row-disable';
  }

  validateText =  _.debounce(async ()=>{
    await this.actGetBoxList(this.getParamAPi())
  }, 500);

  async sortData(e: any){
    const {sortField, sortOrder} = e;
    if(sortOrder){
      this.isDescending = sortOrder !== 1
      this.sortByColumn = sortField.replace('_', '');
    }
    await this.actGetBoxList(this.getParamAPi())
  }

  onRowClick({data}){
    this.$router.push(`/box/${data.id}`);
  }

  get formatDate() {
    return (myparameter: any) => {
      return moment(myparameter).format('DD-MM-yyyy hh:mm A')
    };
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
