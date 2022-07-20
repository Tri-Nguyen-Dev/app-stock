<template lang="pug">
  .grid.flex.grid-nogutter.stock
    NoteInfo(:noteInfor="noteInfor" :homeItem="homeItem" :breadcrumbItem="breadcrumbItem")
    div.flex-1( class=' col-12  md:col-12  lg:col-7 xl:col-9' )
      .stock-takeItem.flex.flex-column
        .stock-takeItem__header
          div
            h1.text-heading Stock-take Note
            span.text-subheading All ({{ totalItem }})
          .stock-takeItem__header--action.flex
            Button.btn.btn-primary.border-0(@click='handleAddItems') Add Item
            Button.btn.btn-primary.border-0(@click='handleSubmit' :disabled='isDisabledSubmit') Save
        .stock-takeItem__content
          DataTable.m-h-700(
            :value='listStockSelected'
            dataKey='id'
            responsiveLayout="scroll"
            :resizableColumns="true"
            :class="{ 'table-wrapper-empty': !listStockSelected || listStockSelected.length <= 0 }"
            :paginator="false"
          )
            Column(field='no' header='NO' :styles="{'width': '3rem'}" bodyClass='font-semibold')
              template(#body='slotProps') {{ slotProps.index + 1 }}
            Column(field='stock.barCode' header='Barcode' :sortable="true" bodyClass='font-semibold')
            Column(field='stock.name' header='ITEM NAME' :sortable='true')
            Column(field='box.id' header='BOX CODE' :sortable='true' bodyClass='font-semibold')
            Column(field="box.rackLocation.name" header="LOCATION" className="text-right")
              template(#body="{data}")
                div(v-if="data.box.rackLocation")
                  .flex.align-items-center.cursor-pointer.justify-content-end
                    span.text-primary.font-bold.font-sm.text-white-active {{ data.box.rackLocation.name }}
                    .icon.icon-arrow-up-right.bg-primary.bg-white-active
            Column(:exportable="false" header="ACTION" className="text-right")
              template(#body="{data}")
                .table__action
                  span.action-item(@click="handleDeleteStock(data)")
                    .icon.icon-btn-delete
            template(#footer)
              .grid.grid-nogutter.stock-takeItem__footer
                .col.stock-takeItem__note
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
</template>

<script lang="ts">
import { Component, namespace, Vue } from 'nuxt-property-decorator'
import ItemListModel from '~/components/stock-take/ItemListModel.vue'
import NoteInfo from '~/components/stock-take/item-list/NoteInfo.vue'
const nsStoreCreateStockTake = namespace('stock-take/create-stock-take')
const nsStoreUser = namespace('user-auth/store-user')

@Component({
  components: {
    ItemListModel,
    NoteInfo
  }
})
class StockTakeItems extends Vue {
  listStockSelected = []
  isModalAddItem: boolean = false
  disabledApply = true
  isModalDelete: boolean = false
  selectedStock: any = []
  noteText: string = ''

  @nsStoreUser.State
  user: any | undefined

  @nsStoreCreateStockTake.State
  stockTakeCreated!: any

  @nsStoreCreateStockTake.Action
  actCreateStockTake!: (params?: any) => Promise<any>

  get homeItem() {
    return { to: '/stock-take', icon: 'pi pi-list' }
  }

  get breadcrumbItem() {
    return [
      { label: 'Stock-take Note', to: '/stock-take/item/create' }
    ]
  }

  get totalItem() {
    return _.size(this.listStockSelected)
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
  }

  get noteInfor() {
    return {
      status: 'NEW',
      creatorInfo: [
        { title:'Creator ID', value: this.user.staffId, icon: 'icon-tag-user' },
        { 
          title:'Warehouse', 
          value: _.get(this.listStockSelected[0], 'box.request.warehouse.name', null), 
          icon: 'icon-warehouse',
          link: _.get(this.listStockSelected[0], 'box.request.warehouse.id', null)
        },
        { title:'Items', value: this.totalItem || '0', icon: 'icon-frame' }
      ],
      sellerInfo: [
        { title:'Name', value: this.sellerInfo?.sellerName, icon: 'icon-sender-name' },
        { title:'Email', value: this.sellerInfo?.sellerEmail, icon: 'icon-sender-email' },
        { title:'Phone', value: this.sellerInfo?.sellerPhone, icon: 'icon-sender-phone' }
      ]
    }
  }

  handleAddItems() {
    this.isModalAddItem = true
  }

  async handleSubmit(){
    const data = {
      note: this.noteText,
      checkType: 'ITEM',
      stockTakeItem: _.map(this.listStockSelected, ({ id }) => ({ stockBoxId: id })),
      warehouse: { id: _.get(this.listStockSelected[0], 'box.request.warehouse.id', null) }
    }
    const result = await this.actCreateStockTake(data)
    if(result?.id) {
      this.$router.push(`/stock-take/item/${result.id}/note-detail`)
      this.$toast.add({
        severity: 'success',
        summary: 'Success Message',
        detail: 'Successfully create stock take',
        life: 3000
      })
    }
  }

  handleApplyAddItem(selectedStock){
    this.listStockSelected = _.cloneDeep(selectedStock)
    this.isModalAddItem = false
  }

  hideDialog(isShowModal: boolean){
    this.isModalAddItem = isShowModal
  }

  handleDeleteStock(data) {
    this.listStockSelected = _.filter(
      this.listStockSelected, ({ id }) => {
        return id !== data.id
      }
    )
  }

  handleCancel() {
    this.isModalDelete = false
  }
}

export default StockTakeItems
</script>
<style lang="sass" scoped>
.stock
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
