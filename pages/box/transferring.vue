<template lang="pug">
  .grid.grid-nogutter.packing__detail--container
    Toast
    ConfirmDialogCustom(
      title="Packing Confirm"
      :isShow="isShowConfirmPacking"
      :onOk="handleSavePacking"
      :onCancel="cancelSavePacking"
      :loading="loadingSubmit"
    )
      template(v-slot:message)
        p Do you want to save this packing?
    .col-9.py-0.h-full.overflow-y-auto.overflow-x-hidden.flex-1.relative.flex.flex-column
      .flex.flex-column.flex-1.overflow-hidden
        StockOutPackingOriginal.mb-2.flex-1(
          title='original box'
          icon='icon-info'
          :isOriginal='true'
          :listBox="listOriginalBox"
          type='originalBox'
          @selectedTab='selectedOriginalBox'
        )
        StockOutPackingOriginal.mb-2.flex-1(
          title='Box list'
          icon='icon-info'
          :isTranffering='true'
          :listBox="listTranfferingBox"
          :location="boxLocation"
          type='tranferringBox'
          @selectedTab='selectedTranfferingBox'
          @addBoxNew="addNewBoxTranferring"
          @addStockByBarcode='addStockInTranferring'
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
              Textarea.inputSearchCode.w-full(rows="1" cols="40" placeholder='Write something...')
        .col-2.border-right-1.border-gray-300.p-1
          .grid.align-items-center
            .col-3
              img(src='~/assets/icons/box-border.svg')
            .col
              span.font-semibold.text-base.mr-1 Total boxs:
              .font-semibold.text-primary {{listTranfferingBox.length}}
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
            Button.btn.btn-outline.ml-2(@click="handleBack" v-if="packingStep === 2") Back
            Button.btn.btn-primary.ml-3(@click="showDialogSave" v-if="ishowSave && packingStep === 2") Save
</template>

<script lang="ts">
import { Component, Vue, namespace, ProvideReactive, Watch } from 'nuxt-property-decorator'
import GeneralInformation from '~/components/box/GeneralInformation.vue'
import ConfirmDialogCustom from '~/components/dialog/ConfirmDialog.vue'
import { PackingDetail } from '~/models/PackingDetail'
import { User } from '~/models/User'
const nsStorePackingDetail = namespace('stock-out/packing-box')
const nsStoreBox = namespace('box/box-size-list')
const nsStoreLocationList = namespace('location/location-list')
const nsBoxTransfer = namespace('box/box-transffer')
const nsStoreUser = namespace('user-auth/store-user')
const nsStoreBoxList = namespace('box/box-list')

@Component({
  components: {
    GeneralInformation,
    ConfirmDialogCustom
  }
})
class DeliveryOrderPacking extends Vue {
  tranfferingBoxActive: any = { boxCode: 'TR1', items: [] }
  indexScanBoxCode: number = 0
  autoActiveTabOut: boolean = false
  listOriginalBox: any = []
  loadingSubmit: boolean = false
  listTranfferingBox: any =  [
    {
      boxCode: 'TR1',
      items: [],
      airtag: null,
      checked: false,
      boxSize: null,
      location: null,
      usedCapacityTranffering: 100
    }
  ]

  isShowConfirmPacking: boolean = false

  @ProvideReactive()
  originalBoxActive: any = {}

  @ProvideReactive()
  isMergeBox: boolean = true

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

  @nsBoxTransfer.State
  listBoxTransfer!: any

  @nsStoreBoxList.State
  boxTransfer!: any

  @nsBoxTransfer.State
  combineBox!: any

  @nsStoreUser.State
  user: User.Model | undefined

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

  @nsBoxTransfer.Action
  actGetBoxListTranfer!:(data: any) => Promise<any>

  @nsBoxTransfer.Action
  actCombineBox!:(data: any) => Promise<any>

  async mounted() {
    await Promise.all ([
      this.actGetBoxSizeList()
    ])
    if(this.boxTransfer && this.boxTransfer.length > 0) {
      const listIdTranfer = this.boxTransfer.toString()
      const response = await this.actGetBoxListTranfer({
        ids: listIdTranfer
      })

      if(response) {
        this.listOriginalBox = this.listBoxTransfer.map((x: any) => {
          const obj = _.cloneDeep(x)
          return {
            ...obj,
            boxCode: obj.id,
            usedCapacity: obj.usedCapacity * 100,
            items: obj.listStockWithAmount.map((item) => ({
              ...item,
              barCode: item.stock.barCode,
              name: item.stock.name,
              quantity: item.amount,
              initialQuantity: item.amount,
              actualTranffering: 0,
              imagePath: item.stock.imagePath
            }))
          }
        })
      }
    }
    else { 
      this.$router.push('/box')
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

  addNewBoxTranferring() {
    this.listTranfferingBox.push({
      icon: this.originalBoxActive?.icon,
      qrCode: this.originalBoxActive?.qrCode,
      boxCode: this.genearateBoxCode(this.listTranfferingBox, 'TR'),
      items: [],
      airtag:  this.originalBoxActive.airtag,
      checked: true,
      boxSize: null,
      inventoryFee: 0,
      location: null,
      weight: this.originalBoxActive?.weight,
      height: this.originalBoxActive?.boxSize?.height,
      length: this.originalBoxActive?.boxSize?.length,
      width: this.originalBoxActive?.boxSize?.width,
      locationStatus: this.originalBoxActive?.locationStatus,
      status: this.originalBoxActive?.status,
      usedCapacity: this.originalBoxActive?.usedCapacity / 100,
      usedCapacityTranffering: 100
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
      const { quantity } =
        stockOriginal
      const isFullQuantityStock = quantity > 0
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
    const listStockOK: any = []
    const listStockCancle: any = []
    const listStockNotMatch: any = []
    _.forEach(this.listTranfferingBox, function (obj) {
      _.forEach(obj.items, function ({ quantity, amount, validAmount, stock }) {
        const maxDo = amount - validAmount
        if(quantity >= maxDo) {
          listStockOK.push({
            barCode: stock.barCode,
            maxDo
          })
        }
        else {
          listStockCancle.push({
            barCode: stock.barCode,
            maxDo
          })
        }
      })
    })
    _.forEach(listStockCancle, function (item) { 
      if(!_.find(listStockOK, {
        'barCode': item.barCode
      })) {
        listStockNotMatch.push(item)
      }
    })

    if(listStockNotMatch.length > 0) {
      this.$toast.add({
        severity: 'error',
        summary: 'Error Message',
        detail: `The Item ${listStockNotMatch[0].barCode} could not be transferred. Its quantity in one box must be at least ${listStockNotMatch[0]?.maxDo}!`,
        life: 3000
      })
    }
    else {
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
  }

  getStocks(stocks) {
    const result =  _.map(stocks, ({ stock, originalBox, originalLocation, initialQuantity, quantity, sku, id }) => ({
      id,
      stock: { id: stock.id },
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
    data.transferringBox = _.map(this.listTranfferingBox, ({ boxSize, items, inventoryFee, location, usedCapacityTranffering, ...rest }) => ({
      ...rest,
      boxSize,
      inventoryFee,
      rackLocation: location,
      listStockWithAmount: this.getStocks(items),
      usedCapacity: usedCapacityTranffering / 100
    }))
    data.seller = {
      id: this.listOriginalBox[0]?.request?.seller?.id
    }
    data.warehouse = {
      id: this.listOriginalBox[0]?.request?.warehouse?.id
    } 
    const result = await this.actCombineBox(data)

    if(result) {
      this.$toast.add({ severity:'success', summary: 'Success Message', detail:'Packing successfully!', life: 3000 })
      this.$router.push(`/stock-in/${this.combineBox?.id}/detail`)
    }
  }

  get tranferringOutGoing() {
    const tranferringOutGoing = [...this.listTranfferingBox]
    return tranferringOutGoing.reduce((accumulator:any, object:any) => {
      return accumulator + object.items.reduce((accumulator:any, object:any) => {
        return accumulator + object.quantity
      },0)
    },0)
  }

  get isDisabled() {
    if(_.size(this.listOriginalBox)) {
      const unprocessedStocks = _.partition(_.flatten(_.map(this.listOriginalBox, 'items')), {
        quantity: 0
      })[1]
      const unsetBoxSizeTranffering = _.partition(this.listTranfferingBox, { 'boxSize': null })[0]
      if(_.size(unsetBoxSizeTranffering) === 0 && _.size(unprocessedStocks) === 0) {
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

  handelDeteleBoxEmpty(index) {
    this.listTranfferingBox.splice(index, 1)
  }

  handleBack() {
    this.packingStep = 1
    _.forEach(this.listTranfferingBox, function (obj) {
      _.set(obj, 'location', null)
    })
  }

  handleSavePacking() {
    this.handleSubmit()
  }

  cancelSavePacking() {
    this.isShowConfirmPacking = false
  }

  showDialogSave() {
    this.isShowConfirmPacking = true
  }
}

export default DeliveryOrderPacking
</script>
<style lang="sass" scoped>
.packing__detail--container
  height: calc(100vh - 32px)
  .tranffer-title
    height: 42px
  .box-transferr
    ::v-deep.p-datatable
      height: 55vh
    ::v-deep.p-card-body
      padding: 0 !important
      .p-card-content
        padding: 0 !important
    ::v-deep.p-card-footer
      box-shadow: 0px 10px 45px rgba(0, 10, 24, 0.1)
      border-radius: 8px 8px 0px 0px
      padding-top: 0
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
