<template lang="pug">
  .grid.grid-nogutter.set-delivery
    PackingInformationDetail(
      :deliveryOrderDetail='orderDetail'
      :type='typeTitle'
    ) 
    .col-9.pl-4.pr-1.flex-1(class='col-12 md:col-12 lg:col-9 xl:col-9')
      .grid
        .col-4(class='col-12 md:col-12 lg:col-4 xl:col-4')
          h1.text-heading SET DELIVERY
          span.text-subheading 10 items found
        .col-8.btn-right.flex.justify-content-end(class='col-12 md:col-12 lg:col-8 xl:col-8')
          Button.btn.p-button-outlined.p-button-primary.bg-white.w-25(
            type='button',
            label='Back'
          )
          Button.btn.p-button-outlined.p-button-primary.bg-white.w-25(
            type='button',
            label='Set Driver'
          )
      .delivery-content
        DeliveryInfo
        Button.btn.p-button-outlined.p-button-primary.bg-white.w-25.mb-4(
          type='button'
        )
          .icon.icon-clock.bg-primary
          span Add  Trip Stops
        TripList(
          :listItems='item'
        )
</template>

<script lang="ts">
import { Component, Vue, namespace } from 'nuxt-property-decorator'
import ItemList from '~/components/stock-out/item/ItemList.vue'
import TripList from '~/components/stock-out/set-delivery/TripList.vue'
import PackingInformationDetail from '~/components/stock-out/PackingInformationDetail.vue'
import DeliveryInfo from '~/components/stock-out/set-delivery/DeliveryInfo.vue'
import { OrderDetail } from '~/models/OrderDetail'
const nsStoreOrder = namespace('stock-out/order-detail')
@Component({
  components: {
    ItemList,
    PackingInformationDetail,
    DeliveryInfo,
    TripList
  }
})
class DeliveryOrder extends Vue {
  typeTitle = 'DO_DETAIL'
  item:any = []

  @nsStoreOrder.State
  orderDetail!: OrderDetail.Model

  @nsStoreOrder.Action
  actGetOrderDetail

  get id() {
    return this.$route.params.id
  }

  async mounted() {
    await this.actGetOrderDetail({ id: this.id })
  }
}

export default DeliveryOrder
</script>
<style lang="sass" scoped>
.delivery-content
  background-color: $color-white
  padding: 20px
.btn-right
  height: 70%
  text-align: right
.w-25
  min-width: 95px
  margin-left: 7px

</style>
