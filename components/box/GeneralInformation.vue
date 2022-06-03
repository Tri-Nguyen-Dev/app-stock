<template lang="pug">
  div.general-info.p-3
    div.general-heading.flex.align-items-center
      .icon.inline-block.mr-2.bg-primary(class='icon-info')
      h3.uppercase.text-sm general information
    div.general-content.grid
      .col
        .info-item.border-1.border-gray-300.p-2.border-round
          p.info-title ID receipt note
          p.info-content.text-900.font-semibold 030133333
      .col
        .info-item.border-1.border-gray-300.p-2.border-round
          p.info-title ID Creator
          p.info-content.text-900.font-semibold NVN030133
      .col
        .info-item.border-1.border-gray-300.p-2.border-round
          p.info-title Creator name
          p.info-content.text-900.font-semibold Nguyen Khanh Hung
      .col
        .info-item.border-1.border-gray-300.p-2.border-round
          p.info-title Create time
          p.info-content.text-900.font-semibold 19-09-2022 9:24AM
      .col
        .info-item.border-1.border-gray-300.p-2.border-round
          p.info-title Warehouse
          p.info-content.text-900.font-semibold NTN001
      .col
        .info-item.border-1.border-gray-300.p-2.border-round
          p.info-title Seller email
          p.info-content.text-900.font-semibold minhtri1314@gmail.com 
      .col
        .info-item.border-1.border-gray-300.p-2.border-round
          p.info-title Seller phone
          p.info-content.text-900.font-semibold (+84) 333 666 888
      .col
        .info-item.border-1.border-gray-300.p-2.border-round
          p.info-title Seller name
          p.info-content.text-900.font-semibold Apple Inc 
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
@Component
class GeneralInformation extends Vue {
  
}

export default GeneralInformation
</script>
<style lang="sass" scoped>
</style>

