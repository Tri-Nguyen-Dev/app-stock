<template lang="pug">
  .grid
    .col-2(v-for="(unit, index) in dataChart" :key="index")
      Card
        template(#content='')
          span Total {{ index }}
          .total-compared-content
            span.text-total {{ unit.total }}
            .percent-comparison(v-if='unit.percent')
              .increase(v-if='unit.percent > 0') {{ unit.percent }}%
                i(class="pi pi-arrow-up" style="font-size: 0.7rem")
              .decrease(v-else) {{ unit.percent }}%
                i(class="pi pi-arrow-down" style="font-size: 0.7rem")
          span.text-subheading {{ unit.comparedText }}
</template>

<script lang="ts">
import { Component, namespace, Vue } from 'nuxt-property-decorator'
const nsStoreDashboard = namespace('dashboard/data-chart')

@Component
class TotalCompared extends Vue {

  @nsStoreDashboard.State
  boxItem!: any

  get dataChart() {
    const totalObject = {
      boxes:{
        total: this.boxItem?.totalBox || 0,
        percent: this.boxItem?.rateBox || 0,
        comparedText: 'Compared to this day last month'
      },
      items:{
        total: this.boxItem?.totalItem || 0,
        percent: this.boxItem?.rateItem || 0,
        comparedText: 'Compared to this day last month'
      },
      incoming:{
        total: this.boxItem?.totalIncoming || 0,
        percent: this.boxItem?.rateIncoming || 0,
        comparedText: 'Compared to this day last month'
      },
      outgoing:{
        total: this.boxItem?.totalOutgoing || 0,
        percent: this.boxItem?.rateOutgoing || 0,
        comparedText: 'Compared to this day last month'
      },
      variant:{
        total: this.boxItem?.totalVariant || 0,
        percent: this.boxItem?.rateVariant || 0,
        comparedText: 'Compared to this day last month'
      },
      returned:{
        total: this.boxItem?.totalReturned || 0,
        percent: this.boxItem?.rateReturned || 0,
        comparedText: 'Compared to this day last month'
      }
    }
    return totalObject
  }
}

export default TotalCompared
</script>
<style lang="sass" scoped>
.total-compared-content
  display: flex
  align-items: center
  .text-total
    font-size: $space-size-20
    font-weight: $font-weight-bold
    color: $primary
  .percent-comparison
    margin-left: $space-size-12
    .increase, .decrease
      .pi
        margin-left: $border-radius-2
    .increase
      color: $text-color-status
    .decrease
      color: $text-color-delete
</style>
