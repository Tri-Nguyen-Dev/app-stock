<template lang="pug">
	CreateOrUpdateReceipt(:id='id')
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import CreateOrUpdateReceipt from '~/components/stock-in/CreateOrUpdate.vue'

@Component({
  components: {
    CreateOrUpdateReceipt
  }
})
class UpdateReceipt extends Vue {
  id= this.$route.params.id
}

export default UpdateReceipt
</script>
<style lang="sass" scoped>
</style>
