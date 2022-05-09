<template lang="pug">
.grid.grid-nogutter.packing__detail--container
	.col-3.surface-0.border-round.h-full.overflow-y-auto.sub-tab
		PackingInformationDetail
	.col-9.pl-4.pr-1.h-full.overflow-y-auto.overflow-x-hidden.flex-1
		.grid.justify-content-between
			.col-8
				h1.text-heading Item list
				span.text-subheading {{ total }} items found
			.col-2.btn-center
				ThemeButtonExport.w-full(:click='handleExportReceipt' v-if='!isPack')
				Button.p-button-outlined.p-button-primary.bg-white.w-full(
					type='button',
					label='Map',
					@click='packItem'
					v-if='isPack'
				)
			.col-2.btn-center
				Button.p-button-outlined.p-button-primary.bg-white.w-full(
					type='button',
					label='Pick Items',
					@click='pickItem' v-if='!isPack'
				)
				Button.p-button-outlined.p-button-primary.bg-white.w-full(
					type='button',
					label='Pack Items',
					@click='packItem'
					v-if='isPack'
				)
		ItemList(:isDetail='true' :action='action' @selectRow ='selectItem($event)' :listItems='item')
</template>

<script lang="ts">
import { Component, namespace, Vue } from 'nuxt-property-decorator'
import ItemList from '~/components/stock-out/item/ItemList.vue'
import PackingInformationDetail from '~/components/stock-out/PackingInformationDetail.vue'
import { STOCK_OUT_ACTION } from '~/utils/constants/stock-out'
const nsStoreOrder = namespace('stock-out/order-detail')
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

  @nsStoreOrder.State
  orderDetail!: any

  @nsStoreOrder.Action
  actGetOrderDetail

  handleExportReceipt() {}

  get item() {
    return this.orderDetail.deliveryItemList
  }

  pickItem() {
    this.isPack = true
    this.action = STOCK_OUT_ACTION.ORDER_PICK_ITEM
  }

  selectItem(event) {
    this.selectedItem = event
  }

  packItem() {
    this.$router.push('/stock-out/DO000000000005/packing')
  }

  async	mounted() {
    await	this.actGetOrderDetail({ id: 'DO000000000005' })
  }
}

export default DeliveryOrder
</script>
<style lang="sass" scoped>
.btn-center
	height: 70%
	align-self: center
</style>
