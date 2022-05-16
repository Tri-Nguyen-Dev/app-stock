<template lang="pug">
  .grid.grid-nogutter.packing__detail--container(v-if='packingDetail')
    Toast
    .packing__detail--left.col-3.surface-0.border-round.h-full.overflow-y-auto.sub-tab
      StockOutPackingInformationDetail(:deliveryOrderDetail="deliveryOrderDetail")
    .col-9.ml-5.py-0.h-full.overflow-y-auto.overflow-x-hidden.flex-1.relative
      div.flex.flex-column
        .grid.grid-nogutter.mb-3
          StockOutPackingOriginal(
            title='original box'
            icon='icon-info'
            :isOriginal='true'
            :listBox="listOriginalBox"
            type='originalBox'
          )
        .grid.grid-nogutter.my-3
          StockOutPackingOriginal(
            title='outgoing box'
            icon='icon-arrow-circle-up-right'
            :isOutgoing='true'
            :listBox="listOutGoingBox"
            type='outGoingBox'
          )
        .grid.grid-nogutter.my-3
          StockOutPackingOriginal(
            title='tranferring box'
            icon='icon-repeat'
            :isTranffering='true'
            :listBox="listTranfferingBox"
            type='tranferringBox'
          )
      .packing__detail--footer.grid.grid-nogutter.bg-white.p-3.border-round.fixed.align-items-center.absolute.right-0.left-0.bottom-0
        .col.p-1
          .grid.align-items-center
            .col-1
              .icon--large.icon-note
            .col
              div Note:
              span {{packingDetail.note || 'Note is empty'}}
        .col-2.border-right-1.border-gray-300.p-1
          .grid.align-items-center
            .col-3
              img(src='~/assets/icons/box-border.svg')
            .col
              span.font-semibold.text-base.mr-1 Total boxs:
              .font-semibold.text-primary {{this.listTranfferingBox.length + this.listOutGoingBox.length }}
        .col-2.border-right-1.border-gray-300.p-1
          .grid.align-items-center
            .col-3
              img(src='~/assets/icons/total-items-border.svg')
            .col
              span.font-semibold.text-base.mr-1 Total items:
              .font-semibold.text-primary {{tranferringOutGoing}}
        .col-3.flex.p-1.justify-content-evenly
          Button.p-button-outlined(label='Export file' icon="pi pi-download")
          Button Set delivery
</template>

<script lang="ts">
import { Component, Vue, namespace, ProvideReactive } from 'nuxt-property-decorator'
const nsStorePackingDetail = namespace('stock-out/packing-box')

@Component
class DeliveryOrderPackingDetail extends Vue {
  // listOriginalBox: any = []
  // listOutGoingBox: any = []
  // listTranfferingBox: any = []

  @ProvideReactive()
  listOriginalBox: any = []

  @ProvideReactive()
  listOutGoingBox: any = []

  @ProvideReactive()
  listTranfferingBox: any = []

  @nsStorePackingDetail.State('deliveryOrderDetail')
  deliveryOrderDetail!: any

  @nsStorePackingDetail.State
  packingDetail!: any

  @nsStorePackingDetail.Action
  actGetDeliveryOrderDetail!: (id: any) => Promise<any>

  @nsStorePackingDetail.Action
  actGetPackingDetailById!: (id: any) => Promise<any>

  async mounted() {
    await Promise.all([
      this.actGetDeliveryOrderDetail(this.$route.params.id),
      this.actGetPackingDetailById(this.$route.params.id)
    ])

    this.listOriginalBox = _.map(this.packingDetail?.originalBox, ({ id, inventoryFee, listStockWithAmount }) => ({
      boxCode: id,
      locationId: listStockWithAmount.id,
      inventoryFee,
      items: _.map(listStockWithAmount, ({ stock, amount, initialQuantity, sku }) => ({
        barCode: stock.barCode,
        sku,
        name: stock.name,
        quantity: initialQuantity,
        outGoingQuantity: amount,
        imagePath: stock.imagePath
      }))
    }))

    this.listOutGoingBox = _.map(this.packingDetail.outGoingBox, ({ id, inventoryFee, listStockWithAmount }) => ({
      boxCode: id,
      locationId: listStockWithAmount.id,
      inventoryFee,
      items: _.map(listStockWithAmount, ({ stock, originalBox, amount, sku }) => ({
        barCode: stock.barCode,
        sku,
        name: stock.name,
        quantity: amount,
        originalBox,
        imagePath: stock.imagePath
      }))
    }))

    this.listTranfferingBox =  _.map(this.packingDetail.transferringBox, ({ id, inventoryFee, listStockWithAmount }) => ({
      boxCode: id,
      locationId: listStockWithAmount.id,
      inventoryFee,
      items: _.map(listStockWithAmount, ({ stock, originalBox, amount, sku }) => ({
        barCode: stock.barCode,
        sku,
        name: stock.name,
        quantity: amount,
        originalBox,
        imagePath: stock.imagePath
      }))
    }))
  }

  get tranferringOutGoing() {
    const tranferringOutGoing = [...this.listOutGoingBox,...this.listTranfferingBox]
    return tranferringOutGoing.reduce((accumulator:any, object:any) => {
      return accumulator + object.items.length
    },0)
  }
}
export default DeliveryOrderPackingDetail
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
