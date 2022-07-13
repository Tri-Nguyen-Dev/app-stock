<template lang="pug">
  Card
    template(#content='')
      .header-chart
        h4 Capacity
      .chart-container
        Chart(type="doughnut" :data="dataChart" :options="chartOptions")
      .chart-explication
        span.font-medium Free Space: 88%
        .grid.mt-2(v-if="noteObject")
          .col.chart-explication-item(v-for="(item, index) in noteObject.labels" :key="item")
            .item-content
              span(:style="{ 'color': noteObject.colors[index] }") {{ noteObject.data[index] }}
              span {{ item }}
</template>

<script lang="ts">
import { Component, namespace, Vue } from 'nuxt-property-decorator'
const nsStoreDashboard = namespace('dashboard/data-chart')

@Component
class CapacityChart extends Vue {

  @nsStoreDashboard.State
  capacity!: any

  get dataChart() {
    if(!this.capacity) return
    const dataChart: any = []
    const labels: any = []
    _.forEach(this.capacity, ({ sizeName, value }) => {
      dataChart.push(value)
      labels.push(sizeName)
    })
    return  {
      labels,
      datasets: [
        {
          data: dataChart,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#00A469'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#00A469']
        }
      ]
    } 
  }

  get noteObject() {
    if(this.dataChart) {
      return {
        data: _.get(this.dataChart, 'datasets[0]data', null),
        colors: _.get(this.dataChart, 'datasets[0]backgroundColor', null),
        labels: this.dataChart?.labels
      }
    }
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
