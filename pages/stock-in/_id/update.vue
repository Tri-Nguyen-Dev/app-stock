<template lang="pug">
	CreateOrUpdate(:id='id')
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import CreateOrUpdate from '~/components/stock-in/CreateOrUpdate.vue'

@Component({
  components: {
    CreateOrUpdate
  }
})
class CreateReceipt extends Vue {
  id= this.$route.params.id
}

export default CreateReceipt
</script>
<style lang="sass" scoped>
</style>
