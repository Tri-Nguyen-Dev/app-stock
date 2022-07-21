<template lang="pug">
Dialog(header=`` :visible.sync='visibleVue', :modal='true' :showHeader='false')
  .modal
    .text-heading.modal-header {{modalHeader}} 
    .formgrid.grid
        .field.col-12(class='md:col-6')
          label(for='status') Status :
          Dropdown.w-full(v-model='airtagInformation.status' :options="statusList" optionLabel="name" optionValue='value')
        .field.col-12(class='md:col-6')
          label(for='Barcode') Barcode :
          InputText#Barcode.appearance-none.outline-none.w-full(type='text' v-model='airtagInformation.barCode')
        .field.col-12(v-if="modalHeader === 'Create Category'")
          label.required__title(for='id') AirTagAttribute id:
          InputText#id.appearance-none.outline-none.w-full(type='number' v-model='airtagInformation.airTagAttribute.id' :class="{'id--error' : $v.airtagInformation.airTagAttribute.id.$error}")
          .error-message(v-if='$v.airtagInformation.airTagAttribute.id.$dirty && !$v.airtagInformation.airTagAttribute.id.required') Name cannot be empty!
        .field.col-12(v-if="modalHeader === 'Update Category'")
          label(for='attribute') AirTagAttribute :
          Dropdown.w-full(@change='changeIsNull' v-model='isNull' :options='hasAttribute' optionLabel='name' optionValue='value')
        .div.col-12(v-if="isShowInputs && modalHeader === 'Update Category'")
          .w-full.attribute-input
            label(for='model') model :
            InputText#model.appearance-none.outline-none.w-full(type='text' v-model='airtagInformation.airTagAttribute.model')
          .w-full.attribute-input
            label(for='productionBatch') productionBatch :
            InputText#productionBatch.appearance-none.outline-none.w-full(type='text' v-model='airtagInformation.airTagAttribute.productionBatch')
          .w-full.attribute-input
            label(for='costPrice') costPrice :
            InputText#costPrice.appearance-none.outline-none.w-full(type='number' v-model='airtagInformation.airTagAttribute.costPrice')
          .w-full.attribute-input
            label(for='retailPrice') retailPrice :
            InputText#retailPrice.appearance-none.outline-none.w-full(type='number' v-model='airtagInformation.airTagAttribute.retailPrice')
          .w-full.attribute-input
            label(for='size') size :
            InputText#size.appearance-none.outline-none.w-full(type='text' v-model='airtagInformation.airTagAttribute.size')
          .w-full.attribute-input
            label(for='color') color :
            InputText#color.appearance-none.outline-none.w-full(type='text' v-model='airtagInformation.airTagAttribute.color')
          .w-full.attribute-input
            label(for='connectivity') connectivity :
            InputText#connectivity.appearance-none.outline-none.w-full(type='text' v-model='airtagInformation.airTagAttribute.connectivity')
          .w-full.attribute-input
            label(for='speaker') speaker :
            InputText#speaker.appearance-none.outline-none.w-full(type='text' v-model='airtagInformation.airTagAttribute.speaker')
          .w-full.attribute-input
            label(for='batteryLife') batteryLife :
            InputText#batteryLife.appearance-none.outline-none.w-full(type='text' v-model='airtagInformation.airTagAttribute.batteryLife')
          .w-full.attribute-input
            label(for='sensorTechnology') sensorTechnology :
            InputText#sensorTechnology.appearance-none.outline-none.w-full(type='text' v-model='airtagInformation.airTagAttribute.sensorTechnology')
          .w-full.attribute-input
            label(for='accelerometer') accelerometer :
            InputText#accelerometer.appearance-none.outline-none.w-full(type='text' v-model='airtagInformation.airTagAttribute.accelerometer')
          .w-full.attribute-input
            label(for='accessibility') accessibility :
            InputText#accessibility.appearance-none.outline-none.w-full(type='text' v-model='airtagInformation.airTagAttribute.accessibility')
          .w-full.attribute-input
            label(for='brandName') brandName :
            InputText#brandName.appearance-none.outline-none.w-full(type='text' v-model='airtagInformation.airTagAttribute.brandName')
          .w-full.attribute-input
            label(for='manufacturingDate') manufacturingDate :
            InputText#manufacturingDate.appearance-none.outline-none.w-full(type='date' v-model='airtagInformation.airTagAttribute.manufacturingDate')
        .field.col-12.modal-btn(class='md:col-12')
          Button.btn.btn-outline(@click="handleCancle")
            span Cancel
          Button.btn.btn-primary(@click='createOrUpdateItem' v-if="modalHeader === 'Create Category'" )
            span Create Category 
          Button.btn.btn-primary(@click='createOrUpdateItem' v-if="modalHeader === 'Update Category'")
            span Update Category
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch , namespace } from 'nuxt-property-decorator'
import { required } from 'vuelidate/lib/validators'
import {
  AirtagConstants
} from '~/utils'
const nsAirtag= namespace('airtag/Airtag')

@Component({
  validations: {
    airtagInformation: {
      barCode : {},
      Status: {},
      airTagAttribute:{
        id : {
          required
        },
        model: {},
        productionBatch: {},
        costPrice: {},
        retailPrice: {},
        size: {},
        color: {},
        connectivity: {},
        speaker: {},
        batteryLife: {},
        sensorTechnology: {},
        accelerometer: {},
        accessibility: {},
        systemRequirement: {},
        brandName: {},
        manufacturingDate: {}
      } 
    }
  }
})
class CreateOrUpdate extends Vue {
  @Prop() airtagData!: any
  @Prop({ default: false }) isShow!: boolean
  @Prop() modalHeader!: any

