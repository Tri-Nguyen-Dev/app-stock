<template lang="pug"> 
  Card
    template(#content='')
      .grid
        .col-3.chart-image
          img(:srcset="`${require('~/assets/images/table-empty.png')} 2x`")
        .col-9.chart-content
          .header-chart
            h4 Drivers
            .chart-statistics
              span Active: 80/120
              span New: +88
            ProgressBar(:value="value2" :showValue="false")
            span Average D/O: 6 per driver
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
class DriverChart extends Vue {
  value2 = 70
}

export default DriverChart
</script>
<style lang="sass" scoped>
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
    ::v-deep.p-progressbar-determinate
      border-radius: $border-radius-20
      height: $space-size-12
      margin: $space-size-8 0
      .p-progressbar-value
        border-radius: $border-radius-20
        background: $primary-dark
</style>
