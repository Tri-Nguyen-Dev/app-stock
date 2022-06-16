<template lang="pug">
  .grid.flex.grid-nogutter.stock
    div.bg-white.border-round-top.sub-tab(class='col-12 md:col-12 lg:col-4 xl:col-3')
      .grid.flex.align-items-center.p-2.m-0
        .col-12.flex
          Button(@click='$router.go(-1)').p-button-link.pl-0
            .icon-arrow-left.icon.bg-primary.align-items-center
          Breadcrumb.font-bold(:home="homeItem" :model="breadcrumbItem")
      .border-bottom-1.border-gray-300
      .grid.flex.flex-column.p-2.m-0
        .col.flex
          .icon-box-info.icon.bg-primary.mr-2
          span.font-bold.text-700 Note Items Detail
        .col
          span.p-2.table__status.table__status--available New
        .col
          span.font-bold Note ID: ST2222
        .col.border-bottom-1.border-gray-300
      div.sub--scroll
        .grid.stock--info.p-2.m-0
          .col-12.flex
            .col.flex.align-items-center
              .icon-sender-info.icon.bg-primary.mr-2
              span.font-bold.text-800.uppercase ID Information
          .col-12
            StockUnit.m-0(title="Create Time "  value="N/A" icon="icon-receipt-note")
          .col-12
            StockUnit.m-0(title="Creator ID " :value="user.staffId"  icon="icon-tag-user")
          .col-12
            StockUnit.m-0(title="Warehouse"  :value="user.warehouse.name" icon="icon-warehouse")
          .col-12
            StockUnit.m-0(title="Items"  :value="listStockSelected.length" icon="icon-frame")
          .col.border-bottom-1.border-gray-300
        .grid.stock--contact.p-2.m-0
          .col-12.flex
            .col.flex.align-items-center
              .icon-sender-info.icon.bg-primary.mr-2
              span.font-bold.text-800.uppercase Seller Information
          .col-12
            StockUnit.m-0(title="Name" :value="stockDetail" icon="icon-sender-name")
          .col-12
            StockUnit.m-0(title="Email" :value="stockDetail" icon="icon-sender-email")
          .col-12
            StockUnit.m-0(title="Phone" :value="stockDetail" icon="icon-sender-phone")
    div.flex-1( class=' col-12  md:col-12  lg:col-7 xl:col-9' )
      .stock-take.flex.flex-column
        .stock-take__header
          div
            h1.text-heading Stock-take Note
            span.text-subheading {{ totalItem }} total
          .stock-take__header--action.flex
            Button.btn.btn-primary.border-0(@click='handleAddItems') Add Item
            Button.btn.btn-primary.border-0(@click='handleSubmit' :disabled='isDisabledSubmit') Save
        .stock-take__content
          DataTable(
            :value='dataRenderItems'
            dataKey='id'
            :rows='20'
            responsiveLayout="scroll"
            :resizableColumns="true"
            :class="{ 'table-wrapper-empty': !listStockSelected || listStockSelected.length <= 0 }"
            :selection="selectedStock"
            @row-select-all="rowSelectAll"
            @row-unselect-all="rowUnSelectAll"
            @row-select="rowSelect"
            @row-unselect="rowUnselect"
          )
            Column(selectionMode="multiple" :styles="{width: '3rem'}")
            Column(field='no' header='NO' :styles="{'width': '3rem'}")
              template(#body='slotProps') {{ pagination.pageSize * pagination.pageNumber + slotProps.index + 1 }}
            Column(field='stock.barCode' header='Barcode' :sortable="true")
              template(#body='{ data }')
                span.text-white-active.text-900.font-bold {{ data.stock.barCode }}
            Column(field='stock.name' header='ITEM NAME' :sortable='true')
            Column(field='box.id' header='BOX CODE' :sortable='true')
            Column(field="box.rackLocation.name" header="LOCATION" :sortable="true" className="text-right")
              template(#body="{data}")
                div(v-if="data.box.rackLocation")
                  .flex.align-items-center.cursor-pointer.justify-content-end
                    span.text-primary.font-bold.font-sm.text-white-active {{ data.box.rackLocation.name }}
                    .icon.icon-arrow-up-right.bg-primary.bg-white-active
            Column(:exportable="false" header="ACTION" className="text-right")
              template(#body="{data}")
                .table__action
                  span.action-item(:class="{'disable-button': selectedStock.length > 0}" @click="showModalDelete([data])")
                    .icon.icon-btn-delete
            template(#footer)
              Pagination(
                type="stocks selected"
                :paging="pagination"
                :total="totalItem"
                :deleted-list="selectedStock"
                @onDelete="showModalDelete"
                @onPage="onPage"
              )
            template(#empty)
              div.flex.align-items-center.justify-content-center.flex-column
                img(:srcset="`${require('~/assets/images/table-empty.png')} 2x`" )
                p.text-900.font-bold.mt-3 List is empty!, Click
                  span.text-primary.underline.cursor-pointer(@click='handleAddItems') &nbsp;here
                  span &nbsp;to add item.
    ItemListModel(
      :isShow="isModalAddItem"
      @hideDialog='hideDialog($event)',
      @onApply='handleApplyAddItem($event)',
      :itemSelected='listStockSelected'
    )
    ConfirmDialogCustom(
      title="Confirm delete"
      image="confirm-delete"
      :isShow="isModalDelete"
      :onOk="handleDeleteStock"
      :onCancel="handleCancel"
    )
      template(v-slot:message)
        p {{ deleteMessage }}
</template>

<script lang="ts">
import { Component, namespace, Vue } from 'nuxt-property-decorator'
import Pagination from '~/components/common/Pagination.vue'
import { getDeleteMessage } from '~/utils'
import ItemListModel from '~/components/stock-take/ItemListModel.vue'
import ConfirmDialogCustom from '~/components/dialog/ConfirmDialog.vue'
import { User } from '~/models/User'
const nsStoreCreateStockTake = namespace('stock-take/create-stock-take')
const nsStoreUser = namespace('user-auth/store-user')

@Component({
  components: {
    Pagination,
    ItemListModel,
    ConfirmDialogCustom
  }
})
class StockTakeItems extends Vue {
  listStockSelected = []
  isModalAddItem: boolean = false
  disabledApply = true
  stockDetail = 'namlcp'
  isModalDelete: boolean = false
  onEventDeleteList: any = []
  selectedStock: any = []
  pagination: any = {
    first: 0,
    pageNumber: 0,
    pageCount: 1,
    pageSize: 20
  }

  @nsStoreUser.State
  user: User.Model | undefined

  @nsStoreCreateStockTake.State
  stockTakeCreated!: any

  @nsStoreCreateStockTake.Action
  actCreateStockTake!: (params?: any) => Promise<void>

  handleAddItems() {
    this.isModalAddItem = true
  }

  async handleSubmit(){
    const data = {
      note: 'mac',
      checkType: 'ITEM',
      stockBoxList: _.map(this.listStockSelected, ({ id }) => ({ id }))
    }
    await this.actCreateStockTake(data)
    if(this.stockTakeCreated.id){
      this.$toast.add({
        severity: 'success',
        summary: 'Success Message',
        detail: 'Successfully create stock take',
        life: 3000
      })
    }
  }

  onPage(event: any) {
    this.pagination.pageSize = event.rows
    this.pagination.pageNumber = event.page
  }

  get homeItem() {
    return { label: 'D/O List', to: '/stock-out/order-list' }
  }

  get breadcrumbItem() {
    return [
      { label: 'stock',
        to: `/stock-out/order/${this.$route.params.id}/stock` },
      { label: 'Information',
        to: `/stock-out/order/${this.$route.params.id}/stock/${this.$route.params.sid}`
      }
    ]
  }

  get totalItem() {
    return _.size(this.listStockSelected)
  }

  handleApplyAddItem(selectedStock){
    this.listStockSelected = _.cloneDeep(selectedStock)
    this.isModalAddItem = false
  }

  hideDialog(isShowModal: boolean){
    this.isModalAddItem = isShowModal
  }

  showModalDelete(data) {
    this.onEventDeleteList = data || this.selectedStock
    this.isModalDelete = true
  }

  handleDeleteStock() {
    this.listStockSelected = _.filter(
      this.listStockSelected, ({ id }) => {
        return !_.find(this.onEventDeleteList, { id })
      }
    )
    this.selectedStock = []
    this.isModalDelete = false
    this.pagination.first = 0
    this.pagination.pageNumber = 0
    
  }

  handleCancel() {
    this.isModalDelete = false
  }

  rowSelectAll({ data }) {
    this.selectedStock = _.unionWith(this.selectedStock, data, _.isEqual)
  }

  rowUnSelectAll() {
    this.selectedStock = _.differenceWith(this.selectedStock, this.dataRenderItems, _.isEqual)
  }

  rowSelect({ data }) {
    this.selectedStock.push(data)
  }

  rowUnselect({ originalEvent, data }) {    
    originalEvent.originalEvent.stopPropagation()
    this.selectedStock = _.filter(this.selectedStock, (box: any) => box.id !== data.id)
  }

  get deleteMessage() {
    return getDeleteMessage(this.onEventDeleteList, 'box')
  }

  get dataRenderItems() {
    const lastIndex = this.pagination.first + this.pagination.pageSize
    return this.listStockSelected.filter(
      (_, index) => index >= this.pagination.first && index < lastIndex
    )
  }
  
  get isDisabledSubmit() {
    return _.size(this.listStockSelected) > 0 ? null : 'disabled'
  }
}

export default StockTakeItems
</script>
<style lang="sass" scoped>
.stock
  @include tablet
    margin: 50px
  ::v-deep.sub-tab
    height: calc(100vh - 150px)
    overflow: hidden
    display: flex
    flex-direction: column
    @include desktop
      height: calc(100vh - 32px)
      max-width: 23rem
      overflow: hidden
    .sub--scroll
      display: flex
      align-items: center
      flex-direction: column
      flex: 1
      overflow: auto
      @include desktop
        overflow: auto
      @include tablet
        flex-direction: row
        justify-content: center
        align-items: baseline
        overflow: hidden

::-webkit-input-placeholder
  font-weight: normal

::-webkit-scrollbar
  width: 7px
  height: 7px
  background-color: #F5F5F5

::-webkit-scrollbar-track
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3)
  border-radius: 10px
  background-color: #F5F5F5

::-webkit-scrollbar-thumb
  border-radius: 10px
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3)
  background-color: #979AA4

.wrap-unit
  width: 300px
  margin-bottom: 16px

::v-deep.stock-take
  min-height: calc(100vh - 32px)
  margin-top: 3rem
  @include desktop
    margin-top: 0px
    margin-left: 2rem
    height: calc(100vh - 32px)
  &__header
    flex-direction: column
    flex-wrap: wrap
    margin-bottom: 16px
    @include desktop
      flex-direction: row
      @include flex-center-space-between
    &--action
      margin-top: 12px
      display: flex
      @include flex-column
      flex-wrap:  wrap
      gap: 10px 16px
      @include desktop
        @include flex-center
        flex-direction: row
        margin-top: 0
  &__filter
    margin-bottom: $space-size-24
  &__content
    flex: 1
    border-radius: 4px
    position: relative
    overflow: hidden
  .text-right
    text-align: right !important
    .p-column-header-content
      justify-content: end !important
    .table__action
      float: right
  .disable-button
    pointer-events: none
    background-color: $text-color-300
    .icon
      background-color: $text-color-500
  .pi-calendar:before
    content: url('~/assets/icons/calendar.svg')
  .p-calendar-w-btn
    .p-button
      background: none
      border: none
</style>
