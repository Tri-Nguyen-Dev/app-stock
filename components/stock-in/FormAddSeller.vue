<template lang="pug">
.add-seller
  .addSeller
    .addSellerHeader
      h3.px-3 Add Seller
    .addSellerContent.p-3
      h5.my-1.required__title Email
      InputText.w-full(v-model='seller.email')
      h5.mb-1 First name
      InputText.w-full(
        v-model='seller.firstName',
      )
      //- .error-message(v-if='$v.seller.firstName.$dirty && !$v.seller.firstName.required') Name cannot be empty!
      h5.mb-1 Last name
      InputText.w-full(
        v-model='seller.lastName',
      )
      //- .error-message(v-if='$v.seller.lastName.$dirty && !$v.seller.lastName.required') Name cannot be empty!
      h5.mb-1 Phone number
      InputText.w-full(
        v-model='seller.phoneNumber',
      )
    .addSellerFooter.p-3
      .grid
        .col
          .text-center.surface-hover.cursor-pointer.border-round.p-1(
            @click='cancelCreateSeller'
          )
            span.uppercase.font-semibold cancel
        .col
          .text-center.bg-blue-500.cursor-pointer.border-round.text-white.p-1(
            @click='createSeller'
          )
            span.uppercase save
  Toast(:baseZIndex='99999')
</template>
<script lang='ts'>
import { Component, Vue, Prop, namespace } from 'nuxt-property-decorator'
import { required } from 'vuelidate/lib/validators'
const nsStoreSeller = namespace('seller/seller-create')
@Component({
  validations: {
    seller: {
      email: {
        required
      }
    }
  }
})
class FormAddSeller extends Vue {
  @Prop({ default:'' }) email!: string
  @Prop({ default:'' }) warehouseId!: string
  seller = {
    firstName: undefined,
    lastName:  undefined,
    email: this.email,
    phoneNumber: undefined,
    displayName: '',
    warehouse:{
      id: this.warehouseId
    }
  }

  @nsStoreSeller.State
  newSeller!: any

  @nsStoreSeller.Action
  actCreateSeller!: any

  async createSeller() {
    if (!this.checkValidateInput()) {
      return
    }
    this.seller.displayName = `${this.seller.firstName} ${this.seller.lastName}`
    await this.actCreateSeller(this.seller)
    if (this.newSeller) {
      this.$toast.add({
        severity: 'success',
        summary: 'Success Message',
        detail: 'Successfully create seller ',
        life: 3000
      })
      this.$emit('createSeller', this.newSeller)
      this.cancelCreateSeller()
    }
  }

  checkValidateInput() {
    this.$v.seller.email?.$touch()
    if (this.$v.$invalid) {
      return false
    }
    return true
  }

  cancelCreateSeller() {
    this.$emit('cancelCreateSeller')
  }

}

export default FormAddSeller
</script>
<style lang="sass" scoped>
::v-deep.addSeller
  display: flex
  flex-direction: column
  height: 100%
  .p-inputtext
    box-shadow: none
  .addSellerHeader
    border-bottom: 1px solid #E8EAEF
  .addSellerContent
    flex: 1
    .p-message-text
      overflow-wrap: anywhere
    .error-message
      color: #ff0000
  .addSellerFooter
    border-top: 1px solid #E8EAEF
  .p-fileupload-content
    padding: 0 1rem !important
</style>
