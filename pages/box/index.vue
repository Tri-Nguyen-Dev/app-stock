<template lang="pug">
.box-page-container.flex.flex-column
  .grid.justify-content-between
    .col-fixed
      h1.text-heading Box list
      span.text-subheading(v-if="boxList") {{ totalBoxRecords }} products found
    .col-fixed
      .grid
        .col-fixed
          .header__search
            .icon.icon--left.icon-search
            InputText(type="text" placeholder="Search" v-model="filter.sellerEmail" v-on:input="validateText")
        .col-fixed
          .btn__filter
            .btn-toggle(@click="isShowFilter = !isShowFilter")
              .icon(:class="isShowFilter ? 'icon-chevron-up' : 'icon-filter'")
              span Filter
            .btn-refresh(@click="handleRefeshFilter")
              .icon.icon-rotate-left.bg-white
        .col-fixed
          .btn.btn-primary
            .icon.icon-add-items
            span Add box
  .grid(v-if="isShowFilter")
    .col-8
      .grid
        .col
          FilterTable(title="Warehouse" :value="filter.warehouse" :options="warehouseList" name="warehouse" @updateFilter="handleFilterBox")
        .col
          FilterTable(title="Location" :value="filter.location" placeholder="Enter location"  name="location" :searchText="true" @updateFilter="handleFilterBox")
        .col
          FilterTable(title="Code" :value="filter.barCode" placeholder="Enter code" name="barCode" :searchText="true" @updateFilter="handleFilterBox")
    .col-4
      .grid.grid-nogutter
        .col
          FilterCalendar(title="From" :value="filter.dateFrom" name="dateFrom"  inputClass="border-0" dateFormat="dd-mm-yy" :showIcon="true" @updateFilter="handleFilterBox")
        .col.ml-1
          FilterCalendar(title="From" :value="filter.dateTo" name="dateTo"  inputClass="border-0" dateFormat="dd-mm-yy" :showIcon="true" @updateFilter="handleFilterBox")
  .grid.grid-nogutter.flex-1.relative.overflow-hidden
    .col.h-full.absolute.top-0.left-0.right-0.bg-white
      DataTable.w-full.table__sort-icon.h-full.flex.flex-column(v-if="boxList" :value="boxList" responsiveLayout="scroll" :selection="selectedBoxes"
      removableSort dataKey="id" :resizableColumns="true" :rows="20" :scrollable="false" :rowClass="rowClass" @sort="sortData($event)"
      @row-dblclick="onRowClick($event)" :class="{ 'table-wrapper-empty': !boxList || boxList.length <= 0 }" @row-select-all="rowSelectAll"
      @row-unselect-all="rowUnSelectAll" @row-select="rowSelect" @row-unselect="rowUnselect")
        Column(selectionMode="multiple" :styles="{width: '3rem'}" :exportable="false")
        Column(field="no" header="NO")
          template(#body="slotProps")
            span.font-semibold {{ (pageNumber - 1) * pageSize + slotProps.index +1 }}
        Column(field="barCode" header="CODE" :sortable="true" bodyClass="font-semibold" sortField="_barCode")
        Column(field="request.seller.email" header="SELLER EMAIL" :sortable="true" className="w-3" sortField="_request.seller.email")
        Column(field="createdAt" header="CREATE TIME" :sortable="true" className="text-right" sortField="_createdAt")
          template(#body="{data}") {{ data.createdAt | dateTimeHour12 }}
        Column(field="attributes" header="SIZE(CM)" className="text-right" bodyClass="font-semibold")
          template(#body="{data}") {{ data.length }} * {{ data.width }} * {{ data.height }}
        Column(field="weight" header="WEIGHT(KG)" className="text-right" bodyClass="font-semibold")
          template(#body="{data}") {{ data.weight }}
        Column(field="warehouse" header="WAREHOUSE" :sortable="true" className="text-right" sortField="_request.warehouse.name")
          template(#body="{data}")
            .flex.align-items-center.cursor-pointer.justify-content-end
              span.text-primary.font-bold.font-sm.text-white-active 
              .icon.icon-arrow-up-right.bg-primary.bg-white-active
        Column(field="rackLocation.name" header="LOCATION" :sortable="true" className="text-right" sortField="_rackLocation.name")
          template(#body="{data}")
            .flex.align-items-center.cursor-pointer.justify-content-end
              span.text-primary.font-bold.font-sm.text-white-active 
              .icon.icon-arrow-up-right.bg-primary.bg-white-active
        Column(field="status" header="STATUS" :sortable="true" className="text-right" sortField="_status")
          template(#body="{data}")
            .flex.justify-content-end
              Tag(:class="data.status === 'BOX_STATUS_AVAILABLE' ? 'bg-green-100' : data.status === 'BOX_STATUS_DRAFT' ? 'bg-blue-100' : 'surface-200'").px-2
                span(:class="data.status === 'BOX_STATUS_AVAILABLE' ? 'text-green-400' : data.status === 'BOX_STATUS_DRAFT' ? 'text-primary' : 'text-400'").font-bold.font-sm {{ data.status | boxStatus }}
        Column(:exportable="false" header="ACTION" className="text-right")
          template(#body="{data}")
            .table__action(:class="{'action-disabled': data.status === 'BOX_STATUS_DISABLE'}")
              span(@click="handleEditBox(data.id)")
                .icon.icon-edit-btn
              span(:class="{'disable-button': itemsBoxDelete.length > 0}" @click="showModalDelete(data.id)")
                .icon.icon-btn-delete
        template(#footer)
          .pagination
            div.pagination__info(v-if="itemsBoxDelete.length <= 0")
              img(:src="require('~/assets/icons/filter-left.svg')")
              span(v-if="boxList.length > 0").pagination__total {{ (pageNumber - 1) * pageSize + 1 }} - {{ (pageNumber - 1) * pageSize + boxList.length }} of {{ totalBoxRecords }}
            div.pagination__delete(v-else @click="showModalDelete()")
              img(:src="require('~/assets/icons/trash-white.svg')")
              span Delete {{ itemsBoxDelete.length }} items selected
            Paginator(:first.sync="firstPage" :rows="pageSize" :totalRecords="totalBoxRecords" @page="onPage($event)" :rowsPerPageOptions="[10,20,30]")
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
    Toast
</template>

<script lang="ts">
import { Component, namespace, Vue } from 'nuxt-property-decorator'
import { Box } from '~/models/Box'
import ConfirmDialogCustom from '~/components/dialog/ConfirmDialog.vue'
const nsStoreBox = namespace('box/box-list')
const nsStoreWarehouse = namespace('warehouse/warehouse-list')
const _ = require('lodash')
const dayjs = require('dayjs')

@Component({
  components: {
    ConfirmDialogCustom
  }
})
class BoxList extends Vue {
  selectedBoxes: Box.Model[] = []
  pageNumber: number = 1
  pageSize: number = 20
  isModalDelete: boolean = false
  loadingSubmit: boolean = false
  ids: string[] = []
  isShowFilter = false
  firstPage = 1
  sortByColumn: string = ''
  isDescending: boolean|null = null
  filter: any = {
    sellerEmail:  '',
    warehouse: null,
    location: '',
    barCode: '',
    dateFrom: null,
    dateTo: null
  }

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
    await this.actGetBoxList({ pageNumber: this.pageNumber - 1 , pageSize: this.pageSize })
    this.actWarehouseList()
  }

  getParamAPi() {
    return {
      pageNumber: this.pageNumber - 1, pageSize: this.pageSize,
      'sellerEmail': this.filter.sellerEmail || null,
      'barCode': this.filter.barCode || null,
      'warehouseId': this.filter.warehouse?.id,
      'location': this.filter.location || null,
      'from': this.filter.dateFrom ? dayjs(new Date(this.filter.dateFrom)).format('YYYY-MM-DD') : null,
      'to': this.filter.dateTo ? dayjs(new Date(this.filter.dateTo)).format('YYYY-MM-DD') : null,
      'sortByColumn': this.sortByColumn || null,
      'isDescending': this.isDescending
    }
  }

  async handleFilterBox(e: any, name: string){
    this.filter[name] = e
    await this.actGetBoxList(this.getParamAPi())
    this.selectedBoxes = []
  }

  get isFilter(){
    const params = _.omit(this.getParamAPi(), ['pageNumber', 'pageSize'])
    return Object.values(params).some((item) => item)
  }

  async onPage(event: any) {
    this.pageSize = event.rows
    this.pageNumber = event.page + 1
    await this.actGetBoxList(this.getParamAPi())
  }

  async handleDeleteStock() {
    const result = await this.actDeleteBoxById({ ids: this.ids })
    if(result) {
      this.isModalDelete = false
      this.selectedBoxes = []
      this.$toast.add({
        severity: 'success',
        summary: 'Success Message',
        detail: 'Successfully deleted box',
        life: 3000
      })
      this.firstPage = 1
      this.pageNumber = 1
      await this.actGetBoxList({ pageNumber: this.pageNumber - 1 , pageSize: this.pageSize })
    }
  }

  handleCancel() {
    this.isModalDelete = false
  }

  get itemsBoxDelete() {
    const itemsDelete: string[] = []
    _.forEach(this.selectedBoxes, function(box: any) {
      if(box.status !== 'BOX_STATUS_DISABLE')
        itemsDelete.push(box.id)
    })
    return itemsDelete
  }

  showModalDelete(id?: string) {
    this.ids = id? [id] : this.itemsBoxDelete
    this.isModalDelete = true
  }

  rowClass(data: any) {
    return data.status === 'BOX_STATUS_DISABLE' && 'row-disable'
  }

  validateText =  _.debounce(this.handleFilter, 500);

  async sortData(e: any) {
    const {sortField, sortOrder} = e
    if(sortOrder){
      this.isDescending = sortOrder !== 1
      this.sortByColumn = sortField.replace('_', '')
    }else{
      this.isDescending = null
      this.sortByColumn = ''
    }
    await this.actGetBoxList(this.getParamAPi())
  }

  onRowClick({data}){
    this.$router.push(`/box/${data.id}`)
  }

  handleEditBox(id: any) {
    this.$router.push({ path: `/box/${id}`, query: { plan: 'edit' }})
  }

  async handleFilter() {
    await this.actGetBoxList(this.getParamAPi())
    this.selectedBoxes = []
  }

  async handleRefeshFilter() {
    this.filter.warehouse = null
    this.filter.location = ''
    this.filter.sellerEmail = ''
    this.filter.barCode = ''
    this.filter.dateFrom = null
    this.filter.dateTo = null
    await this.actGetBoxList(this.getParamAPi())
  }

  rowSelectAll({ data }) {
    this.selectedBoxes = _.union(this.selectedBoxes, data) 
  }

  rowUnSelectAll() {
    this.selectedBoxes = _.differenceWith(this.selectedBoxes, this.boxList, _.isEqual)
  }

  rowSelect({ data }) {
    this.selectedBoxes.push(data)
  }

  rowUnselect({ data }) {
    this.selectedBoxes = _.filter(this.selectedBoxes, (box: Box.Model) => box.id !== data.id)
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
  ::v-deep.text-right
    text-align: right !important
    .p-column-header-content
      justify-content: end !important
  ::v-deep.disable-button
    pointer-events: none
    background-color: $text-color-300
    .icon
      background-color: $text-color-500
</style>
