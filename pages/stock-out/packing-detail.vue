<template lang="pug">
.grid.grid-nogutter.packing__detail--container
  .col-3.surface-0.border-round.h-full.overflow-y-auto.sub-tab
    StockOutPackingInformationDetail
  .col-9.pl-5.py-0.h-full.overflow-y-auto.overflow-x-hidden.flex-1
    .grid
      .col
        h1.text-heading Packing detail
        span.text-subheading 1111 products found
      .col.flex.justify-content-end
        .btn.btn-primary.w-2 Next
    .grid.my-3
      StockOutPackingOriginal
    .grid.my-3
      StockOutPackingOutGoing
    .grid.my-3
      StockOutPackingTransferring
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
@Component
class PackingDetail extends Vue {

}

export default PackingDetail
</script>
<style lang="sass" scoped>
.packing__detail--container
  height: calc(100vh - 64px)
  .sub-tab
    height: calc(100vh - 32px)
    max-width: 21.5rem
    overflow: hidden
::-webkit-scrollbar
  width: 7px
  height: 7px
  background-color: #F5F5F5

::-webkit-scrollbar-track
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3)
  border-radius: 10px
  background-color: #F5F5F5

::-webkit-scrollbar-thumb
  border-radius: 10px
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3)
  background-color: #979AA4
</style>
