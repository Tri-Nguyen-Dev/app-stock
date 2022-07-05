<template lang="pug"> 
  .chart-detail-container
    .header-chart
      h4 Top Categories
      .category-item(v-for="(item, index) in data" :key="item.name")
        div
          span.font-medium {{ index + 1 }}. 
          span.font-medium {{ item.name }}
        span.item-percent {{ item.percent }}%
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
class CategoryChart extends Vue {
  data = [
    { name: 'Technology', percent: '62' },
    { name: 'Fashion', percent: '22.5' },
    { name: 'Food', percent: '12.6' }
  ]
}

export default CategoryChart
</script>
<style lang="sass" scoped>
.chart-detail-container
  padding: $space-size-8
  border: 1px solid $text-color-400
  border-radius: $border-radius-6
  .header-chart
    h4
      margin: 0
  .category-item
    margin: $space-size-8 $space-size-4
    display: flex
    justify-content: space-between
    .item-percent
      color: $text-color-status
      font-weight: $font-weight-semi-bold
  .category-item:not(:last-child)
    border-bottom: 1px solid $text-color-400
  .category-item:last-child
    margin-bottom: 0
</style>
