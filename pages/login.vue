<template lang='pug'>
b-container
  section.vh-100
    .container-fluid.h-custom
      .row.d-flex.justify-content-center.align-items-center.h-100

        .col-md-9.col-lg-6.col-xl-5
          img.img-fluid(src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp")
        form.col-md-8.col-lg-6.col-xl-4.offset-xl-1
          h4.mt-1.mb-5.pb-1 AIRTAG CRMS
          .form-outline.mb-4
            input.form-c.form-control-lg(v-model="userName", placeholder="Enter user name")
          .form-outline.mb-3
            input.form-c.form-control-lg(type="password", placeholder="Enter password")

          .text-lg-start.mt-4.pt-2
            button.btn.btn-primary.btn-lg(type="button", @click='callLogin') Login
</template>
<script lang='ts'>
import {Component, Provide, Vue} from 'nuxt-property-decorator'

@Component({
  fetch({ redirect, $auth }): Promise<void> | void {
    if ($auth.loggedIn) {
      redirect('/')
    }
  },
})
class Login extends Vue {
  @Provide()
  userName: string = ''

  callLogin() {
    console.log(this.userName)
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
