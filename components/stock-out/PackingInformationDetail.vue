<template lang="pug">
  .orderPackingDetail
    .packingDetailHeader.border-bottom-1.border-gray-300
      Breadcrumb(:home="homeItem" :model="breadcrumbItem")
    .packingDetailContent.p-3
      .my-3.font-bold
        .icon.icon-info.inline-block
        span.uppercase order detail
      h3.uppercase.m-1 id: dO11338838
      h5.uppercase.inline-block.text-400 Create time:&nbsp;
      span.uppercase.font-bold 13rd April 2022  12:22AM
      TabView
        TabPanel(header='Delivery').p-3
          StockOutPackingSellerInfo.border-bottom-1.border-gray-300.pb-4
          StockOutPackingReceiverInfo.mt-4
        TabPanel(header='Warehouse').p-3
          StockOutPackingWarehouseInfo
        TabPanel(header='Creator').p-3
           StockOutPackingCreatorInfo
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
class PackingInformationDetail extends Vue {
  get homeItem() {
    return { to: '/stock-out', icon: 'pi pi-list' }
  }

  get breadcrumbItem() {
    return [
      { to: '/stock-out/order-detail', icon: 'pi pi-info-circle' },
      { to: '/stock-out/picking-list', icon: 'pi pi-list' },
      {
        label: 'Packing detail',
        to: '/stock-out/packing-detail',
        icon: 'pi pi-info-circle'
      }
    ]
  }
}
export default PackingInformationDetail
</script>
<style lang="sass" scoped>
::v-deep.orderPackingDetail
  .packingDetailContent
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
