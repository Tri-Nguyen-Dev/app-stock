<template lang="pug">
  .grid
    .col-2(v-for="(unit, index) in totalObject" :key="index")
      Card
        template(#content='')
          span Total {{ index }}
          .total-compared-content
            span.text-total {{ unit.total }}
            .percent-comparison
              .increase(v-if='unit.percent > 0') {{ unit.percent }}%
                i(class="pi pi-arrow-up" style="font-size: 0.7rem")
              .decrease(v-else) {{ unit.percent }}%
                i(class="pi pi-arrow-down" style="font-size: 0.7rem")
          span.text-subheading {{ unit.comparedText }}
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
class TotalCompared extends Vue {
  totalObject: any = {
    boxes:{
      total: 27632,
      percent: 2.5,
      comparedText: 'Compared to this day last month'
    },
    items:{
      total: 27632,
      percent: -12,
      comparedText: 'Compared to this day last month'
    },
    incoming:{
      total: 27632,
      percent: -12,
      comparedText: 'Compared to this day last month'
    },
    outgoing:{
      total: 27632,
      percent: 12.5,
      comparedText: 'Compared to this day last month'
    },
    variant:{
      total: 27632,
      percent: -12,
      comparedText: 'Compared to this day last month'
    },
    returned:{
      total: 27632,
      percent: -12,
      comparedText: 'Compared to this day last month'
    }
  }
}

export default TotalCompared
</script>
<style lang="sass" scoped>
.total-compared-content
  display: flex
  align-items: center
  .text-total
    font-size: $space-size-24
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
