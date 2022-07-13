<template lang="pug"> 
  .grid.dashboard-page-container
    .col-12
      h1.text-heading Dashboard
    .col-12
      Card
        template(#content='')
          .dashboard-warehouse
            div Choose warehouse
            Dropdown.warehouse-select(
              :value="warehouseSelect"
              :options="warehouseList"
              optionLabel="name"
              placeholder="Select a warehouse"
              @change="changeWarehouse"
            )
    .col-12.pb-0
      DashboardTotalCompared
    .col-12.flex-1
      .grid.h-full
        .col-5
          DashboardDeliveryChart
          DashboardDriverChart.mt-3
        .col-4
          DashboardActivitiesChart
          DashboardSellerChart.mt-3
        .col-3
          DashboardCategoryChart
          DashboardCapacityChart.mt-3
</template>

<script lang="ts">
import { Component, namespace, Vue } from 'nuxt-property-decorator'
const nsStoreDashboard = namespace('dashboard/data-chart')
const nsStoreWarehouse = namespace('warehouse/warehouse-list')

@Component
class Dashboard extends Vue {
  warehouseSelect = null
  
  @nsStoreWarehouse.State
  warehouseList!: any

  @nsStoreWarehouse.Action
  actWarehouseList!: () => Promise<void>

  @nsStoreDashboard.Action
  actGetBoxItem!: (params: any) => Promise<void>

  @nsStoreDashboard.Action
  actGetDelivery!: (params: any) => Promise<void>

  @nsStoreDashboard.Action
  actActivities!: (params: any) => Promise<void>

  @nsStoreDashboard.Action
  actGetSellers!: (params: any) => Promise<void>

  @nsStoreDashboard.Action
  actGetCategory!: (params: any) => Promise<void>

  @nsStoreDashboard.Action
  actGetCapacity!: (params: any) => Promise<void>

  async mounted() {
    await this.actWarehouseList()
    this.warehouseSelect = this.warehouseList[0]
    this.getDataChart(this.warehouseList[0].id)
  }

  async changeWarehouse({ value }) {
    this.warehouseSelect = value
    await this.getDataChart(value.id)
  }

  async getDataChart(warehouseId) {
    await this.actGetBoxItem({ warehouseId })
    await this.actGetDelivery({ warehouseId })
    await this.actActivities({ warehouseId })
    await this.actGetSellers({ warehouseId })
    await this.actGetCategory({ warehouseId })
    await this.actGetCapacity({ warehouseId })
  }
}

export default Dashboard
</script>
<style lang="sass" scoped>
.dashboard-page-container
  @include mobile
    min-height: calc(100vh - 32px)
  @include tablet
    min-height: calc(100vh - 32px)
  @include desktop
    height: calc(100vh - 64px)
  display: flex
  flex-direction: column
  @mixin flex-center-column
  .dashboard-warehouse
    display: flex
    justify-content: space-between
    align-items: center
    .warehouse-select
      width: 200px
  ::v-deep.p-card-body
    padding: $space-size-12
    .p-card-content
      padding: 0
</style>
