<template lang="pug">
  Card
    template(#content='')
      .header-chart
        h4.chart-title Activities
      Chart(type="line" :data="dataActivitiesChart")
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
class ActivitiesChart extends Vue {
  dataActivities: any = {
    incoming: [
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
    ],
    outgoing: [
      {
        date: 'January',
        value: 29
      },
      {
        date: 'February',
        value: 59
      },
      {
        date: 'March',
        value: 60
      },
      {
        date: 'April',
        value: 21
      },
      {
        date: 'May',
        value: 59
      },
      {
        date: 'June',
        value: 55
      },
      {
        date: 'July',
        value: 23
      }
    ]
  }

  get dataActivitiesChart() {
    if(this.dataActivities) {
      const labels = this.dataActivities?.incoming.map(item => {
        return item.date
      })
      const incomingData = this.dataActivities?.incoming.map(item => {
        return item.value
      })
      const outgoingData = this.dataActivities?.outgoing.map(item => {
        return item.value
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
