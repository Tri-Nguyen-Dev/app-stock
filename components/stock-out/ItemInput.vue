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
        :suggestions='sellerList'
        @item-select='changeItem($event)' 
        @complete="searchSeller($event)"
      )
      InputText.w-full( v-else-if='!item.options' v-model='item.value' :disabled='item.disabled' @change='receiverChange', )
      Dropdown.w-full( 
        v-else 
        :disabled='item.disabled' 
        :options="warehouseBySeller" 
        optionLabel="name" 
        v-model='item.value'
        @change='selectedItems($event)' 
      )
    p {{ item }}
</template>

<script lang="ts">
import { Component, Vue, Prop, namespace } from 'nuxt-property-decorator'
const nsStoreWarehouse = namespace('warehouse/warehouse-list')

@Component
class ItemInput extends Vue {
  @Prop() listInfor: any | undefined
  @Prop() readonly sellerList: any | undefined

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