<template lang="pug">
  .modal-overlay
    .modal
      .text-heading.modal-header Add new Warehouse
      .card
        .formgrid.grid
          .field.col-12()
            label.required__title(for='name') Name :
            InputText#name.text-base.text-color.surface-overlay.p-2.border-1.border-solid.surface-border.border-round.appearance-none.outline-none.w-full(v-model='WarehouseInformation.name' type='text' class='focus:border-primary' :class="{'name--error' : $v.WarehouseInformation.name.$error}")
            .error-message(v-if='$v.WarehouseInformation.name.$dirty && !$v.WarehouseInformation.name.required') Name cannot be empty! 
          .field.col-12(class='md:col-6')
            label(for='icon') Adress:
            InputText#icon.text-base.text-color.surface-overlay.p-2.border-1.border-solid.surface-border.border-round.appearance-none.outline-none.w-full(type='text' v-model='WarehouseInformation.icon' )
          .field.col-12(class='md:col-6')
            label(for='displayOrder') Phone:
            InputText#displayOrder.text-base.text-color.surface-overlay.p-2.border-1.border-solid.surface-border.border-round.appearance-none.outline-none.w-full(type='number' v-model='WarehouseInformation.displayOrder')
          .field.col-12(class='md:col-6')
            label(for='icon') Email:
            InputText#icon.text-base.text-color.surface-overlay.p-2.border-1.border-solid.surface-border.border-round.appearance-none.outline-none.w-full(type='text' v-model='WarehouseInformation.icon' )
          .field.col-12(class='md:col-6')
            label(for='icon') Description:
            InputText#icon.text-base.text-color.surface-overlay.p-2.border-1.border-solid.surface-border.border-round.appearance-none.outline-none.w-full(type='text' v-model='WarehouseInformation.icon' )
          .field.col-12(class='md:col-6')
            label(for='icon') Max Number Rack:
            InputText#icon.text-base.text-color.surface-overlay.p-2.border-1.border-solid.surface-border.border-round.appearance-none.outline-none.w-full(type='text' v-model='WarehouseInformation.icon' )
          .field.col-12.modal-btn(class='md:col-9')
            Button.btn.btn-cancel(@click="$emit('close-modal')")
              span Cancel
            Button.btn.btn-primary(@click="addItem()")
              .icon.icon-add-items
              span Add Category
</template>
<script lang="ts">
import { Component, Vue, namespace } from 'nuxt-property-decorator'
import { required } from 'vuelidate/lib/validators'
import { Warehouse as WarehouseModel } from '~/models/Warehouse'
const nsStoreWarehouse = namespace('warehouse/warehouse-list')
@Component({
  validations: {
    warehouseInformation: {
      name: {
        required
      },
      icon: {},
      displayOrder: {},
      deleted: Boolean
    }
  }
})
class AddNewWarehouse extends Vue {
  WarehouseInformation: any = {
    name: '',
    adress: '',
    phone: '',
    email:'',
    description: '',
    maxNumberRack: ''
  }

  @nsStoreWarehouse.State
  warehouseList!: WarehouseModel.Model[]

  @nsStoreWarehouse.State
  newWarehouseDetail

  @nsStoreWarehouse.Action
  actWarehouseList!: (params?: any) => Promise<void>

  @nsStoreWarehouse.Action
  actCreateNewCategory!: (param: any) => Promise<void>

  async mounted() {
    await Promise.all([this.actWarehouseList()])
  }

  async addItem() {
    this.$v.categoryInformation.name?.$touch()
    if (this.$v.$invalid) {
      return
    }
    await this.actCreateNewCategory({
      name: this.WarehouseInformation.Name,
      adress: this.WarehouseInformation.Adress,
      phone: this.WarehouseInformation.Phone,
      email: this.WarehouseInformation.Email,
      Description: this.WarehouseInformation.Description,
      MaxNumberRack: this.WarehouseInformation.MaxNumberRack
    })
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

.modal-btn
  display: flex
  align-items: flex-end
  justify-content: flex-end
  gap: 15px
</style>
