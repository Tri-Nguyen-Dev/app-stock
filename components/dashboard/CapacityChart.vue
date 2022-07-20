<template lang="pug">
  Card
    template(#content='')
      .header-chart
        h4 Capacity
      .chart-container
        Chart(type="doughnut" :data="dataChart" :options="chartOptions")
      .chart-explication
        span.font-medium(v-if="noteObject.freeSpacePercent") Free Space: {{ noteObject.freeSpacePercent }}
        .grid.mt-2(v-if="noteObject")
          .col.chart-explication-item(v-for="(item, index) in noteObject.labels" :key="index")
            .item-content
              span(:style="{ 'color': noteObject.colors[index] }") {{ item.value }}
              span {{ item.sizeName }}
</template>

<script lang="ts">
import { Component, namespace, Vue } from 'nuxt-property-decorator'
import { numRounding } from '~/utils'
const nsStoreDashboard = namespace('dashboard/data-chart')

@Component
class CapacityChart extends Vue {

  @nsStoreDashboard.State
  capacity!: any

  get dataChart() {
    if(!this.capacity) return
    const [freeSpace, space] = _.partition(this.capacity, ['type', 0])
    const sumFreeSpace = _.sumBy(freeSpace, function(o) { return o.value })
    const sumSpace = _.sumBy(space, function(o) { return o.value })
    const dataChart: any = []
    const labels: any = []
    _.forEach(space, ({ sizeName, value }) => {
      dataChart.push(value)
      labels.push(sizeName)
    })
    const total = sumFreeSpace + sumSpace
    const freeSpacePercent = (total && `${numRounding(sumFreeSpace / total * 100)}%`) || '-'
    return  {
      labels,
      datasets: [
        {
          data: dataChart,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#00A469', '#00CFCE', '#7E57C2'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#00A469', '#00CFCE', '#7E57C2']
        }
      ],
      freeSpacePercent,
      freeSpace
    } 
  }

  get noteObject() {
    return {
      data: _.get(this.dataChart, 'datasets[0]data', null),
      colors: _.get(this.dataChart, 'datasets[0]backgroundColor', null),
      labels: this.dataChart?.freeSpace,
      freeSpacePercent: _.get(this.dataChart, 'freeSpacePercent', null)
    }
  }

  chartOptions= {
    plugins: {
      legend: {
        display: false
      },
      labels: {
        render: 'value'
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
