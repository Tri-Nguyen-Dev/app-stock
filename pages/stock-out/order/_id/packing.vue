<template lang="pug">
  .grid.grid-nogutter.packing__detail--container
    .packing__detail--left.col-3.surface-0.border-round.h-full.overflow-y-auto.sub-tab
      StockOutPackingInformationDetail
    .col-9.ml-5.py-0.h-full.overflow-y-auto.overflow-x-hidden.flex-1.relative
      div
        .grid.grid-nogutter.mb-3
          StockOutPackingOriginal(title='original box' icon='icon-info' :isOriginal='true')
        .grid.grid-nogutter.my-3
          StockOutPackingOriginal(title='outgoing box' icon='icon-arrow-circle-up-right' :isOutgoing='true')
        .grid.grid-nogutter.my-3
          StockOutPackingOriginal(title='tranferring box' icon='icon-repeat' :isTranffering='true')
      .packing__detail--footer.grid.grid-nogutter.bg-white.p-3.border-round.fixed.align-items-center.absolute.right-0.left-0.bottom-0
        .col-5
          .grid.align-items-center
            .col-1
              .icon--large.icon-note
            .col
              div Note:
              Textarea.note-area.border-white(v-model="value" rows="1" cols="40" placeholder='Write something...')
        .col-2
          .grid.align-items-center
            .col-3
              img(src='~/assets/icons/box-border.svg')
            .col
              span.font-semibold.text-base.mr-1 Total boxs:
              .font-semibold.text-primary 1
        .col-2
          .grid.align-items-center
            .col-3
              img(src='~/assets/icons/total-items-border.svg')
            .col
              span.font-semibold.text-base.mr-1 Total items:
              .font-semibold.text-primary 1
        .col-2
          .grid.align-items-center
            .col-3
              img(src='~/assets/icons/total-fee.svg')
            .col
              span.font-semibold.text-base.mr-1 Total fee:
              .font-semibold.text-primary 1 $ / day
        .col-1
          Button Next
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
class DeliveryOrderPacking extends Vue {}

export default DeliveryOrderPacking
</script>
<style lang="sass" scoped>
.packing__detail--container
  height: calc(100vh - 32px)
  .packing__detail--left
    height: calc( 100% - 32px) !important
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
