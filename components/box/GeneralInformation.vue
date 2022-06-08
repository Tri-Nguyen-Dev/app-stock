<template lang="pug">
  div.general-info.px-3
    div.general-heading.flex.align-items-center
      .icon.inline-block.mr-2.bg-primary(class='icon-info')
      h3.uppercase.text-sm general information
    div.general-content.grid
      .col
        .info-item.border-1.border-gray-300.p-2.border-round
          p.my-0.info-title.text-sm ID Creator
          p.info-content.text-900.font-semibold.text-sm.my-1 {{ user.email }}
      .col
        .info-item.border-1.border-gray-300.p-2.border-round
          p.my-0.info-title.text-sm Creator name
          p.info-content.text-900.font-semibold.text-sm.my-1 {{ user.displayName }}
      .col
        .info-item.border-1.border-gray-300.p-2.border-round
          p.my-0.info-title.text-sm Warehouse
          p.info-content.text-900.font-semibold.text-sm.my-1 NTN001
      .col
        .info-item.border-1.border-gray-300.p-2.border-round
          p.my-0.info-title.text-sm Seller email
          p.info-content.text-900.font-semibold.text-sm.my-1(v-if="this.listOriginalBox.length > 0") {{ infoSeller.email }}
      .col
        .info-item.border-1.border-gray-300.p-2.border-round
          .my-0p.info-title.text-sm Seller phone
          p.info-content.text-900.font-semibold.text-sm.my-1(v-if="this.listOriginalBox.length > 0") {{ infoSeller.phoneNumber }}
      .col
        .info-item.border-1.border-gray-300.p-2.border-round
          p.my-0.info-title.text-sm Seller name
          p.info-content.text-900.font-semibold.text-sm.my-1(v-if="this.listOriginalBox.length > 0") {{ infoSeller.displayName }} 
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { User } from '~/models/User'

@Component
class GeneralInformation extends Vue {
  @Prop() readonly user!: User.Model | undefined
  @Prop() readonly listOriginalBox!: any

  get infoSeller() {
    if(this.listOriginalBox && this.listOriginalBox.length > 0) {
      return this.listOriginalBox[0]?.request?.seller
    }
  }
}

export default GeneralInformation
</script>
<style lang="sass" scoped>
.info-item
  min-height: 60px
</style>

