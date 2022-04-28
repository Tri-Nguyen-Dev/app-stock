<template lang="pug">
div
  .grid.flex.grid-nogutter.align-items-center.my-2(
    v-for="(item, index) in listInfor"
    :key='item.key'
  )
    .col-3
      span.font-bold.text-label {{ item.label }}
    .col.w-full
      InputText.w-full( v-if='!item.options' v-model='item.value' :disabled='item.disabled' )
      Dropdown.w-full( v-else :disabled='item.disabled' )
</template>

<script lang="ts">
import { Component, Vue, Prop  } from 'nuxt-property-decorator'

@Component
class ItemInput extends Vue {
  @Prop() listInfor: any | undefined

}

export default ItemInput
</script>
<style lang="sass" scoped>
.text-label::after
	content: ':'

</style>