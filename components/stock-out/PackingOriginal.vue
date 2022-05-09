<template lang="pug">
.packing__common--table.bg-white.border-round.w-full
  Button.bg-white.text-primary.border-0.btn-add-tab(v-if='!isOriginal' @click="handleAddTab") + Add
  span.p-input-icon-right.absolute.scan__boxcode(v-if='isOriginal')
    .icon--small.icon--right.icon-scan.surface-900.icon--absolute
    InputText.border-0.w-full.mb-1(
      type="text"
      @change='changeBoxCode($event)'
      v-model="boxCodeText"
      placeholder='Please enter box code!'
    )
  TabView(:activeIndex="activeIndex" :scrollable="true" @tab-change="tabChange" :class='isOriginal ? "originalTable" : "outGoingTable"')
    TabPanel(:disabled="true")
      template(#header)
        .icon.inline-block.mr-2(:class='icon')
        span.uppercase {{title}}
        .uppercase &nbsp;(2 boxes, 4 items)
    TabPanel(v-for='tab in tabs' :key='tab.index' :disabled="tab.key !== activeIndex && type === 'originalBox'")
      template(#header)
        .icon.icon-box-packing-outline.inline-block.mr-2.surface-700
        .icon.icon-box-packing.hidden.mr-2
        span.uppercase.text-700 {{tab.title}}
        .ml-1.px-1(v-if='isOutgoing && tab.checked') {{tagCodeOnTab}}
      .grid.grid-nogutter.border-bottom-1.border-gray-300.align-items-center.px-4(v-if='!isOriginal')
        .col-3.py-3.border-right-1.border-gray-300
          span.mr-1 Size:
          Dropdown(v-model='tab.boxSizeSelect' :options="boxSize" optionLabel="name").w-9
          span.ml-1 (cm)
        .col-1.py-3.ml-2.border-right-1.border-gray-300(v-if='isOutgoing')
          Checkbox(v-model="tab.checked" :binary="true")
          span.ml-2 Attach Tag
        .col-3.ml-2.py-3.border-right-1.border-gray-300
          .grid.align-items-center(v-if='isTranffering')
            .col-4
              div Estimated
              div Inventory Fee:
            .col
              InputText.w-4(v-model='tab.estimateFee' type='number')
              span.ml-1 / day
          .grid.justify-content-center.align-items-center(v-if='isOutgoing && tab.checked')
            span.mr-1 Tag code:
            InputText(type='number' @change='addTagByBarCode' v-model='tagCodeText')
        .col.py-3.flex.justify-content-end
          span.p-input-icon-right
            span.mr-1 Barcode:
            .icon--small.icon--right.icon-scan.surface-900.icon--absolute
            InputText(@change='addStockByBarcode($event)' v-model="barCodeText" autofocus)
      StockOutPackingTableList(:isOriginal='true' :value="tab.content" :type='type')
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'nuxt-property-decorator'

@Component
class PackingOriginal extends Vue {
  activeIndex: number = 0
  tabs: any = []
  boxSize: any = [
    { name: 'Small size (20*20*20)', code: 'S' },
    { name: 'Medium size (20*20*20)', code: 'M' },
    { name: 'Large size (20*20*20)', code: 'L' },
    { name: 'Extra size (20*20*20)', code: 'XL' }
  ]

  // originalIndex: number = 0
  barCodeText: string = ''
  boxCodeText: string = ''
  tagCodeText: string = ''
  tagCodeOnTab: string = ''

  @Prop() readonly title!: string | undefined
  @Prop() readonly icon!: string | undefined
  @Prop() readonly isOriginal!: boolean | false
  @Prop() readonly isOutgoing!: boolean | false
  @Prop() readonly isTranffering!: boolean | false
  @Prop() listBox!: Array<any>
  @Prop() readonly type!: string | undefined

  @Watch('listBox', { immediate: true, deep: true })
  filterListOriginalBox () {
    if(this.listBox) {
      this.tabs = this.listBox.map((item: any, index: number) => {
        return { index, title: item.boxCode, content: item.items, checked: false, boxSizeSelect: '', estimateFee: 0 }
      })
    }
  }

  handleAddTab() {
    if(this.tabs.length <= 9) {
      this.$emit('addBoxNew')
      this.activeIndex++
      this.$emit('selectedTab', this.activeIndex)
    }
  }

  addStockByBarcode(e) {
    const barCode = e.target.value
    if(barCode.length === 13) {
      this.$emit('addStockByBarcode', barCode)
    }
    this.barCodeText = ''
  }

  tabChange({ index }) {
    if(this.type !== 'originalBox') {
      this.$emit('selectedTab', index)
    } else {
      this.activeIndex = index
    }
  }

  changeBoxCode(e) {
    const boxCode = e.target.value
    if(boxCode.length === 13) {
      const index = _.findIndex(this.listBox, { boxCode })
      if(index >= 0){
        this.activeIndex = index + 1
        this.$emit('selectedTab', index)
      }
    }
    this.boxCodeText = ''
  }

  addTagByBarCode(e:any) {
    this.tagCodeOnTab = e.target.value
    const tagCode = e.target.value
    this.$emit(tagCode)
    this.tagCodeText = ''
  }
}

export default PackingOriginal
</script>
<style lang="sass" scoped>
::v-deep.packing__common--table
  position: relative
  .originalTable
    .p-tabview-nav-container
      width: calc(100% - 235px)
  .outGoingTable
    .p-tabview-nav-container
      width: calc(100% - 59px)
  .p-inputtext
    background: $text-color-300
  .scan__boxcode
    top: 2px
    right: 0
  .btn-add-tab
    position: absolute
    right: 0
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
        .p-disabled:first-child
          min-width: 265px !important
        .p-disabled
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
