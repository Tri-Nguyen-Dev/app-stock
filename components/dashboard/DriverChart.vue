<template lang="pug"> 
  Card.drivers-chart-container
    template(#content='')
      .grid
        .col-3.chart-image.mt-2
          img(:srcset="`${require('~/assets/images/driver.svg')}`" style="width:120px; height: 120px")
        .col-9.chart-content
          .header-chart
            h4 Drivers
            .chart-statistics
              span Active: {{ dataChart.active }}
              span(v-tooltip="'Compared to last month'") New: +{{dataChart.new}}
            ProgressBar(:value="dataChart.data" :showValue="false")
            span Average D/O: {{ dataChart.average }} per driver
</template>

<script lang="ts">
import { Component, namespace, Vue } from 'nuxt-property-decorator'
const nsStoreDashboard = namespace('dashboard/data-chart')

@Component
class DriverChart extends Vue {

  @nsStoreDashboard.State
  delivery!: any

  get dataChart() {
    if(this.delivery) {
      const data = Math.floor((Math.random() * 30) + 1)
      const total = Math.floor((Math.random() * 100) + 31)
      return {
        active: `${data}/${total}`,
        new: Math.floor((Math.random() * 10) + 1),
        data,
        average: Math.floor((Math.random() * 10) + 1)
      }
    } else {
      return {
        active: 0/0,
        new: 0,
        data: 0,
        average: 0
      }
    }
  }
}

export default DriverChart
</script>
<style lang="sass" scoped>
.drivers-chart-container
  min-height: 160px
  .chart-image
    img
      object-fit: cover
      height: 100%
      width: 100%
  .chart-content
    flex: 1
    .header-chart
      h4
        margin: 0
      .chart-statistics
        display: flex
        justify-content: space-between
        padding: $space-size-4 0
        margin-top: $space-size-8
      ::v-deep.p-progressbar-determinate
        border-radius: $border-radius-20
        height: $space-size-12
        margin: $space-size-8 0
        .p-progressbar-value
          border-radius: $border-radius-20
          background: $primary
</style>
