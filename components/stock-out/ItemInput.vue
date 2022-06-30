<template lang="pug">
div
  .grid.flex.grid-nogutter.align-items-center.my-2(
    v-for="(item) in listInfor"
    :key='item.key'
  )
    .col-3
      span.font-bold.text-small.mr-1.text-label {{ item.label }}
    .col-9
      AutoComplete.justify-content-end.w-full(
        v-if='item.type === INPUT_TYPE.AutoComplete'
        field='email'
        forceSelection
        v-model='item.value'
        :disabled='item.disabled'
        :suggestions='sellerList'
        @item-select='changeItem($event)'
        @complete="searchSeller($event)"
      )
      InputText.w-full(
        v-else-if='item.type === INPUT_TYPE.Text || item.type === INPUT_TYPE.Dropdown && checkRole === "staff"'
        v-model='item.value'
        :disabled=`checkRole === 'staff'? item.staffDisable : item.disabled `
        @change='receiverChange',
      )

      Dropdown.w-full(
        v-else-if='item.type === INPUT_TYPE.Dropdown && checkRole === "admin" '
        :disabled='item.disabled'
        :options="warehouseList"
        optionLabel="name"
        v-model='item.value'
        @change='selectedItems($event)'
    )
</template>

<script lang="ts">
import { Component, Vue, Prop, namespace } from 'nuxt-property-decorator'
import { INPUT_TYPE } from '~/utils/constants/stock-out'
const nsStoreWarehouse = namespace('warehouse/warehouse-list')
const nsStoreUserDetail = namespace('user-auth/store-user')

@Component({
})

class ItemInput extends Vue {
  @Prop() listInfor: any | undefined
  @Prop() readonly sellerList: any | undefined
  @Prop() validations :any
  @Prop() invalid: any | undefined
  INPUT_TYPE : any  = INPUT_TYPE
  name: any | string

  @nsStoreWarehouse.State
  warehouseList!: any

  @nsStoreUserDetail.State
  user!: any

  selectedItems( event : any  ) {
    this.$emit('fieldWarehouse', event.value)
  }

  receiverChange( event : any  ) {
    this.$emit('fieldReceiver', event.target.value)
  }

  get checkRole (){
    return this.user.role
  }

  changeItem( event : any ) {
    this.$emit('sellerInfor' , event.value)
  }

  searchSeller(event: any) {
    this.$emit('paramSeller' , event.query)

  }
}

export default ItemInput
</script>
<style lang="sass" scoped>
.text-label::after
  content: ' *:'
::v-deep.p-inputwrapper
  .p-autocomplete-input
    width: 100%
::v-deep.p-dropdown
  .p-inputtext.p-placeholder
    color: #495057
  .p-dropdown-label.p-inputtext
    color: #495057
</style>
