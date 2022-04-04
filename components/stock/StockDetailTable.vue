<template lang="pug">
  .flex.flex-column.h-full
    .grid.justify-content-between
      .col-fixed
        h1.font-bold.m-0.font-size-4xlarge.line-height-1 Stock detail
        span.text-600.font-sm(v-if="itemsList") {{itemsList.length}} results found
      .col-fixed
        .grid
          .col-fixed
            span.p-input-icon-left
              .icon.icon--left.icon-search.surface-900
              InputText.w-21rem.h-3rem(type="text" placeholder="Search" v-model='filter.name')
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
            InputText.border-0.w-full.mb-1(type="text" placeholder="Enter seller")
      .col
        .bg-white.border-round
          div.pt-2.pl-3.pb-1
            span.text-600.font-sm SKU
          span.p-input-icon-right.w-full
            .icon.icon--right.icon-search.surface-900.icon--absolute
            InputText.border-0.w-full.mb-1(type="text" placeholder="Enter SKU")
      .col
        .bg-white.border-round
          div.pt-2.pl-3.pb-1
            span.text-600.font-sm Box Code
          span.p-input-icon-right.w-full
            .icon.icon--right.icon-search.surface-900.icon--absolute
            InputText.border-0.w-full.mb-1(type="text" placeholder="Enter box code")
      .col
        .bg-white.border-round
          div.pt-2.pl-3.pb-1
            span.text-600.font-sm Warehouse
          Dropdown.w-full.border-0.mb-1(v-model="selectedWarehouse" optionLabel="name" placeholder="Select")
      .col
        .bg-white.border-round
          div.pt-2.pl-3.pb-1
            span.text-600.font-sm Location
          span.p-input-icon-right.w-full
            .icon.icon--right.icon-search.surface-900.icon--absolute
            InputText.border-0.w-full.mb-1(type="text" placeholder="Enter location")
      .col
        .bg-white.border-round
          div.pt-2.pl-3.pb-1
            span.text-600.font-sm Status
          Dropdown.w-full.border-0.mb-1(v-model="selectedWarehouse" optionLabel="name" placeholder="Select")
    .grid.grid-nogutter.flex-1.relative.overflow-hidden
      .col.h-full.absolute.top-0.left-0.right-0
        DataTable.w-full.airtag-datatable.h-full.flex.flex-column(v-if="itemsList" :value="itemsList" responsiveLayout="scroll" :selection.sync="selectedStock"
        dataKey="id" :resizableColumns="true" :rows="20" :scrollable="false" )
          Column(selectionMode="multiple" :styles="{width: '3rem'}" :exportable="false")
          Column(field="no" header="NO" sortable)
            template(#body="slotProps")
              span.font-semibold {{slotProps.index +1}}
          Column(field="seller.email" header="SELLER EMAIL" sortable className="w-3")
          Column(field="sku" header="SKU" sortable className="p-text-right")
          Column(field="inventoryQuantity" header="INVENTORY QUANTITY" className="p-text-right" bodyClass="font-semibold")
          Column(field="boxCode" header="BOX CODE" className="p-text-right" bodyClass="font-semibold")
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
          Column(field="deleted" header="STATUS" sortable className="p-text-right")
            template(#body="{data}")
              div
                Tag(v-if="data.status" severity="success").px-2.bg-green-100
                  span.font-bold.text-green-400.font-sm AVAILABLE
                Tag(v-else severity="success").px-2.surface-200
                  span.font-bold.text-400.font-sm DISABLE
          Column(:exportable="false" header="ACTION" className="p-text-right")
            template(#body="{data}")
              Button.border-0.p-0.h-2rem.w-2rem.justify-content-center.surface-200(:disabled="!data.status")
                .icon--small.icon-btn-edit
              Button.border-0.p-0.ml-1.h-2rem.w-2rem.justify-content-center.surface-200(@click="showModalDelete()" :disabled="!data.status")
                .icon--small.icon-btn-delete
          template(#footer)
            div
              .flex.align-items-center(v-if="selectedStock.length <= 0")
                .icon--large.icon-footer-paginator.surface-400
                span.ml-3.text-400.font-sm Showing 01 - {{pageSize}} of {{totalBoxRecords}}
              Button(@click="showModalDelete()" v-if="selectedStock.length>0").p-button-danger.opacity-70.ml-1
                .icon--small.icon-trash-white.bg-white
                span.ml-3 Delete {{selectedStock.length}} items selected
            Paginator(:rows="pageSize" :totalRecords="totalBoxRecords" @page="onPage($event)").p-0
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
import { Component, namespace, Vue,Watch } from 'nuxt-property-decorator'
import ConfirmDialogCustom from '~/components/dialog/ConfirmDialog.vue'
const nsStoreStockTable = namespace('stock/stock-detail')

@Component({
  components: {ConfirmDialogCustom}
})
class StockDetailTable extends Vue {
  isShowFilter: boolean = false

  selectedWarehouse = []

  selectedStatus = null

  selectedStock = []

  deleteStockList = []

  isModalDelete: boolean = false

  ids: string[] = []

  loadingSubmit: boolean = false

  pageNumber: number = 0

  pageSize: number = 20

  totalBoxRecords: number = 100

  filter: any = {
    name: null,
    sellerEmail: null,
    boxCode: null,
    warehouse: null,
    location: null,
    status: null
  }


  @nsStoreStockTable.State
  itemsList!: {}

  @nsStoreStockTable.Action
  actGetItemsList!: (params:any) => Promise<void>

  @Watch('selectedStock')
  getSelectedStock() {
    this.deleteStockList = [...this.selectedStock]
  }

  showModalDelete(id?: string) {
    if (id) {
      this.ids = [id]
    } else {
      this.ids = this.selectedStock.map((item: any) => {
        return item.id
      })
    }
    this.isModalDelete = true
  }

  handleCancel() {
    this.isModalDelete = false
  }

  handleDeleteStock() {
    try {
      // this.loadingSubmit = true
      // await this.actDeleteStockByIds(this.ids)
      // this.getProductList()
      this.loadingSubmit = false
      this.isModalDelete = false
      this.selectedStock = []
    } catch (error) {
      this.loadingSubmit = false
    }
  }

  async getItemsList() {
    const filter = {
      sellerName: this.filter.name
    }
    const params = {
      filter,
      id: this.$route.params.id
    }
    await this.actGetItemsList(params)
  }

  @Watch('filter', { deep: true })
  getFilterList() {
    this.getItemsList()
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
