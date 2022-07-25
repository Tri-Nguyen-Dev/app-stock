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
            type='button'
            label='Back'
            @click="backDoDetail"
          )
          Button.btn.p-button-outlined.p-button-primary.bg-white.w-25(
            type='button'
            label='Set Driver'
            @click="setShowSetDriver"
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
    DriverDialog(
      :isModalDriverList='isModalDriverList',
      @hideDialog='hideDialog($event)',
      @assigned='assignedDriver($event)'
      :orderIds='[]')
</template>

<script lang="ts">
import { Component, Vue, namespace } from 'nuxt-property-decorator'
import ItemList from '~/components/stock-out/item/ItemList.vue'
import TripList from '~/components/stock-out/set-delivery/TripList.vue'
import PackingInformationDetail from '~/components/stock-out/PackingInformationDetail.vue'
import DeliveryInfo from '~/components/stock-out/set-delivery/DeliveryInfo.vue'
import DriverDialog from '~/components/stock-out/driver/DriverDialog.vue'
import { OrderDetail } from '~/models/OrderDetail'
const nsStoreOrder = namespace('stock-out/order-detail')
@Component({
  components: {
    ItemList,
    PackingInformationDetail,
    DeliveryInfo,
    TripList,
    DriverDialog
  }
})
class DeliveryOrder extends Vue {
  typeTitle = 'SET_DELIVERY'
  item:any = []
  isModalDriverList = false

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

  backDoDetail() {
    this.$router.push({
      path: `/stock-out/order/${this.id}`
    })
  }

  assignedDriver(event) {
    if (event) {
      this.$toast.add({
        severity: 'success',
        summary: 'Success Message',
        detail: 'Successfully set Delivery',
        life: 3000
      })
      const packingInfo = this.$el.querySelector('.packing__detail--left')
      if (packingInfo) {
        const scrollHeight = packingInfo.scrollHeight
        packingInfo.scrollTop = scrollHeight
      }
    }
  }

  setShowSetDriver() {
    this.isModalDriverList = true
  }

  hideDialog(event) {
    this.isModalDriverList = !event
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
