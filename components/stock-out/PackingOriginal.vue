<template lang="pug">
.packing__common--table.bg-white.border-round.w-full(:class='isPackingDetail ? "packing-detail" : ""')
  Toast
  Button.bg-white.text-primary.border-0.btn-add-tab(v-if='!isOriginal  && !isPackingDetail' @click="handleAddTab") + Add
  span.p-input-icon-right.absolute.scan__boxcode(v-if='isOriginal && !isPackingDetail')
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
        .uppercase &nbsp;({{getTotalBox}} box(es), {{getTotalItem}} items)
        span(v-if='type === "tranferringBox"') RN
    TabPanel(v-for='(tab,index) in listBox' :key='index' :disabled="isDisable(tab)")
      template(#header)
        .icon.icon-box-packing-outline.inline-block.mr-2.surface-700
        .icon.icon-box-packing.hidden.mr-2
        span.uppercase.text-700 {{tab.boxCode}}
        .ml-1.px-1(v-if='isOutgoing && tab.checked') {{ tab.tagCode }}
        AutoComplete.edit-location.ml-1(
          v-if="isShowLocation(tab)"
          v-model='tab.location',
          field='name',
          :suggestions='locationList',
          @complete='searchLocation($event)'
          :dropdown='true'
          forceSelection
        )
          template(#item='slotProps')
            .grid.align-items-center.grid-nogutter
              span.font-bold.text-small {{ slotProps.item.name }}
              .icon-arrow-up-right.icon
      .grid.grid-nogutter.border-bottom-1.border-gray-300.align-items-center.px-4(v-if='!isOriginal  && !isPackingDetail')
        .col-3.py-3.border-right-1.border-gray-300
          span.mr-1 Size:
          Dropdown.ml-1(v-model='tab.boxSize' :options="boxSizeList" optionLabel="name").w-9
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
              InputText.w-4(v-model='tab.inventoryFee' type='number')
              span.ml-1 / day
          .grid.justify-content-center.align-items-center(v-if='isOutgoing && tab.checked')
            span.mr-1 Tag code:
            InputText(@change='addTagByBarCode')
        .col.py-3.flex.justify-content-end
          span.p-input-icon-right
            span.mr-1 Barcode:
            .icon--small.icon--right.icon-scan.surface-900.icon--absolute
            InputText(@change='addStockByBarcode($event)' v-model="barCodeText")
      StockOutPackingTableList(:isOriginal='true' :value="tab.items" :type='type')
</template>
<script lang="ts">
import { Component, Vue, Prop, namespace } from 'nuxt-property-decorator'
const nsStoreLocationList = namespace('location/location-list')
const nsStorePackingDetail = namespace('stock-out/packing-box')

@Component
class PackingOriginal extends Vue {
  activeIndex: number = 0
  tabs: any = []
  selectedsd: any = null
  barCodeText: string = ''
  boxCodeText: string = ''
  locationBox: any = []
  isPackingDetail: boolean = false

  @Prop() readonly title!: string | undefined
  @Prop() readonly icon!: string | undefined
  @Prop() readonly isOriginal!: boolean | false
  @Prop() readonly isOutgoing!: boolean | false
  @Prop() readonly isTranffering!: boolean | false
  @Prop() listBox!: Array<any>
  @Prop() boxSizeList!: Array<any>
  @Prop() readonly type!: string | undefined
  // @Prop() location !: Array<any>

  @nsStoreLocationList.State
  locationList: {}

  @nsStoreLocationList.Action
  actLocationList!: (params: any) => Promise<void>

  @nsStorePackingDetail.Action
  actScanAirtag!: (params: any) => Promise<void>

  getTabKey(tab) {
    return tab.boxCode + (tab.location?.id || '')
  }

  handleAddTab() {
    if(this.listBox.length <= 9) {
      this.$emit('addBoxNew')
      this.activeIndex = this.listBox.length
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
    }
    this.activeIndex = index
  }

  changeBoxCode(e) {
    const boxCode = e.target.value
    if(boxCode.length === 13) {
      const index = _.findIndex(this.listBox, { boxCode })
      if(index >= 0){
        const itemsBox = _.get(this.listBox[this.activeIndex - 1], 'items')
        if(!_.size(_.partition(itemsBox, ['quantity', 0])[1]) || !itemsBox) {
          this.activeIndex = index + 1
          this.$emit('selectedTab', index)
        } else {
          this.$toast.add({
            severity: 'error',
            summary: 'Error Message',
            detail: 'Please buy original item (quantity = 0)',
            life: 3000
          })
        }
      } else {
        this.$toast.add({
          severity: 'error',
          summary: 'Error Message',
          detail: 'The box code is not in the original listing',
          life: 3000
        })
      }
    }
    this.boxCodeText = ''
  }

  async addTagByBarCode(e:any) {
    const barCode = e.target.value
    await this.actScanAirtag(barCode)
    this.listBox[this.activeIndex - 1].tagCode = e.target.value
  }

  get getTotalBox() {
    return _.size(this.listBox)
  }

  get getTotalItem() {
    const sum = this.listBox.reduce((accumulator, object) => {
      const length = this.type === 'originalBox' ? _.size(_.partition(object.items, ['outGoingQuantity', 0])[1]) : _.size(object.items)
      return accumulator +  length
    }, 0)
    return sum
  }

  async searchLocation (e) {
    await this.actLocationList({
      location: e.query
    })
  }

  isShowLocation(obj) {
    return _.has(obj, 'location') && this.type === 'tranferringBox'
  }

  mounted() {
    if(this.$route.name?.includes('packing-detail')) {
      this.isPackingDetail = true
    }
  }

  isDisable(tab) {
    if(this.$route.name?.includes('packing-detail')) {
      this.activeIndex = 1
    }
    return tab.key !== this.activeIndex && this.type === 'originalBox'
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
    .p-tabview-nav-container
      overflow: unset !important
    .p-tabview-nav li .p-tabview-nav-link
      .pi-chevron-down
        color: #fff !important
      &:focus
        box-shadow: none
      &:hover
        border: none
    .p-tabview-nav-content
      overflow: unset !important
      .edit-location
        width: 160px !important
      .p-tabview-nav
        overflow: unset !important
        .p-disabled:first-child
          min-width: 265px !important
        .p-disabled
          opacity: 1
          font-size: 12px
          border-right: 1px solid $bg-body-base
        li
          overflow: unset !important
        li .p-tabview-nav-link
          border-bottom: none
          height: 100% !important
          span
            color: $text-color-900
        .p-tabview-nav-link
          overflow: unset !important
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
::v-deep.packing__common--table.packing-detail
  .originalTable
    .p-tabview-nav-container
      width: 100% !important
  .outGoingTable
    .p-tabview-nav-container
      width: 100% !important
</style>
