<template lang="pug">
.grid
  div(class="bg-white sub__tab col-12 lg:col-3")
    Breadcrumb(:home="homeItem" :model="breadcrumbItem")
    div.sub__tab--scroll
      StockOutLabelCreate
  div(class="lg:pl-5 pl-0 lg:mt-0 mt-4 col-12 lg:col-9")
    .grid.grid-nogutter.h-full.flex.flex-column
      .col-12.justify-content-between.flex
        div
          h1.text-heading Item list
          span.text-subheading {{ listItemsAddSize }} product found
        div
          .btn.btn-primary(@click='createStockOut')
            .icon.icon-add-items.surface-900.bg-white
            span.text-900.text-white.mr-3 Add Items For Delivery
      .col-12.flex-1
        DataTable.w-full.flex.flex-column.table__sort-icon.bg-white(
          :resizableColumns='true',
          :value='listItemsAdd',
          dataKey='id',
          :row-hover='true',
          responsiveLayout='scroll',
          :scrollable="false"
        )
          template(#empty)
            .flex.align-items-center.justify-content-center.flex-column
              img(:srcset='`${require("~/assets/images/table-empty.png")} 2x`')
              p.text-900.font-bold.mt-3 List is empty!
          column(field='no', header='NO')
            template(#body='slotProps')
              span.font-bold {{ slotProps.index + 1 }}
          column(field='image' header='IMAGE' :sortable='true' )
            template(#body='{data}')
              .stock__table__image.overflow-hidden
                img.h-2rem.w-2rem.border-round(
                  :src="data.stock.imagePath | getThumbnailUrl" alt='' width='100%' style='object-fit: cover;')
          column(field='barCode' header='BARCODE' :sortable='true' )
            template(#body='{data}')
              span.text-primary {{ data.stock.barCode }}
          column(field='sku', header='SKU', sortable='', data-type='numeric')
            template(#body='{ data }')
              span.uppercase {{ data.sku }}
          column(field='stock.name', header='STOCK NAME', :sortable='true')
            template(#body='{ data }')
              span.font-bold.text-right {{ data.stock.name }}
          column(field='box.id', header='BOXCODE', :sortable='true')
            template(#body='{ data }')
              span.font-bold.text-right {{ data.box.id }}
          column(field='amount' header='INVENTORY QUANTITY' bodyClass='text-bold' :sortable='true' className="text-right" )
          column(field='delivery' header='DELIVERY QUANTITY' bodyClass='text-bold' :sortable='true' className="text-right" )
            template(#body='{data}')
              span(v-if='isActive !== data.id ') {{ data.delivery }}
              InputNumber(
              v-model="data.delivery"
              mode="decimal"
              :min="1"
              :max="data.amount"
              inputClass="w-full"
              v-else ).w-7rem
          column(field='tag', header='TAG', headerClass='grid-header-center')
            template(#body='{ data }')
              .grid-cell-center
                Checkbox(v-model='data.hasAirtag', :binary='true' )
          column(
            :exportable='false',
            header='ACTION',
          )
            template(#body='{ data}')
              .table__action(v-if='isActive !== data.id')
                  Button.btn-action(
                    @click='editItem(data)'
                  )
                    .icon--small.icon-btn-edit
                  Button.btn-action(
                    @click='showModalDelete( [data] )',
                  )
                    .icon--small.icon-btn-delete
              .table__action(v-else)
                Button.btn-action(
                  @click='saveEditItem()'
                )
                  .icon--small.pi.pi-check.text-primary
                Button.btn-action(
                  @click='handleCancelEdit( data )'
                )
                  .icon--small.pi.pi-times.text-primary
          template( #footer  )
            .mr-4.flex.justify-content-end( v-if="listItemsAddSize > 0" )
              Button( label='Cancel' @click='showModalCancel' ).btn.btn__default.flex-initial
              Button( label='Submit' @click='handleSubmit' ).btn.btn__priamry.flex-initial
            .grid.grid-nogutter.ml-3( v-else )
              .flex.align-items-center.justify-content-center.pl-3
                img(src='~/assets/icons/note.svg')
              div.ml-4
                span.font-semibold.text-base.mr-1 Note:
                br
                InputText.pt-0.pl-0(
                  placeholder='Write something...',
                  style='border: none'
                  v-model='noteBox'
                )
      ConfirmDialogCustom(
        title="Confirm delete"
        image="confirm-delete"
        :isShow="isModalDelete"
        :onOk="handleDelete"
        :onCancel="handleCancelDelete"
        :loading="loadingSubmit"
      )
        template(v-slot:message)
          p  {{ deleteMessage }}

      ConfirmDialogCustom(
        title="Confirm Cancel"
        image="confirm-delete"
        :isShow="isModalCancel"
        :onOk="handleCancel"
        :onCancel="handleModalCancel"
        :loading="loadingSubmit"
      )
        template(v-slot:message)
          p  Are You Want Cancel Order
    Toast
</template>

<script lang="ts">
import { Component, namespace, Vue } from 'nuxt-property-decorator'
import { getDeleteMessage, INFORMATION } from '~/utils'
import ConfirmDialogCustom from '~/components/dialog/ConfirmDialog.vue'
const nsStoreCreateOrder = namespace('stock-out/create-order')

@Component({
  components: { ConfirmDialogCustom }

})
class createOrder extends Vue {
  listItemsAdd: any = []
  isActive: string = ''
  delivery: string = ''
  noteBox: any = null
  infomation = INFORMATION
  oldItem: any = null
  isModalDelete: boolean = false
  isModalCancel : boolean = false
  loadingSubmit: boolean = false
  onEventDeleteList: any = []
  valueDelete: any

  @nsStoreCreateOrder.State
  listInfor:any

  @nsStoreCreateOrder.State
  outGoingListStore:any

  @nsStoreCreateOrder.Action
  actGetCreateOrder!: (obj: any) => Promise<void>

  @nsStoreCreateOrder.Action
  actOutGoingList!: (obj: any) => Promise<void>

  @nsStoreCreateOrder.Action
  actDeliveryOrder!: (params: any) => Promise<void>

  mounted() {
    this.listItemsAdd = this.outGoingListStore.map((x: any) => (
      { ..._.cloneDeep(x), hasAirtag: false }))
    if(this.listItemsAdd.length > 0){
      this.disableInput(true)
    }else if (!this.infomation.seller[0].value ){
      this.disableInput(false)
    }
  }

  createStockOut() {
    const note = this.noteBox
    const listInfoAdd = { ...this.infomation , note }
    this.$router.push('/stock-out/order/add-items')
    this.actGetCreateOrder(
      _.cloneDeep(listInfoAdd)
    )
  }

  editItem(data: any  ) {
    this.isActive = data.id
    this.oldItem = _.cloneDeep(data)
  }

  handleCancelDelete() {
    this.isModalDelete = false
  }

  handleModalCancel() {
    this.isModalCancel = false
  }

  showModalDelete(data?: any ) {
    _.forEach(data, (obj)=> {
      this.onEventDeleteList = [obj.stock]
    })
    this.valueDelete = data
    this.isModalDelete = true
  }

  showModalCancel() {
    this.isModalCancel = true
  }

  async saveEditItem() {
    await this.actOutGoingList(
      _.cloneDeep(this.listItemsAdd))
    this.isActive = ''
  }

  async handleDelete() {
    const b = this.valueDelete[0]
    _.remove(this.listItemsAdd, ({ id }) => id === b.id)
    const result : any =  await this.actOutGoingList(
      _.cloneDeep(this.listItemsAdd))
    if( result ) {
      this.isModalDelete = false
      this.$toast.add({
        severity: 'success',
        summary: 'Success Message',
        detail: 'Successfully deleted stock',
        life: 3000
      })
    }
    if(this.listItemsAdd.length === 0) this.disableInput(false)
  }

  async handleSubmit(){
    const listReceiver = this.listInfor.receiver
    const deliveryItemList: any = []
    _.forEach(this.listItemsAdd, ({ id, delivery, hasAirtag }) =>{
      deliveryItemList.push({
        stockBox:{
          id
        },
        amount: delivery,
        hasAirtag
      })
    })
    const result : any = await this.actDeliveryOrder({
      seller: {
        id: this.infomation.seller[0].id
      },
      receiverAddress: listReceiver[0].value,
      receiverEmail: listReceiver[1].value,
      receiverName: listReceiver[2].value,
      receiverPhone: listReceiver[3].value,
      dueDeliveryDate: null,
      estimatedDeliveryTime: null,
      warehouse: {
        id: this.listInfor.warehouse[0].warehouseId
      },
      deliveryItemList
    })
    if( result ) {
      this.$toast.add({
        severity: 'success',
        summary: 'Success Message',
        detail: 'Successfully Add New Order ',
        life: 3000
      })
      await this.handleCancel()
    } else {
      this.$toast.add({
        severity: 'error',
        summary: 'Error Message',
        detail: 'Error Add New Order',
        life: 3000
      })
    }
  }

  handleCancelEdit (data : any ) {
    data.delivery = this.oldItem.delivery
    this.isActive = ''
  }

  async handleCancel() {
    const emptyList =  this.listItemsAdd = []
    await this.actGetCreateOrder(_.cloneDeep(emptyList))
    await this.actOutGoingList(_.cloneDeep(emptyList))
    _.forEach(this.infomation, function(item){
      _.forEach(item, function(i) {
        i.value = null
      })
    })
    await this.$router.push({ path: '/stock-out/order-list' })
  }

  disableInput(isDisable: boolean) {
    _.forEach(this.infomation, function(obj){
      _.forEach(obj, function(o){
        if(_.has(o, 'disabled')) {
          _.set(o, 'disabled' , isDisable)
        }
      })
    })
  }

  get listItemsAddSize() {
    return this.listItemsAdd.length || 0
  }

  get deleteMessage() {
    return getDeleteMessage(this.onEventDeleteList, 'item')
  }

  get homeItem() {
    return { to: '/stock-out/order-list', icon: 'pi pi-list' }
  }

  get breadcrumbItem() {
    return [
      {
        label: 'Add new order',
        to: '/stock-out/create-order',
        icon: 'pi pi-info-circle'
      }
    ]
  }

}

export default createOrder
</script>

<style lang="sass" scoped>
.sub__tab
  overflow: auto
  @include desktop 
    height: 100%
    max-width: 20rem
    border-radius: var(--border-radius)
.sub__tab--scroll
  background-color: #ffffff
  @include desktop 
    height: calc(100vh - 110px)
    overflow: auto
.btn-action
  border: none
  padding: 0
  height: 2rem
  width: 2rem
  justify-content: center
  background: var(--surface-200)
::v-deep.p-datatable
  .p-datatable-footer
    box-shadow: 0px 10px 45px rgba(0, 10, 24, 0.1)
    background-color: #ffffff
    border: none
    padding: 15px 0px
    width: 100%
  .btn
    border: none
    padding: 0px 25px
    margin: 5px 10px 0px
    &__priamry
      background-color: $primary
      font-weight: 700
    &__default
      background-color: var(--surface-200)
      color: $text-color-900
      font-weight: 700

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
</style>
