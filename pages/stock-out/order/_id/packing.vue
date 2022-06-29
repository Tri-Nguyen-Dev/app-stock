<template lang="pug">
  .grid.grid-nogutter.packing__detail--container
    Toast
    ConfirmDialogCustom(
      title="Report Confirm"
      image="confirm-delete"
      :isShow="isShowModalReport"
      :onOk="handleReportBox"
      :onCancel="cancelReportBox"
      :loading="loadingSubmit"
    )
      template(v-slot:message)
        p Do you want to report the quantity discrepancy  in the box {{ originalBoxActive.boxCode }}?
      template(v-slot:content)
        h3.text-left.text-900 NOTE:
        Textarea.text-left.w-full(v-model="valueReportNote" rows="4" placeholder="Please note here for your report if necessary")
    .packing__detail--left.col-3.surface-0.border-round.h-full.overflow-y-auto.sub-tab
      StockOutPackingInformationDetail(:deliveryOrderDetail="deliveryOrderDetail")
    .col-9.ml-5.py-0.h-full.overflow-y-auto.overflow-x-hidden.flex-1.relative.flex.flex-column
      .flex.flex-column.flex-1.overflow-hidden
        StockOutPackingOriginal.mb-2(
          title='original box'
          icon='icon-info'
          :isOriginal='true'
          :listBox="listOriginalBox"
          type='originalBox'
          @selectedTab='selectedOriginalBox'
          @showFormReportBox="showFormReportBox"
          :isNextBox="isNextBox"
        )
        StockOutPackingOriginal.mb-2(
          title='outgoing box'
          icon='icon-arrow-circle-up-right'
          :isOutgoing='true'
          :listBox="listOutGoingBox"
          type='outGoingBox'
          @selectedTab='selectedOutGoingBox'
          @addBoxNew="addNewBoxOutGoing"
          @addStockByBarcode='addStockInOutGoing'
          @handelDeteleBoxEmpty='handelDeteleBoxEmpty'
          :boxSizeList='boxSizeList'
          :autoActiveTabOut="autoActiveTabOut"
        )
      .packing__detail--footer.grid.grid-nogutter.bg-white.border-round.align-items-center
        .col.p-1
          .grid.align-items-center
            .col-1
              .icon--large.icon-note
            .col
              div(style="padding-left: 10.5px") Note:
              //- InputText.inputSearchCode.w-full(v-model="noteText" rows="1" cols="40" placeholder='Write something...')
        .col-2.border-right-1.border-gray-300.p-1
          .grid.align-items-center
            .col-3
              img(src='~/assets/icons/box-border.svg')
            .col
              span.font-semibold.text-base.mr-1 Total boxs:
              .font-semibold.text-primary {{ listOutGoingBox.length }}
        .col-2.border-right-1.border-gray-300.p-1
          .grid.align-items-center
            .col-3
              img(src='~/assets/icons/total-items-border.svg')
            .col
              span.font-semibold.text-base.mr-1 Total items:
              .font-semibold.text-primary {{ totalItem }}
        .col-2.flex.justify-content-end.p-1
          Button.btn.btn-primary.ml-3(@click="handleSubmit" :disabled="isDisabled") Save
</template>

<script lang="ts">
import { Component, Vue, namespace, ProvideReactive, Watch } from 'nuxt-property-decorator'
import ConfirmDialogCustom from '~/components/dialog/ConfirmDialog.vue'
import { PackingDetail } from '~/models/PackingDetail'
const nsStorePackingDetail = namespace('stock-out/packing-box')
const nsStoreBox = namespace('box/box-size-list')

@Component({
  components: {
    ConfirmDialogCustom
  }
})
class DeliveryOrderPacking extends Vue {
  outGoingBoxActive: any = { boxCode: 'EX1', items: [] }
  indexScanBoxCode: number = 0
  autoActiveTabOut: boolean = false
  listOriginalBox: any = []
  noteText: string = ''
  isShowModalReport: boolean = false
  loadingSubmit: boolean = false
  valueReportNote: any = null
  listOutGoingBox: any = [
    {
      boxCode: 'EX1',
      items: [],
      airtag: null,
      checked: false,
      boxSize: null
    }
  ]

  @ProvideReactive()
  originalBoxActive: any = {}

  @nsStorePackingDetail.State('totalOriginalList')
  totalOriginalList!: number

  @nsStorePackingDetail.State('originalList')
  originalList!: PackingDetail.OriginalBox[]

