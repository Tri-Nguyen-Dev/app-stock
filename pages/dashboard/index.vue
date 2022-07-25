<template lang="pug"> 
  .grid.dashboard-page-container
    .col-12.mb-3
      h1.text-heading Dashboard
    .col-12.pb-0
      DashboardTotalCompared
    .col-12.flex-1
      .grid.h-full
        .col-5.dashboard-column(class="col-12 xl:col-5")
          .grid.dashboard-column.m-0.h-full
            DashboardDeliveryChart.dashboard-column__full
            DashboardDriverChart.mt-3
        .col-4.dashboard-column(class="col-12 lg:col-6 xl:col-4")
          DashboardActivitiesChart.dashboard-column__full
          DashboardSellerChart.mt-3
        .col-3.dashboard-column(class="col-12 lg:col-6 xl:col-3")
          DashboardCategoryChart.col-12.mb-3
          DashboardCapacityChart.col-12.dashboard-column__full
</template>

<script lang="ts">
import { Component, namespace, Vue } from 'nuxt-property-decorator'
const nsStoreDashboard = namespace('dashboard/data-chart')
const nsStoreWarehouse = namespace('warehouse/warehouse-list')

@Component
class Dashboard extends Vue {
  
  @nsStoreWarehouse.State
  warehouseSelected!: any

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
    if(this.warehouseSelected) {
      await this.getDataChart()
    }
  }

  async getDataChart() {
    const warehouseId = this.warehouseSelected?.id
    await Promise.all([
      this.actGetBoxItem({ warehouseId }),
      this.actGetDelivery({ warehouseId }),
      this.actActivities({ warehouseId }),
      this.actGetSellers({ warehouseId }),
      this.actGetCategory({ warehouseId }),
      this.actGetCapacity({ warehouseId })
    ])
  }
}

export default Dashboard
</script>
<style lang="sass" scoped>
.dashboard-page-container
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
  .dashboard-column
    @include flex-column
    &__full
      flex: 1
</style>
