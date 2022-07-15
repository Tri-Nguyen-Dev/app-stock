<template lang="pug">
  Card
    template(#content='')
      .header-chart
        h4.chart-title Seller
      Chart(type="line" :data="dataSellersChart" :options='chartOptions')
</template>
<script lang="ts">
import { Component, namespace, Vue } from 'nuxt-property-decorator'
const nsStoreDashboard = namespace('dashboard/data-chart')
const dayjs = require('dayjs')

@Component
class SellerChart extends Vue {

  @nsStoreDashboard.State
  sellers!: any

  get dataSellersChart() {
    if(this.sellers) {
      const labels = this.sellers.map(item => {
        return dayjs(new Date(item.createdAt)).format('MM/DD')
      })
      const dataSeller = this.sellers.map(item => {
        return item.value
      })
      return {
        labels,
        datasets: [
          {
            type: 'line',
            label: 'Sellers',
            borderColor: '#42A5F5',
            borderWidth: 2,
            fill: false,
            data: dataSeller
          }
        ]
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
export default SellerChart
</script>
<style lang="sass" scoped>
.header-chart
  h4
    margin: 0
</style>
