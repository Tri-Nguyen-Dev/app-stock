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
        span.uppercase.text-700 {{tab.title}}
      .grid.grid-nogutter.border-bottom-1.border-gray-300.align-items-center.px-4.py-2(v-if='!isOriginal')
        .col-3
          span.mr-1 Size:
          Dropdown(v-model='tab.boxSizeSelect' :options="boxSize" optionLabel="name" placeholder="Select a box size").w-9
          span.ml-1 (cm)
        .col(v-if='isOutgoing')
          Checkbox(v-model="tab.checked" :binary="true")
          span.ml-1 Attach Tag
        .col(v-if='isTranffering')
          .grid.align-items-center
            .col-4
              div Estimated
              div Inventory Fee:
            .col
              InputText.w-4(v-model='tab.estimateFee' type='number')
              span.ml-1 /day
        .col.flex.justify-content-end
          span.p-input-icon-right
            span.mr-1 Barcode:
            .icon--small.icon--right.icon-scan.surface-900.icon--absolute
            InputText
      StockOutPackingTableList(:isOriginal='true')
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
class PackingOriginal extends Vue {
  tabs: any = [
    { index: 1, title: 'box 1', content: 'Content 1',checked: false, boxSizeSelect:'', estimateFee: 0 },
    { index: 2, title: 'box 2', content: 'Content 2',checked: false, boxSizeSelect:'', estimateFee: 0 },
    { index: 3, title: 'box 3', content: 'Content 3',checked: false, boxSizeSelect:'', estimateFee: 0 }
  ]

  boxSize: any = [
    { name: 'Small size (20*20*20)', code: 'S' },
    { name: 'Medium size (20*20*20)', code: 'M' },
    { name: 'Large size (20*20*20)', code: 'L' },
    { name: 'Extra size (20*20*20)', code: 'XL' }
  ]

  @Prop() readonly title!: string | undefined
  @Prop() readonly icon!: string | undefined
  @Prop() readonly isOriginal!: boolean | false
  @Prop() readonly isOutgoing!: boolean | false
  @Prop() readonly isTranffering!: boolean | false
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
      .p-dropdown,
      .p-inputtext
        background: $text-color-300
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