  @nsStorePackingDetail.State('deliveryOrderDetail')
  deliveryOrderDetail!: any

  @nsStoreBox.State
  boxSizeList!: any

  @nsStorePackingDetail.Action
  actGetListOriginal!: (id: any) => Promise<any>

  @nsStorePackingDetail.Action
  actGetDeliveryOrderDetail!: (id: any) => Promise<any>

  @nsStoreBox.Action
  actGetBoxSizeList!:() => Promise<any>

  @nsStorePackingDetail.Action
  actSavePackingDetail!:(data: any) => Promise<any>

  @nsStorePackingDetail.Action
  actCreateReport!:(data: any) => Promise<any>

  async mounted() {
    const { id } = this.$route.params
    await Promise.all ([
      this.actGetDeliveryOrderDetail(id),
      this.actGetBoxSizeList()
    ])
    const result = await this.actGetListOriginal(id)
    if (result) {
      this.listOriginalBox = this.originalList.map((x: any) => {
        const obj = _.cloneDeep(x)
        return {
          ...obj,
          usedCapacity: obj.usedCapacity * 100,
          suggestCapacity: obj.suggestCapacity * 100,
          items: obj.items.map((item) => ({
            ...item,
            initialQuantity: item.quantity,
            actualOutGoing: 0
          }))
        }
      })
    }
  }

  selectedOriginalBox(index: number) {
    this.indexScanBoxCode++
    if(this.indexScanBoxCode === 1) {
      this.autoActiveTabOut = true
    }
    this.originalBoxActive = this.listOriginalBox[index]
  }

  genearateBoxCode(listPacking, subname) {
    let boxCode = subname
    if(listPacking.length > 0) {
      const lastNo = _.last(listPacking)?.boxCode.replace(subname, '')
      boxCode += parseInt(lastNo) + 1
    } else {
      boxCode += 1
    }
    return boxCode
  }

  addNewBoxOutGoing() {
    this.listOutGoingBox.push({
      boxCode: this.genearateBoxCode(this.listOutGoingBox, 'EX'),
      items: [],
      airtag: null,
      checked: false,
      boxSize: null
    })
    if (_.size(this.listOutGoingBox) === 1)
      this.outGoingBoxActive = this.listOutGoingBox[0]
  }

  addStockInOutGoing(barCode: string) {
    const stockOriginal = _.find(this.originalBoxActive.items, { barCode })
    if (stockOriginal) {
      const stockOutGoing = _.find(this.outGoingBoxActive.items, { barCode, originalBox: this.originalBoxActive.boxCode })
      const { outGoingQuantity, actualOutGoing, hasAirtag } = stockOriginal
      const isFullQuantityStock = outGoingQuantity > actualOutGoing
      this.addStock(
        this.outGoingBoxActive,
        stockOriginal,
        stockOutGoing,
        isFullQuantityStock
      )
      if(hasAirtag && !this.outGoingBoxActive.checked && isFullQuantityStock) {
        this.outGoingBoxActive.checked = hasAirtag
      }
    } else {
      this.$toast.add({
        severity: 'error',
        summary: 'Error Message',
        detail: 'Item not found in original box!',
        life: 3000
      })
    }
  }

  addStock(
    boxActive,
    stockOriginal,
    stockPacking,
    isFullQuantityStock
  ) {
    if (isFullQuantityStock) {
      stockOriginal.quantity--
      if (stockPacking) {
        stockPacking.quantity++
      } else {
        boxActive.items.unshift({
          ...stockOriginal,
          quantity: 1,
          originalBox: this.originalBoxActive.boxCode,
          originalLocation: {
            id: this.originalBoxActive.locationId
          }
        })
      }
      stockOriginal.actualOutGoing++
    } else {
      this.$toast.add({
        severity: 'error',
        summary: 'Error Message',
        detail: 'Can not add more item!',
        life: 3000
      })
    }
  }

  selectedOutGoingBox(index: number) {
    this.outGoingBoxActive = this.listOutGoingBox[index - 1]
  }

  getStocks(stocks) {
    const result =  _.map(stocks, ({ stockId, stockBoxId, originalBox, sku, originalLocation, initialQuantity, quantity, airtag }) => ({
      stock: { id: stockId },
      originalItem: stockBoxId,
      originalBox,
      sku,
      originalLocation,
      initialQuantity,
      amount: quantity,
      airtag
    }))
    return result
  }

