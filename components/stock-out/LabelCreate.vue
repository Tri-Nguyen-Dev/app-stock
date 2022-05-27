<template lang="pug">
.border-top-1.border-gray-300.grid-nogutter
  .col.p-4.border-tab
    .grid.grid-nogutter.align-items-center.mb-4
      .icon.bg-primary.surface-900.mr-3.icon-sender-info
      span.uppercase.text-800.font-bold seller information
    div
      StockOutItemInput(
        :listInfor='information.seller'
        @sellerInfor='handleSeller'
        @paramSeller='paramSeller'
        :sellerList='sellerList'
       )
      .input-errors(
        v-if='$v.information.seller.$each[1].value.$dirty && $v.information.seller.$each[1].value.$invalid || $v.information.seller.$each[2].value.$dirty && $v.information.seller.$each[2].value.$invalid '
        style='text-align: center')
        .error-message Please, fill in seller information
      .input-errors(
        v-else-if='$v.information.seller.$each[0].value.$dirty && $v.information.seller.$each[0].value.$invalid '
        style='text-align: center')
        .error-message Seller not found

      button(@click='abc') hehe
  .border-top-1.border-gray-300.grid-nogutter
  .col.p-4
    .grid.grid-nogutter.align-items-center.mb-4
      .icon.bg-primary.surface-900.mr-3.icon-warehouse-info
      span.uppercase.text-800.font-bold warehouse contact
    div
      StockOutItemInput(
        :listInfor='information.warehouse'
        @fieldWarehouse='handleWarehouse'
      )
  .border-top-1.border-gray-300.grid-nogutter
  .col.p-4
    .grid.grid-nogutter.align-items-center.mb-4
      .icon.bg-primary.surface-900.mr-3.icon-receive-square
      span.uppercase.text-800.font-bold receiver information
    div
      StockOutItemInput(
        :listInfor='information.receiver'
        @fieldReceiver='handleReceiver'
      )
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
      StockOutItemInput( :listInfor='information.creator')
</template>

<script lang="ts">
import { required } from 'vuelidate/lib/validators'
import { Component, namespace, Prop, Vue } from 'nuxt-property-decorator'
import { INFORMATION } from '~/utils'
const nsStoreWarehouse = namespace('warehouse/warehouse-list')
const nsStoreSeller = namespace('seller/seller-list')
const nsStoreUserDetail = namespace('user-auth/store-user')
const dayjs = require('dayjs')

@Component({
  validations: {
    information: {
      seller:{
        $each: {
          value: { required }
        }
      }
    }
  }
})
class LabelCreate extends Vue {
  @Prop() readonly title!: any | undefined
  @Prop() readonly icon!: any | undefined

  deliveryDate: string | any = 'Fill receiver information'
  estimatedDate: string | any = 'Fill receiver information'
  information = INFORMATION
  @nsStoreUserDetail.State
  user!: any

  @nsStoreSeller.State
  sellerList!: any

  @nsStoreWarehouse.Action
  actWarehouseBySeller!: (params: any) => Promise<void>

  @nsStoreSeller.Action
  actSellerList!: (params: any) => Promise<void>

  mounted() {
    this.handleUser()
  }

  handleWarehouse(event: any) {
    const InfoWarehouse = this.information.warehouse
    InfoWarehouse[0].warehouseId = event.id
    InfoWarehouse[1].value = event.email
    InfoWarehouse[2].value = event.phone
  }

  async handleSeller(event: any) {
    await this.actWarehouseBySeller({ email: event.email })
    const InfoSeller = this.information.seller
    InfoSeller[0].value = event.email
    InfoSeller[0].id = event.id
    InfoSeller[1].value = event.displayName
    InfoSeller[2].value = event.phoneNumber
    this.unSelectedSeller()
  }

  handleUser() {
    const InfoCreator = this.information.creator
    InfoCreator[0].value = this.user.staffId
    InfoCreator[1].value = this.user.email
    InfoCreator[2].value = this.user.displayName
    InfoCreator[3].value = this.user.phoneNumber
  }

  paramSeller(event: any) {
    this.actSellerList({ email: event })
  }

  handleReceiver(event: any) {
    const d = new Date()
    const dayFrom = dayjs(d).add(5, 'day').format('DD/MM/YYYY')
    const dayTo = dayjs(d).add(8, 'day').format('DD/MM/YYYY')
    const estimate = dayFrom + ' - ' + dayTo
    if (event) {
      this.deliveryDate = estimate
      this.estimatedDate = '1 day'
    }
  }

  unSelectedSeller() {
    _.forEach(this.information.warehouse, (val) => {
      val.value = null
    })
  }

  // abc() {
  //   // console.log(this.information.seller[0].label === 'Email')
  //   this.$v.information.seller?.$each?.$touch()
  //   if (this.$v.$invalid) {
  //
  //   }
  //
  // }
}

export default LabelCreate

</script>
<style lang="sass" scoped>
.error-message
  color: #ff0000
.text-label::after
  content: ':'

</style>
