<template lang="pug">
.packingTimeDelivery.grid
  .icon.icon-calendar-infor.mr-2.bg-blue-700.inline-block
  span.uppercase.font-bold.mb-4 time information
  .col-12(className='lg:col-12 md:col-12 sm:col-12 py-3 px-2')
    StockUnit.location-unit(title="Due delivery date" value="Shop 7-17, G/F, Landmark" icon="icon-calendar")
  .col-12(className='lg:col-12 md:col-12 sm:col-12 py-3 px-2')
    StockUnit(title="Estimated delivery time" value="dfgdgdgdg" icon="icon-clock")
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
class PackingTimeDelivery extends Vue {

}

export default PackingTimeDelivery
</script>
<style lang="sass" scoped>
</style>
