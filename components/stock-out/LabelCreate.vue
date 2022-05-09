<template lang="pug">
.border-top-1.border-gray-300.grid-nogutter
  .col.p-4.border-tab
    .grid.grid-nogutter.align-items-center.mb-4
      .icon.bg-primary.surface-900.mr-3.icon-sender-info
      span.uppercase.text-800.font-bold seller information
    div
      StockOutItemInput( :listInfor='infomation.seller' @sellerInfro='handleSeller' )
  .border-top-1.border-gray-300.grid-nogutter
  .col.p-4
    .grid.grid-nogutter.align-items-center.mb-4
      .icon.bg-primary.surface-900.mr-3.icon-buildings
      span.uppercase.text-800.font-bold warehouse contact
    div
      StockOutItemInput( :listInfor='infomation.warehouse' @fieldWarehouse='handleWarehouse' )
  .border-top-1.border-gray-300.grid-nogutter
  .col.p-4
    .grid.grid-nogutter.align-items-center.mb-4
      .icon.bg-primary.surface-900.mr-3.icon-receive-square
      span.uppercase.text-800.font-bold receiver information
    div
      StockOutItemInput( :listInfor='infomation.receiver' )
  .border-top-1.border-gray-300.grid-nogutter
  .col.p-4
    .grid.grid-nogutter.align-items-center.mb-4
      .icon.bg-primary.surface-900.mr-3.icon-calendar-infor
      span.uppercase.text-800.font-bold time information
    div
      StockUnit(
        title="Estimated delivery Time"
        icon="icon-clock"
        :value="estimatedDate"
      )
      StockUnit.mt-2(
        title="Due delivery date"
        icon="icon-calendar"
        :value="deliveryDate"
      )
  .border-top-1.border-gray-300.grid-nogutter
  .col.p-4
    .grid.grid-nogutter.align-items-center.mb-4
      .icon.bg-primary.surface-900.mr-3.icon-profile-circle
      span.uppercase.text-800.font-bold creator information
    div
      StockOutItemInput( :listInfor='infomation.creator' )
</template>

<script lang="ts">
import { Component, Vue, Prop, namespace } from 'nuxt-property-decorator'
import { INFORMATION } from '~/utils'
const nsStoreWarehouse = namespace('warehouse/warehouse-list')
const nsStoreSeller = namespace('seller/seller-list')
const nsStoreUserDetail = namespace('user-auth/user')

@Component
class LabelCreate extends Vue {
  @Prop() readonly title!: any | undefined
  @Prop() readonly icon!: any | undefined

  deliveryDate: string | any = 'Fill receiver information'
  estimatedDate: string | any  = 'Fill receiver information'
  infomation = INFORMATION

  @nsStoreUserDetail.State
  user!: any

  @nsStoreWarehouse.Action
  actWarehouseList!:() => Promise<void>

  @nsStoreSeller.Action
  actSellerList!:(params: any) => Promise<void>

  @nsStoreUserDetail.Action
  actGetUserDetail!:(params: any) => Promise<void>

  async mounted() {
    await this.actGetUserDetail({ id : this.$auth.$state.user.sub })
    this.handleUser()
    this.actSellerList(null)
   
  }

  handleWarehouse( event : any ) {
    const InforWarehouse = this.infomation.warehouse
    InforWarehouse[0].value = event.name
    InforWarehouse[0].warehouseId = event.id
    InforWarehouse[1].value = event.email
    InforWarehouse[2].value = event.phone
  }

  handleSeller( event : any ){
    const InforSeller = this.infomation.seller
    InforSeller[0].value = event.email
    InforSeller[1].value = event.name
    InforSeller[2].value = event.phone
    this.actWarehouseList()
  }

  handleUser() {
    const InforCreator = this.infomation.creator
    const fullName = `${ this.user.lastName } ${ this.user.firstName }`
    InforCreator[0].value = this.user.id
    InforCreator[1].value = this.user.email
    InforCreator[2].value = fullName
    InforCreator[3].value = this.user.phoneNumber
  }

}

export default LabelCreate
</script>
<style lang="sass" scoped>
.text-label::after
	content: ':'

</style>