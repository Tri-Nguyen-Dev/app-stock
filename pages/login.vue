<template lang='pug'>
  b-container
    section.vh-100
      .container-fluid.h-custom
        .row.d-flex.justify-content-center.align-items-center.h-100

          .col-md-9.col-lg-6.col-xl-5
            img.img-fluid(src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp")
          form.col-md-8.col-lg-6.col-xl-4.offset-xl-1
            h4.mt-1.mb-5.pb-1 AIRTAG SYSTEM
            .form-outline.mb-4
              input.form-c.form-control-lg(v-model="loginUser.userName", placeholder="Enter user name")
            .form-outline.mb-3
              input.form-c.form-control-lg(type="password", v-model="loginUser.password", placeholder="Enter password")

            .text-lg-start.mt-4.pt-2
              button.btn.btn-primary.btn-lg(type="button", @click='callLogin') Login
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
.divider:after,
.divider:before
  content: ""
  flex: 1
  height: 1px
  background: #eee

.h-custom
  height: calc(100% - 73px)

@media (max-width: 450px)
.h-custom
  height: 100%
</style>
