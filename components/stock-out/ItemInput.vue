<template lang="pug">
div
  .grid.flex.grid-nogutter.align-items-center.my-2(
    v-for="(item, index) in listInfor"
    :key='item.key'
  )
    .col-3
      span.font-bold.text-small.mr-1.text-label {{ item.label }}
    .col.w-full
      InputText.w-full( v-if='!item.options' v-model='item.value' :disabled='item.disabled' )
      Dropdown.w-full( v-else :disabled='item.disabled' )
</template>

<script lang="ts">
import { Component, Vue, Prop, namespace } from 'nuxt-property-decorator'
const nsStoreWarehouse = namespace('warehouse/warehouse-list')

@Component
class ItemInput extends Vue {
  @Prop() listInfor: any | undefined

  @nsStoreWarehouse.State
  warehouseList!: any

  @nsStoreWarehouse.Action
  actWarehouseList!:() => Promise<void>

}

export default ItemInput
</script>
<style lang="sass" scoped>
.text-label::after
	content: ':'

</style>