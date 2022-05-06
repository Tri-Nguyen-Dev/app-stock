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
        v-if='item.autoComplete' 
        field='email' 
        forceSelection
        v-model='selectedSeller'
        :disabled='item.disabled' 
        :suggestions='list'
        @item-select='changeItem($event)' 
        @complete="searchCountry($event)"
      )
      InputText.w-full( v-else-if='!item.options' v-model='item.value' :disabled='item.disabled' )
      Dropdown.w-full( 
        v-else 
        :disabled='item.disabled' 
        :options="warehouseList" 
        optionLabel="name" 
        v-model='selectedWarehouse'
        :placeholder='filedWarehouse'
        @change='selectedItems($event)' 
      )
</template>

<script lang="ts">
import { Component, Vue, Prop, namespace } from 'nuxt-property-decorator'
const nsStoreSeller = namespace('seller/seller-list')
const nsStoreWarehouse = namespace('warehouse/warehouse-list')

@Component
class ItemInput extends Vue {
  @Prop() listInfor: any | undefined
  selectedWarehouse: any = null
  filedWarehouse: any = null
  selectedSeller: any = null
  name: any | string 
  list: any = []

  @nsStoreWarehouse.State
  warehouseList!: any

  @nsStoreSeller.State
  sellerList!: any

  selectedItems( event : any  ) {
    this.$emit('fieldWarehouse', event.value)
  }
  
  mounted() {
    const inforObj = this.listInfor[0]
    if(inforObj.label === 'Email' && inforObj.value !== ''  ) {
      this.selectedSeller = inforObj.value
    } 
    else if ( this.listInfor[0].label === 'Name'){
      this.filedWarehouse = inforObj.value
    }

  }
 
  changeItem( event : any ) {
    this.$emit('sellerInfro' , event.value)
  }

  searchCountry() {
    this.list = this.sellerList
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

::v-deep.p-dropdown
  .p-inputtext.p-placeholder
    color: #495057
  .p-dropdown-label.p-inputtext
    color: #495057
</style>