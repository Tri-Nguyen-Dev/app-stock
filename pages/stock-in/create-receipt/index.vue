<template lang="pug">
	CreateOrUpdateReceipt
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import CreateOrUpdateReceipt from '~/components/stock-in/CreateOrUpdate.vue'

@Component({
  components: {
    CreateOrUpdateReceipt
  }
})
class CreateReceipt extends Vue {
}

export default CreateReceipt
</script>
<style lang="sass" scoped>
</style>
