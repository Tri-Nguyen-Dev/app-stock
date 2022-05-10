<template lang="pug">
  .grid.grid-nogutter.packing__detail--container
    Toast
    .packing__detail--left.col-3.surface-0.border-round.h-full.overflow-y-auto.sub-tab
      //- StockOutPackingInformationDetail(:deliveryOrderDetail="deliveryOrderDetail")
    .col-9.ml-5.py-0.h-full.overflow-y-auto.overflow-x-hidden.flex-1.relative
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
            :boxSizeList='boxSizeList'
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
            :boxSizeList='boxSizeList'
          )
      .packing__detail--footer.grid.grid-nogutter.bg-white.p-3.border-round.fixed.align-items-center.absolute.right-0.left-0.bottom-0
        .col.p-1
          .grid.align-items-center
            .col-1
              .icon--large.icon-note
            .col
              div Note:
              Textarea.note-area.border-white.w-full(rows="1" cols="40" placeholder='Write something...')
        .col-2.border-right-1.border-gray-300.p-1
          .grid.align-items-center
            .col-3
              img(src='~/assets/icons/box-border.svg')
            .col
              span.font-semibold.text-base.mr-1 Total boxs:
              .font-semibold.text-primary 1
        .col-2.border-right-1.border-gray-300.p-1
          .grid.align-items-center
            .col-3
              img(src='~/assets/icons/total-items-border.svg')
            .col
              span.font-semibold.text-base.mr-1 Total items:
              .font-semibold.text-primary 1
        .col-1.flex.justify-content-end.p-1
          Button.w-10.justify-content-center.flex(@click="handleClick") Next
</template>

<script lang="ts">
import { Component, Vue, namespace } from 'nuxt-property-decorator'
import { PackingDetail } from '~/models/PackingDetail'
const nsStorePackingDetail = namespace('stock-out/packing-box')
const nsStoreBox = namespace('box/box-size-list')
const nsStoreLocationList = namespace('location/location-list')

@Component
class DeliveryOrderPacking extends Vue {
  originalBoxActive: any = {}
  outGoingBoxActive: any = { boxCode: 'EX1', items: [] }
  tranfferingBoxActive: any = { boxCode: 'EX1', items: [] }
  listOriginalBox: any = []
  listOutGoingBox: any = []
  listTranfferingBox: any = []
  nextSuggestLocation: boolean = false

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

  @nsStoreLocationList.Action
  actLocationList!: (params: any) => Promise<void>

  async mounted() {
    await Promise.all ([
      this.actGetDeliveryOrderDetail('DO000000000041'),
      this.actGetBoxSizeList()
    ])
    const result = await this.actGetListOriginal('DO000000000041')
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
    this.originalBoxActive = this.listOriginalBox[index]
  }

  addNewBoxOutGoing() {
    this.listOutGoingBox.push({
      boxCode: `EX0${_.size(this.listOutGoingBox) + 1}`,
      items: [],
      tagCode: '',
      checked: false,
      boxSizeSelect: ''
    })
    if (_.size(this.listOutGoingBox) === 1)
      this.outGoingBoxActive = this.listOutGoingBox[0]
  }

  addStockInOutGoing(barCode: string) {
    const stockOriginal = _.find(this.originalBoxActive.items, { barCode })
    if (stockOriginal) {
      const stockOutGoing = _.find(this.outGoingBoxActive.items, { barCode })
      const { outGoingQuantity, actualOutGoing } = stockOriginal
      const isFullQuantityStock = outGoingQuantity > actualOutGoing
      this.addStock(
        this.outGoingBoxActive,
        stockOriginal,
        stockOutGoing,
        isFullQuantityStock,
        true
      )
    } else {
      this.$toast.add({
        severity: 'error',
        summary: 'Error Message',
        detail: 'Pass through so luong satisfies the condition of box',
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
          originalBox: this.originalBoxActive.boxCode
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
        detail: 'Pass through so luong satisfies the condition of box',
        life: 3000
      })
    }
  }

  selectedOutGoingBox(index: number) {
    this.outGoingBoxActive = this.listOutGoingBox[index - 1]
  }

  addNewBoxTranferring() {
    this.listTranfferingBox.push({
      boxCode: `IN0${_.size(this.listTranfferingBox) + 1}`,
      items: [],
      tagCode: '',
      checked: true,
      boxSizeSelect: '',
      estimateFee: 0
    })
    if(_.size(this.listTranfferingBox) === 1)
      this.tranfferingBoxActive = this.listTranfferingBox[0]
  }

  addStockInTranferring(barCode: string) {
    const stockOriginal = _.find(this.originalBoxActive.items, { barCode })
    if (stockOriginal) {
      const tranfferingStock = _.find(this.tranfferingBoxActive.items, {
        barCode
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
        detail: 'Stock is not in the Original List',
        life: 3000
      })
    }
  }

  selectedTranfferingBox(index: number) {
    this.tranfferingBoxActive = this.listTranfferingBox[index - 1]
  }

  checkQuantityOriginal(list) {
    if (list && list.length > 0) {
      let isCheck = true
      list.forEach((boxItem) => {
        boxItem?.items.forEach((itemStock) => {
          if (itemStock.quantity > 0) {
            isCheck = false
          } else isCheck = true
        })
      })
      return isCheck
    }
  }

  async handleClick() {
    if (!this.checkQuantityOriginal(this.listOriginalBox)) {
      this.$toast.add({
        severity: 'error',
        summary: 'Error Message',
        detail: 'The number of products in the box has not been processed yet',
        life: 3000
      })
    } else if(this.listTranfferingBox) {
      this.nextSuggestLocation = true
      let listBoxLocation = [ ...this.listTranfferingBox ]
      listBoxLocation = listBoxLocation.map((item) => {
        return item.boxSizeSelect?.id.toString()
      })
      await this.actLocationSuggestion(listBoxLocation)
    }
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
