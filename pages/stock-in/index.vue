<template lang="pug">
  .receipt__header
    .grid.justify-content-between
      .col-fixed
        h1.text-heading Receipt note list
        span.text-subheading {{ total }} products found
      .col-fixed
        .grid
          .col-fixed
            .btn__filter(:class="{'active': isShowFilter}")
              .btn-toggle(@click="isShowFilter = !isShowFilter")
                .icon.icon-filter(v-if="!isShowFilter")
                .icon.icon-chevron-up.bg-primary(v-else)
                span Filter
              .btn-refresh(@click="refreshFilter")
                .icon.icon-rotate-left.bg-white
          .col-fixed
            .btn.btn-primary(@click='createStockIn')
                .icon.icon-add-items.surface-900.bg-white
                span.text-900.text-white.mr-3 Add recepit note
          .col-fixed
            .btn__filter(class='active')
              .btn.btn-toggle.bg-white
                .icon-download.icon--large.bg-primary
                span.text-900.text-primary Export file
    .grid.header__filter(:class='{ "active": isShowFilter }')
      .col-4
        .grid
          .col-3
            FilterTable(title="ID" :value="filter.id" placeholder="Enter ID" name="id" :searchText="true" @updateFilter="handleFilter")
          .col-9
            .grid.grid-nogutter
              .col
                  FilterCalendar(
                    title="From"
                    :value="filter.dateFrom"
                    name="dateFrom"
                    inputClass="border-0"
                    dateFormat="dd-mm-yy"
                    :showIcon="true"
                    @updateFilter="handleFilter")
              .col.ml-1
                  FilterCalendar(
                  title="From"
                  :value="filter.dateTo"
                  name="dateTo"
                  inputClass="border-0"
                  dateFormat="dd-mm-yy"
                  :showIcon="true"
                  @updateFilter="handleFilter")
      .col-2
        FilterTable(
          title="Warehouse"
          :value="filter.warehouse"
          :options="warehouseList"
          name="warehouse"
          @updateFilter="handleFilter")
      .col-2
        FilterTable(
          title="Seller"
          placeholder="Enter seller"
          name="sellerEmail"
          :value="filter.sellerEmail"
          :searchText="true"
          @updateFilter="handleFilter")
      .col-2
        FilterTable(
          title="Creator ID"
          placeholder="Enter ID"
          name="creatorId"
          :value="filter.creatorId"
          :searchText="true"
          @updateFilter="handleFilter")
      .col-2
        FilterTable(title="Status" :value="filter.status" :options="statusRequest" name="status" @updateFilter="handleFilter")
    .grid.grid-nogutter.flex-1.relative.overflow-hidden
      .col.h-full.absolute.top-0.left-0.right-0.bg-white
        DataTable.w-full.table__sort-icon.h-full.flex.flex-column(
          v-if="stockIn" :value="stockIn"
          responsiveLayout="scroll"
          :selection="selectedStockIn"
        removableSort dataKey="id"
        :resizableColumns="true" :rows="20"
        :scrollable="false"
        @sort="sortData($event)"
        @row-select="rowSelect"
        @row-dblclick="onRowClick($event)"
        :class="{ 'table-wrapper-empty': !stockIn || stockIn.length <= 0 }"
        @row-select-all="rowSelectAll"
        @row-unselect-all="rowUnSelectAll" @row-unselect='rowUnselect' )
          Column(selectionMode='multiple')
          Column(field='no' header='NO' )
            template(#body='{ index }')
              span.grid-cell-center.stock__table-no.text-white-active.text-900.font-bold {{ getIndexPaginate(index) }}
          Column(field='id' header='ID' :sortable="true" sortField="_id" )
            template(#body='{ data }')
              span.text-white-active.text-900.font-bold {{ data.id }}
          Column(header='Create Time' field='data.createdA' :sortable="true" sortField="_data.createdA")
            template(#body='{ data }') {{ data.createdAt | dateTimeHour12 }}
          Column(header='SELLER NAME' field='sellerName' :sortable="true" sortField="_sellerName")
            template(#body='{ data }') {{ data.sellerName }}
          Column(header='SELLER EMAIL' field='sellerEmail' :sortable="true" sortField="_sellerEmail")
            template(#body='{ data }') {{ data.sellerEmail }}
          Column(field="warehouseName" header="WAREHOUSE" :sortable="true" sortField="_warehouseName" :styles="{'width': '1%'}")
            template(#body="{data}")
              .flex.align-items-center.cursor-pointer.justify-content-end
                span.text-primary.font-bold.text-white-active {{ data.warehouseName }}
                .icon.icon-arrow-up-right.bg-primary.bg-white-active
          Column(header='CREATOR ID' field='data.creatorId' :sortable="true" sortField="_data.creatorId")
            template(#body='{ data }') {{ data.creatorId }}
          Column(header='CREATOR NAME' field='data.creatorName' :sortable="true" sortField="_data.creatorName")
            template(#body='{ data }') {{ data.creatorName }}
          Column(header='STATUS' field=' data.status' :sortable="true" sortField="_data.status")
            template(#body='{ data }')
              span.border-round.py-2.px-3.uppercase.font-bold.font-sm(
                :class=" data.status === 'REQUEST_STATUS_SAVED' ? 'text-green-400 bg-green-100 ' : 'text-primary bg-blue-100' ")
                | {{ data.status | requestStatus }}
          template(#empty)
            div.table__empty
              img(:srcset="`${require('~/assets/images/table-empty.png')} 2x`" v-if="!isFilter")
              img(:srcset="`${require('~/assets/images/table-notfound.png')} 2x`" v-else)
              p.empty__text(v-if="!isFilter") List is empty!, Click
                span &nbsp;here
                span &nbsp;to add item.
              p.notfound__text(v-else) Item not found!
          template(#footer)
            .pagination
              div.pagination__info(v-if="itemsBoxDelete.length <= 0 ")
                img(:src="require('~/assets/icons/filter-left.svg')")
                span(v-if="stockIn.length > 0").pagination__total
                | {{ (pageNumber - 1) * pageSize + 1 }} - {{ (pageNumber - 1) * pageSize + stockIn.length }} of {{ total }}
              div.pagination__delete(v-else @click="showModalDelete()")
                img(:src="require('~/assets/icons/trash-white.svg')")
                span Delete {{ itemsBoxDelete.length }} items selected
              Paginator(
                :first.sync="firstPage"
                :rows="pageSize" :totalRecords="total"
                @page="onPage($event)"
                :rowsPerPageOptions="[10,20,30]")
      ConfirmDialogCustom(
        title="Confirm delete"
        :message="`Are you sure you want to delete in this list stock?`"
        image="confirm-delete"
        :isShow="isModalDelete"
        :onOk="handleDeleteStockIn"
        :onCancel="handleCancel"
        :loading="loadingSubmit"
      )
    Toast

</template>

<script lang="ts">
import { Component, Vue, namespace } from 'nuxt-property-decorator'
import ConfirmDialogCustom from '~/components/dialog/ConfirmDialog.vue'
import { Request } from '~/models/RequestList'
import { REQUEST_STATUS, refreshAllFilter, calculateIndex, PAGINATE_DEFAULT } from '~/utils'
const nsWarehouseStock = namespace('warehouse/warehouse-list')
const nsStoreStockIn = namespace('stock-in/request-list')
const dayjs = require('dayjs')

@Component({
  components: {
    ConfirmDialogCustom
  }
})
class StockIn extends Vue {
  selectedStockIn: any = []
  isShowFilter: boolean = false
  selectedWarehouse: any = null
  statusRequest = REQUEST_STATUS
  isModalDelete: boolean = false
  loadingSubmit: boolean = false
  pageNumber: number = 1
  pageSize: number = 20
  firstPage: number = 1
  ids: string[] = []
  sortByColumn: string = ''
  isDescending: boolean | null = null
  paginate = PAGINATE_DEFAULT
  filter: any = {
    id: null,
    dateFrom: null,
    dateTo: null,
    warehouse: null,
    sellerEmail: null,
    creatorId: null,
    status: null
  }

  @nsStoreStockIn.State
  stockIn!: Request.Model[]

  @nsStoreStockIn.State
  total!: number

  @nsWarehouseStock.State
  warehouseList!: any

  @nsStoreStockIn.Action
  actGetStockIn!: (params: any) => Promise<void>

  @nsStoreStockIn.Action
  actDeleteStockInByIds!: (params: {ids: string[]}) => Promise<any>

  @nsWarehouseStock.Action
  actWarehouseList!: () => Promise<void>

  getParamApi() {
    return {
      pageNumber: this.pageNumber - 1, pageSize: this.pageSize,
      'id': this.filter.id || null,
      'sellerEmail': this.filter.sellerEmail || null,
      'creatorId': this.filter.creatorId || null ,
      'from': this.filter.dateFrom ? dayjs(new Date(this.filter.dateFrom)).format('YYYY-MM-DD') : null,
      'to': this.filter.dateTo ? dayjs(new Date(this.filter.dateTo)).format('YYYY-MM-DD') : null,
      'sortBy': this.sortByColumn || null,
      'desc': this.isDescending,
      'status': this.filter.status?.value,
      'warehouseId': this.filter.warehouse?.id
    }
  }

  rowSelectAll({ data }) {
    this.selectedStockIn = _.union(this.selectedStockIn, data)
  }

  rowUnSelectAll() {
    this.selectedStockIn = _.differenceWith(this.selectedStockIn,this.stockIn,_.isEqual)
  }

  async onPage(event: any) {
    this.pageSize = event.rows
    this.pageNumber = event.page + 1
    await this.actGetStockIn(this.getParamApi())
  }

  rowSelect({ data }) {
    this.selectedStockIn.push( data )
  }

  rowUnselect({ data }) {
    this.selectedStockIn = _.filter(
      this.selectedStockIn,
      (stockIn: Request.Model) => stockIn.id !== data.id
    )
  }

  onRowClick({ data }) {
    this.$router.push(`/stock-in/${data.id}`)
  }

  async handleDeleteStockIn() {
    let result : any = []
    result  = await this.actDeleteStockInByIds({ ids: this.ids })
    if(result == null) {
      this.isModalDelete = false
      this.selectedStockIn = []
      this.$toast.add({
        severity: 'success',
        summary: 'Success Message',
        detail: 'Successfully deleted box',
        life: 3000
      })
      this.firstPage = 1
      this.pageNumber = 1
      await this.actGetStockIn({ pageNumber: this.pageNumber - 1 , pageSize: this.pageSize })
    }
  }

  async mounted() {
    await this.actGetStockIn({
      pageNumber: this.pageNumber - 1,pageSize: this.pageSize
    })
    this.actWarehouseList()
  }

  async refreshFilter() {
    refreshAllFilter(this.filter)
    await this.actGetStockIn(this.getParamApi())
  }

  async handleFilter(e: any, name: string) {
    this.filter[name] = e
    await this.actGetStockIn(this.getParamApi())
    this.selectedStockIn = []
  }

  debounceSearch = _.debounce(async () => {
    await this.actGetStockIn(this.getParamApi())
  }, 500)

  getIndexPaginate(index: number) {
    return calculateIndex(
      index,
      this.paginate.pageNumber,
      this.paginate.pageSize
    )
  }

  showModalDelete(id?: string) {
    this.ids = id? [id] : this.itemsBoxDelete
    this.isModalDelete = true
  }

  handleCancel() {
    this.isModalDelete = false
  }

  get itemsBoxDelete() {
    const itemsDelete: string[] = []
    _.forEach(this.selectedStockIn, function (box: any) {
      if (box.status === 'REQUEST_STATUS_DRAFT') itemsDelete.push(box.id)
    })
    return itemsDelete
  }

  get isFilter(){
    const params = _.omit(this.getParamApi(), ['pageNumber', 'pageSize'])
    return Object.values(params).some((item) => item)
  }

  async sortData(e: any) {
    const { sortField, sortOrder } = e
    if(sortOrder){
      this.isDescending = sortOrder !== 1
      this.sortByColumn = sortField.replace('_', '')
    }else{
      this.isDescending = null
      this.sortByColumn = ''
    }
    await this.actGetStockIn(this.getParamApi())
  }

  createStockIn() {
    this.$router.push('stock-in/create-receipt')
  }

}

export default StockIn
</script>

<style lang="sass" scoped>
.receipt__header
  @include flex-column
  height: calc(100vh - 32px)
  margin-bottom: 24px
  ::v-deep.p-component
    font-family: $font-family-primary
  ::v-deep.pi-calendar:before
    content: url('~/assets/icons/calendar.svg')
  ::v-deep.p-calendar-w-btn
    .p-button
      background: none
      border: none

</style>