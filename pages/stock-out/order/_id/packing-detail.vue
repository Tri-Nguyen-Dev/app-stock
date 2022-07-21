<template lang="pug">
  .grid.grid-nogutter.packing__detail--container(v-if='packingDetail')
    Toast
    StockOutPackingInformationDetail(:deliveryOrderDetail="deliveryOrderDetail")
    .col-9.ml-5.py-0.h-full.overflow-y-auto.overflow-x-hidden.flex-1.relative.flex.flex-column
      .flex.flex-column.flex-1.overflow-hidden
        StockOutPackingOriginal.mb-2(
          title='original box'
          icon='icon-info'
          :isOriginal='true'
          :listBox="listOriginalBox"
          type='originalBox'
        )
        StockOutPackingOriginal.mb-2(
          title='outgoing box'
          icon='icon-arrow-circle-up-right'
          :isOutgoing='true'
          :listBox="listOutGoingBox"
          type='outGoingBox'
        )
      .packing__detail--footer.grid.grid-nogutter.bg-white.border-round.align-items-center
        .col.p-1
          .grid.align-items-center
            .col-1
              .icon--large.icon-note
            .col
              div Note:
              span(v-if="packingDetail.order") {{ packingDetail.order.packingNote || 'Note is empty'}}
        .col-2.border-right-1.border-gray-300.p-1
          .grid.justify-content-center
            .col-3.flex
              img(src='~/assets/icons/box-border.svg')
            .col-fixed
              span.text-base.mr-1 Total boxs:
              .font-semibold.text-primary {{ listOutGoingBox.length }}
        .col-2.p-1
          .grid.justify-content-center
            .col-3.flex
              img(src='~/assets/icons/total-items-border.svg')
            .col-fixed
              span.text-base.mr-1 Total items:
              .font-semibold.text-primary {{ totalItem }}
</template>

<script lang="ts">
import { Component, Vue, namespace, ProvideReactive } from 'nuxt-property-decorator'
const nsStorePackingDetail = namespace('stock-out/packing-box')

@Component
class DeliveryOrderPackingDetail extends Vue {
  listOriginalBox: any = []
  listOutGoingBox: any = []

  @ProvideReactive()
  originalBoxActive: any = {}

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
    this.listOriginalBox = this.packingDetail?.originalBox
    this.listOutGoingBox = _.map(this.packingDetail.outGoingBox, ({ id, inventoryFee, listStockWithAmount, boxSize, airtag }, index) => ({
      boxCode: `EX${index + 1}`,
      newBoxCode: id,
      locationId: listStockWithAmount.id,
      inventoryFee,
      items: _.map(listStockWithAmount, ({ stock, originalBox, amount, sku }) => ({
        barCode: stock.barCode,
        sku,
        name: stock.name,
        quantity: amount,
        originalBox,
        imagePath: stock.imagePath
      })),
      boxSize,
      airtag
    }))
  }

  get totalItem() {
    const totalItem = [...this.listOutGoingBox]
    return totalItem.reduce((accumulator:any, object:any) => {
      return accumulator + object.items.reduce((accumulator:any, object:any) => {
        return accumulator + object.quantity
      },0)
    },0)
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
}
export default DeliveryOrderPackingDetail
</script>
<style lang="sass" scoped>
.packing__detail--container
  height: calc(100vh - 32px)
  .packing-wapper
    overflow-y: hidden
  .packing__detail--footer
    height: 82px
    padding: 0 12px
    margin-top: auto
    overflow: auto
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
