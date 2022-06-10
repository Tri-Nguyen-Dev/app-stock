<template lang="pug">
.grid.grid-nogutter.packing__detail--container
  .packing__detail--left.col-3.surface-0.border-round.h-full.overflow-y-auto
    PackingInformationDetail#packingInfo(
      :deliveryOrderDetail='orderDetail',
      :type='typeTitle'
    )
  .col-9.packing__detail--left.pl-4.pr-1.flex-1
    .grid
      .col-4
        h1.text-heading {{ textHeading }}
        span.text-subheading {{ total }} items found
      .col-8.btn-right(v-if='orderDetail')
        ThemeButtonExport.w-25(:click='handleExportReceipt')
        //- Button.p-button-outlined.p-button-primary.bg-white.w-25(
        //-   type='button',
        //-   label='Map',
        //-   @click='packItem',
        //-   v-if='isPack'
        //- )
        Button.p-button-outlined.p-button-primary.bg-white.w-25(
          type='button',
          label='Pick Items',
          @click='pickItem',
          v-if='checkStatus("PICK_ITEM") || isPick'
        )
        Button.p-button-outlined.p-button-primary.bg-white.w-25(
          type='button',
          label='Pack Items',
          @click='packItem',
          v-if='!isPick && checkStatus("PACK_ITEM")',
          :disabled='!enablePack'
        )
        Button.p-button-outlined.p-button-primary.bg-white.w-25(
          type='button',
          label='Packing detail',
          v-if='checkStatus("PACKING_DETAIL")',
          @click='packDetail()'
        )
        Button.p-button-outlined.p-button-primary.bg-white.w-25(
          type='button',
          label='Set Delivery',
          v-if='checkStatus("SET_DELIVERY")',
          @click='setDelivery()'
        )
        Button.p-button-outlined.p-button-primary.bg-white.w-25(
          type='button',
          label='Reset Delivery',
          v-if='checkStatus("RESET_DELIVERY")',
          @click='setDelivery()'
        )
    ItemList(
      :isDetail='true',
      :action='action',
      @selectRow='selectItem($event)',
      @enablePack='checkEnablePack($event)',
      :listItems='item',
      v-if='item'
    )
    DriverDialog(
      :isModalDriverList='isModalDriverList',
      @hideDialog='hideDialog($event)',
      @assigned='assignedDriver($event)'
    )
</template>

<script lang="ts">
import { Component, namespace, Vue, Watch } from 'nuxt-property-decorator'
import ItemList from '~/components/stock-out/item/ItemList.vue'
import PackingInformationDetail from '~/components/stock-out/PackingInformationDetail.vue'
import { STOCK_OUT_ACTION, ORDER_STATUS } from '~/utils/constants/stock-out'
import { OrderDetail } from '~/models/OrderDetail'
import { exportFileTypePdf } from '~/utils'
import DriverDialog from '~/components/stock-out/driver/DriverDialog.vue'
const nsStoreOrder = namespace('stock-out/order-detail')
const nsStoreExportOrder = namespace('stock-out/order-export')
const nsUser = namespace('user-auth/store-user')
@Component({
  components: {
    ItemList,
    PackingInformationDetail,
    DriverDialog
  }
})
class DeliveryOrder extends Vue {
  total = 100
  action = STOCK_OUT_ACTION.ORDER_DETAIL
  selectedItem: any[] = []
  enablePack = false
  typeTitle = 'DO_DETAIL'
  textHeading = 'Item list'
  isModalDriverList = false
  isPick = false
  @nsStoreOrder.State
  orderDetail!: OrderDetail.Model

  @nsStoreOrder.State
  orderUpdate!: any

  @nsStoreOrder.Action
  actGetOrderDetail

  @nsStoreOrder.Action
  actPostUpdateProgressOrder

  @nsStoreExportOrder.Action
  actGetOrderPdf

  @nsStoreOrder.Action
  updateDriverInOrderDetail

  @nsUser.State
  user!: any

  get item() {
    if (this.orderDetail) {
      return this.orderDetail.deliveryItemList
    }
  }

