<template lang="pug"> 
  Card
    template(#content='')
      .header-chart
        h4 Delivery Order
        .chart-statistics
          span Total Delivery Order: {{ total }}
          span Delivered Delivery Order: {{ totalDelivered }}
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
    const labels: any = []
    const backgroundColor: any = []
    const data: any = []
    _.forEach(this.delivery, ({ statusName, statusCode, value }) => {
      labels.push(statusName)
      backgroundColor.push(DeliveryConstants.MapColorDelivery.get(statusCode))
      data.push(value)
    })
    const multiAxisData= {
      labels,
      datasets: [{
        backgroundColor,
        yAxisID: 'y',
        data
      }]
    }
    return multiAxisData
  }

  get total() {
    return _.sumBy(this.delivery, function(o) { return o.value })
  }

  get totalDelivered() {
    const delivered = _.find(this.delivery, function(o) {
      return o.statusCode === DeliveryConstants.StatusDeliveryName.DELIVERED 
    })
    if(delivered) {
      return delivered.value
    }
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
