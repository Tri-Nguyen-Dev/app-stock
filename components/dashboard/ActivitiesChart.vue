<template lang="pug">
  Card
    template(#content='')
      .header-chart
        h4.chart-title Activities
      Chart(type="line" :data="dataActivitiesChart")
</template>
<script lang="ts">
import { Component, namespace, Vue } from 'nuxt-property-decorator'
const nsStoreDashboard = namespace('dashboard/data-chart')
const dayjs = require('dayjs')

@Component
class ActivitiesChart extends Vue {

  @nsStoreDashboard.State
  activities!: any

  get dataActivitiesChart() {
    if(this.activities) {
      const labels = this.activities.map(item => {
        return dayjs(new Date(item.createdAt)).format('MM/DD')
      })
      const incomingData = this.activities.map(item => {
        return item.incoming
      })
      const outgoingData = this.activities.map(item => {
        return item.outgoing
      })
      return {
        labels,
        datasets: [
          {
            type: 'line',
            label: 'Incoming',
            data: incomingData,
            borderWidth: 2,
            fill: false,
            borderColor: '#42A5F5',
            tension: .4
          },
          {
            label: 'Outgoing',
            data: outgoingData,
            fill: false,
            borderColor: '#FFA726',
            tension: .4
          }
        ]
      }
    }
  }
}
export default ActivitiesChart
</script>
<style lang="sass" scoped>
.header-chart
  h4
    margin: 0
</style>
