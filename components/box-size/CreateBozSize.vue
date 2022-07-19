<template lang="pug">
Dialog.item-list-dialog(:visible.sync='showModal', :showHeader='false' :modal='true' :contentStyle='{"overflow-y": "none !important"}')
  .text-heading.confirm-dialog__title Add New BoxSize
  .card.card-container
    .formgrid.grid(v-if= "!boxSizeData")
      .field.col-12(class='md:col-6')
        label.required__title(for='name') Name :
        InputText#name.w-full(v-model='boxSizeInformation.name' type='text' class='focus:border-primary' :class="{'name--error' : $v.boxSizeInformation.name.$error}")
        .error-message(v-if='$v.boxSizeInformation.name.$dirty && !$v.boxSizeInformation.name.required') Name cannot be empty!
      .field.col-12(class='md:col-6')
        label.required__title(for='height') Height :
        InputText#height.w-full(v-model='boxSizeInformation.height' type='text' :class="{'height--error' : $v.boxSizeInformation.height.$error}")
        .error-message(v-if='$v.boxSizeInformation.height.$dirty && !$v.boxSizeInformation.height.required') Height cannot be empty!
      .field.col-12(class='md:col-6')
        label.required__title(for='width') Width :
        InputText#width.w-full(v-model='boxSizeInformation.width' type='text' :class="{'width--error' : $v.boxSizeInformation.width.$error}")
        .error-message(v-if='$v.boxSizeInformation.width.$dirty && !$v.boxSizeInformation.width.required') Width cannot be empty!
      .field.col-12(class='md:col-6')
        label.required__title(for='length') Length :
        InputText#length.w-full(v-model='boxSizeInformation.length' type='text' :class="{'length--error' : $v.boxSizeInformation.length.$error}")
        .error-message(v-if='$v.boxSizeInformation.length.$dirty && !$v.boxSizeInformation.length.required') Length cannot be empty!
      .field.col-12.modal-btn(class='md:col-9')
    .formgrid.grid(v-if= " boxSizeData && boxSizeData.id")
      .field.col-12(class='md:col-6')
        label.required__title(for='name') Name :
        InputText#name.w-full(v-model='boxSizeData.name' type='text' class='focus:border-primary')
      .field.col-12(class='md:col-6')
        label.required__title(for='height') Height :
        InputText#height.w-full(v-model='boxSizeData.height' type='text')
      .field.col-12(class='md:col-6')
        label.required__title(for='width') Width :
        InputText#width.w-full(v-model='boxSizeData.width' type='text')
      .field.col-12(class='md:col-6')
        label.required__title(for='length') Length :
        InputText#length.w-full(v-model='boxSizeData.length' type='text')
      .field.col-12.modal-btn(class='md:col-9')
  template(#footer)
    .field.col-12.modal-btn(class='md:col-9')
      Button.btn.btn-cancel(@click="$emit('close-modal')") Cancel
        span
      Button.btn.btn-primary
        span Save
</template>

<script lang="ts">
import { Component, Vue, namespace, Prop, Watch } from 'nuxt-property-decorator'
import { required } from 'vuelidate/lib/validators'
import ConfirmDialogCustom from '~/components/dialog/ConfirmDialog.vue'
import { BoxSize as BoxSizeModel } from '~/models/BoxSize'
const nsStoreBoxSize = namespace('box-size/box-size')
@Component({
  components: {
    ConfirmDialogCustom
  },
  validations: {
    boxSizeInformation: {
      name: {
        required
      },
      height: {
        required
      },
      width: {
        required
      },
      length: {
        required
      }
    }
  }
})
class AddNewBoxSize extends Vue {
  @Prop() isCreateBoxSize = false
  @Prop() boxSizeData!: any
  showModal = false
  boxSizeInformation: any = {
    name: '',
    height: '',
    width: '',
    length:''
  }

  // -- [ state ]------------------------------------------------
  @nsStoreBoxSize.State
  boxSizeList!: BoxSizeModel.Model[]
  // --[ getter ] -----------------------------------------------

  @Watch('isCreateBoxSize')
  setShowModal(){
    this.showModal = this.isCreateBoxSize
  }
}

export default AddNewBoxSize
</script>

<style lang="sass" scoped>
.item-list-dialog
  ::v-deep.p-dialog-content
    background-color: #E8EAEF
    width: 45vw
    padding-bottom: 5px
    overflow: hidden !important
.confirm-dialog__title
  margin:5px 0px 30px 280px
.card-container
  background-color: $color-white
  border-radius: 10px
  padding: 15px 30px 11px 30px
  margin-bottom: 10px
.btn
  cursor: pointer
  border: none
.btn-cancel
  background-color: #5a6268
  color: $color-white
  padding-right: 0
.btn-cancel :hover
  background-color: $primary
  color: $text-color-100
.btn-primary
  width: 85px
.error-message
    color: red
    margin-top: 5px
.modal-btn
  display: flex
  align-items: flex-end
  justify-content: flex-end
  gap: 15px
  width: 100%
  margin-top: 5px
</style>