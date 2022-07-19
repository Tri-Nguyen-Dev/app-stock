<template lang="pug">
Dialog.item-list-dialog(:visible.sync='showModal', :showHeader='false' :modal='true' :contentStyle='{"overflow-y": "none !important"}')
  .text-heading.confirm-dialog__title Add new Warehouse
  .card.card-container
    .formgrid.grid(v-if= "!warehouseData")
      .field.col-12
        label.required__title(for='name') Name :
        InputText#name.w-full(
          v-model='warehouseInformation.name'
          type='text'
          class='focus:border-primary'
          :class="{'name--error' : $v.warehouseInformation.name.$error}")
        .error-message(v-if='$v.warehouseInformation.name.$dirty && !$v.warehouseInformation.name.required') Name cannot be empty!
      .field.col-12
        label.required__title(for='icon') Address :
        InputText#icon.w-full(
          v-model='warehouseInformation.address'
          type='text'
          :class="{'address--error' : $v.warehouseInformation.address.$error}")
        .error-message(
          v-if='$v.warehouseInformation.address.$dirty && !$v.warehouseInformation.address.required'
        ) Address cannot be empty!
      .field.col-12
        label.required__title(for='email') Email:
        InputText#email.w-full(
          v-model='warehouseInformation.email'
          type='text'
          :class="{'email--error' : $v.warehouseInformation.email.$error}")
        .error-message(v-if='$v.warehouseInformation.email.$dirty && !$v.warehouseInformation.email.required') Email cannot be empty!
      .field.col-12(class='lg:col-12')
        label(for='description') Description :
        InputText#description.w-full(v-model='warehouseInformation.description' type='text')
      .field.col-12(class='md:col-6')
        label.required__title(for='phone') Phone :
        InputText#phone.w-full(
          v-model='warehouseInformation.phone'
          type='text'
          :class="{'phone--error' : $v.warehouseInformation.phone.$error}")
        .error-message(v-if='$v.warehouseInformation.phone.$dirty && !$v.warehouseInformation.phone.required') Phone cannot be empty!
      .field.col-12(class='md:col-6')
        label(for='maxNumberRack') MaxNumberRack :
        InputText#maxNumberRack.w-full(v-model='warehouseInformation.maxNumberRack' type='number')
      .field.col-12.modal-btn(class='md:col-9')
    .formgrid.grid(v-if= " warehouseData && warehouseData.id")
      .field.col-12
        label.required__title(for='name') Name :
        InputText#name.w-full(v-model='warehouseData.name' type='text' class='focus:border-primary')
      .field.col-12
        label.required__title(for='icon') Address :
        InputText#icon.w-full(v-model='warehouseData.address' type='text')
      .field.col-12
        label.required__title(for='email') Email:
        InputText#email.w-full(v-model='warehouseData.email' type='text' )
      .field.col-12(class='lg:col-12')
        label(for='description') Description :
        InputText#description.w-full(v-model='warehouseData.description' type='text')
      .field.col-12(class='md:col-6')
        label.required__title(for='phone') Phone :
        InputText#phone.w-full(v-model='warehouseData.phone' type='text' )
      .field.col-12(class='md:col-6')
        label(for='maxNumberRack') MaxNumberRack :
        InputText#maxNumberRack.w-full(v-model='warehouseData.maxNumberRack' type='number')
  template(#footer)
    .field.col-12.modal-btn(class='md:col-9')
      Button.btn.btn-cancel(@click="$emit('close-modal')") Cancel
        span
      Button.btn.btn-primary(v-if="!warehouseData" @click="addItem()")
        span Save
      Button.btn.btn-primary(v-if="warehouseData" @click="UpdateItem()")
        span Save
</template>
<script lang="ts">
import { Component, Vue, namespace, Prop, Watch } from 'nuxt-property-decorator'
import { required } from 'vuelidate/lib/validators'
import { Warehouse as WarehouseModel } from '~/models/Warehouse'
import ConfirmDialogCustom from '~/components/dialog/ConfirmDialog.vue'
const nsStoreWarehouse = namespace('warehouse/warehouse-list')
@Component({
  components: {
    ConfirmDialogCustom
  },
  validations: {
    warehouseInformation: {
      name: {
        required
      },
      address: {
        required
      },
      email: {
        required
      },
      description: {},
      phone: {
        required
      },
      maxNumberRack: {}
    }
  }
})
class AddNewWarehouse extends Vue {
  @Prop() warehouseData!: any
  @Prop() isShowCreateWarehouse = false
  showModal = false
  warehouseInformation: any = {
    name: '',
    address: '',
    phone: '',
    email:'',
    description: '',
    maxNumberRack: ''
  }

  // -- [ state ]------------------------------------------------
  @nsStoreWarehouse.State
  warehouseList!: WarehouseModel.Model[]

  @nsStoreWarehouse.State
  newWarehouseDetail!: WarehouseModel.CreateOrUpdateWarehouse

  @nsStoreWarehouse.State
  warehouseDetail!: WarehouseModel.Model

  @nsStoreWarehouse.Action
  actWarehouseList!: (params?: any) => Promise<void>

  @nsStoreWarehouse.Action
  actCreateNewWarehouse!: (param?: any) => Promise<void>

  @nsStoreWarehouse.Action
  actWarehouseDetail!: (param?: any) => Promise<any>

  @nsStoreWarehouse.Action
  actUpdateWarehouse!: (param?: any) => Promise<any>

  // --[ getter ] -----------------------------------------------
  @Watch('isShowCreateWarehouse')
  setShowModal(){
    this.showModal = this.isShowCreateWarehouse
  }
  // --[ functions ] --------------------------------------------

  async mounted() {
    await Promise.all([this.actWarehouseList()])
  }

  clearInform(){
    this.warehouseInformation.name = ''
    this.warehouseInformation.address =''
    this.warehouseInformation.phone =''
    this.warehouseInformation.email =''
    this.warehouseInformation.description =''
    this.warehouseInformation.maxNumberRack =''

  }

  async addItem() {
    this.$v.warehouseInformation.name?.$touch()
    this.$v.warehouseInformation.address?.$touch()
    this.$v.warehouseInformation.email?.$touch()
    this.$v.warehouseInformation.phone?.$touch()
    if (this.$v.$invalid) {
      return
    }
    const result: any = await this.actCreateNewWarehouse({
      name: this.warehouseInformation.name,
      address: this.warehouseInformation.address,
      phone: this.warehouseInformation.phone,
      email: this.warehouseInformation.email,
      description: this.warehouseInformation.description,
      maxNumberRack: +this.warehouseInformation.maxNumberRack
    })

    await this.actWarehouseList()
    if(result){
      this.clearInform()
      this.$emit('close-modal', this.warehouseInformation)
      this.$toast.add({
        severity: 'success',
        summary: 'Success Message',
        detail: 'Successfully create new category',
        life: 3000
      })
    } else {
      this.clearInform()
      this.$emit('close-modal', this.warehouseInformation)
      this.$toast.add({
        severity: 'error',
        summary: 'Error Message',
        detail: 'Create category failed!',
        life: 3000
      })
    }
  }

  async UpdateItem() {
    const result = await this.actUpdateWarehouse({
      id: this.warehouseData.id,
      name: this.warehouseData.name,
      address: this.warehouseData.address,
      phone: this.warehouseData.phone,
      email: this.warehouseData.email,
      description: this.warehouseData.description,
      maxNumberRack: this.warehouseData.maxNumberRack
    })
    if (result) {
      await this.actWarehouseList()
      this.clearInform()
      this.$emit('close-modal', this.warehouseData)
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
export default AddNewWarehouse
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
