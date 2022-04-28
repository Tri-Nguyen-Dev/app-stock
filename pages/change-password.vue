<template lang="pug">
  div.change-password
      h3.auth-title Change new password
      p.auth-des Please enter the new password twice in the two input below.
      div.auth-input.auth-input-password
        input(placeholder="Enter password")
        .icon.icon-regularlock-open-alt.icon--left.icon-status-primary
        .icon.icon-eye.icon--right.icon-status-normal.cursor-pointer
      div.auth-input.auth-input-password.mt-3
        input(placeholder="Enter confirm password")
        .icon.icon-regularlock-open-alt.icon--left.icon-status-primary
        .icon.icon-check-circle-fill.icon--right.icon-status-success
      ul.auth-list-vali.mt-3
        li.auth-vali-item
          .icon.icon-check.icon-status-success
          span 6 or more characters
        li.auth-vali-item
          .icon.icon-check.icon-status-normal
          span Upper & lowercase letters
        li.auth-vali-item
          .icon.icon-check.icon-status-normal
          span At least 1 number
        li.auth-vali-item
          .icon.icon-check.icon-status-normal
          span At least 1 special characters
      div.auth-action.mt-3
        .btn.btn-cancel Cancel
        .btn.btn-primary Submit
</template>
<script lang='ts'>
import { Component, Vue } from 'nuxt-property-decorator'
@Component({
  layout: 'public'
})
class ChangePassword extends Vue {
  
}

export default ChangePassword
</script>
<style lang="sass" scoped>
.change-password
  padding: 16px
  position: absolute
  width: 340px
  height: 422px
  left: 50%
  top: 50%
  transform: translate(-50%, -50%)
  text-align: center
  .auth-list-vali
    list-style-type: none
    padding-left: 0
  .auth-vali-item
    display: flex
    align-items: center
    gap: 0 10px
    margin-top: 12px
    span
      font-size: 12px
</style>