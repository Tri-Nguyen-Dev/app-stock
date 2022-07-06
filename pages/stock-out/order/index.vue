<template lang="pug">
  .grid.flex.grid-nogutter.order
    div.sub__tab(class="col-12 md:col-12 lg:col-3 xl:col-3 ")
      Breadcrumb(:home="homeItem" :model="breadcrumbItem")
      div.sub__tab--scroll
        .border-top-1.border-gray-300.grid-nogutter
          .col.p-4.border-tab
            .grid.grid-nogutter.align-items-center.mb-4
              .icon.bg-primary.surface-900.mr-3.icon-warehouse-info
              span.uppercase.text-800.font-bold warehouse contact
            div
              StockOutItemInput(
                :listInfor='information.warehouse'
                @fieldWarehouse='handleWarehouse'
              )
              .input-errors(
                v-if='$v.information.warehouse.$each[0].value.$dirty && $v.information.warehouse.$each[0].value.$invalid '
                )
                .error-message *Please, select name in the correct Warehouse Information
          .border-top-1.border-gray-300.grid-nogutter
          .col.p-4
            .grid.grid-nogutter.align-items-center.mb-4
              .icon.bg-primary.surface-900.mr-3.icon-sender-info
              span.uppercase.text-800.font-bold seller information
            div
              StockOutItemInput(
                :listInfor='information.seller'
                @sellerInfor='handleSeller'
                @paramSeller='paramSeller'
                @clearSeller='clearSeller'
                :sellerList='sellerList'
              )
              .input-errors(
                v-if=' $v.information.seller.$each[0].value.$invalid && $v.information.seller.$each[0].value.$dirty'
                )
                .error-message *Seller not found, please select seller email
          .border-top-1.border-gray-300.grid-nogutter
          .col.p-4
            .grid.grid-nogutter.align-items-center.mb-4
              .icon.bg-primary.surface-900.mr-3.icon-receive-square
              span.uppercase.text-800.font-bold receiver information
            div
              StockOutItemInput(
                :listInfor='information.receiver'
                @fieldReceiver='handleReceiver'
              )
              .input-errors(
                v-if='$v.information.receiver.$each[0].$model.value === null && $v.information.receiver.$each[3].$model.value === null '
              )
                .error-message {{errorMessage.errorAddress}} Receiver Information
              .input-errors(
                v-else-if='$v.information.receiver.$each[0].value.$dirty && $v.information.receiver.$each[0].value.$invalid'
                )
                .error-message *Please, fill in Address filed
              .input-errors(
                v-else-if='$v.information.receiver.$each[3].value.$dirty && $v.information.receiver.$each[3].value.$invalid'
                )
                .error-message *Please, fill in Phone filed

          .border-top-1.border-gray-300.grid-nogutter
          .col.p-4
            .grid.grid-nogutter.align-items-center.mb-4
              .icon.bg-primary.surface-900.mr-3.icon-calendar-infor
              span.uppercase.text-800.font-bold time information
            div
              StockUnit(
                title="Estimated delivery Time"
                icon="icon-clock"
                :value='estimatedDate || "Estimated delivery Time" '
              )
              StockUnit.mt-2(
                title="Due delivery date"
                icon="icon-calendar"
                :value=' deliveryDate || "DUE DATE TIME" '
                placeholder="Enter"
              )
          .border-top-1.border-gray-300.grid-nogutter
          .col.p-4
            .grid.grid-nogutter.align-items-center.mb-4
              .icon.bg-primary.surface-900.mr-3.icon-profile-circle
              span.uppercase.text-800.font-bold creator information
            div
              StockOutItemInput( :listInfor='information.creator')
    .inventory.flex.flex-column.flex-1(class="lg:col-7 md:col-12 ")
      .inventory__header
        div
          h1.text-heading Item list
          span.text-subheading {{ listItemsAddSize }} product found
        .inventory__header--action.flex
          .btn.btn-primary(@click='createStockOut')
            .icon.icon-add-items.surface-900.bg-white
            span.text-900.text-white.mr-3 Add Items For Delivery
      .inventory__content
        DataTable.m-h-700(
          :resizableColumns='true',
          :value='listItemsAdd',
          dataKey='id',
          :row-hover='true',
          responsiveLayout='scroll',
          :scrollable="false"
          :class="{ 'table-wrapper-empty': !listItemsAdd || listItemsAdd.length <= 0 }"
        )
          template(#empty)
            .flex.align-items-center.justify-content-center.flex-column
              img(:srcset='`${require("~/assets/images/table-empty.png")} 2x`')
              p.text-900.font-bold.mt-3 List is empty!, Click
                span.text-primary.underline.cursor-pointer(@click='createStockOut') &nbsp;here
                span &nbsp;to add item.
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
              :value='data.delivery'
              mode="decimal"
              :min="0"
              inputClass="w-full"
              v-else
              @input='deliveryChange($event, data)'
              :class='data.amount < data.delivery && "p-invalid"').w-7rem
          column(field='tag', header='TAG', headerClass='grid-header-center')
            template(#body='{ data }')
              .grid-cell-center
                Checkbox(v-model='data.hasAirtag', :binary='true' )
          column(
            :exportable='false',
            header='ACTION',
          )
            template(#body='{ data}')
              .table__action(v-if='isActive !== data.id' :class="{'action-disabled': (data.id !== isActive)}")
                  Button.btn-action(
                    @click='editItem(data)'
                    :disabled="data.id !== isActive && isActive !==''"
                  )
                    .icon--small.icon-btn-edit
                  Button.btn-action(
                    @click='showModalDelete( [data] )'
                    :disabled="data.id !== isActive && isActive !==''"
                  )
                    .icon--small.icon-btn-delete
              .table__action(v-else)
                Button.btn-action( :disabled="isDisableSubmit"

                  @click='saveEditItem( data )'
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
</template>

<script lang="ts">
import { Component, namespace, Vue } from 'nuxt-property-decorator'
import { required } from 'vuelidate/lib/validators'
import dayjs from 'dayjs'
import { getDeleteMessage, INFORMATION } from '~/utils'
import ConfirmDialogCustom from '~/components/dialog/ConfirmDialog.vue'
const nsStoreCreateOrder = namespace('stock-out/create-order')
const nsStoreWarehouse = namespace('warehouse/warehouse-list')
const nsStoreSeller = namespace('seller/seller-list')
const nsStoreUserDetail = namespace('user-auth/store-user')

@Component({
  components: { ConfirmDialogCustom },
  validations: {
    information: {
      seller:{
        $each: {
          value: { required }
        }
      },
      warehouse:{
        $each: {
          value: { required }
        }
      },
      receiver:{
        $each: {
          value: { required }
        }
      }
    }
  }
})

class createOrder extends Vue {
  listItemsAdd: any = []
  isActive: string = ''
  delivery: string = ''
  noteBox: any = null
  oldItem: any = null
  isModalDelete: boolean = false
  isModalCancel : boolean = false
  loadingSubmit: boolean = false
  onEventDeleteList: any = []
  valueDelete: any
  deliveryDate: string | any = ''
  estimatedDate: string | any = ''
  information = INFORMATION
  isDisableSubmit: boolean = false
  errorMessage: any = {
    errorPhone  :'*Please, fill in phone in the correct',
    errorName : '*Please, fill in name in the correct',
    errorEmail : '*Please, fill in email in the correct',
    errorAddress : '*Please, fill in email in the correct'
  }

  // -- [ State ] ------------------------------------------------------------
  @nsStoreCreateOrder.State
  listInfo:any

  @nsStoreCreateOrder.State
  outGoingListStore:any

  @nsStoreUserDetail.State
  user!: any

  @nsStoreSeller.State
  sellerList!: any

  @nsStoreCreateOrder.State
  estimate!: any

  // -- [ Action ] ------------------------------------------------------------

  @nsStoreCreateOrder.Action
  actGetCreateOrder!: (obj: any) => Promise<void>

  @nsStoreCreateOrder.Action
  actOutGoingList!: (obj: any) => Promise<void>

  @nsStoreCreateOrder.Action
  actDeliveryOrder!: (params: any) => Promise<void>

  @nsStoreWarehouse.Action
  actWarehouseList!: () => Promise<void>

  @nsStoreSeller.Action
  actSellerList!: (params: any) => Promise<void>

  @nsStoreCreateOrder.Action
  actGetEstimate!: (obj: any) => Promise<void>

  // -- [ Functions ] ------------------------------------------------------------

  mounted() {
    this.listItemsAdd = this.outGoingListStore.map((x: any) => (
      { ..._.cloneDeep(x), hasAirtag: false }))
    if(this.listItemsAdd.length > 0){
      this.disableInput(true)
    }else if (!this.information.seller[0].value ){
      this.disableInput(false)
    }
    this.handleUser()

    if(this.user.role === 'staff'){
      this.warehouseByStaff()
    }
    else {
      this.actWarehouseList()
    }
  }

  destroyed() {
    if(this.$route.path !== '/stock-out/order/add-items') {
      this.emptyList()
    }
  }

  createStockOut() {
    this.$v.information.warehouse?.$each?.$touch()
    this.$v.information.receiver?.$each?.$touch()
    this.$v.information.seller?.$each?.$touch()
    const validSeller = this.$v?.information?.seller?.$each[0]?.value
    const validWarehouse = this.$v.information.warehouse?.$each[0]?.value
    const validReceiver = this.$v.information.receiver

    if( !validSeller?.$invalid && validSeller?.$dirty &&
      !validWarehouse?.$invalid && validWarehouse?.$dirty &&
      !validReceiver?.$each[0]?.value.$invalid && validReceiver?.$each[0]?.value.$dirty &&
      !validReceiver?.$each[3]?.value.$invalid && validReceiver?.$each[3]?.value.$dirty
    ) {
      const note = this.noteBox
      const listInfoAdd = { ...this.information , note }
      this.$router.push('/stock-out/order/add-items')
      this.actGetCreateOrder(
        _.cloneDeep(listInfoAdd)
      )
    }
    return true
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
    this.valueDelete = _.forEach(data, (obj) => {
      this.onEventDeleteList = [obj.stock]
    })
    this.isModalDelete = true
  }

  showModalCancel() {
    this.isModalCancel = true
  }

  async saveEditItem( ) {
    await this.actOutGoingList(
      _.cloneDeep(this.listItemsAdd))
    this.isActive = ''
  }

  async handleSubmit(){
    const listReceiver = this.listInfo.receiver
    const deliveryItemList: any = []
    const note = this.listInfo.note
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
        id: this.information.seller[0].id
      },
      receiverAddress: listReceiver[0].value,
      receiverEmail: listReceiver[1].value,
      receiverName: listReceiver[2].value,
      receiverPhone: listReceiver[3].value,
      dueDeliveryDate: null,
      estimatedDeliveryTime: null,
      note,
      warehouse: {
        id: this.listInfo.warehouse[0].warehouseId
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
    await this.emptyList()
    this.isModalCancel = false
    await this.$router.push({ path: '/stock-out/order-list' })
  }

  async emptyList() {
    const emptyList =  this.listItemsAdd = []
    await this.actGetCreateOrder(_.cloneDeep(emptyList))
    await this.actOutGoingList(_.cloneDeep(emptyList))
    _.forEach(this.information, function(item){
      _.forEach(item, function(i) {
        i.value = null
      })
    })
  }

  disableInput(isDisable: boolean) {
    _.forEach(this.information, function(obj){
      _.forEach(obj, function(o){
        if(_.has(o, 'disabled')) {
          _.set(o, 'disabled' , isDisable)
        }
      })
    })
  }

  warehouseByStaff(){
    const warehouseByUser = this.user.warehouse
    const InfoWarehouse = this.information.warehouse
    InfoWarehouse[0].warehouseId =  warehouseByUser?.id
    InfoWarehouse[0].value =  warehouseByUser?.name
    InfoWarehouse[1].value =  warehouseByUser?.email
    InfoWarehouse[2].value = warehouseByUser?.phone
  }

  handleWarehouse(event: any) {
    const InfoWarehouse = this.information.warehouse
    InfoWarehouse[0].warehouseId = event.id
    InfoWarehouse[1].value = event.email
    InfoWarehouse[2].value = event.phone
    this.unSelectedSeller()

  }

  handleSeller(event: any) {
    // await this.actWarehouseBySeller({ email: event.email })
    const InfoSeller = this.information.seller
    InfoSeller[0].value = event.email
    InfoSeller[0].id = event.id
    InfoSeller[1].value = event.displayName || `${event.firstName} ${event.lastName}`
    InfoSeller[2].value = event.phoneNumber
  }

  clearSeller(event: any) {
    if(event  === '' || event === null) {
      this.unSelectedSeller()
    }
  }

  handleUser() {
    const InfoCreator = this.information.creator
    InfoCreator[0].value = this.user.staffId
    InfoCreator[1].value = this.user.email
    InfoCreator[2].value = this.user.displayName
    InfoCreator[3].value = this.user.phoneNumber
  }

  paramSeller(event: any) {
    this.actSellerList({ email: event })
    if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(event.value))
    {
      return true
    }
    return this.$v.information.seller?.$each?.$touch()
  }

  handleReceiver(event: any) {
    const d = new Date()
    const dayFrom = dayjs(d).add(5, 'day').format('DD/MM/YYYY')
    const dayTo = dayjs(d).add(8, 'day').format('DD/MM/YYYY')
    const estimate = dayFrom + ' - ' + dayTo
    if (event) {
      this.deliveryDate = estimate
      this.estimatedDate = '1 day'
    }
  }

  unSelectedSeller() {
    _.forEach(this.information.seller, (val) => {
      val.value = null
    })
  }

  deliveryChange( deliveryNew , data?: any ){
    if(deliveryNew === 0) {
      this.showModalDelete([data])
      this.isDisableSubmit = true
    }
    else if (deliveryNew > data.amount && data.delivery !== deliveryNew) {
      this.isDisableSubmit = true
      this.$toast.add({
        severity: 'error',
        summary: 'Error Message',
        detail: `Delivery quantity could not exceed ${data.amount}`,
        life: 3000
      })
    } else if (deliveryNew === null){
      this.isDisableSubmit = true
    } else if (deliveryNew <= data.amount) {
      this.isDisableSubmit = false
    }
    data.delivery = deliveryNew
  }

  async handleDelete() {
    const b = this.valueDelete[0]
    const c = _.cloneDeep(this.listItemsAdd)
    _.remove(c, ({ id }) => id === b.id)
    const result : any =  await this.actOutGoingList(
      c)
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
    this.listItemsAdd = _.cloneDeep(result)
  }

  // -- [ Getter ] ------------------------------------------------------------

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
::v-deep.order
  @include tablet
    margin: 20px
  .sub__tab
    background-color: #ffffff
    height: calc(100vh - 32px)
    overflow: hidden
    @include desktop
      height: calc(100vh - 32px)
      max-width: 23rem
      overflow: hidden
      border-radius: var(--border-radius)
  .sub__tab--scroll
    display: flex
    align-items: center
    flex-direction: column
    height: calc(100vh - 100px)
    overflow: auto
    background-color: #ffffff
    @include desktop
      height: calc(100vh - 100px)
      overflow: auto
    @include tablet
      flex-direction: row
      justify-content: center
      align-items: baseline
      overflow: auto
  .btn-action
    border: none
    padding: 0
    height: 2rem
    width: 2rem
    justify-content: center
    background: var(--surface-200)
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

::v-deep.inventory
  min-height: calc(100vh - 32px)
  margin-top: 3rem
  @include desktop
    margin-top: 0px
    margin-left: 2rem
    height: calc(100vh - 32px)
  &__header
    flex-direction: column
    flex-wrap: wrap
    margin-bottom: 24px
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
  &__content
    flex: 1
    border-radius: 4px
    position: relative
    overflow: hidden
::v-deep.p-datatable
  .p-datatable-footer
    box-shadow: 0px 10px 45px rgba(0, 10, 24, 0.1)
    background-color: #ffffff
    border: none
    padding: 15px 0px
    width: 100%
  .text-primary
    color: $primary-dark !important
    font-weight: $font-weight-medium
  .p-datatable-tbody
    & > tr
      background: $text-color-100
      .text-bold
        color: $text-color-700
        .p-inputnumber-input
          color: $text-color-700
    .outgoing__selected
      background: $color-white
      > .text-bold
        font-weight: $font-weight-bold
        color: $text-color-900
        .p-inputnumber-input
          font-weight: $font-weight-bold
          color: $text-color-900 !important
  .p-datatable-thead > tr > th
    white-space: unset
    .p-column-header-content
      .p-checkbox
        display: none
  .text-right
    text-align: right !important
    .p-column-header-content
      justify-content: end !important
::v-deep.input-errors
  text-align: start !important
  .error-message
    color: #ff0000
</style>

