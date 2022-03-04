<template lang='pug'>
  b-overlay(:show='loading')
    slot
</template>
<script lang='ts'>
import { Component, namespace, Vue } from 'nuxt-property-decorator'

const nsStoreLoader = namespace('commons/store-loader')

@Component
class Loading extends Vue {
  @nsStoreLoader.State
  loading!: boolean
}

export default Loading
</script>
