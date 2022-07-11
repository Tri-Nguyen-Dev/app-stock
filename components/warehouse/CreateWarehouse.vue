<template lang="pug">
  .modal-overlay
    .modal
      .text-heading.modal-header Add new Warehouse
      .card
        .formgrid.grid
          .field.col-12()
            label.required__title(for='name') Name :
            InputText#name.text-base.text-color.surface-overlay.p-2.border-1.border-solid.surface-border.border-round.appearance-none.outline-none.w-full(v-model='warehouseInformation.name' type='text' class='focus:border-primary' :class="{'name--error' : $v.warehouseInformation.name.$error}")
            .error-message(v-if='$v.warehouseInformation.name.$dirty && !$v.warehouseInformation.name.required') Name cannot be empty!
          .field.col-12()
            label.required__title(for='icon') Address :
            InputText#icon.text-base.text-color.surface-overlay.p-2.border-1.border-solid.surface-border.border-round.appearance-none.outline-none.w-full(v-model='warehouseInformation.address' type='text' :class="{'address--error' : $v.warehouseInformation.address.$error}")
            .error-message(v-if='$v.warehouseInformation.address.$dirty && !$v.warehouseInformation.address.required') Address cannot be empty!
          .field.col-12()
            label.required__title(for='email') Email:
            InputText#email.text-base.text-color.surface-overlay.p-2.border-1.border-solid.surface-border.border-round.appearance-none.outline-none.w-full(v-model='warehouseInformation.email' type='text' :class="{'email--error' : $v.warehouseInformation.email.$error}")
            .error-message(v-if='$v.warehouseInformation.email.$dirty && !$v.warehouseInformation.email.required') Email cannot be empty!
          .field.col-12(class='lg:col-12')
            label(for='description') Description :
            InputText#description.text-base.text-color.surface-overlay.p-2.border-1.border-solid.surface-border.border-round.appearance-none.outline-none.w-full(v-model='warehouseInformation.description' type='text')
          .field.col-12(class='md:col-6')
            label.required__title(for='phone') Phone :
            InputText#phone.text-base.text-color.surface-overlay.p-2.border-1.border-solid.surface-border.border-round.appearance-none.outline-none.w-full(v-model='warehouseInformation.phone' type='text' :class="{'phone--error' : $v.warehouseInformation.phone.$error}")
            .error-message(v-if='$v.warehouseInformation.phone.$dirty && !$v.warehouseInformation.phone.required') Phone cannot be empty!
          .field.col-12(class='md:col-6')
            label(for='maxNumberRack') MaxNumberRack :
            InputText#maxNumberRack.text-base.text-color.surface-overlay.p-2.border-1.border-solid.surface-border.border-round.appearance-none.outline-none.w-full(v-model='warehouseInformation.maxNumberRack' type='number')
          .field.col-12.modal-btn(class='md:col-9')
            Button.btn.btn-cancel(@click="$emit('close-modal')")
              span Cancel
            Button.btn.btn-primary(@click="addItem()")
              .icon.icon-add-items
              span Add Warehouse
        
</template>
<script lang="ts">
import { Component, Vue, namespace, Prop } from 'nuxt-property-decorator'
import { required } from 'vuelidate/lib/validators'
import { Warehouse as WarehouseModel } from '~/models/Warehouse'
const nsStoreWarehouse = namespace('warehouse/warehouse-list')
@Component({
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
  @Prop() id!: string
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

  @nsStoreWarehouse.Action
  actWarehouseList!: (params?: any) => Promise<void>

  @nsStoreWarehouse.Action
  actCreateNewWarehouse!: (param: any) => Promise<void>

  @nsStoreWarehouse.Action
  actUpdateWarehouse!: (param: any) => Promise<void>

  // --[ getter ] -----------------------------------------------

  // --[ functions ] --------------------------------------------
  async mounted() {
    await Promise.all([this.actWarehouseList()])
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
      this.$emit('close-modal', this.warehouseInformation)
      this.$toast.add({
        severity: 'success',
        summary: 'Success Message',
        detail: 'Successfully create new category',
        life: 3000
      })
    } else {
      this.$emit('close-modal', this.warehouseInformation)
      this.$toast.add({
        severity: 'error',
        summary: 'Error Message',
        detail: 'Create category failed!',
        life: 3000
      })
    }
  }
}
export default AddNewWarehouse
</script>
<style lang="sass" scoped>
.modal-overlay
  position: fixed
  top: 0
  bottom: 0
  left: 0
  right: 0
  display: flex
  justify-content: center
  align-items: center
  background-color: #000000da
  z-index: 1000

.modal
  background-color: #fff
  padding: 50px
  border-radius: 10px
  width: 750px

.modal-header
  text-align: center
  margin-bottom: 30px

.btn
  cursor: pointer
  border: none
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
