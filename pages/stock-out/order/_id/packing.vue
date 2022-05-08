<template lang="pug">
  .grid.grid-nogutter.packing__detail--container
    .packing__detail--left.col-3.surface-0.border-round.h-full.overflow-y-auto.sub-tab
      StockOutPackingInformationDetail
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
          )
        .grid.grid-nogutter.my-3
          StockOutPackingOriginal(
            title='tranferring box'
            icon='icon-repeat'
            :isTranffering='true'
            :listBox="listTranfferingBox"
            type='tranferringBox'
            @selectedTab='selectedTranfferingBox'
            @addBoxNew="addNewBoxTranferring"
            @addStockByBarcode='addStockInTranferring'
          )
      .packing__detail--footer.grid.grid-nogutter.bg-white.p-3.border-round.fixed.align-items-center.absolute.right-0.left-0.bottom-0
        .col-4.p-1
          .grid.align-items-center
            .col-1
              .icon--large.icon-note
            .col
              div Note:
              Textarea.note-area.border-white(rows="1" cols="40" placeholder='Write something...')
        .col.border-right-1.border-gray-300.p-1
          .grid.align-items-center
            .col-3
              img(src='~/assets/icons/box-border.svg')
            .col
              span.font-semibold.text-base.mr-1 Total boxs:
              .font-semibold.text-primary 1
        .col.border-right-1.border-gray-300.p-1
          .grid.align-items-center
            .col-3
              img(src='~/assets/icons/total-items-border.svg')
            .col
              span.font-semibold.text-base.mr-1 Total items:
              .font-semibold.text-primary 1
        .col.border-right-1.border-gray-300.p-1
          .grid.align-items-center
            .col-3
              img(src='~/assets/icons/total-fee.svg')
            .col
              span.font-semibold.text-base.mr-1 Total fee:
              .font-semibold.text-primary 1 $ / day
        .col-1.flex.justify-content-end.p-1
          Button.w-10.justify-content-center.flex Next
</template>

<script lang="ts">
import { Component, Vue, namespace } from 'nuxt-property-decorator'
import { PackingDetail } from '~/models/PackingDetail'
const nsStorePackingDetail = namespace('stock-out/packing-box')

@Component
class DeliveryOrderPacking extends Vue {
  originalBoxActive: any = {}
  outGoingBoxActive: any = { boxCode: 'EX1', items: [] }
  tranfferingBoxActive: any = { boxCode: 'EX1', items: [] }
  @nsStorePackingDetail.State('totalOriginalList')
  totalOriginalList!: number

  @nsStorePackingDetail.State('originalList')
  originalList!: PackingDetail.OriginalBox[]

  @nsStorePackingDetail.State('originalList')
  deliveryOrderDetail!: any

  @nsStorePackingDetail.Action
  actGetListOriginal!: (id: any) => Promise<any>

  @nsStorePackingDetail.Action
  actGetDeliveryOrderDetail!: (id: any) => Promise<any>
  
  async created() {    
    // await this.actGetDeliveryOrderDetail('DO000000000007')
    const result = await this.actGetListOriginal('DO000000000007')
    if(result) {
      this.listOriginalBox = this.originalList.map((x: any) => {
        const object = _.cloneDeep(x)
        return { ...object, items: object.items.map(item => ({ ...item, initialQuantity: item.quantity })) }
      })
    }
  }
  
  listOriginalBox: any = []
  listOutGoingBox: any = []
  listTranfferingBox: any = []

  selectedOriginalBox(index: number) {
    this.originalBoxActive = this.listOriginalBox[index]
  }

  addNewBoxOutGoing() {
    this.listOutGoingBox.push({
      boxCode: `EX0${_.size(this.listOutGoingBox) + 1}`, items: []
    })
    if(_.size(this.listOutGoingBox) === 1) 
      this.outGoingBoxActive = this.listOutGoingBox[0]
  }

  addStockInOutGoing(barCode: string) {
    const stockOriginal= _.find(this.originalBoxActive.items, { barCode })
    const stockOutGoing = _.find(this.outGoingBoxActive.items, { barCode })
    const isFullQuantityStock = stockOriginal.outGoingQuantity > _.get(stockOriginal, 'actualOutGoing', 0)
    this.addStock(this.outGoingBoxActive, stockOriginal, stockOutGoing, isFullQuantityStock, true)
  }

  addStock(boxActive, stockOriginal, stockPacking, isFullQuantityStock, isOutGoing = false) {
    if(stockOriginal) {
      if(isFullQuantityStock) {
        stockOriginal.quantity--
        if(stockPacking) {
          stockPacking.quantity++
        } else {
          boxActive.items.push({ 
            ...stockOriginal,
            quantity: 1,
            originalBox:  this.originalBoxActive.boxCode
          })
        }
        if(isOutGoing) {
          if(stockOriginal.actualOutGoing) {
            stockOriginal.actualOutGoing = stockOriginal.actualOutGoing + 1
          } else {
            stockOriginal.actualOutGoing = 1
          }
        }
      } else {
        // console.log('vuot qua so luong chuyen di')
      }
    }
  }

  selectedOutGoingBox(index: number) {
    this.outGoingBoxActive = this.listOutGoingBox[index - 1]
  }

  addNewBoxTranferring() {
    this.listTranfferingBox.push({
      boxCode: `IN0${_.size(this.listTranfferingBox) + 1}`, items: []
    })
    if(_.size(this.listTranfferingBox) === 1) 
      this.tranfferingBoxActive = this.listTranfferingBox[0]
  }

  addStockInTranferring(barCode: string) {
    const stockOriginal= _.find(this.originalBoxActive.items, { barCode })
    const tranfferingStock = _.find(this.tranfferingBoxActive.items, { barCode })
    const isFullQuantityStock = stockOriginal.quantity - (stockOriginal.outGoingQuantity - _.get(stockOriginal, 'actualOutGoing', 0)) > 0
    this.addStock(this.tranfferingBoxActive, stockOriginal, tranfferingStock, isFullQuantityStock)
  }

  selectedTranfferingBox(index: number) {
    this.tranfferingBoxActive = this.listTranfferingBox[index - 1]
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
