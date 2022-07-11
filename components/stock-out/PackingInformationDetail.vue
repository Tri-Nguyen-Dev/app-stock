<template lang="pug">
.order__packing--detail
  .packing__detail--header.border-bottom-1.border-gray-300
    Breadcrumb(:home='homeItem', :model='breadcrumbItem')
  .packing__detail--content.p-3
    .my-3.font-bold.flex.align-items-center
      .icon.icon-info.inline-block
      span.uppercase.ml-1 order detail
    span.uppercase.font-bold.pl-1.mr-1(style='background-color: #00A469; color: #FFFFFF') {{status}} &nbsp;
    h3.uppercase.inline-block.m-1 id: {{ deliveryOrderDetail.id }}
    div
      h5.uppercase.inline-block(style='color :#979AA4') Create time:&nbsp;
      span.uppercase.font-bold {{deliveryOrderDetail.createdAt | dateTimeHour24}}
    TabView
      TabPanel.p-3(header='Delivery')
        StockOutPackingSellerInfo.border-bottom-1.border-gray-300.pb-4(:sellerInfo='deliveryOrderDetail')
        StockOutPackingReceiverInfo.border-bottom-1.border-gray-300.pb-4.mt-4(:receiverInfro='deliveryOrderDetail')
        StockOutPackingTimeDelivery.mt-4(:timeDelivery='deliveryOrderDetail')
        DeliveryDriverInfo.mt-4(v-if='deliveryOrderDetail.driver' :driverInfo='deliveryOrderDetail.driver')
      TabPanel.p-3(header='Warehouse')
        StockOutPackingWarehouseInfo(:warehouseInfo='deliveryOrderDetail')
      TabPanel.p-3(header='Creator')
        StockOutPackingCreatorInfo(:creatorInfo='deliveryOrderDetail')
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import DeliveryDriverInfo from '~/components/stock-out/driver/DriverInfor.vue'
import { DeliveryConstants, ORDER_STATUS } from '~/utils'
@Component({
  components: {
    DeliveryDriverInfo
  }
})
class PackingInformationDetail extends Vue {
  @Prop() deliveryOrderDetail!: any
  @Prop() type!: string
  @Prop() driverInfo!: any
  get homeItem() {
    return { label: '', to: '/stock-out/order-list', icon: 'pi pi-list' }
  }

  get status() {
    return DeliveryConstants.MapStatusDelivery.get(this.deliveryOrderDetail?.status)
  }
 
  get breadcrumbItem() {
    if (this.type === 'DO_DETAIL') {
      return [
        { label: 'Delivery order detail', to: `/stock-out/order/${this.deliveryOrderDetail.id}?isPick=true`, icon: 'pi pi-info-circle' }
      ]
    } else if (this.type === 'PICK_ITEM') {
      return [
        { label: '', to: `/stock-out/order/${this.deliveryOrderDetail.id}?isPick=true`, icon: 'pi pi-info-circle' },
        { label: 'Picking list', to: `/stock-out/order/${this.deliveryOrderDetail.id}?isPick=false`, icon: 'pi pi-list' }
      ]
    } else if(this.deliveryOrderDetail.status===ORDER_STATUS.IN_PROGRESS) {
      return [
        { label: '', to: `/stock-out/order/${this.deliveryOrderDetail.id}?isPick=true`, icon: 'pi pi-info-circle' },
        { label: '', to: `/stock-out/order/${this.deliveryOrderDetail.id}?isPick=false`, icon: 'pi pi-list' },
        {
          label: 'Packing',
          to: `/stock-out/order/${this.deliveryOrderDetail.id}/packing`,
          icon: 'pi pi-info-circle'
        }
      ]
    } else {
      return [
        { label: '', to: `/stock-out/order/${this.deliveryOrderDetail.id}?isPick=false`, icon: 'pi pi-info-circle' },
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
  .p-breadcrumb
    .p-menuitem-link
      display: flex
      align-items: center
      .p-menuitem-icon
        display: block !important
        height: 100%
      .p-menuitem-text
        margin-left: 4px
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
