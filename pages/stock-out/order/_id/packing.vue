<template lang="pug">
  .grid.grid-nogutter.packing__detail--container
    Toast
    .packing__detail--left.col-3.surface-0.border-round.h-full.overflow-y-auto.sub-tab
      StockOutPackingInformationDetail(:deliveryOrderDetail="deliveryOrderDetail")
    .col-9.ml-5.py-0.h-full.overflow-y-auto.overflow-x-hidden.flex-1.relative.flex.flex-column
      div.flex.flex-column
        .grid.grid-nogutter.mb-3
          StockOutPackingOriginal(
            title='original box'
            icon='icon-info'
            :isOriginal='true'
            :listBox="listOriginalBox"
            type='originalBox'
            @selectedTab='selectedOriginalBox'
          )
        .grid.grid-nogutter.my-3
          StockOutPackingOriginal(
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
        .grid.grid-nogutter.my-3
          StockOutPackingOriginal(
            title='tranferring box'
            icon='icon-repeat'
            :isTranffering='true'
            :listBox="listTranfferingBox"
            :location="boxLocation"
            type='tranferringBox'
            @selectedTab='selectedTranfferingBox'
            @addBoxNew="addNewBoxTranferring"
            @addStockByBarcode='addStockInTranferring'
            @handelDeteleBoxEmpty='handelDeteleBoxEmpty'
            :boxSizeList='boxSizeList'
          )
      .packing__detail--footer.grid.grid-nogutter.bg-white.border-round.align-items-center
        .col.p-1
          .grid.align-items-center
            .col-1
              .icon--large.icon-note
            .col
              div(style="padding-left: 10.5px") Note:
              Textarea.inputSearchCode.w-full(rows="1" cols="40" placeholder='Write something...')
        .col-2.border-right-1.border-gray-300.p-1
          .grid.align-items-center
            .col-3
              img(src='~/assets/icons/box-border.svg')
            .col
              span.font-semibold.text-base.mr-1 Total boxs:
              .font-semibold.text-primary {{listTranfferingBox.length + listOutGoingBox.length}}
        .col-2.border-right-1.border-gray-300.p-1
          .grid.align-items-center
            .col-3
              img(src='~/assets/icons/total-items-border.svg')
            .col
              span.font-semibold.text-base.mr-1 Total items:
              .font-semibold.text-primary {{tranferringOutGoing}}
        .col-2.flex.justify-content-end.p-1
          Button.btn.btn-primary.justify-content-center.flex(@click="handleClick" v-if='packingStep === 1' :disabled="isDisabled") Next
          div.flex
            Button.btn.btn-outline.ml-2(@click="handleBack" v-if="ishowSave && packingStep === 2") Back
            Button.btn.btn-primary.ml-3(@click="handleSubmit" v-if="ishowSave && packingStep === 2") Save
</template>

<script lang="ts">
import { Component, Vue, namespace, ProvideReactive, Watch } from 'nuxt-property-decorator'
import { PackingDetail } from '~/models/PackingDetail'
const nsStorePackingDetail = namespace('stock-out/packing-box')
const nsStoreBox = namespace('box/box-size-list')
const nsStoreLocationList = namespace('location/location-list')

@Component
class DeliveryOrderPacking extends Vue {
  outGoingBoxActive: any = { boxCode: 'EX1', items: [] }
  tranfferingBoxActive: any = { boxCode: 'EX1', items: [] }
  indexScanBoxCode: number = 0
  autoActiveTabOut: boolean = false
  listOriginalBox: any = []
  listTranfferingBox: any = []
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

  @ProvideReactive()
  packingStep: number | string = 1

  @nsStorePackingDetail.State('totalOriginalList')
  totalOriginalList!: number

  @nsStorePackingDetail.State('originalList')
  originalList!: PackingDetail.OriginalBox[]

  @nsStorePackingDetail.State('deliveryOrderDetail')
  deliveryOrderDetail!: any

  @nsStorePackingDetail.State('boxLocation')
  boxLocation!: any[]

  @nsStoreBox.State
  boxSizeList!: any

  @nsStorePackingDetail.Action
  actGetListOriginal!: (id: any) => Promise<any>

  @nsStorePackingDetail.Action
  actGetDeliveryOrderDetail!: (id: any) => Promise<any>

  @nsStoreBox.Action
  actGetBoxSizeList!:() => Promise<any>

  @nsStorePackingDetail.Action
  actLocationSuggestion!:(data: any) => Promise<any>

  @nsStorePackingDetail.Action
  actSavePackingDetail!:(data: any) => Promise<any>

  @nsStoreLocationList.Action
  actLocationList!: (params: any) => Promise<void>

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
          items: obj.items.map((item) => ({
            ...item,
            initialQuantity: item.quantity,
            actualOutGoing: 0,
            actualTranffering: 0
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
        isFullQuantityStock,
        true
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
    isFullQuantityStock,
    isOutGoing = false
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
      if (isOutGoing) {
        stockOriginal.actualOutGoing++
      } else {
        stockOriginal.actualTranffering++
      }
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

  addNewBoxTranferring() {
    this.listTranfferingBox.push({
      boxCode: this.genearateBoxCode(this.listTranfferingBox, 'IN'),
      items: [],
      airtag: null,
      checked: true,
      boxSize: null,
      inventoryFee: 0,
      request:{
        id: this.originalBoxActive.requestId
      },
      location: null
    })
    if(_.size(this.listTranfferingBox) === 1)
      this.tranfferingBoxActive = this.listTranfferingBox[0]
  }

  addStockInTranferring(barCode: string) {
    const stockOriginal = _.find(this.originalBoxActive.items, { barCode })
    if (stockOriginal) {
      const tranfferingStock = _.find(this.tranfferingBoxActive.items, {
        barCode, originalBox: this.originalBoxActive.boxCode
      })
      const { initialQuantity, outGoingQuantity, actualTranffering } =
        stockOriginal
      const isFullQuantityStock =
        initialQuantity - outGoingQuantity > actualTranffering
      this.addStock(
        this.tranfferingBoxActive,
        stockOriginal,
        tranfferingStock,
        isFullQuantityStock
      )
    } else {
      this.$toast.add({
        severity: 'error',
        summary: 'Error Message',
        detail: 'Stock is not found in original box!',
        life: 3000
      })
    }
  }

  selectedTranfferingBox(index: number) {
    this.tranfferingBoxActive = this.listTranfferingBox[index - 1]
  }

  async handleClick() {
    this.packingStep = 2
    let listBoxLocation = [ ...this.listTranfferingBox ]
    listBoxLocation = listBoxLocation.map((item) => {
      return item.boxSize?.id.toString()
    })
    const locationList = await this.actLocationSuggestion(listBoxLocation)
    if(locationList) {
      _.forEach(this.listTranfferingBox, function (obj, index) {
        _.set(obj, 'location', locationList[index])
      })
    }
  }

  getStocks(stocks) {
    const result =  _.map(stocks, ({ stockId, originalBox, originalLocation, initialQuantity, quantity, sku }) => ({
      stock: { id: stockId },
      originalBox,
      sku,
      originalLocation,
      initialQuantity,
      amount: quantity
    }))
    return result
  }

  async handleSubmit() {
    const data: any = {}
    data.originalBox = _.map(this.listOriginalBox, 'boxCode')
    data.outGoingBox = _.map(this.listOutGoingBox, ({ boxSize, items, airtag }) => ({
      boxSize,
      listStockWithAmount: this.getStocks(items),
      airtag
    }))
    data.transferringBox = _.map(this.listTranfferingBox, ({ boxSize, items, inventoryFee, location, request }) => ({
      boxSize,
      inventoryFee,
      rackLocation: location,
      request,
      listStockWithAmount: this.getStocks(items)
    }))
    const { id } = this.$route.params
    await this.actSavePackingDetail({ data, id })
    this.$router.push(`/stock-out/order/${id}/packing-detail`)
  }

  get tranferringOutGoing() {
    const tranferringOutGoing = [...this.listOutGoingBox,...this.listTranfferingBox]
    return tranferringOutGoing.reduce((accumulator:any, object:any) => {
      return accumulator + object.items.length
    },0)
  }

  get isDisabled() {
    if(_.size(this.listOriginalBox)) {
      const unprocessedStocks = _.partition(_.flatten(_.map(this.listOriginalBox, 'items')), {
        quantity: 0
      })[1]
      const unsetBoxSizeOutGoing = _.partition(this.listOutGoingBox, { 'boxSize': null })[0]
      const unsetTagCode = _.partition(this.listOutGoingBox, { 'airtag': null, checked: true  })[0]
      const unsetBoxSizeTranffering = _.partition(this.listTranfferingBox, { 'boxSize': null })[0]
      if(_.size(unsetBoxSizeOutGoing) === 0 && _.size(unsetBoxSizeTranffering) === 0 && _.size(unprocessedStocks) === 0 && _.size(unsetTagCode) === 0) {
        return null
      }
    }
    return 'disabled'
  }

  get isNextBox() {
    const itemsBox = _.get(this.originalBoxActive, 'items')
    return !_.size(_.partition(itemsBox, ['quantity', 0])[1]) && itemsBox
  }

  @Watch('isNextBox')
  handleNextBox(newValue) {
    if(newValue) {
      this.$toast.add({
        severity: 'success',
        summary: 'Success Message',
        detail: `Box ${this.originalBoxActive.boxCode} has been successfully process. Please move to another box!`,
        life: 3000
      })
    }
  }

  get ishowSave() {
    return _.size(_.partition(this.listTranfferingBox, {
      'location': null
    })[0]) === 0 && !this.isDisabled
  }

  handelDeteleBoxEmpty(type, index) {
    if(type === 'tranferringBox') {
      this.listTranfferingBox.splice(index, 1)
    }
    else {
      this.listOutGoingBox.splice(index, 1)
    }
  }

  handleBack() {
    this.packingStep = 1
    _.forEach(this.listTranfferingBox, function (obj) {
      _.set(obj, 'location', null)
    })
  }
}

export default DeliveryOrderPacking
</script>
<style lang="sass" scoped>
.packing__detail--container
  height: calc(100vh - 32px)
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
