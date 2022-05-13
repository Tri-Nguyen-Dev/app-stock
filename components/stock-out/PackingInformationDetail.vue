<template lang="pug">
.order__packing--detail
	.packing__detail--header.border-bottom-1.border-gray-300
		Breadcrumb(:home='homeItem', :model='breadcrumbItem')
	.packing__detail--content.p-3
		.my-3.font-bold
			.icon.icon-info.inline-block
			span.uppercase order detail
		h3.uppercase.m-1 id: {{ deliveryOrderDetail.id }}
		h5.uppercase.inline-block.text-400 Create time:&nbsp;
		span.uppercase.font-bold 13rd April 2022 12:22AM
		TabView
			TabPanel.p-3(header='Delivery')
				StockOutPackingSellerInfo.border-bottom-1.border-gray-300.pb-4(:sellerInfo='deliveryOrderDetail')
				StockOutPackingReceiverInfo.border-bottom-1.border-gray-300.pb-4.mt-4(:receiverInfro='deliveryOrderDetail')
				StockOutPackingTimeDelivery.mt-4(:timeDelivery='deliveryOrderDetail')
			TabPanel.p-3(header='Warehouse')
				StockOutPackingWarehouseInfo(:warehouseInfo='deliveryOrderDetail')
			TabPanel.p-3(header='Creator')
				StockOutPackingCreatorInfo(:creatorInfo='deliveryOrderDetail')
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
class PackingInformationDetail extends Vue {
  @Prop() deliveryOrderDetail!: any
  @Prop() type!: string
  get homeItem() {
    return { label: '', to: '/order-list', icon: 'pi pi-list' }
  }

  get breadcrumbItem() {
    if (this.type === 'PICKING_LIST') {
      return [
        { label: 'Delivery order detail', to: `/stock-out/order/${this.deliveryOrderDetail.id}`, icon: 'pi pi-info-circle' }
      ]
    } else if (this.type === 'PACK_ITEM') {
      return [
        { label: '', to: `/stock-out/order/${this.deliveryOrderDetail.id}`, icon: 'pi pi-info-circle' },
        { label: 'Packing list', to: `/stock-out/order/${this.deliveryOrderDetail.id}`, icon: 'pi pi-list' }
      ]
    } else {
      return [
        { label: '', to: `/stock-out/order/${this.deliveryOrderDetail.id}`, icon: 'pi pi-info-circle' },
        {
          label: 'Packing detail',
          to: `/stock-out/order/${this.deliveryOrderDetail.id}/packing`,
          icon: 'pi pi-info-circle'
        }
      ]
    }
		
  }
}
export default PackingInformationDetail
</script>
<style lang="sass" scoped>
::v-deep.order__packing--detail
  .packing__detail--content
    .p-tabview .p-tabview-nav li
      .p-tabview-nav-link
        background: #fff
        border: none
        box-shadow: none !important

    .p-tabview .p-tabview-panels
      background: #fff
      padding: 1.25rem 0 0 0

    .p-highlight .p-tabview-nav-link
      color: #000 !important
      border-bottom: 2px solid #486AE2 !important
</style>
