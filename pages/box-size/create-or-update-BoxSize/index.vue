<template lang="pug">
	CreateOrUpdateBoxSize
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import CreateOrUpdateBoxSize from '~/components/box-size/CreateBozSize.vue'

@Component({
  components: {
    CreateOrUpdateBoxSize
  }
})
class CreateBoxSize extends Vue {
}

export default CreateBoxSize
</script>
<style lang="sass" scoped>
</style>