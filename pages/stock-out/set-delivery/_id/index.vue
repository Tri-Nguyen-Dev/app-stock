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
        .col-8.btn-right.flex.justify-content-end(class='col-12 md:col-12 lg:col-8 xl:col-8')
          Button.btn.p-button-outlined.p-button-primary.bg-white.w-25(
            type='button'
            label='Back'
            @click="backDoDetail"
          )
          Button.btn.btn-primary.w-25(
            type='button'
            label='Save'
          )
      .delivery-content
        .delivery-header
          .info-heading
            .icon.icon-info.bg-primary
            span.info-title DELIVERY INFORMATION
          Button.btn.p-button-outlined.p-button-primary.bg-white.w-25(
            type='button'
          )
            .icon.icon-search.bg-primary
            span Search Route
        .delivery-main
          Timeline(:value="events" align="left")
            template(#content="slotProps")
              DestinationItem.mt-2
    DriverDialog(
      :isModalDriverList='isModalDriverList'
      @hideDialog='hideDialog($event)'
      @assigned='assignedDriver($event)'
      :orderIds='[]'
    )
</template>

<script lang="ts">
import { Component, Vue, namespace } from 'nuxt-property-decorator'
import PackingInformationDetail from '~/components/stock-out/PackingInformationDetail.vue'
import DriverDialog from '~/components/stock-out/driver/DriverDialog.vue'
import DestinationItem from '~/components/stock-out/set-delivery/DestinationItem.vue'
import { OrderDetail } from '~/models/OrderDetail'
const nsStoreOrder = namespace('stock-out/order-detail')
@Component({
  components: {
    PackingInformationDetail,
    DriverDialog,
    DestinationItem
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

  events: any = [
    { status: 'Ordered', date: '15/10/2020 10:30', icon: 'pi pi-shopping-cart', color: '#9C27B0', image: 'game-controller.jpg' },
    { status: 'Processing', date: '15/10/2020 14:00', icon: 'pi pi-cog', color: '#673AB7' },
    { status: 'Shipped', date: '15/10/2020 16:15', icon: 'pi pi-shopping-cart', color: '#FF9800' },
    { status: 'Delivered', date: '16/10/2020 10:00', icon: 'pi pi-check', color: '#607D8B' }
  ]

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
  border-radius: 4px
  margin-top: 24px

  .delivery-header
    display: flex
    justify-content: space-between
    padding: 20px
    border-bottom: 1.5px solid $bg-body-base

    .info-heading
      display: flex
      align-items: center
      gap: 0 10px

    .info-title
      color: $text-color-800
      font-size: $font-size-small
      font-weight: $font-weight-bold
      line-height: calc(24 / 12)

  .delivery-main
    padding: 20px

.btn-right
  height: 70%
  text-align: right
.w-25
  min-width: 95px
  margin-left: 7px

</style>