  async handleSubmit() {
    const data: any = {
      originalBox: _.map(this.listOriginalBox, ({ boxCode, usedCapacity }) => ({
        id: boxCode,
        usedCapacity: usedCapacity / 100
      })),
      outGoingBox: _.map(this.listOutGoingBox, ({ boxSize, items, airtag }) => ({
        boxSize,
        listStockWithAmount: this.getStocks(items),
        airtag
      })),
      packingNote: this.noteText
    }
    const { id } = this.$route.params
    const result = await this.actSavePackingDetail({ data, id })
    if(result) {
      this.$toast.add({ severity:'success', summary: 'Success Message', detail:'Packing successfully!', life: 3000 })
      this.$router.push(`/stock-out/order/${id}/packing-detail`)
    }
  }

  get totalItem() {
    const totalItem = [...this.listOutGoingBox]
    return totalItem.reduce((accumulator:any, object:any) => {
      return accumulator + object.items.reduce((accumulator:any, object:any) => {
        return accumulator + object.quantity
      },0)
    },0)
  }

  get isDisabled() {
    if(_.size(this.listOriginalBox)) {
      const unprocessedStocks = _.partition(_.flatten(_.map(this.listOriginalBox, 'items')), function({ outGoingQuantity, actualOutGoing }) { 
        return outGoingQuantity === actualOutGoing
      })[1]
      const unsetBoxSizeOutGoing = _.partition(this.listOutGoingBox, { 'boxSize': null })[0]
      const unsetTagCode = _.partition(this.listOutGoingBox, { 'airtag': null, checked: true  })[0]
      if(_.size(unsetBoxSizeOutGoing) === 0  && _.size(unprocessedStocks) === 0 && _.size(unsetTagCode) === 0) {
        return null
      }
    }
    return 'disabled'
  }

  get isNextBox() {
    const itemsBox = _.get(this.originalBoxActive, 'items')
    return !_.size(_.partition(itemsBox, ({ outGoingQuantity, actualOutGoing }) => outGoingQuantity === actualOutGoing)[1]) && itemsBox
  }

  @Watch('isNextBox')
  handleNextBox(newValue) {
    if(newValue) {
      this.$toast.add({
        severity: 'success',
        summary: 'Success Message',
        detail: 'Please check the used capacity!',
        life: 3000
      })
      const indexBoxOriginalActive = _.findIndex(this.listOriginalBox, { 'boxCode': this.originalBoxActive.boxCode })
      this.listOriginalBox[indexBoxOriginalActive].usedCapacity = this.listOriginalBox[indexBoxOriginalActive].suggestCapacity
    }
  }

  handelDeteleBoxEmpty(index) {
    this.listOutGoingBox.splice(index, 1)
  }

  showFormReportBox() {
    this.isShowModalReport = true
  }

  cancelReportBox(){
    this.isShowModalReport = false
  }

  async handleReportBox() {
    if(this.originalBoxActive) {
      const result = await this.actCreateReport({
        boxNote: [
          {
            box: {
              id: this.originalBoxActive.boxCode
            },
            note: this.valueReportNote
          }
        ] 
      })
      if(result) {
        this.isShowModalReport = false
        this.$toast.add({
          severity: 'success',
          summary: 'Success Message',
          detail: 'Add report successfully!',
          life: 3000
        })
        this.valueReportNote = null
      }
      else {
        this.isShowModalReport = false
        this.$toast.add({
          severity: 'error',
          summary: 'Error Message',
          detail: 'Add report error!',
          life: 3000
        })
        this.isShowModalReport = false
        this.valueReportNote = null
      }
    }
  }
}

export default DeliveryOrderPacking
</script>
<style lang="sass" scoped>
.packing__detail--container
  height: calc(100vh - 32px)
  .packing-wapper
    overflow-y: hidden
  .packing__detail--left
    height: calc( 100% - 32px) !important
  .sub-tab
    height: calc(100vh - 32px)
    max-width: 21.5rem
    overflow: hidden
  .packing__detail--footer
    height: 82px
    padding: 0 12px
    margin-top: auto
::-webkit-scrollbar
  width: 7px
  height: 7px
  background-color: #F5F5F5

::-webkit-scrollbar-track
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3)
  border-radius: 10px
  background-color: #F5F5F5

::-webkit-scrollbar-thumb
  border-radius: 10px
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3)
  background-color: #979AA4
</style>
