<template lang="pug">
  div.card-dashboard
    h4.chart-title Seller
    Chart(type="line" :data="dataSellersChart" :options='chartOptions')
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
class SellerChart extends Vue {
  dataSellers: any = [
    {
      date: 'January',
      value: 39
    },
    {
      date: 'February',
      value: 59
    },
    {
      date: 'March',
      value: 80
    },
    {
      date: 'April',
      value: 81
    },
    {
      date: 'May',
      value: 29
    },
    {
      date: 'June',
      value: 56
    },
    {
      date: 'July',
      value: 49
    }
  ]

  get dataSellersChart() {
    if(this.dataSellers) {
      const labels = this.dataSellers.map(item => {
        return item.date
      })
      const dataSeller = this.dataSellers.map(item => {
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
  .card-dashboard
    background-color: #fff
    box-shadow: 0px 4px 20px rgba(91, 71, 188, 0.3)
    padding: 16px
    border-radius: 8px
    h4
      margin: 0
</style>