  get id() {
    return this.$route.params.id
  }

  async pickItem() {
    // update progress order
    const dataUpdate = { ...this.orderDetail }
    dataUpdate.status = ORDER_STATUS.IN_PROGRESS
    if (!dataUpdate.assignee) {
      if (this.user) {
        dataUpdate.assignee = {
          id: this.user.id
        }
      }
    }
    await this.actPostUpdateProgressOrder(dataUpdate)
    this.typeTitle = 'PICK_ITEM'
    this.action = STOCK_OUT_ACTION.ORDER_PICK_ITEM
    this.enablePack = false
    this.textHeading = 'Picking list'
    this.$router.push(`/stock-out/order/${this.id}?isPick=false`)
  }

  selectItem(event) {
    this.selectedItem = event
  }

  checkEnablePack(event) {
    this.enablePack = event
  }

  packItem() {
    this.$router.push(`/stock-out/order/${this.id}/packing`)
  }

  packDetail() {
    this.$router.push(`/stock-out/order/${this.id}/packing-detail`)
  }

  async handleExportReceipt() {
    const result = await this.actGetOrderPdf({ id: this.id })
    if (result) {
      exportFileTypePdf(result, `Delivery-order-${this.id}`)
    }
  }

  async mounted() {
    await this.actGetOrderDetail({ id: this.id })
    this.initialValue()
  }

  checkStatus(action){
    let show = false
    switch(action){
    case 'PICK_ITEM':
      if(this.orderDetail.status === ORDER_STATUS.NEW) {
        show = true
      }
      break       
    case 'PACK_ITEM':
      if(this.orderDetail.status === ORDER_STATUS.IN_PROGRESS) {
        show = true
      }
      break
    case 'PACKING_DETAIL':
      if(this.orderDetail.status !== ORDER_STATUS.NEW) {
        show = true
      }
      break
    case 'SET_DELIVERY':
      if(this.orderDetail.status === ORDER_STATUS.READY) {
        show = true
      }
      break
    case 'RESET_DELIVERY':
      if(this.orderDetail.status === ORDER_STATUS.SETTED) {
        show = true
      }
      break
    }
    return show
  }

  initialValue() {
    if ((this.$route.query.isPick === 'false'  &&  this.orderDetail.status === ORDER_STATUS.IN_PROGRESS) 
      || (this.$route.query.isPick === undefined && this.orderDetail.status === ORDER_STATUS.IN_PROGRESS)){
      this.action = STOCK_OUT_ACTION.ORDER_PICK_ITEM
    } else {
      this.action = STOCK_OUT_ACTION.ORDER_DETAIL
    }
    this.typeTitle =
      this.action === STOCK_OUT_ACTION.ORDER_PICK_ITEM ? 'PICK_ITEM' : 'DO_DETAIL'
    this.enablePack = false
    this.textHeading =
      this.action === STOCK_OUT_ACTION.ORDER_PICK_ITEM
        ? 'Picking list'
        : 'Delivery order detail'
    this.total = this.orderDetail.deliveryItemList!.length
  }

  @Watch('$route')
  checkQuery() {
    this.isPick = this.$route.query.isPick ==='true'
    this.initialValue()
  }

  setDelivery() {
    this.isModalDriverList = true
  }

  hideDialog(event) {
    this.isModalDriverList = !event
  }

  assignedDriver(event) {
    if (event) {
      this.$toast.add({
        severity: 'success',
        summary: 'Success Message',
        detail: 'Successfully set Delivery',
        life: 3000
      })
      const packingInfo = this.$el.querySelector('.packing__detail--left')
      if (packingInfo) {
        const scrollHeight = packingInfo.scrollHeight
        packingInfo.scrollTop = scrollHeight
      }
    }
    
  }
}

export default DeliveryOrder
</script>
<style lang="sass" scoped>
.btn-right
  height: 70%
  text-align: right
.packing__detail--container
  height: calc(100vh - 32px)
.packing__detail--left
  height: calc( 100% - 32px) !important
.w-25
  width: 25%
  margin-left: 7px
</style>
