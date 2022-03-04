<template lang='pug'>
  b-container
    h1.text-center
      Login Failed
</template>
<script lang='ts'>
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  layout: 'default'
})
class LoginFailed extends Vue {
  callLogout() {
    this.$auth.logout()
  }
}

export default LoginFailed
</script>
<style lang='sass'>
</style>
