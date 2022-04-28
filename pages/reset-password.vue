<template lang="pug">
  div.reset-password
    div.img-reset
      img(:src='require("~/assets/images/reset-password.png")')
    h3.auth-title.mt-3 Reset password
    div.auth-input.mt-3
      input(placeholder="Enter email")
      .icon.icon-sms.icon--left.icon-status-primary
      //- email enter right - .icon-status-success / .icon-status-disabled
      .icon.icon-check-circle-fill.icon--right.icon-status-success 
    div.auth-action.mt-3
      .btn.btn-cancel Cancel
      .btn.btn-primary Submit
</template>
<script lang='ts'>
import { Component, Vue } from 'nuxt-property-decorator'
@Component({
  layout: 'auth'
})
class ResetPassword extends Vue {

}

export default ResetPassword
</script>
<style lang="sass" scoped>
.reset-password
  padding: 16px
  position: absolute
  width: 340px
  height: 422px
  left: 50%
  top: 50%
  transform: translate(-50%, -50%)
  text-align: center
</style>