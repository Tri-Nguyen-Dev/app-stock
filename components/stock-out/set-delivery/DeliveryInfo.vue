<template lang="pug">
  .delivery-info
    .info-heading
      .icon.icon-info.bg-primary
      span.info-title DELIVERY INFORMATION
    .item-address.grid
      .col-5
        AddressItem(titleText="PICK-UP ADDRESS")
        AddressItem(titleText="Destination ADDRESS" class="mt-2")
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import AddressItem from '~/components/stock-out/set-delivery/AddressItem.vue'

@Component({
  components: {
    AddressItem
  }
})

class DeliveryInfo extends Vue {

}

export default DeliveryInfo
</script>

<style lang="sass" scoped>
.info-heading
  display: flex
  align-items: center
  gap: 0 10px

  .info-title
    color: $text-color-800
    font-size: $font-size-small
    font-weight: $font-weight-bold
    line-height: calc(24 / 12)
.item-address
  margin: 20px 0
</style>