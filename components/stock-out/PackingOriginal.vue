<template lang="pug">
.packing__common--table.bg-white.border-round.w-full
  Button.bg-white.text-primary.border-0.btn-add-tab(v-if='!isOriginal' @click="handleAddTab") + Add
  TabView(:scrollable="true" @tab-change="tabChange" :activeIndex="active")
    TabPanel(:disabled="true")
      template(#header)
        .icon.inline-block.mr-2(:class='icon')
        span.uppercase {{title}}
        .uppercase &nbsp;(2 boxes, 4 items)
    TabPanel(v-for='tab in tabs' :key='tab.index')
      template(#header)
        .icon.icon-box-packing-outline.inline-block.mr-2.surface-700
        .icon.icon-box-packing.hidden.mr-2
        span.uppercase.text-700 {{tab.title}}
        .text-white.bg-primary.border-round.ml-1.p-1(v-if='isOutgoing && tab.checked') &nbsp;Tag
      .grid.grid-nogutter.border-bottom-1.border-gray-300.align-items-center.px-4(v-if='!isOriginal')
        .col-3.py-3.border-right-1.border-gray-300
          span.mr-1 Size:
          Dropdown(v-model='tab.boxSizeSelect' :options="boxSize" optionLabel="name" placeholder="Select a box size").w-9
          span.ml-1 (cm)
        .col-1.py-3.ml-2.border-right-1.border-gray-300(v-if='isOutgoing')
          Checkbox(v-model="tab.checked" :binary="true")
          span.ml-2 Attach Tag
        .col-3.ml-2.py-3.border-right-1.border-gray-300(v-if='isTranffering')
          .grid.align-items-center
            .col-4
              div Estimated
              div Inventory Fee:
            .col
              InputText.w-4(v-model='tab.estimateFee' type='number')
              span.ml-1 / day
        .col.py-3.flex.justify-content-end
          span.p-input-icon-right
            span.mr-1 Barcode:
            .icon--small.icon--right.icon-scan.surface-900.icon--absolute
            InputText
      StockOutPackingTableList(:isOriginal='true' :value="tab.content" :type='type')
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'nuxt-property-decorator'

@Component
class PackingOriginal extends Vue {
  active: number = 1
  tabs: any = []
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
  @Prop() listOriginalBox!: Array<any>
  @Prop() readonly type!: string | undefined

  @Watch('listOriginalBox')
  filterListOriginalBox () {
    if(this.listOriginalBox) {
      this.tabs = this.listOriginalBox.map((item: any, index: number) => {
        return { index: index + 1, title: item.boxCode, content: item.items, checked: false, boxSizeSelect: '', estimateFee: 0 }
      })
    }
  }

  handleAddTab() {
    if(this.tabs.length <= 9) {
      this.tabs.push({
        index: this.tabs.length, title: 'EX01', content: '',checked: true
      })
    }
  }
}

export default PackingOriginal
</script>
<style lang="sass" scoped>
::v-deep.packing__common--table
  position: relative
  .btn-add-tab
    position: absolute
    right: 32px
    top: 4px
    z-index: 1
    box-shadow: none
    &::before
      position: absolute
      content: ''
      height: 100%
      width: 1px
      background-color: #dee2e6
      left: 0
  .p-tabview
    .icon
      background: $primary-dark
    .p-tabview-panels
      min-height: 166px
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
          min-width: 265px !important
          opacity: 1
          font-size: 12px
          border-right: 1px solid $bg-body-base
        li .p-tabview-nav-link
          border-bottom: none
          span
            color: $text-color-900
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
