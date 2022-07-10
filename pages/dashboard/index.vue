<template lang="pug"> 
  .grid.dashboard-page-container
    .col-12
      h1.text-heading Dashboard
    .col-12
      Card
        template(#content='')
          .dashboard-warehouse
            div Choose warehouse
            Dropdown.warehouse-select(v-model="selectedCity" :options="cities" optionLabel="name" placeholder="Select a warehouse")
    .col-12.pb-0
      DashboardTotalCompared
    .col-12.flex-1
      .grid
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
import { Component, Vue } from 'nuxt-property-decorator'

@Component
class Dashboard extends Vue {
  selectedCity = null
  cities = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
  ]
}

export default Dashboard
</script>
<style lang="sass" scoped>
.dashboard-page-container
  @mixin flex-center-column
  .dashboard-warehouse
    // background: $color-white
    display: flex
    justify-content: space-between
    align-items: center
    // padding: $space-size-8 $space-size-12
    .warehouse-select
      width: 200px
  ::v-deep.p-card-body
    padding: $space-size-12
    .p-card-content
      padding: 0
</style>
