<template lang="pug">
Dialog.item-list-dialog(:visible.sync='showModal', :showHeader='false' :modal='true' :contentStyle='{"overflow-y": "none !important"}')
  .text-heading.confirm-dialog__title Add New BoxSize
  .card.card-container
    .formgrid.grid(v-if= "!boxSizeData")
      .field.col-12(class='md:col-6')
        label.required__title(for='name') Name :
        InputText#name.w-full(
          v-model='boxSizeInform.name' 
          type='text' class='focus:border-primary' 
          :class="{'name--error' : $v.boxSizeInform.name.$error}"
        )
        .error-message(v-if='$v.boxSizeInform.name.$dirty && !$v.boxSizeInform.name.required') Name cannot be empty!
      .field.col-12(class='md:col-6')
        label.required__title(for='height') Height :
        InputText#height.w-full(
          v-model='boxSizeInform.height' 
          type='text' 
          :class="{'height--error' : $v.boxSizeInform.height.$error}"
        
        )
        .error-message(v-if='$v.boxSizeInform.height.$dirty && !$v.boxSizeInform.height.required') Height cannot be empty!
      .field.col-12(class='md:col-6')
        label.required__title(for='width') Width :
        InputText#width.w-full(
          v-model='boxSizeInform.width' 
          type='text' 
          :class="{'width--error' : $v.boxSizeInform.width.$error}"
        )
        .error-message(v-if='$v.boxSizeInform.width.$dirty && !$v.boxSizeInform.width.required') Width cannot be empty!
      .field.col-12(class='md:col-6')
        label.required__title(for='length') Length :
        InputText#length.w-full(
          v-model='boxSizeInform.length' 
          type='text' 
          :class="{'length--error' : $v.boxSizeInform.length.$error}"
        )
        .error-message(v-if='$v.boxSizeInform.length.$dirty && !$v.boxSizeInform.length.required') Length cannot be empty!
      .field.col-12.modal-btn(class='md:col-9')
    .formgrid.grid(v-if= " boxSizeData && boxSizeData.id")
      .field.col-12(class='md:col-6')
        label.required__title(for='name') Name :
        InputText#name.w-full(
          v-model='boxSizeData.name' 
          type='text' 
          class='focus:border-primary'
        )
      .field.col-12(class='md:col-6')
        label.required__title(for='height') Height :
        InputText#height.w-full(
          v-model='boxSizeData.height' 
          type='text'
        )
      .field.col-12(class='md:col-6')
        label.required__title(for='width') Width :
        InputText#width.w-full(
          v-model='boxSizeData.width' 
          type='text'
        )
      .field.col-12(class='md:col-6')
        label.required__title(for='length') Length :
        InputText#length.w-full(
          v-model='boxSizeData.length' 
          type='text'
        )
      .field.col-12.modal-btn(class='md:col-9')
  template(#footer)
    .field.col-12.modal-btn(class='md:col-9')
      Button.btn.btn-cancel(@click="$emit('close-modal')") Cancel
        span
      Button.btn.btn-primary(v-if="!boxSizeData" @click="addItem()")
        span Save
      Button.btn.btn-primary(v-if="boxSizeData" @click="UpdateItem()")
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
    boxSizeInform: {
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
  boxSizeInform: any = {
    name: '',
    height: '',
    width: '',
    length: ''
  }

  // -- [ state ]------------------------------------------------
  @nsStoreBoxSize.State
  boxSizeList!: BoxSizeModel.Model[]

  @nsStoreBoxSize.State
  newBoxSize!: BoxSizeModel.CreateOrUpdateBoxSize

  @nsStoreBoxSize.Action
  actBoxSizeList!: () => Promise<void>

  @nsStoreBoxSize.Action
  actCreateNewBoxSize!: (param?: any) => Promise<void>
  
  @nsStoreBoxSize.Action
  actUpdateBoxSize!: (param?: any) => Promise<any>

  // --[ getter ] -----------------------------------------------

  @Watch('isCreateBoxSize')
  setShowModal(){
    this.showModal = this.isCreateBoxSize
  }

  // --[ functions ] --------------------------------------------
  async mounted() {
    await Promise.all([this.actBoxSizeList()])
  }

  clearInform(){
    this.boxSizeInform.name = ''
    this.boxSizeInform.height =''
    this.boxSizeInform.width =''
    this.boxSizeInform.length =''
  }

  async addItem() {
    this.$v.boxSizeInform.name?.$touch()
    this.$v.boxSizeInform.height?.$touch()
    this.$v.boxSizeInform.width?.$touch()
    this.$v.boxSizeInform.length?.$touch()
    if (this.$v.$invalid) {
      return
    }
    const result: any = await this.actCreateNewBoxSize({
      name: this.boxSizeInform.name,
      height: +this.boxSizeInform.height,
      width: +this.boxSizeInform.width,
      length: +this.boxSizeInform.length
    })

    await this.actBoxSizeList()
    if(result){
      this.clearInform()
      this.$emit('close-modal', this.boxSizeInform)
      this.$toast.add({
        severity: 'success',
        summary: 'Success Message',
        detail: 'Successfully create new category',
        life: 3000
      })
    } else {
      this.clearInform()
      this.$emit('close-modal', this.boxSizeInform)
      this.$toast.add({
        severity: 'error',
        summary: 'Error Message',
        detail: 'Create category failed!',
        life: 3000
      })
    }
  }

  async UpdateItem(){
    const result = await this.actUpdateBoxSize({
      id: this.boxSizeData.id,
      name: this.boxSizeData.name,
      height: this.boxSizeData.height,
      width: this.boxSizeData.width,
      length: this.boxSizeData.length
    })
    if (result){
      await this.actBoxSizeList()
      this.clearInform()
      this.$emit('close-modal', this.boxSizeData)
      this.$toast.add({
        severity: 'success',
        summary: 'Success Message',
        detail: 'Successfully update box',
        life: 3000
      }) 
    } else {
      this.clearInform()
      this.$toast.add({
        severity: 'error',
        summary: 'Error Message',
        detail: 'Update category failed!',
        life: 3000
      })
    }
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