  statusList:any = AirtagConstants.AIRTAG_STATUS_OPTIONS
  isShowInputs: any = false
  airtagInformation: any = {
    airTagAttribute: {
      id : ''
    },
    status: 'AIRTAG_STATUS_AVAILABLE',
    barCode: ''
  }

  isNull: any = true
  hasAttribute: any = [
    { name: 'null' , value: true },
    { name: 'not null' , value: false }
  ]

  @nsAirtag.State
  airtagList!: any

  @nsAirtag.Action
  actAirtagList!: () => Promise<void>

  @nsAirtag.Action
  actUpdateAirtag!: (param: any) => Promise<any>

  @nsAirtag.Action
  actCreateNewAirtag!: (param: any) => Promise<any>
  
  @Watch('airtagData')
  updateData() {
    if(this.modalHeader === 'Update Category'){
      this.airtagInformation.id = this.airtagData.id
      this.airtagInformation.barCode = this.airtagData.barCode
      this.airtagInformation.status = this.airtagData.status
      this.airtagInformation.airTagAttribute = {
        id: this.airtagData.airTagAttribute.id,
        model: this.airtagData.airTagAttribute.model,
        productionBatch: this.airtagData.airTagAttribute.productionBatch,
        costPrice: this.airtagData.airTagAttribute.costPrice,
        retailPrice: this.airtagData.airTagAttribute.retailPrice,
        size: this.airtagData.airTagAttribute.size,
        color: this.airtagData.airTagAttribute.color,
        connectivity: this.airtagData.airTagAttribute.connectivity,
        speaker: this.airtagData.airTagAttribute.speaker,
        batteryLife: this.airtagData.airTagAttribute.batteryLife,
        sensorTechnology: this.airtagData.airTagAttribute.sensorTechnology,
        accelerometer: this.airtagData.airTagAttribute.accelerometer,
        accessibility: this.airtagData.airTagAttribute.accessibility,
        systemRequirement: this.airtagData.airTagAttribute.systemRequirement,
        brandName: this.airtagData.airTagAttribute.brandName,
        manufacturingDate: this.airtagData.airTagAttribute.manufacturingDate
      }
      if(this.airtagInformation.airTagAttribute) {
        this.isNull = false
        this.isShowInputs = true
      }
    } 
  }

  changeIsNull() {
    if(this.isNull) {
      this.isShowInputs = false
      this.airtagInformation.airTagAttribute = null
    }
    else {
      this.isShowInputs = true
      this.airtagInformation.airTagAttribute = this.airtagData.airTagAttribute
    }
  }

  get visibleVue() {
    return this.isShow
  }

  handleCancle() {
    this.$emit('close-modal')
    this.airtagInformation = {
      airTagAttribute: {
        id: ''
      },
      status: 'AIRTAG_STATUS_AVAILABLE',
      barCode: ''
    }
  }

  async createOrUpdateItem() {
    if(this.modalHeader === 'Update Category'){
      const result = await this.actUpdateAirtag({
        id: this.airtagInformation.id,
        barCode: this.airtagInformation.barCode,
        airTagAttribute:{
          model: this.airtagInformation.airTagAttribute.model,
          productionBatch: this.airtagInformation.airTagAttribute.productionBatch,
          costPrice: this.airtagInformation.airTagAttribute.costPrice,
          retailPrice: this.airtagInformation.airTagAttribute.retailPrice,
          size: this.airtagInformation.airTagAttribute.size,
          color: this.airtagInformation.airTagAttribute.color,
          connectivity: this.airtagInformation.airTagAttribute.connectivity,
          speaker: this.airtagInformation.airTagAttribute.speaker,
          batteryLife: this.airtagInformation.airTagAttribute.batteryLife,
          sensorTechnology: this.airtagInformation.airTagAttribute.sensorTechnology,
          accelerometer: this.airtagInformation.airTagAttribute.accelerometer,
          accessibility: this.airtagInformation.airTagAttribute.accessibility,
          systemRequirement: this.airtagInformation.airTagAttribute.systemRequirement,
          brandName: this.airtagInformation.airTagAttribute.brandName,
          manufacturingDate: this.airtagInformation.airTagAttribute.manufacturingDate
        } 
      })
      if (result) {
        this.$emit('close-modal', this.airtagInformation)
        this.$toast.add({
          severity: 'success',
          summary: 'Success Message',
          detail: 'Successfully update airtag',
          life: 3000
        })
      } else {
        this.$toast.add({
          severity: 'error',
          summary: 'Error Message',
          detail: 'Update airtag failed!',
          life: 3000
        })
      }
    }
    else {
      this.$v.airtagInformation.airTagAttribute?.id?.$touch()
      if (this.$v.$invalid) {
        return
      }
      const result = await this.actCreateNewAirtag({
        status: this.airtagInformation.status,
        barCode: this.airtagInformation.barCode,
        airTagAttribute:{
          id: this.airtagInformation.airTagAttribute.id
        } 
      })
      if (result) {
        this.$emit('close-modal', this.airtagInformation)
        this.$toast.add({
          severity: 'success',
          summary: 'Success Message',
          detail: 'Successfully create airtag',
          life: 3000
        })
      } else {
        this.$toast.add({
          severity: 'error',
          summary: 'Error Message',
          detail: 'Create airtag failed!',
          life: 3000
        })
      }
    }
    this.airtagInformation = {
      airTagAttribute: {
        id: ''
      },
      status: 'AIRTAG_STATUS_AVAILABLE',
      barCode: ''
    }
    this.$emit('reloadList')
  }

}
export default CreateOrUpdate
</script>
<style lang="sass" scoped>
.modal
  background-color: #fff
  padding: 20px
  border-radius: 10px
  width: 650px

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

.attribute-input
  padding-bottom: 10px

</style>
