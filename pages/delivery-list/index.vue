<template lang="pug">
  .stock
    h1.text-heading Delivery order list
    .stock__header.grid.mt-3
      div.col-12(class="xl:col-6")
        TabView(@tab-click="handleTab($event)")
          TabPanel 
            template(#header)
              .icon.icon-truck.mr-2.surface-600
              span New 
          TabPanel
            template(#header)
              .icon.icon-truck.mr-2.surface-600
              span Delivery setting
          TabPanel
            template(#header)
              .icon.icon-truck.mr-2.surface-600
              span Delivered
      div.col-12(class="xl:col-6")
        .header__action
          .btn__filter(:class="{'active': isShowFilter}")
            .btn-toggle(@click="isShowFilter = !isShowFilter")
              .icon.icon-filter(v-if="!isShowFilter")
              .icon.icon-chevron-up.bg-primary(v-else)
              span Filter
            .btn-refresh(@click="handleRefreshFilter")
              .icon.icon-rotate-left.bg-white
          .btn.btn-primary(@click="")
            .icon.icon-add-items
            span Add new 
          .btn__filter(class='active' @click="")
            .btn.btn-toggle.bg-white
              .icon-download.icon--large.bg-primary
              span.text-900.text-primary Export file
    .grid.header__filter(:class='{ "active": isShowFilter }')
      //- .col
      //-   FilterTable(title="Catagory" name="categories" :value="filter.categories"  @updateFilter="handleFilter")
      //-     template(v-slot:multi-select)
      //-       MultiSelect.filter__multiselect(v-model='filter.categories' @change="handleChangeFilter" :options='categoryList' optionLabel="name" placeholder='Select' :filter='true')
      //- .col
      //-   FilterTable(title="Barcode" placeholder="Search barcode" name="barCode" :value="filter.barCode" :searchText="true" @updateFilter="handleFilter")
      //- .col
      //-   FilterTable(title="Status" :value="filter.status" :options="statusList" name="status" @updateFilter="handleFilter")
    .stock__table
        DataTable(
          :value='deliveryList' 
          @sort="sortData($event)"
          :class="{ 'table-wrapper-empty': !deliveryList || deliveryList.length <= 0 }"
          :rowClass="rowClass" 
          responsiveLayout="scroll"
          @row-click='rowdbClick'
          :selection='selectedDelivery'
          dataKey='id'
          :rows='10'
          :rowHover='true'
          @row-select-all="rowSelectAll"
          @row-unselect-all="rowUnSelectAll"
          @row-select="rowSelect"
          @row-unselect="rowUnselect"
        )
          Column(
            selectionMode='multiple'
            :styles="{'width': '1%'}"
            :headerClass="classHeaderMuti")
          Column(field='no' header='NO' :styles="{'width': '1%'}" )
            template(#body='{ index }')
              span.grid-cell-center.stock__table-no.text-white-active.text-900.font-bold {{ getIndexPaginate(index) }}
          Column(field='id' header='ID' sortable headerClass="grid-header-center")
            template(#body='{ data }')
             .stock__table-name.text-white-active.text-base.text-900.text-overflow-ellipsis.overflow-hidden {{ data.id }}
          Column(header='Creator ID' field='creatorId' sortable sortField="_creatorId")
            template(#body='{ data }')
              .stock__table-name.text-white-active.text-base.text-900.text-overflow-ellipsis.overflow-hidden {{ data.creatorId }}
          Column(header='Create Name' field='creatorName' sortable sortField="_creatorName" headerClass="grid-header-right")
            template(#body='{ data }')
              .stock__table-barcode.grid-cell-right {{ data.creatorName }}
          Column(header='Create time' field='createTime' sortable  sortField="_createTime" headerClass="grid-header-right")
              template(#body='{ data }')
                div.grid-cell-right {{ data.createTime }}
          Column(header='Seller email' sortable field='sellerEmail' sortField="_sellerEmail" headerClass="grid-header-right")
              template(#body='{ data }')
                div.grid-cell-right {{ data.sellerEmail }}
          Column(header='Receiver Address' sortable field='receiverAddress' sortField="_receiverAddress" headerClass="grid-header-right")
              template(#body='{ data }')
                div.grid-cell-right {{ data.receiverAddress }}
          Column( sortable field='dueDeliveryDate' sortField="_dueDeliveryDate" headerClass="grid-header-right")
              template(#header)
                div
                  div.text-end Due 
                  div Delivery Date
              template(#body='{ data }')
                div.grid-cell-right {{ data.dueDeliveryDate }}
          Column( sortable field='estimatedDeliveryTime' sortField="_estimatedDeliveryTime" headerClass="grid-header-right")
              template(#header)
                div
                  div.text-end Estimated 
                  div Delivery Time 
              template(#body='{ data }')
                div.grid-cell-right {{ data.estimatedDeliveryTime }}
          Column( sortable field='lastedUpdateTime' sortField="_lastedUpdateTime" headerClass="grid-header-right")
              template(#header)
                div
                  div.text-end Latest 
                  div update time
              template(#body='{ data }')
                div.grid-cell-right {{ data.lastedUpdateTime }}
          Column(header='Warehouse' sortable field='warehouseName' sortField="_warehouseName" headerClass="grid-header-right")
              template(#body='{ data }')
                div.grid-cell-right {{ data.warehouseName }}
          Column(header='PIC' sortable field='warehouseId' sortField="_warehouseId" headerClass="grid-header-right")
              template(#body='{ data }')
                div.grid-cell-right {{ data.warehouseId }}
          Column(v-if="activeTab === 1" header='Driver' sortable field='driverId' sortField="_driverId" headerClass="grid-header-right")
              template(#body='{ data }')
                div.grid-cell-right {{ data.driverId }}
          Column(field='status' header="Status" headerClass="grid-header-right")
            template(#body='{ data }')
              div.grid-cell-right
                span.table__status.table__status--available(v-if="data.stockStatus === 'STOCK_STATUS_AVAILABLE'") Available
                span.table__status.table__status--disable(v-if="data.stockStatus === 'STOCK_STATUS_DISABLE' ") Disable
          Column(field='action' header="action" :styles="{'width': '2%'}")
            template(#body='{ data }')
              .table__action(:class="{'action-disabled': data.stockStatus === 'STOCK_STATUS_DISABLE'}")
                span(@click="handleEditStock(data.id)")
                  .icon.icon-edit-btn
                span(@click="showModalDelete([data])" :class="{'disable-button': selectedDeliveryFilter.length > 0}")
                  .icon.icon-btn-delete
          template(#footer)
            //- Pagination(
              :paging="paging"
              :total="total"
              :deleted-list="selectedDeliveryFilter"
              @onDelete="showModalDelete"
              @onPage="onPage")
        //-   template(#empty)
            div.table__empty
              img(:srcset="`${require('~/assets/images/table-empty.png')} 2x`" v-if="!checkIsFilter")
              img(:srcset="`${require('~/assets/images/table-notfound.png')} 2x`" v-else)
              p.empty__text(v-if="!checkIsFilter") List is empty!, Click
                span &nbsp;here
                span(@click="handleAddStock") &nbsp;to add item.
              p.notfound__text(v-else) Item not found!
</template>
<script lang="ts">
import { Vue, namespace } from 'nuxt-property-decorator'
import { DeliveryList } from '~/models/Delivery'
const nsStoreDelivery = namespace('delivery/delivery-list')

class Delivery extends Vue { 
  selectedDelivery: DeliveryList.Model[] = []
  isShowFilter: boolean = false
  loading: boolean = false
  activeTab: number = 0
  filter: any = {
    name: null,
    barCode: null,
    warehouse: null,
    categories: null,
    status: null,
    sortBy: null,
    desc: null
  } 
  
  get classHeaderMuti() {
    return !this.deliveryList ||
      this.deliveryList.length <= 0 ||
      this.checkStockDisable
      ? 'checkbox-disable'
      : ''
  }

  get checkStockDisable() {
    return this.deliveryList.every(
      (item) => item.status === 'STOCK_STATUS_DISABLE'
    )
  }

  @nsStoreDelivery.State
  total!: number

  @nsStoreDelivery.State
  deliveryList!: DeliveryList.Model[]
 
  @nsStoreDelivery.Action
  actGetDeliveryList!: () => Promise<void>

  handleFilter(e: any, name: string){
    this.filter[name] = e
    // this.getProductList()
  }
  
  handleRefreshFilter() {
    this.filter.name = null
    this.filter.barCode = null
    this.filter.categories = null
    this.filter.status = null
    // this.getProductList()
  }

  handleTab({ index }: any) {
    this.activeTab = index
  }

  rowClass(data: any) {
    return data.status === 'STOCK_STATUS_DISABLE' ? 'row-disable' : ''
  }

  rowdbClick({ data }) {
    this.$router.push(`/stock/${data.id}`)
  }
  
  rowSelectAll({ data }) {
    this.selectedDelivery = _.union(this.selectedDelivery, data)
  }

  rowUnSelectAll() {
    this.selectedDelivery = _.differenceWith(
      this.selectedDelivery,
      this.deliveryList,
      _.isEqual
    )
  }

  rowSelect({ data }) {
    this.selectedDelivery.push(data)
  }

  rowUnselect({ originalEvent, data }) {
    originalEvent.originalEvent.stopPropagation()
    this.selectedDelivery = _.filter(
      this.selectedDelivery,
      (stock: any) => stock.id !== data.id
    )
  }

}
export default Delivery
</script>
<style lang="sass" scoped>
.text-end 
  display: flex
  justify-content: end
.stock
  @include flex-column
  height: 100%
  &__header
    @include flex-center-space-between
    margin-bottom: 24px
    ::v-deep.p-tabview .p-tabview-nav li:not(.p-highlight):not(.p-disabled)
      &:hover
          .p-tabview-nav-link
            background-color: transparent !important
            color: #000 !important
          .icon 
            background-color: var(--primary-color) !important
    ::v-deep.p-tabview .p-tabview-nav li
      .p-tabview-nav-link
        background: var(--bg-body-bas)
        border: none
        box-shadow: none !important
    ::v-deep.p-tabview .p-tabview-panels
      background: var(--bg-body-bas)
      padding: 1.25rem 0 0 0
      display: none
    ::v-deep.p-highlight .p-tabview-nav-link
      color: #000 !important
      border-bottom: 2px solid #486AE2 !important
      .icon
        background-color: var(--primary-color) !important
  .header__action
      @include flex-center-vert
      justify-content: flex-end
      gap: 0 16px
.stock__table
  border-radius: 4px
  flex: 1
  position: relative
  overflow: hidden
  &-no
    font-size: $font-size-medium
  &-barcode
    text-transform: uppercase
  ::v-deep.disable-button
    pointer-events: none
    background-color: $text-color-300
    .icon
      background-color: $text-color-500
      
.filter__dropdown, .filter__multiselect
  @include size(100%, 40px)
  border: none
</style>