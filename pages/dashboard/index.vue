<template lang="pug"> 
  .grid.dashboard-page-container
    .col-12
      h1.text-heading Dashboard
    .col-12
      .dashboard-warehouse
        div Choose warehouse
        Dropdown.warehouse-select(v-model="selectedCity" :options="cities" optionLabel="name" placeholder="Select a warehouse")
    .col-12
      DashboardTotalCompared
    .col-12
      .grid.chart-container
        .col-5
          DashboardDeliveryChart
          DashboardDriverChart.mt-3
        .col-4
          DashboardDeliveryChart
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
  .dashboard-warehouse
    background: $color-white
    display: flex
    justify-content: space-between
    align-items: center
    padding: $space-size-8 $space-size-12
    .warehouse-select
      width: 200px
  .chart-container
    background: $color-white
    margin-left: 0
    margin-right: 0
</style>
