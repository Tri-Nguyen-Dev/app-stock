<template lang="pug">
  .flex.flex-column.h-full
    .grid.justify-content-between
      .col-fixed
        h1.font-bold.m-0.font-size-4xlarge.line-height-1 Stock detail
        span.text-600.font-sm(v-if="itemsList.data") {{itemsList.data.total}} results found
      .col-fixed
        .grid
          .col-fixed
            Button.border-0.bg-white.w-8rem.h-3rem.border-primary(@click="isShowFilter = !isShowFilter")
              .icon.bg-primary(:class="isShowFilter ? 'icon-chevron-up' : 'icon-filter'")
              span.text-900.ml-3.text-primary Filter
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
        DataTable.bg-white.table__sort-icon.h-full.flex.flex-column(v-if="itemsList.data" :value="itemsList.data.items" responsiveLayout="scroll" :selection.sync="selectedStock"
          dataKey="id" :resizableColumns="true" :rowClass="rowClass" :rows="20" :scrollable="false" @row-dblclick='redirectToDetail'
          :class="{ 'table__empty': !itemsList.items || itemsList.items.length <= 0 }")
          Column(selectionMode="multiple" :styles="{width: '3rem'}" :exportable="false")
          Column(field="no" header="NO")
            template(#body="{ index }")
              span.font-semibold {{ (index + 1) + paginate.pageNumber * paginate.pageSize  }}
          Column(field="box.request.seller.email" header="SELLER EMAIL" sortable className="w-3")
          Column(field="stock.sku" header="SKU" sortable className="p-text-right")
          Column(field="amount" header="INVENTORY QUANTITY" className="p-text-right" bodyClass="font-semibold")
          Column(field="box.barCode" header="BOX CODE" className="p-text-right" bodyClass="font-semibold")
          Column(field="box.request.warehouse.name" header="WAREHOUSE" sortable className="p-text-right")
            template(#body="{data}")
              .flex.align-items-center.cursor-pointer.justify-content-end
                span.text-primary.font-bold.font-sm {{data.box.request.warehouse.name}}
                .icon--small.icon-arrow-up-right.bg-primary
          //- Column(field="location.name" header="LOCATION" sortable className="p-text-right")
          //-   template(#body="{data}")
          //-     .flex.align-items-center.cursor-pointer.justify-content-end
          //-       span.text-primary.font-bold.font-sm {{data.location.name}}
          //-       .icon--small.icon-arrow-up-right.bg-primary
          Column(field="box.deleted" header="STATUS" sortable className="p-text-right")
            template(#body="{data}")
              div
                Tag(v-if="data.box.deleted" severity="success").px-2.surface-200
                  span.font-bold.text-400.font-sm DISABLE
                Tag(v-else severity="success").px-2.bg-green-100
                  span.font-bold.text-green-400.font-sm AVAILABLE
          Column(:exportable="false" header="ACTION" className="p-text-right")
            template(#body="{data}")
              Button.border-0.p-0.h-2rem.w-2rem.justify-content-center.surface-200(:disabled="!data.box.status")
                .icon--small.icon-btn-edit
              Button.border-0.p-0.ml-1.h-2rem.w-2rem.justify-content-center.surface-200(@click="showModalDelete()" :disabled="!data.status")
                .icon--small.icon-btn-delete
          template(#footer)
            .pagination
              div.pagination__info(v-if='!selectedStockFilter.length > 0')
                img(:src="require('~/assets/icons/filter-left.svg')")
                span.pagination__total {{ getInfoPaginate }}
              div.pagination__delete(v-else @click="showModalDelete()")
                img(:src="require('~/assets/icons/trash-white.svg')")
                span Delete {{ selectedStockFilter.length }} items selected
              Paginator(v-model:first="paginate.pageNumber" :rows="paginate.pageSize" :totalRecords="itemsList.data.total" @page="onPage($event)")
          template(#empty)
            div.flex.align-items-center.justify-content-center.flex-column
              img(:srcset="`${require('~/assets/images/table-empty.png')} 2x`" v-if="!checkIsFilter")
              img(:srcset="`${require('~/assets/images/table-notfound.png')} 2x`" v-else)
              p.text-900.font-bold.mt-3(v-if="!checkIsFilter") List is empty!, Click
                span.text-primary.underline here
                span to add item.
              p.text-900.font-bold.mt-3(v-else) Item not found!
    ConfirmDialogCustom(
      title="Confirm delete"
      :message="`Are you sure you want to delete ${ids.length} in this list stock?`"
      image="confirm-delete"
      :isShow="isModalDelete"
      :onOk="handleDeleteStock"
      :onCancel="handleCancel"
      :loading="loadingSubmit"
    )
</template>
<script lang="ts">
import { Component, namespace, Prop, Vue,Watch } from 'nuxt-property-decorator'
import ConfirmDialogCustom from '~/components/dialog/ConfirmDialog.vue'
import { Stock as StockModel } from '~/models/Stock'
const nsStoreStockTable = namespace('stock/stock-detail')
const nsWarehouseStock = namespace('warehouse/warehouse-list')

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

  @nsStoreStockTable.State
  total!: number

  @nsStoreStockTable.State
  itemsList!: StockModel.BoxModel

  @nsWarehouseStock.State
  warehouseList!: any

  @nsStoreStockTable.Action
  actGetItemsList!: (params:any) => Promise<void>

  @nsWarehouseStock.Action
  actWarehouseList!: () => Promise<void>

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

  rowClass(data: any) {
    return data.box.deleted ? 'row-disable' : ''
  }

  handleCancel() {
    this.isModalDelete = false
  }

  handleDeleteStock() {
    try {
      // this.loadingSubmit = true
      // await this.actDeleteStockByIds(this.ids)
      // this.getItemsList()
      this.loadingSubmit = false
      this.isModalDelete = false
      this.selectedStock = []
    } catch (error) {
      this.loadingSubmit = false
    }
  }

  async getItemsList() {
    const filter = {
      seller: this.filter?.sellerEmail,
      sku: this.filter?.sku,
      barCode: this.filter?.boxCode,
      location: this.filter?.location,
      deleted: this.filter.status?.value,
      pageNumber:this.paginate.pageNumber,
      pageSize: this.paginate.pageSize
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

  redirectToDetail({ data }) {
    this.$router.push(`${this.$route.params.sid}/item/${data.id}`)
  }

  mounted() {
      this.getItemsList()
  }
}
export default StockDetailTable
</script>
<style lang="sass" scoped>
    .stock__mutidelete
      background-color: #FF7171
    ::v-deep.p-inputtext,
    ::v-deep.p-dropdown,
    ::v-deep.p-button
      box-shadow: none !important
</style>
