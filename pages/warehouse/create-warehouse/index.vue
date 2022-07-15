<template lang="pug">
	CreateOrUpdateWarehouse
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import CreateOrUpdateWarehouse from '~/components/warehouse/CreateWarehouse.vue'

@Component({
  components: {
    CreateOrUpdateWarehouse
  }
})
class CreateWarehouse extends Vue {
}

export default CreateWarehouse
</script>
<style lang="sass" scoped>
</style>