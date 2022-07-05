<template lang="pug"> 
  .chart-detail-container
    .header-chart
      h4 Delivery Order
      .chart-statistics
        span Total Delivery Order: 82
        span Delivered Delivery Order: 88
    Chart(type="bar" :data="multiAxisData" :options="multiAxisOptions")
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
class DeliveryChart extends Vue {
  multiAxisData= {
    labels: ['New', 'In Progress', 'Cancelled', 'Ready', 'Setted', 'Accepted', 'Delivering'],
    datasets: [{
      label: '',
      backgroundColor: [
        '#EC407A',
        '#AB47BC',
        '#42A5F5',
        '#7E57C2',
        '#66BB6A',
        '#FFCA28',
        '#26A69A'
      ],
      yAxisID: 'y',
      data: [65, 59, 80, 81, 56, 55, 40]
    }]
  }

  multiAxisOptions= {
    scales: {
      x: {
        ticks: {
          color: '#495057'
        },
        grid: {
          color: '#ebedef'
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        ticks: {
          min: 0,
          max: 100,
          color: '#495057'
        },
        grid: {
          color: '#ebedef'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  }
}

export default DeliveryChart
</script>
<style lang="sass" scoped>
.chart-detail-container
  padding: $space-size-8
  border: 1px solid $text-color-400
  border-radius: $border-radius-6
  .header-chart
    h4
      margin: 0
    .chart-statistics
      display: flex
      justify-content: space-between
      padding: $space-size-4 0
</style>
