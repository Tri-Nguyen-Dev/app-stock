<template lang="pug">
  SetBoxSize
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import SetBoxSize from '~/components/warehouse/SetBoxSize.vue'

@Component({
  components: {
    SetBoxSize
  }
})

class SetBoxSizeForWarehouse extends Vue{
}
export default SetBoxSizeForWarehouse
</script>

<style lang="sass" scoped>
</style>