<template lang="pug">
CreateOrUpdateStockTakeBox(:id='id')
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import CreateOrUpdateStockTakeBox from '~/components/stock-take/box/CreateOrUpdate.vue'

@Component({
  components: {
    CreateOrUpdateStockTakeBox
  }
})
class UpdateReceipt extends Vue {
  get id() {
    return this.$route.params.id
  }
}

export default UpdateReceipt
</script>
<style lang="sass" scoped>
</style>
