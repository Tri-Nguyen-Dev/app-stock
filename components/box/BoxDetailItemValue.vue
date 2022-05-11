<template lang="pug">
div.px-3
  BoxDetailItemValue( :item='item' :boxSellerInfor='boxSellerInfor')
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
class BoxDetailValue extends Vue {
  @Prop() item!: any | undefined
  @Prop() boxSellerInfor?: () => any

}

export default BoxDetailValue
</script>
