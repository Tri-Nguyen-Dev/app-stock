<template lang="pug">
.packing__original--table.bg-white.border-round.w-full
  TabView(:active-index="active = 1")
    TabPanel(:disabled="true")
      template(#header)
        .icon.icon-info.inline-block.mr-2
        span.uppercase original box
    TabPanel(v-for='tab in tabs' :key='tab.index')
      template(#header)
        .icon.icon-box-packing-outline.inline-block.mr-2.surface-700
        .icon.icon-box-packing.hidden.mr-2
        span.uppercase.text-700 11258
      StockOutPackingTableList
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
class PackingOriginal extends Vue {
  tabs: any = [
    { index: 1, title: '', content: 'Content 1' },
    { index: 2, title: '', content: 'Content 2' },
    { index: 3, title: '', content: 'Content 3' }
  ]
}

export default PackingOriginal
</script>
<style lang="sass" scoped>
::v-deep.packing__original--table
  .icon.icon-info
    background: $primary-dark
  .p-tabview-panels
    padding: 0
    .p-datatable .p-datatable-thead > tr > th
      background: #fff !important
  .p-tabview-nav li .p-tabview-nav-link
    &:focus
      box-shadow: none
    &:hover
      border: none
  .p-tabview-nav-content .p-highlight
    position: relative
    .p-tabview-nav-link
      border: none
    span
      color: $text-color-900 !important
    .icon.icon-box-packing-outline
      display: none !important
    .icon.icon-box-packing
      display: inline-block !important
      background: $primary
    &::after
      position: absolute
      content: ''
      background-color: $primary
      width: 100%
      height: 12px
</style>
