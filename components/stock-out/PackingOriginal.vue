<template lang="pug">
.packing__common--table.bg-white.border-round.w-full
  TabView(:active-index="active = 1")
    TabPanel(:disabled="true")
      template(#header)
        .icon.inline-block.mr-2(:class='icon')
        span.uppercase {{title}}
    TabPanel(v-for='tab in tabs' :key='tab.index')
      template(#header)
        .icon.icon-box-packing-outline.inline-block.mr-2.surface-700
        .icon.icon-box-packing.hidden.mr-2
        span.uppercase.text-700 11258
      .grid
        .col
        .col
      StockOutPackingTableList(:isOriginal='true')
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
class PackingOriginal extends Vue {
  tabs: any = [
    { index: 1, title: '', content: 'Content 1' },
    { index: 2, title: '', content: 'Content 2' },
    { index: 3, title: '', content: 'Content 3' }
  ]

  @Prop() readonly title!: string | undefined
  @Prop() readonly icon!: string | undefined
}

export default PackingOriginal
</script>
<style lang="sass" scoped>
::v-deep.packing__common--table
  .p-tabview
    .icon
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
    .p-tabview-nav-content
      .p-tabview-nav
        .p-disabled
          border-right: 1px solid $bg-body-base
        li .p-tabview-nav-link
          color: $primary-dark
      .p-highlight
        border-bottom: 2px solid $primary
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
</style>
