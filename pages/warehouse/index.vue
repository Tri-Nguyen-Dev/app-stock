<template lang="pug">
  .warehouse
    .warehouse__header
      div
        h1.text-heading Warehouse List
        span.text-subheading {{ total }} products found
      .header__action
        .header__search
          .icon.icon--left.icon-search
          InputText(type='text' placeholder='Search warehouse name' v-model="filter.name" v-on:input="debounceSearchName")
        Button.btn.btn-primary(@click='isShowCreateWarehouse = true; warehouseData= null')         
          .icon.icon-add-items
          span Add Warehouse
    .grid.grid-nogutter.flex-1.relative.overflow-hidden.m-h-700
      .col.h-full.absolute.top-0.left-0.right-0.bg-white
        DataTable(
          dataKey='id'
          :class="{ 'table-wrapper-empty': !warehouseList || warehouseList.length <= 0 }"
          :rows='10'
          :rowHover='true'
          responsiveLayout='scroll'
          :value='dataRenderItems'
          :selection.sync='selectedItem'
          @row-select='selectRow()'
          @row-unselect='unSelectRow'
          @row-select-all="rowSelectAll"
          @row-unselect-all="rowUnSelectAll"
        )
          Column(
            selectionMode='multiple'
            :styles="{'width': '1%'}"
          )
          Column(field='no' header='NO' :styles="{'width': '1%'}" )
            template(#body='{ index }')
              span.grid-cell-center.warehouse__table-no.text-white-active.text-900.font-bold {{ getIndexPaginate(index) }}
          Column(header='Name' field='name'  )
            template(#body='{ data }')
              div.grid-cell-left {{ data.name }}
          Column(header='Adress'  field='adress' headerClass="grid-header-center")
            template(#body='{ data }')
              div.grid-cell-left {{ data.address }}
          Column(header='Phone'  field='phone' headerClass="grid-header-center")
            template(#body='{ data }')
              div.grid-cell-center {{ data.phone }}
          Column(header='Email'  field='email' headerClass="grid-header-center")
            template(#body='{ data }')
              div.grid-cell-center {{ data.email }}
          Column(header='Description'  field='description' headerClass="grid-header-right")
            template(#body='{ data }')
              div.grid-cell-center {{ data.description }}
          Column(header='maxNumberRack'  field='maxNumberRack' headerClass="grid-header-center")
            template(#body='{ data }')
              div.grid-cell-center {{ data.maxNumberRack }}
          Column(field='action' header="action" :styles="{'width': '2%'}")
            template(#body='{ data }')
              .table__action(:class="{'action-disabled': data.stockStatus === 'STOCK_STATUS_DISABLE'}")
                span.action-item(@click.stop="handleEditWarehouse([data])")
                  .icon.icon-edit-btn
                span.action-item(@click.stop="showModalDelete([data])" )
                  .icon.icon-btn-delete
          template(#footer)
            Pagination(
              type="items selected"
              :paging="paging"
              :total="total"
              :deleted-list="selectedItem"
              @onDelete="showModalDelete"
              @onPage="onPage")
          template(#empty)
            div.table__empty
              img(:srcset="`${require('~/assets/images/table-empty.png')} 2x`" v-if="!checkIsFilter")
              img(:srcset="`${require('~/assets/images/table-notfound.png')} 2x`" v-else)
              p.empty__text(v-if="!checkIsFilter") List is empty!, Click
                span &nbsp;here
                span(@click="handleAddwarehouse") &nbsp;to add item.
              p.notfound__text(v-else) Item not found!
    ConfirmDialogCustom(
      title="Confirm delete"
      image="confirm-delete"
      :isShow="isModalDelete"
      :onOk="handleDeleteWarehouse"
      :onCancel="handleCancel"
      :deleted-list="selectedItem"
      :loading="loadingSubmit"
    )
      template(v-slot:message)
        p {{ deleteMessage }}
    Toast
    CreateWarehouse(
      :isShowCreateWarehouse="isShowCreateWarehouse"
      @close-modal="isShowCreateWarehouse = false"
      :warehouseData="warehouseData")
</template>

<script lang="ts">
import { Component, Vue, namespace } from 'nuxt-property-decorator'
import ConfirmDialogCustom from '~/components/dialog/ConfirmDialog.vue'
import CreateWarehouse from '~/components/warehouse/CreateWarehouse.vue'
import { Warehouse as WarehouseModel } from '~/models/Warehouse'
import {
  LIMIT_PAGE_OPTIONS,
  PAGINATE_DEFAULT,
  calculateIndex,
  getDeleteMessage
} from '~/utils'
import { Paging } from '~/models/common/Paging'
import Pagination from '~/components/common/Pagination.vue'
const nsStoreWarehouse = namespace('warehouse/warehouse-list')
@Component({
  components: {
    ConfirmDialogCustom,
    Pagination,
    CreateWarehouse
  }
})
class Warehouse extends Vue {
  selectedWarhouse: WarehouseModel.Model[] = []
  isShowFilter: boolean = false
  loading: boolean = false
  isModalDelete: boolean = false
  isShowCreateWarehouse: boolean = false
  onEventDeleteList: WarehouseModel.Model[] = []
  onEventCreateOrUpdateWarehouse: WarehouseModel.CreateOrUpdateWarehouse[] = []
  loadingSubmit: boolean = false
  isFilter: boolean = false
  limitOptions = LIMIT_PAGE_OPTIONS
  enablePack = false
  warehouseData: any = null
  id: string
  selectedItem: any[] = []
  paging: Paging.Model = { ...PAGINATE_DEFAULT, first: 0 }
  filter: any = {
    email: '',
    phone: '',
    name: '',
    address: null,
    description: null,
    maxNumberRack: null
  }

  // -- [ state ]-------------------------------
  @nsStoreWarehouse.State
  warehouseList!: WarehouseModel.Model[]

  @nsStoreWarehouse.State
  warehouseBySeller!: WarehouseModel.Model[]

  @nsStoreWarehouse.Action
  actWarehouseList!: (params?: any) => Promise<void>

  @nsStoreWarehouse.Action
  actWarehouseBySeller!: (params?: any) => Promise<void>

  @nsStoreWarehouse.Action
  actDeletedWarehouseById!: (id?: any) => Promise<any>

  // --[ getter ] -----------------------------
  get total() {
    return this.warehouseList.length
  }

  get checkIsFilter() {
    const params = _.omit(this.getParamApi(), ['pageNumber', 'pageSize'])
    return Object.values(params).some((item) => item)
  }

  onPage(event: any) {
    this.paging.pageSize = event.rows
    this.paging.pageNumber = event.page
  }

  get dataRenderItems() {
    const start = this.paging.pageSize * this.paging.pageNumber
    const end = start + this.paging.pageSize
    const result = this.warehouseList.slice(start, end)
    return result
  }

  showModalDelete(data: WarehouseModel.Model[]) {
    this.onEventDeleteList = data || this.selectedItem
    this.isModalDelete = true
  }

  getIndexPaginate(index: number) {
    return calculateIndex(
      index,
      this.paging.pageNumber,
      this.paging.pageSize
    )
  }

  getParamApi() {
    return {
      params: {
        pageNumber: this.paging.pageNumber, pageSize: this.paging.pageSize,
        'email': this.filter.email || null,
        'address': this.filter.address || null,
        'name': this.filter.name || null,
        'description': this.filter.description || null,
        'phone': this.filter.phone || null,
        'maxNumberRack': this.filter.maxNumberRack || null
      }
    }
  }

  get deleteMessage() {
    return getDeleteMessage(this.onEventDeleteList, 'warehouse')
  }

  // -- [ Functions ] --------------------------
  async getWarehouseList() {
    await this.actWarehouseList({
      pageSize: this.paging.pageSize,
      pageNumber: this.paging.pageNumber,
      ...this.getParamApi()
    })
  }

  async handleDeleteWarehouse() {
    this.loadingSubmit = true
    const id = this.onEventDeleteList[0].id
    const result = await this.actDeletedWarehouseById( id )
    if(result){
      this.loadingSubmit = false
      this.isModalDelete = false
      this.$toast.add({
        severity: 'success',
        summary: 'Success Message',
        detail: 'Successfully deleted box',
        life: 3000
      })
      await this.actWarehouseList({ pageNumber: this.paging.pageNumber, pageSize: this.paging.pageSize })
      this.selectedItem = []
    }
  }

  async handleFilter(e: any, name: string){
    this.loadingSubmit = true
    this.filter[name] = e
    await this.actWarehouseList(this.getParamApi())
    this.loadingSubmit = false
    this.selectedItem = []
  }

  async handleRefeshFilter() {
    this.filter.name = ''
    this.filter.email = ''
    this.filter.phone = ''
    this.filter.address = null
    this.filter.maxNumberRack = null
    this.filter.description = null
    await this.actWarehouseList(this.getParamApi())
  }

  warehouseSelect({ data }){
    this.selectedWarhouse.push(data)
  }

  handleCancel() {
    this.isModalDelete = false
  }

  handleEditWarehouse(data) {
    this.warehouseData = _.cloneDeep(data[0])
    this.isShowCreateWarehouse = true
  }

  debounceSearchName = _.debounce((value) => {
    this.filter.name = value
    this.getWarehouseList()
  }, 500)

  handleAddwarehouse() {
    this.$router.push('/warehouse/create-warehouse')
  }

  selectRow() {
    this.$emit('selectRow', this.selectedItem)
    if (this.selectedItem.length === this.dataRenderItems.length) {
      this.$emit('enablePack', true)
    }
  }

  unSelectRow({ originalEvent, data }) {
    originalEvent.originalEvent.stopPropagation()
    this.selectedItem = _.filter(
      this.selectedItem,
      (warehouse: any) => warehouse.id !== data._id
    )
    this.$emit('enablePack', false)

  }

  rowSelectAll({ data }) {
    this.selectedItem = _.union(this.selectedItem, data)
  }

  rowUnSelectAll() {
    this.selectedItem = _.differenceWith(
      this.selectedItem,
      this.warehouseList,
      _.isEqual
    )
  }

  async mounted() {
    await this.getWarehouseList()
  }

}
export default Warehouse
</script>
<style lang="sass" scoped>
.warehouse
  @include flex-column
  @include desktop
    height: calc(100vh - 32px)
  &__header
    flex-direction: column
    flex-wrap: wrap
    margin-bottom: 24px
    @include desktop
      flex-direction: row
      @include flex-center-space-between
  .header__action
    display: flex
    margin-top: 12px
    @include flex-column
    flex-wrap:  wrap
    gap: 10px 16px
    @include desktop
      @include flex-center
      flex-direction: row
      margin-top: 0
  .btn-refresh
    border-top-left-radius: 0 !important
    border-bottom-left-radius: 0 !important
  .fillter-container
    margin-left: 800px
.warehouse__table
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
