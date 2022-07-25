<template lang="pug">
  section
    ProgressSpinner(v-if="hasRouteQuery" strokeWidth="6")
    .surface-0.flex.align-items-center.justify-content-center.min-h-screen.min-w-screen.overflow-hidden.p-2(v-else)
      .grid.justify-content-center.col-12(class='md:col-6 lg:col-4')
        .logo-block.w-full.mb-5.text-center
          img.pr-1(:src='require("assets/images/tag-user.png")')
          img.pt-2(:src='require("assets/images/logo-text-airtag.png")')
        .w-full
          Button.bg-primary.w-full.p-3.mb-3(type="button", label="Sign In", @click='callLogin')
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  layout: 'public'
})
class Login extends Vue {
  async callLogin() {
    await this.$auth.loginWith('keycloak')
  }

  get hasRouteQuery() {
    return !(_.isEmpty(this.$route.query))
  }
}

export default Login
</script>
<style lang="sass" scoped>
.logo-block
  height: 54px
  img
    height: 100%
</style>
