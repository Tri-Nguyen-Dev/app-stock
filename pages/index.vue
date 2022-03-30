<template lang="pug">
  h1.text-center WELCOME!
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  // middleware: ['authenticate'],
  // layout: 'dashboard'
})
class Pages extends Vue {}

export default Pages
</script>
<style lang="sass">
</style>
