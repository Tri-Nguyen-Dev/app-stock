<template lang="pug">
.grid.grid-nogutter.packing__detail--container
	.col-3.surface-0.border-round.h-full.overflow-y-auto.sub-tab
		PackingInformationDetail(:deliveryOrderDetail ='orderDetail')
	.col-9.pl-4.pr-1.h-full.overflow-y-auto.overflow-x-hidden.flex-1
		.grid.justify-content-between
			.col-8
				h1.text-heading Item list
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
					v-if='!isPack'
				)
				Button.p-button-outlined.p-button-primary.bg-white.w-full(
					type='button',
					label='Pack Items',
					@click='packItem',
					v-if='isPack',
					:disabled='!enablePack'
				)
		ItemList(
			:isDetail='true',
			:action='action',
			@selectRow='selectItem($event)',
			@enablePack='checkEnablePack($event)',
			:listItems='item',
			v-if='item'
		)
</template>

<script lang="ts">
import { Component, namespace, Vue } from 'nuxt-property-decorator'
import ItemList from '~/components/stock-out/item/ItemList.vue'
import PackingInformationDetail from '~/components/stock-out/PackingInformationDetail.vue'
import { STOCK_OUT_ACTION, ORDER_STATUS } from '~/utils/constants/stock-out'
import { OrderDetail } from '~/models/OrderDetail'
import { exportFileTypePdf } from '~/utils'
const nsStoreOrder = namespace('stock-out/order-detail')
const nsStoreExportOrder = namespace('stock-out/order-export')
const nsUser = namespace('user-auth/user')
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
      dataUpdate.assignee = {
        id: this.user ? this.user.id : 0
      }
    }
    await this.actPostUpdateProgressOrder(dataUpdate)
    this.isPack = true
    this.action = STOCK_OUT_ACTION.ORDER_PICK_ITEM
  }

  selectItem(event) {
    this.selectedItem = event
  }

  checkEnablePack(event) {
    this.enablePack = event
  }

  packItem() {
    this.$router.push(`/stock-out/${this.id}/packing`)
  }

  async handleExportReceipt() {
    const result = await this.actGetOrderPdf({ id: this.id })
    if (result) {
      exportFileTypePdf(result, `Delivery-order-${this.id}`)
    }
  }

  async mounted() {
    await this.actGetOrderDetail({ id: this.id })
  }
}

export default DeliveryOrder
</script>
<style lang="sass" scoped>
.btn-center
  height: 70%
  align-self: center
</style>
