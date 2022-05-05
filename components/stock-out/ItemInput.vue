<template lang="pug">
div
  .grid.flex.grid-nogutter.align-items-center.my-2(
    v-for="(item, index) in listInfor"
    :key='item.key'
  )
    .col-3
      span.font-bold.text-small.mr-1.text-label {{ item.label }}
    .col.w-full
      InputText.w-full( v-if='!item.options' v-model='item.value' :disabled='item.disabled' :options="warehouseList" optionLabel="name" )
      Dropdown.w-full( v-else :disabled='item.disabled' :options="options" optionLabel="name" v-model='selectedWarehouse' @change='selectedItems($event)' )
</template>

<script lang="ts">
import { Component, Vue, Prop, namespace } from 'nuxt-property-decorator'
const nsStoreWarehouse = namespace('warehouse/warehouse-list')

@Component
class ItemInput extends Vue {
  @Prop() listInfor: any | undefined
  selectedWarehouse: any = []

  @nsStoreWarehouse.State
  warehouseList!: any

  @nsStoreWarehouse.Action
  actWarehouseList!:() => Promise<void>

  selectedItems( event : any  ) {
    this.$emit('fieldWarehouse', event.value)
  }

  options: any = [
    {
      id: '1',
      name: 'haha',
      phone: '0123455789',
      email: 'halo1@gmail.com'
    },
    {
      id: '2',
      name: 'haha1',
      phone: '0123455729',
      email: 'halo2@gmail.com'
      
    },
    {
      id: '3',
      name: 'haha2',
      phone: '0123194557',
      email: 'halo3@gmail.com'

    },
    {
      id: '4',
      name: 'haha5',
      phone: '0121111113',
      email: 'halo23@gmail.com'

    }
  ]

  mounted() {
    this.actWarehouseList()
  }

}

export default ItemInput
</script>
<style lang="sass" scoped>
.text-label::after
	content: ':'

</style>