<template lang="pug">
  Loading(:show='true')
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import Loading from '~/components/common/Loading.vue'

@Component({
  components: { Loading }
})
class Pages extends Vue {}

export default Pages
</script>
<style lang="sass">
</style>
