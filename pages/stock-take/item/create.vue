<template lang="pug">
  .grid.flex.grid-nogutter.stock
    NoteInfo(:noteInfor="noteInfor" :homeItem="homeItem" :breadcrumbItem="breadcrumbItem")
    div.flex-1( class=' col-12  md:col-12  lg:col-7 xl:col-9' )
      .stock-takeItem.flex.flex-column
        .stock-takeItem__header
          div
            h1.text-heading Stock-take Note
            span.text-subheading {{ totalItem }} total
          .stock-takeItem__header--action.flex
            Button.btn.btn-primary.border-0(@click='handleAddItems') Add Item
            Button.btn.btn-primary.border-0(@click='handleSubmit' :disabled='isDisabledSubmit') Save
        .stock-takeItem__content
          DataTable(
            :value='listStockSelected'
            dataKey='id'
            responsiveLayout="scroll"
            :resizableColumns="true"
            :class="{ 'table-wrapper-empty': !listStockSelected || listStockSelected.length <= 0 }"
            :selection.sync="selectedStock"
            :paginator="false"
          )
            Column(selectionMode="multiple" :styles="{width: '3rem'}")
            Column(field='no' header='NO' :styles="{'width': '3rem'}")
              template(#body='slotProps') {{ slotProps.index + 1 }}
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
              .grid.grid-nogutter.stock-takeItem__footer
                .col-fixed.stock-takeItem__delete
                  .pagination__delete(@click="showModalDelete()" v-if='selectedStock.length')
                    .icon.icon-btn-delete
                    span Delete {{ selectedStock.length }} items selected
                .col-9.stock-takeItem__note
                  div(style="padding-left: 10.5px") Note:
                  InputText.inputSearchCode.w-full(v-model="noteText" rows="1" cols="40" placeholder='Write something...')
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
import { getDeleteMessage } from '~/utils'
import ItemListModel from '~/components/stock-take/ItemListModel.vue'
import ConfirmDialogCustom from '~/components/dialog/ConfirmDialog.vue'
import NoteInfo from '~/components/stock-take/item-list/NoteInfo.vue'
const nsStoreCreateStockTake = namespace('stock-take/create-stock-take')
const nsStoreUser = namespace('user-auth/store-user')

@Component({
  components: {
    ItemListModel,
    ConfirmDialogCustom,
    NoteInfo
  }
})
class StockTakeItems extends Vue {
  listStockSelected = []
  isModalAddItem: boolean = false
  disabledApply = true
  isModalDelete: boolean = false
  onEventDeleteList: any = []
  selectedStock: any = []
  noteText: string = ''

  @nsStoreUser.State
  user: any | undefined

  @nsStoreCreateStockTake.State
  stockTakeCreated!: any

  @nsStoreCreateStockTake.Action
  actCreateStockTake!: (params?: any) => Promise<any>
  
  get homeItem() {
    return { label: 'Note list', to: '/stock-take' }
  }

  get breadcrumbItem() {
    return [
      { label: 'Add new note', to: '/stock-take/item' }
    ]
  }

  get totalItem() {
    return _.size(this.listStockSelected)
  }

  get deleteMessage() {
    return getDeleteMessage(this.onEventDeleteList, 'box')
  }
  
  get isDisabledSubmit() {
    return _.size(this.listStockSelected) > 0 ? null : 'disabled'
  }

  get sellerInfo() {
    const firstStock: any = this.listStockSelected[0]
    if(firstStock) {
      const stockSame = _.partition(this.listStockSelected, ({ sellerEmail }) => sellerEmail === firstStock.sellerEmail)[0]
      if(_.size(stockSame) === this.totalItem) {
        return firstStock
      }
    }
    return { sellerName: 'N/A', sellerEmail: 'N/A', sellerPhone: 'N/A' }
  }
  
  get noteInfor() {
    return {
      status: 'NEW',
      creator: {
        createdAt: this.user?.createdAt,
        creatorID: this.user.staffId,
        warehouse: this.user?.warehouse?.name
      },
      totalItem: this.totalItem,
      seller: this.sellerInfo
    }
  }

  handleAddItems() {
    this.isModalAddItem = true
  }

  async handleSubmit(){
    const data = {
      note: this.noteText,
      checkType: 'ITEM',
      stockTakeItem: _.map(this.listStockSelected, ({ id }) => ({ stockBoxId: id }))
    }
    const result = await this.actCreateStockTake(data)
    if(result) {
      if(result?.id) {
        this.$toast.add({
          severity: 'success',
          summary: 'Success Message',
          detail: 'Successfully create stock take',
          life: 3000
        })
      }
    }
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
  }

  handleCancel() {
    this.isModalDelete = false
  }
}

export default StockTakeItems
</script>
<style lang="sass" scoped>
.stock
  @include tablet
    // margin: 50px
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

::v-deep.stock-takeItem
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
  &__note
    border-left: 1px solid var(--gray-300)!important
  &__footer
    background: $color-white
    display: flex
    justify-content: space-between
    padding: 6px 8px
    align-items: center
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
