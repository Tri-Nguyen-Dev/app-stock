<template lang="pug">
  .grid.flex.grid-nogutter.align-items-center.my-2
      .col-3
        span.font-bold.text-label {{ title }} 
      .col.w-full
        InputText( v-if='!options' :disabled='disable'  )
        Dropdown.w-full( v-else :disabled='disable'  )
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
class ItemInput extends Vue {
  @Prop() readonly title!: any | undefined
  @Prop() disable!: any | undefined
  @Prop() options!: any | undefined

}

export default ItemInput
</script>
<style lang="sass" scoped>
.text-label::after
	content: ':'

</style>