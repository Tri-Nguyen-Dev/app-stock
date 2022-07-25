<template lang="pug">
  .address-item
    .address-title
      .icon.icon-receive-square.bg-primary
      span.info-title {{ titleText }}
    .address-block
      .block-icon
        .icon.icon-user-octagon.bg-primary
      .block-main
        .block-title 22 David Avenue, NYC
        .block-content Warehouse01
</template>          

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
class DeliveryInfo extends Vue {
  @Prop() titleText!: string | null

}

export default DeliveryInfo
</script>

<style lang="sass" scoped>
.address-item 
  display: flex
  align-items: center
  gap: 0 40px

  .address-title
    display: flex
    align-items: center
    gap: 0 10px

    .info-title
      color: $text-color-800
      font-size: $font-size-small
      font-weight: $font-weight-bold
      line-height: calc(24 / 12)
      text-transform: uppercase

  .info-title
    display: flex
    gap: 0 10px

  .address-block
    margin-left: auto
    display: flex
    align-items: center
    background-color: $text-color-200
    padding: 16px 46px 16px 16px
    border-radius: 4px
    gap: 0 18px

    .icon-user-octagon
      display: block
      width: 26px
      height: 26px

    .block-main
      .block-title
        color: $text-color-700
        font-size: $font-size-small
        font-weight: $font-weight-regular
        line-height: calc(16 / 12)

      .block-content
        color: $text-color-900
        font-size: $font-size-small
        font-weight: $font-weight-bold
        line-height: calc(16 / 12)
        margin-top: 6px
</style>