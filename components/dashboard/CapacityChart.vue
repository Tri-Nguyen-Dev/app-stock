<template lang="pug">
  Card
    template(#content='')
      .header-chart
        h4 Capacity
      .chart-container
        Chart(type="doughnut" :data="chartData" :options="chartOptions")
      .chart-explication
        span.font-medium Free Space: 88%
        .grid.mt-2
          .col.chart-explication-item(v-for="(item, index) in backgroundColor" :key="item")
            .item-content 
              span(:style="{ 'color': item }") {{ dataChart[index] }}
              span {{ chartData.labels[index] }}
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
class CapacityChart extends Vue {
  backgroundColor = ['#FF6384', '#36A2EB', '#FFCE56', '#00A469']
  dataChart = [150, 50, 100, 74]
  chartData = {
    labels: ['A', 'B', 'C', 'D'],
    datasets: [
      {
        data: this.dataChart,
        backgroundColor: this.backgroundColor,
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#00A469']
      }
    ]
  }

  chartOptions= {
    plugins: {
      legend: {
        display: false
      }
    }
  }
}

export default CapacityChart
</script>
<style lang="sass" scoped>
.header-chart
  h4
    margin: 0
.chart-container
  margin: 0 auto
  width: 80%
.chart-explication
  margin: $space-size-8 $space-size-4
  &-item
    display: flex
    justify-content: center
    font-weight: $font-weight-semi-bold
    .item-content
      display: flex
      flex-direction: column
  &-item:not(:last-child)
    border-right: 1px solid $text-color-400
</style>
