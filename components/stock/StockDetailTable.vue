<template lang="pug">
  .flex.flex-column.h-full
    .grid.justify-content-between
      .col-fixed
        h1.font-bold.m-0.font-size-4xlarge.line-height-1 Stock detail
        span.text-600.font-sm(v-if="itemsList.data") {{itemsList.data.total}} results found
      .col-fixed
        .grid
          .col-fixed.flex.btn-filter
            div.cursor-pointer.bg-white.btn-filter-toggle.flex.align-items-center.h-full.flex-1(@click="isShowFilter = !isShowFilter")
              .icon.bg-primary(:class="isShowFilter ? 'icon-chevron-up' : 'icon-filter'")
              span.text-900.ml-3.text-primary Filter
            div.cursor-pointer.refresh-filter(@click="handleRefreshFilter")
              img(:src="require(`~/assets/icons/rotate-left.svg`)")
    .grid(v-show="isShowFilter")
      .col
        .bg-white.border-round
          div.pt-2.pl-3.pb-1
            span.text-600.font-sm Seller
          span.p-input-icon-right.w-full
            .icon.icon--right.icon-search.surface-900.icon--absolute
            InputText.border-0.w-full.mb-1(type="text" placeholder="Enter seller" v-model='filter.sellerEmail')
      .col
        .bg-white.border-round
          div.pt-2.pl-3.pb-1
            span.text-600.font-sm SKU
          span.p-input-icon-right.w-full
            .icon.icon--right.icon-search.surface-900.icon--absolute
            InputText.border-0.w-full.mb-1(type="text" placeholder="Enter SKU" v-model='filter.sku')
      .col
        .bg-white.border-round
          div.pt-2.pl-3.pb-1
            span.text-600.font-sm Box Code
          span.p-input-icon-right.w-full
            .icon.icon--right.icon-search.surface-900.icon--absolute
            InputText.border-0.w-full.mb-1(type="text" placeholder="Enter box code" v-model='filter.boxCode')
      .col
        .bg-white.border-round
          div.pt-2.pl-3.pb-1
            span.text-600.font-sm Warehouse
          Dropdown.w-full.border-0.mb-1(v-model="filter.warehouse" :options="warehouseList" optionLabel="name" placeholder="Select")
      .col
        .bg-white.border-round
          div.pt-2.pl-3.pb-1
            span.text-600.font-sm Location
          span.p-input-icon-right.w-full
            .icon.icon--right.icon-search.surface-900.icon--absolute
            InputText.border-0.w-full.mb-1(type="text" placeholder="Enter location" v-model='filter.location')
      .col
        .bg-white.border-round
          div.pt-2.pl-3.pb-1
            span.text-600.font-sm Status
          Dropdown.w-full.border-0.mb-1(v-model="filter.status" :options="statusList" optionLabel="name" placeholder="Select")
    .grid.grid-nogutter.flex-1.relative.overflow-hidden
      .col.h-full.absolute.top-0.left-0.right-0
        DataTable.bg-white.table__sort-icon.w-full.h-full.flex.flex-column(v-if="itemsList.data" :value="itemsList.data.items" responsiveLayout="scroll" :selection.sync="selectedStock"
          dataKey="id" :resizableColumns="true" :rowClass="rowClass" :rows="20" :scrollable="false" @row-dblclick='redirectToDetail'
          :class="{ 'table__empty': !itemsList.data.items || itemsList.data.items.length <= 0 }" @sort="sortData($event)")
          Column(selectionMode="multiple" :styles="{'width': '1%'}" :exportable="false")
          Column(field="no" header="NO" :styles="{'width': '1%'}")
            template(#body="{ index }")
              span.font-semibold {{ (index + 1) + paginate.pageNumber * paginate.pageSize  }}
          Column(field="box.request.seller.email" header="SELLER EMAIL" sortable className="w-3")
          Column(field="stock.sku" header="SKU" sortable className="p-text-right")
          Column(field="amount" header="INVENTORY QUANTITY" sortable className="p-text-right" bodyClass="font-semibold" :styles="{'width': '5%'}")
          Column(field="box.barCode" header="BOX CODE" sortable className="p-text-right" bodyClass="font-semibold" :styles="{'width': '5%'}")
          Column(field="box.request.warehouse.name" sortable header="WAREHOUSE" className="p-text-right" :styles="{'width': '5%'}")
            template(#body="{data}")
              .flex.align-items-center.cursor-pointer.justify-content-end
                span.text-primary.font-bold.font-sm {{data.box.request.warehouse.name}}
                .icon--small.icon-arrow-up-right.bg-primary
          //- Column(field="location.name" header="LOCATION" sortable className="p-text-right")
          //-   template(#body="{data}")
          //-     .flex.align-items-center.cursor-pointer.justify-content-end
          //-       span.text-primary.font-bold.font-sm {{data.location.name}}
          //-       .icon--small.icon-arrow-up-right.bg-primary
          Column(field="box.deleted" header="STATUS" sortable className="p-text-right" :styles="{'width': '5%'}")
            template(#body="{data}")
              div
                Tag(v-show="data.itemStatus === 'ITEM_STATUS_DISABLE'").px-2.surface-200
                  span.font-bold.text-400.font-sm DISABLE
                Tag(v-show="data.itemStatus === 'ITEM_STATUS_DRAFT'").px-2.bg-blue-500
                  span.font-bold.text-400.font-sm DRAFT
                Tag(v-show="data.itemStatus === 'ITEM_STATUS_AVAILABLE'").px-2.bg-green-100
                  span.font-bold.text-green-400.font-sm AVAILABLE
          Column(:exportable="false" header="ACTION" className="p-text-right")
            template(#body="{data}")
              Button.border-0.p-0.h-2rem.w-2rem.justify-content-center.surface-200(:disabled="!data.box.status" @click='editItemDetail(data.id)')
                .icon--small.icon-btn-edit
              Button.border-0.p-0.ml-1.h-2rem.w-2rem.justify-content-center.surface-200(@click="showModalDelete(data.id)" :disabled="data.box.deleted")
                .icon--small.icon-btn-delete
          template(#footer)
            .pagination
              div.pagination__info(v-if='!selectedStockFilter.length > 0')
                img(:src="require('~/assets/icons/filter-left.svg')")
                span.pagination__total {{ getInfoPaginate }}
              div.pagination__delete(v-else @click="showModalDelete()")
                img(:src="require('~/assets/icons/trash-white.svg')")
                span Delete {{ selectedStockFilter.length }} items selected
              Paginator(:first.sync="firstPage" :rows="paginate.pageSize" :totalRecords="itemsList.data.total" @page="onPage($event)")
          template(#empty)
            div.flex.align-items-center.justify-content-center.flex-column
              img(:srcset="`${require('~/assets/images/table-empty.png')} 2x`" v-if="!checkIsFilter")
              img(:srcset="`${require('~/assets/images/table-notfound.png')} 2x`" v-else)
              p.text-900.font-bold.mt-3(v-if="!checkIsFilter") List is empty!, Click
                span.text-primary.underline  &nbsp;here&nbsp;
                span to add item.
              p.text-900.font-bold.mt-3(v-else) Item not found!
    ConfirmDialogCustom(
      title="Confirm delete"
      :message="`Are you sure you want to delete ${ids.length} in this list stock?`"
      image="confirm-delete"
      :isShow="isModalDelete"
      :onOk="handleDeleteItems"
      :onCancel="handleCancel"
      :loading="loadingSubmit"
    )
</template>
<script lang="ts">
import { Component, namespace, Prop, Vue,Watch } from 'nuxt-property-decorator'
import ConfirmDialogCustom from '~/components/dialog/ConfirmDialog.vue'
import { Stock as StockModel } from '~/models/Stock'
const nsStoreStockTable = namespace('stock/stock-detail')
const nsStoreWarehouse = namespace('warehouse/warehouse-list')

@Component({
  components: {ConfirmDialogCustom}
})
class StockDetailTable extends Vue {

  @Prop() sku!: string
  isShowFilter: boolean = false
  selectedWarehouse = []
  selectedStatus = null
  selectedStock :StockModel.ModelDetail[] = []
  deleteStockList = []
  isModalDelete: boolean = false
  ids: string[] = []
  loadingSubmit: boolean = false
  firstPage:any = 0

  filter: any = {
    sellerName: null,
    sellerEmail: null,
    boxCode: null,
    sku: null,
    warehouse: null,
    location: null,
    status: false
  }

  statusList: any = [
    { name: 'Disable', value: true },
    { name: 'Available', value: false }
  ]

  paginate: any = {
    pageNumber: 0,
    pageSize: 10
  }

  sort: any = {
    sortByColumn: null,
    sortDescending: null
  }

  @nsStoreStockTable.State
  total!: number

  @nsStoreStockTable.State
  itemsList!: StockModel.BoxModel

  @nsStoreWarehouse.State
  warehouseList!: any

  @nsStoreStockTable.Action
  actGetItemsList!: (params:any) => Promise<void>

  @nsStoreWarehouse.Action
  actWarehouseList!: () => Promise<void>

  @nsStoreStockTable.Action
  actDeleteItemsById!: (ids: string[]) => Promise<void>

  get getInfoPaginate() {
    const { pageNumber, pageSize } = this.paginate
    const start = (pageNumber + 1) * pageSize - (pageSize - 1)
    const convertStart = ('0' + start).slice(-2)
    const end = Math.min(start + pageSize - 1, this.itemsList.data.total)
    return `Showing ${convertStart} - ${end} of ${this.itemsList.data.total}`
  }

  get selectedStockFilter() {
    return this.selectedStock.filter((item: any) => !item.box.deleted)
  }

  onPage(event: any) {
    this.paginate.pageNumber = event.page
    this.getItemsList()
  }

  get checkIsFilter() {
    return Object.values(this.filter).some((item) => item)
  }

  showModalDelete(id?: string) {
    if (id) {
      this.ids = [id]
    } else {
      this.ids = this.selectedStockFilter.map((item: any) => {
        return item.id
      })
    }
    this.isModalDelete = true
  }

  sortData(e: any){
    const {sortField, sortOrder} = e
    if(sortOrder){
      this.sort.sortDescending = sortOrder !== 1
      this.sort.sortByColumn = sortField.replace('_', '')
    }
    this.getItemsList()
  }

  rowClass(data: any) {
    return data.box.deleted ? 'row-disable' : ''
  }

  handleCancel() {
    this.isModalDelete = false
  }

  async handleDeleteItems() {
    this.loadingSubmit = true
    await this.actDeleteItemsById(this.ids)
    this.loadingSubmit = false
    this.isModalDelete = false
    this.$toast.add({
      severity: 'success',
      summary: 'Success Message',
      detail: 'Successfully deleted stock',
      life: 3000
    })
    this.paginate.pageNumber = 0
    this.firstPage = 0
    this.getItemsList()
    this.selectedStock = []
  }

  async getItemsList() {
    const filter = {
      sellerEmail: this.filter?.sellerEmail,
      sku: this.filter?.sku,
      barCode: this.filter?.boxCode,
      location: this.filter?.location,
      warehouseId: this.filter?.warehouse?.id,
      deleted: this.filter.status?.value,
      pageNumber:this.paginate.pageNumber,
      pageSize: this.paginate.pageSize,
      sortByColumn: this.sort?.sortByColumn,
      isDescending: this.sort.sortDescending && this.sort?.sortDescending
    }
    const params = {
      filter,
      ...this.paginate,
      id: this.$route.params.sid
    }
    await this.actGetItemsList(params)
  }

  @Watch('filter', { deep: true })
  getFilterList() {
    this.getItemsList()
  }

  handleRefreshFilter () {
    this.filter = {
      name: null,
      warehouse: null,
      categories: null,
      barCode: null,
      status: null
    }
  }

  redirectToDetail({ data }) {
    this.$router.push(`${this.$route.params.sid}/item/${data.box.id}`)
  }

  editItemDetail(id:any) {
    this.$router.push({ path: `${this.$route.params.sid}/item/${id}`, query: {plan: 'edit'}})
  }

  mounted() {
    this.getItemsList()
    this.actWarehouseList()
  }
}
export default StockDetailTable
</script>
<style lang="sass" scoped>
  .btn-filter
    height: 58px
    width: 166px
    .refresh-filter
      background-color: $primary
      display: flex
      align-items: center
      width: 50px
      justify-content: center
      border-top-right-radius: 4px
      border-bottom-right-radius: 4px
    .btn-filter-toggle
      // gap: 18px
      border-top-left-radius: 4px
      border-bottom-left-radius: 4px
      display: flex
      justify-content: center

  .stock__mutidelete
    background-color: #FF7171
  ::v-deep.p-inputtext,
  ::v-deep.p-dropdown,
  ::v-deep.p-button
    box-shadow: none !important
</style>
