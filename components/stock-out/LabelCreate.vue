<template lang="pug">
.border-top-1.border-gray-300.grid-nogutter
  .col.p-4.border-tab
    .grid.grid-nogutter.align-items-center.mb-4
      .icon.bg-primary.surface-900.mr-3.icon-sender-info
      span.uppercase.text-800.font-bold seller information
    div
      StockOutItemInput( 
        :listInfor='infomation.seller' 
        @sellerInfor='handleSeller' 
        @paramSeller='paramSeller' 
        :sellerList='sellerList' )
  .border-top-1.border-gray-300.grid-nogutter
  .col.p-4
    .grid.grid-nogutter.align-items-center.mb-4
      .icon.bg-primary.surface-900.mr-3.icon-warehouse-info
      span.uppercase.text-800.font-bold warehouse contact
    div
      StockOutItemInput( :listInfor='infomation.warehouse' @fieldWarehouse='handleWarehouse'  )
  .border-top-1.border-gray-300.grid-nogutter
  .col.p-4
    .grid.grid-nogutter.align-items-center.mb-4
      .icon.bg-primary.surface-900.mr-3.icon-receive-square
      span.uppercase.text-800.font-bold receiver information
    div
      StockOutItemInput( :listInfor='infomation.receiver' @fieldReceiver='handleReveiver'   )
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
import { Component, namespace, Prop, Vue } from 'nuxt-property-decorator'
import { INFORMATION } from '~/utils'
const nsStoreWarehouse = namespace('warehouse/warehouse-list')
const nsStoreSeller = namespace('seller/seller-list')
const nsStoreUserDetail = namespace('user-auth/store-user')
const dayjs = require('dayjs')

@Component
class LabelCreate extends Vue {
  @Prop() readonly title!: any | undefined
  @Prop() readonly icon!: any | undefined

  deliveryDate: string | any = 'Fill receiver information'
  estimatedDate: string | any  = 'Fill receiver information'
  infomation = INFORMATION
  @nsStoreUserDetail.State
  user!: any

  @nsStoreSeller.State
  sellerList!: any

  @nsStoreWarehouse.Action
  actWarehouseBySeller!:(params : any) => Promise<void>

  @nsStoreSeller.Action
  actSellerList!:(params: any) => Promise<void>

  mounted() {
    this.handleUser()
  }

  handleWarehouse( event : any ) {
    const InforWarehouse = this.infomation.warehouse
    InforWarehouse[0].warehouseId = event.id
    InforWarehouse[1].value = event.email
    InforWarehouse[2].value = event.phone
  }

  async handleSeller( event : any ){
    await this.actWarehouseBySeller({ email: event.email })
    const InforSeller = this.infomation.seller
    InforSeller[0].value = event.email
    InforSeller[0].id = event.id
    InforSeller[1].value = event.displayName
    InforSeller[2].value = event.phoneNumber
    this.unSelectedSeller()
  }

  handleUser() {
    const InforCreator = this.infomation.creator
    InforCreator[0].value = this.user.staffId
    InforCreator[1].value = this.user.email
    InforCreator[2].value = this.user.displayName
    InforCreator[3].value = this.user.phoneNumber
  }

  paramSeller(event : any ) {
    this.actSellerList({ email : event })
  }

  handleReveiver( event : any  ) {
    const d = new Date()
    const dayFrom = dayjs(d).add(5, 'day').format('DD/MM/YYYY')
    const dayTo = dayjs(d).add(8, 'day').format('DD/MM/YYYY')
    const estimat = dayFrom + ' - ' + dayTo
    if(event) {
      this.deliveryDate = estimat
      this.estimatedDate = '1 day'
    }
  }

  unSelectedSeller() {
    _.forEach(this.infomation.warehouse, ( val )=>{
      val.value = null
    })
  }
}

export default LabelCreate
</script>
<style lang="sass" scoped>
.text-label::after
	content: ':'

</style>
