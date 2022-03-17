<template lang='pug'>
  section.surface-0.flex.align-items-center.justify-content-center.min-h-screen.min-w-screen.overflow-hidden.p-2
    .grid.justify-content-center.col-12(class='md:col-6 lg:col-4')
      .logo-block.w-full.mb-5
        img.pr-1(:src='require("assets/images/tag-user.png")')
        img.pt-2(:src='require("assets/images/logo-text-airtag.png")')
      .w-full
        //- Input Email
        label.block.font-bold.mb-2(for="inputEmail") Email
        span.p-input-icon-left.mb-3.w-full
          .icon.icon--left.icon-sms.bg-primary
          InputText#inputEmail.w-full(v-model="loginUser.userName")
        //- Input Password
        label.block.font-bold.mb-2(for="inputPassword") Password
        span.p-input-icon-left.mb-6.w-full
          .icon.icon--left.icon-lock-open.bg-primary
          InputText#inputPassword.w-full(type="password", v-model="loginUser.password")
        //- Action block
        Button.bg-primary.w-full.p-3.mb-3(type="button", label="Sign In", @click='callLogin')
        //- Remember block
        .flex.align-items-center.justify-content-between.mb-5
          .flex.align-items-center
            Checkbox#rememberCheck.mr-2(v-model="checked", :binary="true")
            label.text-sm(for="rememberCheck") Save password
          a.ml-5.text-sm.text-right.text-primary.cursor-pointer Forgot password?

</template>
<script lang='ts'>
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  fetch({ redirect, $auth }): Promise<void> | void {
    if ($auth.user) {
      redirect('/')
    }
  },
})
class Login extends Vue {

  checked = false

  loginUser = {
    userName: null,
    password: null
  }

  callLogin() {
    this.$auth.loginWith('local', { data: this.loginUser })
      .catch(() => {
        const userLogin = require('~/mocks/user.json')
        this.$auth.setUser(userLogin)
        this.$store.commit('commons/store-token/setToken', userLogin)
      })
  }
}

export default Login
</script>
<style lang='sass'>
.logo-block
  height: 54px
  img
    height: 100%
</style>
