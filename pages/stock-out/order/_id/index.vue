<template lang="pug">
.grid.grid-nogutter.packing__detail--container
	.packing__detail--left.col-3.surface-0.border-round.h-full.overflow-y-auto
		PackingInformationDetail(
			:deliveryOrderDetail='orderDetail',
			:type='typeTitle'
		)
	.col-9.packing__detail--left.pl-4.pr-1.flex-1
		.grid
			.col-8
				h1.text-heading {{textHeading}}
				span.text-subheading {{ total }} items found
			.col-2.btn-center
				ThemeButtonExport.w-full(:click='handleExportReceipt', v-if='!isPack')
				Button.p-button-outlined.p-button-primary.bg-white.w-full(
					type='button',
					label='Map',
					@click='packItem',
					v-if='isPack'
				)
			.col-2.btn-center
				Button.p-button-outlined.p-button-primary.bg-white.w-full(
					type='button',
					label='Pick Items',
					@click='pickItem',
					v-if='!isPack  && !isReady'
				)
				Button.p-button-outlined.p-button-primary.bg-white.w-full(
					type='button',
					label='Pack Items',
					@click='packItem',
					v-if='isPack && !isReady',
					:disabled='!enablePack'
				)
				Button.p-button-outlined.p-button-primary.bg-white.w-full(
					type='button',
					label='Packing detail',
					v-if='isReady',
					@click='packDetail()'
				)
		ItemList(
			:isDetail='true',
			:action='action',
			@selectRow='selectItem($event)',
			@enablePack='checkEnablePack($event)',
			:listItems='item',
			v-if='item'
			:isReady ='isReady'
		)
</template>

<script lang="ts">
import { Component, namespace, Vue, Watch } from 'nuxt-property-decorator'
import ItemList from '~/components/stock-out/item/ItemList.vue'
import PackingInformationDetail from '~/components/stock-out/PackingInformationDetail.vue'
import { STOCK_OUT_ACTION, ORDER_STATUS } from '~/utils/constants/stock-out'
import { OrderDetail } from '~/models/OrderDetail'
import { exportFileTypePdf } from '~/utils'
const nsStoreOrder = namespace('stock-out/order-detail')
const nsStoreExportOrder = namespace('stock-out/order-export')
const nsUser = namespace('user-auth/store-user')
@Component({
  components: {
    ItemList,
    PackingInformationDetail
  }
})
class DeliveryOrder extends Vue {
  total = 100
  action = STOCK_OUT_ACTION.ORDER_DETAIL
  isPack = false
  selectedItem: any[] = []
  enablePack = false
  typeTitle = 'DO_DETAIL'
  isReady = false
  textHeading = 'Item list'
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
    this.isPack = true
    this.enablePack = false
    this.textHeading= 'Picking list'
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
    if (this.orderDetail.status === ORDER_STATUS.IN_PROGRESS) {
      // this.typeTitle = 'PACK_ITEM'
      // this.isPack = true
      // this.enablePack = false
      // this.action = STOCK_OUT_ACTION.ORDER_PICK_ITEM
    }
    if (this.orderDetail.status === ORDER_STATUS.READY) {
      this.isReady = true
    }
    if(this.$route.query.isPick === 'false'){
      this.initialValue(STOCK_OUT_ACTION.ORDER_PICK_ITEM)
    } else {
      this.initialValue(STOCK_OUT_ACTION.ORDER_DETAIL)
    }
  }

  initialValue(action){
    this.isPack = action===STOCK_OUT_ACTION.ORDER_PICK_ITEM
    this.typeTitle = action===STOCK_OUT_ACTION.ORDER_PICK_ITEM?'PICK_ITEM' : 'DO_DETAIL'
    this.action = action
    this.enablePack = false
    this.textHeading= action===STOCK_OUT_ACTION.ORDER_PICK_ITEM?'Picking list' : 'Delivery order detail'
  }

  @Watch('$route')
  checkQuery() {
    if(this.$route.query.isPick === 'true'){
      this.initialValue(STOCK_OUT_ACTION.ORDER_DETAIL)
    } else {
      this.initialValue(STOCK_OUT_ACTION.ORDER_PICK_ITEM)
    }
  }
}

export default DeliveryOrder
</script>
<style lang="sass" scoped>
.btn-center
	height: 70%
	align-self: center
.packing__detail--container
	height: calc(100vh - 32px)
.packing__detail--left
	height: calc( 100% - 32px) !important
</style>
