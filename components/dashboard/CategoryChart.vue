<template lang="pug"> 
  Card.category-chart-container
    template(#content='')
      .header-chart
        h4 Top Categories
        .category-item(v-for="(item, index) in dataChart" :key="item.id")
          div
            span.font-medium {{ index + 1 }}. 
            span.font-medium {{ item.categoryName }}
          span.item-percent {{ item.value }}
</template>

<script lang="ts">
import { Component, namespace, Vue } from 'nuxt-property-decorator'
import { roundingPercent } from '~/utils'
const nsStoreDashboard = namespace('dashboard/data-chart')

@Component
class CategoryChart extends Vue {

  @nsStoreDashboard.State
  category!: any

  get dataChart() {
    if(this.category) {
      const totalCategory = _.sumBy(this.category, function(o) { return o.value })
      const top3 = this.category.slice(0, 3)
      return _.map(top3, (o) => {
        return { ...o, value: roundingPercent(o.value / totalCategory * 100) }
      })
    }
  }
}

export default CategoryChart
</script>
<style lang="sass" scoped>
.category-chart-container
  min-height: 150px
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
    padding-bottom: $space-size-8
  .category-item:last-child
    margin-bottom: 0
</style>
