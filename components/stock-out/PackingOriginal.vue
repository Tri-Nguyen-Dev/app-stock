<template lang="pug">
.packing__common--table.bg-white.border-round.w-full(:class='isPackingDetail ? "packing-detail" : isMergeBox ? "transfer" : ""')
  Toast
  Button.bg-white.text-primary.border-0.btn-add-tab.font-semibold(
    v-if='!isOriginal  && !isPackingDetail'
    @click="handleAddTab"
    :disabled="disableEditQty") + Add
  span.p-input-icon-right.absolute.scan__boxcode(v-if='isOriginal && !isPackingDetail')
    .icon--small.icon--right.icon-scan.surface-900.icon--absolute
    InputText.inputSearchCode.w-full.input-border(
      @change='changeBoxCode($event)'
      v-model="boxCodeText"
      placeholder='Please enter box code!'
      ref="inputScanBoxCode"
      :disabled="disableEditQty"
    )
  Button.btn-print.font-semibold.btn.btn-primary(label="Print" v-if='isPackingDetail && listBox.length > 0' @click='isShowLabel = true')
  TabView.h-full.flex.flex-column(:activeIndex="activeIndex" :scrollable="true" @tab-change="tabChange"
    :class='classTabView'
  )
    TabPanel(:disabled="true")
      template(#header)
        .icon.inline-block.mr-2(:class='icon')
        span.uppercase {{title}}
    TabPanel.h-full(v-for='(tab,index) in listBox' :key='index' :disabled="isDisable(tab)")
      template(#header)
        .icon.icon-box-packing-outline.inline-block.mr-2.surface-700
        .icon.icon-box-packing.hidden.mr-2
        span.uppercase.text-700 {{tab.boxCode}}
        span.ml-2(v-if="!isOriginal && !tab.items.length > 0" @click.stop="handleDeleteBox(index)")
          span.pi.pi-times.delete-box
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
              .icon-arrow-up-right.icon.ml-2
        .aritag-text(v-if='isOutgoing && tab.checked && tab.airtag') {{ tab.airtag.barCode }}
        .aritag-text(v-if='tab.airtag && isPackingDetail') {{ tab.airtag.barCode }}
      .grid.grid-nogutter.border-bottom-1.border-gray-300.align-items-center.px-4(v-if="isOriginal")
        .col.py-3
          span.mr-2 Capacity:
          .p-input-icon-right(v-if="!isPackingDetail")
            InputNumber(id="percent" suffix="%" v-model="tab.usedCapacity" :max="100" :disabled="isDisabledCapcity")
          span(v-else) {{ tab.usedCapacity | capacityPercent}}
        .col.py-3.flex.justify-content-end(v-if="!isMergeBox && !isPackingDetail")
          Button.btn.btn-primary.h-3rem(@click="showFormReport") Report
      .grid.grid-nogutter.border-bottom-1.border-gray-300.align-items-center.px-4(v-if='!isOriginal  && !isPackingDetail')
        .col.py-3.border-right-1.border-gray-300.h-full(v-if="isTranffering")
          span.mr-2 Capacity:
          .p-input-icon-right
            InputNumber.input-number(id="percent" suffix="%" v-model="tab.usedCapacityTranffering" :max="100" :disabled="disableEditQty")
        .col.py-3.flex.align-items-center.px-3.h-full
          span.mr-1 Size:
          Dropdown.ml-1(v-model='tab.boxSize' :options="boxSizeList" optionLabel="name" :disabled="disableEditQty")
          span.ml-1 (cm)
        .col.py-3.border-right-1.border-left-1.border-gray-300.flex.align-items-center.px-3.h-full(v-if='isOutgoing')
          Checkbox(v-model="tab.checked" :binary="true" :disabled='hasTagStock(tab)' @change="handleChangeTag(tab)")
          span.ml-2 Attach Tag
          div.ml-2(v-if='isOutgoing && tab.checked')
            span.p-input-icon-right
              .icon--small.icon--right.icon-scan.surface-900.icon--absolute
              InputText.inputSearchCode.input-border(
                @change='addTagByBarCode'
                v-model="tagCodeText"
                ref="inputScanTag"
              )
        .col.py-3.border-right-1.border-left-1.border-gray-300.px-3.relative.z-3(v-if='isTranffering')
          div.flex.align-items-center
            div
              div Estimated
              div Inventory Fee:
            div.ml-2
              InputNumber(
                v-model='tab.inventoryFee',
                mode='currency',
                currency='USD',
                locale='en-US'
                :disabled="disableEditQty"
              )
              span.ml-1 / day
        .col.py-3.flex.justify-content-end.align-items-center
          span.mr-1 Barcode:
          span.ml-1.p-input-icon-right
            .icon--small.icon--right.icon-scan.surface-900.icon--absolute
            InputText.input-border.inputSearchCode(
              placeholder='Please enter bar code!'
              @change='addStockByBarcode($event)'
              v-model="barCodeText"
              ref="inputScanBarCode"
              :disabled="disableEditQty"
            )
      .grid.grid-nogutter.border-bottom-1.border-gray-300.align-items-center.px-4(v-if='!isOriginal  && isPackingDetail')
        .col-fixed.pr-3.py-3.border-right-1.border-gray-300
          span.mr-1.font-semibold Size: {{tab.boxSize.name}} {{tab.boxSize.height}}*{{tab.boxSize.width}}*{{tab.boxSize.length}}
          span.ml-1.font-semibold (cm)
        .col.ml-2.py-3.flex.justify-content-end
          span.font-semibold Box Code: {{tab.newBoxCode}}
      StockOutPackingTableList.flex-1.overflow-hidden(:isOriginal='true' :value="tab.items" :type='type' :boxCode='tab.boxCode'
        :isPackingDetail="isPackingDetail" @handleDeleteStock="handleDeleteStock"
      )
  PrintLabel(
    :displayLable='isShowLabel',
    @setShow='setShowLabel',
    :DOId='DOId',
    :boxIds='boxIds'
    :type='type'
    v-if='isPackingDetail',
	)
</template>
<script lang="ts">
import { Component, Vue, Prop, namespace, Watch, InjectReactive } from 'nuxt-property-decorator'
import PrintLabel from '~/components/pdf/PrintLabel.vue'
const nsStoreLocationList = namespace('location/location-list')
const nsStorePackingDetail = namespace('stock-out/packing-box')

@Component({
  components: {
    PrintLabel
  }
})
class PackingOriginal extends Vue {
  activeIndex: number = 0
  tabs: any = []
  selectedsd: any = null
  barCodeText: string = ''
  boxCodeText: string = ''
  tagCodeText: string = ''
  isPackingDetail: boolean = false
  isShowLabel: boolean = false

  @Prop() readonly title!: string | undefined
  @Prop() readonly icon!: string | undefined
  @Prop() readonly isOriginal!: boolean | false
  @Prop() readonly isOutgoing!: boolean | false
  @Prop() readonly isTranffering!: boolean | false
  @Prop() listBox!: Array<any>
  @Prop() boxSizeList!: Array<any>
  @Prop() readonly type!: string | undefined
  @Prop() readonly autoActiveTabOut!: boolean | false
  @Prop() readonly isNextBox!: any

  @InjectReactive() readonly packingStep!: any
  @InjectReactive() readonly isMergeBox!: boolean | false

  @nsStoreLocationList.State
  locationList: {}

  @nsStorePackingDetail.Action
  actScanAirtag!: (params: any) => Promise<any>

  @nsStoreLocationList.Action
  actLocationList!: (params: any) => Promise<void>

  @Watch('activeIndex')
  async inputChange(index) {
    await this.$nextTick()
    if(this.$refs.inputScanBarCode && !this.isOriginal) {
      const inputRef = this.$refs.inputScanBarCode[index - 1] as any
      await this.$nextTick(() =>  inputRef?.$el.focus())
    }
  }

  @Watch('autoActiveTabOut')
  activeFirstOutTag(value) {
    if(value && this.isOutgoing || this.isTranffering) {
      this.activeIndex = 1
      this.$emit('selectedTab', 1)
    }
  }

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
        if((!_.size(_.partition(itemsBox, ({ out, actual }) => out === actual)[1]) || !itemsBox) && !this.isMergeBox) {
          this.activeIndex = index + 1
          this.$emit('selectedTab', index)
        } else if((!_.size(_.partition(itemsBox, ['quantity', 0])[1]) || !itemsBox) && this.isMergeBox) {
          this.activeIndex = index + 1
          this.$emit('selectedTab', index)
        }
        else {
          this.$toast.add({
            severity: 'error',
            summary: 'Error Message',
            detail: 'Current box processing has not been complete. Please complete before moving to others',
            life: 3000
          })
        }
      } else {
        this.$toast.add({
          severity: 'error',
          summary: 'Error Message',
          detail: 'The box not found in original list!',
          life: 3000
        })
      }
    }
    this.boxCodeText = ''
  }

  async addTagByBarCode(e:any) {
    const barCode = e.target.value
    const tagCode = await this.actScanAirtag(barCode)
    if(tagCode) {
      this.tagCodeText = ''
      const tagCodeExist = _.find(this.listBox, function({ airtag }) {
        if (airtag?.barCode === barCode) {
          return true
        }
      })
      if(tagCodeExist) {
        this.$toast.add({
          severity: 'error',
          summary: 'Error Message',
          detail: 'This tag is not available in this time!',
          life: 3000
        })
      } else if(tagCode.status === 'AIRTAG_STATUS_AVAILABLE') {
        this.listBox[this.activeIndex - 1].airtag = {
          id: tagCode.id,
          barCode: e.target.value
        }
      } else {
        this.$toast.add({
          severity: 'error',
          summary: 'Error Message',
          detail: 'This tag is not exist!',
          life: 3000
        })
      }
    } else {
      this.$toast.add({
        severity: 'error',
        summary: 'Error Message',
        detail: 'This tag code is not exist!',
        life: 3000
      })
    }
    this.tagCodeText = ''
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

  get isDisabledCapcity() {
    if(!this.isNextBox) {
      return 'disabled'
    }
  }

  isShowLocation(obj) {
    return obj?.location && this.type === 'tranferringBox'
  }

  mounted() {
    if(this.$refs.inputScanBoxCode) {
      const inputRef = this.$refs.inputScanBoxCode as any
      inputRef.$el.focus()
    }
    if(this.$route.name?.includes('packing-detail')) {
      this.isPackingDetail = true
    }
  }

  isDisable(tab) {
    if(this.$route.name?.includes('packing-detail')) {
      this.activeIndex = 1
      return
    }
    return tab.key !== this.activeIndex && this.type === 'originalBox'
  }

  handleDeleteStock(stockDelete, boxCode) {
    const box = _.find(this.listBox, { boxCode })
    if(box) {
      _.remove(box.items, ({ barCode, originalBox }) => {
        return barCode === stockDelete.barCode && originalBox === stockDelete.originalBox
      })
      if(!this.hasTagStock(box)) {
        box.checked = false
        box.airtag = null
      }
    }
    this.$forceUpdate()
  }

  handleDeleteBox(index) {
    this.$emit('handelDeteleBoxEmpty', index)
    if(index < this.activeIndex - 1) {
      this.$nextTick(() => (this.activeIndex = this.activeIndex - 1))
    } else if(index === this.activeIndex - 1) {
      this.$nextTick(() => (this.activeIndex = 0))
    }
  }

  hasTagStock(box) {
    if(!box) return
    const isHasTag = _.find(box.items, { hasAirtag: true })
    return !!isHasTag
  }

  async handleChangeTag(box) {
    if(box) {
      if(!box.checked) {
        _.set(box, 'airtag', null)
      } else {
        await this.$nextTick()
        if(this.$refs.inputScanTag && this.isOutgoing) {
          const inputRef = this.$refs.inputScanTag[this.activeIndex - 1] as any
          await this.$nextTick(() =>  inputRef?.$el.focus())
        }
      }
    }
  }

  showFormReport() {
    this.$emit('showFormReportBox')
  }

  get disableEditQty() {
    if(this.packingStep === 2) {
      return 'disabled'
    }
    else return null
  }

  async searchLocation(e) {
    await this.actLocationList({
      location: e.query,
      pageSize:20,
      pageNumber:0
    })
  }

  setShowLabel(value: any) {
    this.isShowLabel = value
  }

  get DOId() {
    return this.$route.params.id || ''
  }

  get boxIds() {
    if(this.type === 'originalBox') {
      return _.map(this.listBox, 'boxCode')
    } else {
      return _.map(this.listBox, 'newBoxCode')
    }
  }

  get classTabView() {
    return this.isOriginal ? 'originalTable' : 'outGoingTable'
  }
}

