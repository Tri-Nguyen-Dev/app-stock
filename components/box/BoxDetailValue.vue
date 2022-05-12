<template lang="pug">
div
  .grid.align-items-center.m-0.border-round.surface-100.mb-2
    .col-12-fixed.mr-2
      .icon--large.bg-primary(:class="`icon-${item.icon}`")
    div(class='col-12 lg:col-12 xl:col-8')
      span.font-bold.text-600 {{ item.label }}
      .mt-1
        div( v-if='item.id === 1 ' )
          span.font-bold.w-7rem.text-overflow-ellipsis {{ boxSellerInfor.name }}
        div( v-else-if='item.id === 2' )
          span.font-bold {{ boxSellerInfor.email }}
        div( v-else )
          span.font-bold {{ boxSellerInfor.phone }}

</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
class BoxDetailItemValue extends Vue {
  @Prop() item!: any | undefined
  @Prop() boxSellerInfor!: any
}

export default BoxDetailItemValue

</script>

