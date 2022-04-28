<template lang="pug"> 
  div.layout-auth
    .auth-wapper
      Nuxt
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
class Dashboard extends Vue {}

export default Dashboard
</script>
<style lang="sass" scoped>
.layout-auth
  position: relative
  width: 100%
  height: 100vh 
  background-color: $color-white
  .auth-wapper
    padding: 16px
    position: absolute
    width: 340px
    height: 422px
    left: 50%
    top: 50%
    transform: translate(-50%, -50%)
    text-align: center
</style>
