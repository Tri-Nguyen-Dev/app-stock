<template lang="pug">
  .flex.flex-column.h-full
    .grid.justify-content-between(class="mt-2 lg:mt-0")
      .col-fixed
        h1.text-heading Stock detail
        span.text-subheading(v-if="itemsList.data") {{itemsList.data.total}} results found
      .col-fixed
        .grid
          .col-fixed.flex.btn-filter
            div.cursor-pointer.bg-white.btn-filter-toggle.flex.align-items-center.h-full.flex-1(@click="isShowFilter = !isShowFilter")
              .icon.bg-primary(:class="isShowFilter ? 'icon-chevron-up' : 'icon-filter'")
              span.text-900.ml-3.text-primary Filter
            div.cursor-pointer.refresh-filter(@click="handleRefreshFilter")
              img(:src="require(`~/assets/icons/rotate-left.svg`)")
    .grid(v-show="isShowFilter")
      .col(class='xl:col-2 lg:col-6 md:col-6 sm:col-12 col-12')
        FilterTable(
          title="Seller"
          placeholder="Enter seller"
          name="sellerEmail"
          :value="filter.sellerEmail"
          :searchText="true"
          @updateFilter="handleFilter"
        )
      .col(class='xl:col-2 lg:col-6 md:col-6 sm:col-12 col-12')
        FilterTable(
          title="SKU"
          placeholder="Enter SKU"
          name="sku"
          :value="filter.sku"
          :searchText="true"
          @updateFilter="handleFilter"
        )
      .col(class='xl:col-2 lg:col-6 md:col-6 sm:col-12 col-12')
        FilterTable(
          title="Enter box code"
          placeholder="Enter box code"
          name="boxCode"
          :value="filter.boxCode"
          :searchText="true"
          @updateFilter="handleFilter"
        )
      .col(class='xl:col-2 lg:col-6 md:col-6 sm:col-12 col-12')
        FilterTable(
          title="Warehouse"
          :value="filter.warehouse"
          :options="warehouseOption"
          name="warehouse"
          @updateFilter="handleFilter"
        )
      .col(class='xl:col-2 lg:col-6 md:col-6 sm:col-12 col-12')
        FilterTable(
          title="Location"
          placeholder="Enter location"
          name="location"
          :value="filter.location"
          :searchText="true"
          @updateFilter="handleFilter"
        )
      .col(class='xl:col-2 lg:col-6 md:col-6 sm:col-12 xs:col-12')
        FilterTable(title="Status" :value="filter.status" :options="statusList" name="status" @updateFilter="handleFilter")
    .grid.grid-nogutter.flex-1.relative.overflow-hidden.m-h-700
      .col.h-full.absolute.top-0.left-0.right-0.mt-2
        DataTable.bg-white.table__sort-icon.w-full.h-full.flex.flex-column(
          v-if="itemsList.data"
          :value="itemsList.data.items"
          responsiveLayout="scroll"
          :selection.sync="selectedStock"
          dataKey="id"
          :resizableColumns="true"
          :rowClass="rowClass"
          :rows="20"
          :scrollable="false"
          @row-dblclick='redirectToDetail'
          :class="{ 'table-wrapper-empty': !itemsList.data.items || itemsList.data.items.length <= 0 }"
          @sort="sortData($event)"
        )
          Column(selectionMode="multiple" :styles="{'width': '1%'}" :exportable="false" :headerClass="classHeaderMuti")
          Column(field="no" header="NO" :styles="{'width': '1%'}")
            template(#body="{ index }")
              span.font-semibold {{ (index + 1) + paginate.pageNumber * paginate.pageSize  }}
          Column(field="box.request.seller.email" header="SELLER EMAIL" sortable className="w-3")
          Column(field="sku" header="SKU" sortable className="p-text-right")
          Column(
            field="amount"
            header="Q.TY"
            sortable className="p-text-right"
            bodyClass="font-semibold"
            :styles="{'width': '5%'}"
          )
          Column(
            field="box.id"
            header="BOX CODE"
            sortable
            className="p-text-right"
            bodyClass="font-semibold"
          )
            template(#body="{data}")
              .flex.align-items-center.cursor-pointer.justify-content-end(v-if="data.box.id")
                span {{data.box.id}}
              .flex.align-items-center.cursor-pointer.justify-content-end(v-else)
                span N/A
          Column(
            field="box.request.warehouse.name"
            sortable header="WAREHOUSE"
            className="p-text-right"
            :styles="{'width': '5%'}"
          )
            template(#body="{data}")
              .flex.align-items-center.cursor-pointer.justify-content-end(v-if='data.box.request && data.box.request.warehouse')
                span.text-primary.font-bold.font-sm {{data.box.request.warehouse.name}}
                .icon--small.icon-arrow-up-right.bg-primary
              .flex.align-items-center.cursor-pointer.justify-content-end(v-else)
                span.text-primary.font-bold.font-sm N/A
          Column(field="box.rackLocation.name" header="LOCATION" sortable className="p-text-right")
            template(#body="{data}")
              .flex.align-items-center.cursor-pointer.justify-content-end(v-if="data.box.rackLocation")
                span.text-primary.font-bold.font-sm
                | {{ data.box.rackLocation ? (data.box.rackLocation.name ? data.box.rackLocation.name : '' ) : ''}}
                .icon--small.icon-arrow-up-right.bg-primary
              .flex.align-items-center.cursor-pointer.justify-content-end(v-else)
                span N/A
          Column(field="itemStatus" header="STATUS" sortable className="p-text-right")
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
              .table__action(:class="{'action-disabled': data.itemStatus === 'ITEM_STATUS_DISABLE'}")
                span.action-item(@click='editItemDetail(data.box.id)')
                  .icon.icon-btn-edit
                span.action-item(@click="showModalDelete(data.id)")
                  .icon.icon-btn-delete
          template(#footer)
            Pagination(
              type="items selected"
              :paging="paging"
              :total="total"
              :deleted-list="selectedStockFilter"
              @onDelete="showModalDelete"
              @onPage="onPage")
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
import { Component, namespace, Prop, Vue } from 'nuxt-property-decorator'
import ConfirmDialogCustom from '~/components/dialog/ConfirmDialog.vue'
import Pagination from '~/components/common/Pagination.vue'
import { Paging } from '~/models/common/Paging'
import { Stock as StockModel } from '~/models/Stock'
import {
  PAGINATE_DEFAULT
} from '~/utils'
const nsStoreStockTable = namespace('stock/stock-detail')
const nsStoreWarehouse = namespace('warehouse/warehouse-list')
const nsSidebar = namespace('layout/store-sidebar')
const nsStoreUser = namespace('user-auth/store-user')

@Component({
  components: { ConfirmDialogCustom, Pagination }
})
class StockDetailTable extends Vue {
  @nsSidebar.State
  widthScreen!: number

  @Prop() sku!: string
  isShowFilter: boolean = false
  selectedStock: StockModel.ModelDetail[] = []
  isModalDelete: boolean = false
  ids: string[] = []
  loadingSubmit: boolean = false
  paging: Paging.Model = { ...PAGINATE_DEFAULT, first: 0 }
  warehouseOption: any = []

  filter: any = {
    sellerName: null,
    sellerEmail: null,
    boxCode: null,
    sku: null,
    warehouse: null,
    location: null,
    status: null
  }

  statusList: any = [
    { name: 'Available', value: 'ITEM_STATUS_AVAILABLE' },
    { name: 'Draft', value: 'ITEM_STATUS_DRAFT' },
    { name: 'Disable', value: 'ITEM_STATUS_DISABLE' }
  ]

  paginate: any = {
    pageNumber: 0,
    pageSize: 10
  }

  sort: any = {
    sortBy: null,
    desc: null
  }

  @nsStoreStockTable.State
  total!: number

  @nsStoreStockTable.State
  itemsList!: StockModel.BoxModel

  @nsStoreWarehouse.State
  warehouseList!: any

  @nsStoreUser.State
  user: any | undefined

  @nsStoreStockTable.Action
  actGetItemsList!: (params: any) => Promise<void>

  @nsStoreWarehouse.Action
  actWarehouseList!: () => Promise<void>

  @nsStoreStockTable.Action
  actDeleteItemsById!: (ids: string[]) => Promise<void>

  get selectedStockFilter() {
    return this.selectedStock.filter(
      (item: any) => item.itemStatus !== 'ITEM_STATUS_DISABLE'
    )
  }

  get classHeaderMuti() {
    return !this.itemsList.data.items ||
      this.itemsList.data.items.length <= 0 ? 'checkbox-disable'
      : ''
  }

  onPage(event: any) {
    this.paginate.pageSize = event.rows
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

  sortData(e: any) {
    const { sortField, sortOrder } = e
    if (sortOrder) {
      this.sort.desc = sortOrder !== 1
      this.sort.sortBy = sortField.replace('_', '')
    }
    this.getItemsList()
  }

  rowClass(data: any) {
    return data.itemStatus === 'ITEM_STATUS_DISABLE' ? 'row-disable' : ''
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
      itemStatus: this.filter.status?.value,
      pageNumber: this.paginate.pageNumber,
      pageSize: this.paginate.pageSize,
      sortBy: this.sort?.sortBy,
      desc: this.sort.desc && this.sort?.desc
    }
    const params = {
      filter,
      ...this.paginate,
      id: this.$route.params.sid
    }
    await this.actGetItemsList(params)
  }

  handleFilter(e: any, name: string) {
    this.filter[name] = e
    this.getItemsList()
    this.selectedStock = []
  }

  handleRefreshFilter() {
    this.filter = {
      name: null,
      warehouse: null,
      categories: null,
      barCode: null,
      status: null
    }
    this.getItemsList()
  }

  redirectToDetail({ data }) {
    this.$router.push(`${this.$route.params.sid}/item/${data.box.id}`)
  }

  editItemDetail(id: any) {
    this.$router.push({
      path: `${this.$route.params.sid}/item/${id}`,
      query: { plan: 'edit' }
    })
  }

  async mounted() {
    await this.getItemsList()
    const { role, warehouse } = this.user
    if(role === 'admin') {
      await this.actWarehouseList()
      this.warehouseOption = _.cloneDeep(this.warehouseList)
      this.filter.warehouse = this.warehouseList[0]
    } else {
      this.warehouseOption = [warehouse]
      this.filter.warehouse = warehouse
    }
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
