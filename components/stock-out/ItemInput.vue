<template lang="pug">
div
  .grid.flex.grid-nogutter.align-items-center.my-2(
    v-for="(item, index) in listInfor"
    :key='item.key'
  )
    .col-3
      span.font-bold.text-small.mr-1.text-label {{ item.label }}
    .col-9
      AutoComplete.justify-content-end.w-full( 
        v-if='item.type === INPUT_TYPE.AutoComplete' 
        field='email' 
        forceSelection
        v-model='selectedSeller'
        :disabled='item.disabled' 
        :suggestions='sellerList'
        @item-select='changeItem($event)' 
        @complete="searchSeller($event)"
      )
      InputText.w-full(v-else-if='item.type === INPUT_TYPE.Text' v-model='item.value' :disabled='item.disabled' @change='receiverChange', :class="`name-${index}`")
      Dropdown.w-full.p-invalid( 
        v-else-if='item.type === INPUT_TYPE.Dropdown'
        :disabled='item.disabled' 
        :options="warehouseBySeller" 
        optionLabel="name" 
        v-model='item.value'
        @change='selectedItems($event)' 
    )
    div {{item.label}} 
      //- .error(v-if="validations[item.label].required") Field A is required.
      
    button(@click='abc')
</template>

<script lang="ts">
import { Component, Vue, Prop, namespace } from 'nuxt-property-decorator'
import { INPUT_TYPE } from 'utils/constants/stock-out'
const nsStoreWarehouse = namespace('warehouse/warehouse-list')

@Component
class ItemInput extends Vue {
  @Prop() listInfor: any | undefined
  @Prop() readonly sellerList: any | undefined
  @Prop() validations :any
  INPUT_TYPE = INPUT_TYPE
  selectedWarehouse: any = null
  filedWarehouse: any = null
  selectedSeller: any = null
  name: any | string 
  listSeller: any = []

  @nsStoreWarehouse.State
  warehouseBySeller!: any

  selectedItems( event : any  ) {
    this.$emit('fieldWarehouse', event.value)
  }

  receiverChange( event : any  ) {
    this.$emit('fieldReceiver', event.target.value)
  }
  
  mounted() {
    // eslint-disable-next-line dot-notation
    const inforObj = this.listInfor[0]
    if(inforObj.label === 'Email' && inforObj.value !== ''  ) {
      this.selectedSeller = inforObj.value
    } 
    else if ( this.listInfor[0].label === 'Name'){
      this.filedWarehouse = inforObj.value
    }
  }
 
  changeItem( event : any ) {
    this.$emit('sellerInfor' , event.value)
  }

  searchSeller() {
    this.$emit('paramSeller' , this.selectedSeller)
  }

  // validateOrder() {
   
  // }

  abc() {

    this.$v.orderInformation.name?.$touch()
    // this.$v.orderInformation.unit?.$touch()
    // this.$v.orderInformation.category?.$touch()
    // this.$v.orderInformation.quantity?.$touch()
    // this.$v.orderInformation.value?.$touch()
  }

}

export default ItemInput
</script>
<style lang="sass" scoped>
.text-label::after
  content: ':'
::v-deep.p-inputwrapper
  .p-autocomplete-input
    width: 100%
.error-message
  color: #ff0000
::v-deep.p-dropdown
  .p-inputtext.p-placeholder
    color: #495057
  .p-dropdown-label.p-inputtext
    color: #495057
</style>