export default PackingOriginal
</script>
<style lang="sass" scoped>
::v-deep.packing__common--table
  position: relative
  height: 50%
  .delete-box
    position: relative
    z-index: 1000
    font-size: 10px !important
  .input-border
    border: 1px solid #ced4da
    box-shadow: none
    &:focus
      border: 1.5px solid $primary
  .p-inputtext:enabled:focus
    box-shadow: none !important
  .originalTable
    .p-tabview-nav-container
      width: calc(100% - 200px)
  .outGoingTable
    .p-tabview-nav-container
      width: calc(100% - 59px)
  .scan__boxcode
    right: 0
    height: 42px !important
    width: 200px !important
    top: 0
    .p-inputtext
      height: 100%
      margin: 0 !important
    .p-inputtext:enabled:focus
      box-shadow: none !important
  .btn-print
    width: 65px
    height: 42px
    position: absolute
    right: 0
    top: 21px
    transform: translateY(-50%)
    z-index: 1
    box-shadow: none
  .btn-add-tab
    position: absolute
    right: 0
    top: 21px
    transform: translateY(-50%)
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
    .p-tabview-nav-btn.p-link
      border-radius: 3px
      box-shadow: none
      border: 1px solid #dee2e6
    .icon
      background: $primary-dark
    .icon-capacity
      background-color: unset !important
    .p-tabview-panels
      flex: 1
      display: flex
      flex-direction: column
      overflow: hidden
      padding: 0
      .p-tabview-panel
        display: flex
        flex-direction: column
      .p-datatable .p-datatable-thead > tr > th
        background: #fff !important
    .aritag-text
      margin-left: 8px
      color: $text-color-700
    .p-tabview-panel
      flex: 1
      display: flex
      flex-direction: column
    ul.p-tabview-nav
      height: 42px !important
      position: relative
      z-index: 2
    .p-tabview-nav-next, .p-tabview-nav-prev
      z-index: 3
    .p-tabview-nav-container
      overflow: unset !important
    .p-tabview-nav li .p-tabview-nav-link
      &:focus
        box-shadow: none
      &:hover
        border: none
    .p-tabview-nav-content
      overflow-y: visible !important
      padding-bottom: 250px
      margin-bottom: -250px
      position: relative
      .edit-location
        font-size: 14px !important
        position: relative !important
        z-index: 2
        width: 120px !important
        .p-autocomplete-panel
          font-size: 12px !important
          width: 200px
          &::-webkit-scrollbar
            width: 6px
            height: 6px
          &::-webkit-scrollbar-thumb
            border-radius: 10px
            background-color: $text-color-700
        input
          padding: 0
          text-align: center
          font-size: $font-size-small
          color: $text-color-800
          box-shadow: none !important
          border: none !important
          background-color: unset !important
        .p-button
          padding: 0
          width: 16px
          background-color: unset !important
          border: none !important
          span
            font-size: 10px !important
        .p-button:enabled:hover
          box-shadow: none !important
      .p-tabview-nav
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
  .originalTable, .outGoingTable
    .p-tabview-nav-container
      width: calc(100% - 65px) !important
::v-deep.packing__common--table.transfer
  height: 40%
  .p-inputtext
    background: unset !important
</style>
