<template lang="pug"> 
  Card
    template(#content='')
      .header-chart
        h4 Delivery Order
        .chart-statistics
          span Total Delivery Order: 82
          span Delivered Delivery Order: 88
      Chart(type="bar" :data="dataChart" :options="multiAxisOptions")
</template>

<script lang="ts">
import { Component, namespace, Vue } from 'nuxt-property-decorator'
import { DeliveryConstants } from '~/utils'
const nsStoreDashboard = namespace('dashboard/data-chart')

@Component
class DeliveryChart extends Vue {

  @nsStoreDashboard.State
  delivery!: any

  get dataChart() {
    if(!this.delivery) return
    const multiAxisData= {
      labels: this.delivery.map(a => a.statusName),
      datasets: [{
        label: '',
        backgroundColor: this.delivery.map(a => DeliveryConstants.MapColorDelivery.get(a.statusCode)),
        yAxisID: 'y',
        data: this.delivery.map(a => a.value)
      }]
    }
    return multiAxisData
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
    // barThickness: 6,
    barPercentage: 0.7,
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
.header-chart
  h4
    margin: 0
  .chart-statistics
    display: flex
    justify-content: space-between
    padding: $space-size-4 0
</style>
