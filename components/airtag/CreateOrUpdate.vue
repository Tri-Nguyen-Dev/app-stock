<template lang="pug">
Dialog(header=`` :visible.sync='visibleVue', :modal='true' :showHeader='false')
  .modal
    p {{airtagInformation}}
    .text-heading.modal-header {{modalHeader}} 
    .formgrid.grid
        .field.col-12(class='md:col-6')
          label(for='status') Status :
          Dropdown.w-full(v-model='airtagInformation.status' :options="statusList" optionLabel="name" optionValue='value')
        .field.col-12(class='md:col-6')
          label(for='Barcode') Barcode :
          InputText#Barcode.appearance-none.outline-none.w-full(type='text' v-model='airtagInformation.barCode')
        .field.col-12()
          label(for='attribute') AirTagAttribute :
          Dropdown.w-full(@change='showAtributeInput()' v-model='airtagInformation.airTagAttribute' :options='hasAttribute' optionLabel='name' optionValue='value')
        .div.col-12(v-if="isShowInputs")
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
          Button.btn.btn-primary(v-if="modalHeader === 'Create Category'" )
            span Create Category 
          Button.btn.btn-primary(v-if="modalHeader === 'Update Category'")
            span Update Category
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'nuxt-property-decorator'
import { required } from 'vuelidate/lib/validators'
import {
  AirtagConstants
} from '~/utils'

@Component({
  validations: {
    airtagInformation: {
      barCode : {
        required
      },
      Status: {},
      airTagAttribute: {
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
      model: '',
      productionBatch: '',
      costPrice: 0,
      retailPrice: 0,
      size: 0,
      color: '',
      connectivity: '',
      speaker: '',
      batteryLife: '',
      sensorTechnology: '',
      accelerometer: '',
      accessibility: '',
      systemRequirement: '',
      brandName: '',
      manufacturingDate: null
    },
    status: '',
    barCode: ''
  }
  
  hasAttribute: any = [
    { name: 'null' , value: 'null' },
    { name: 'not null' , value: this.airtagInformation.airTagAttribute }
  ]

  @Watch('airtagData')
  showAtributeInput(){
    if(this.airtagInformation.airTagAttribute !==  'null'){
      this.isShowInputs = true
    }
    else {
      this.isShowInputs = false
    }
  }

  @Watch('airtagData')
  updateData() {
    this.airtagInformation.id = this.airtagData.id
    this.airtagInformation.barCode = this.airtagData.barCode
    this.airtagInformation.status = this.airtagData.status
    this.airtagInformation.airTagAttribute = this.airtagData.airTagAttribute
  }

  get visibleVue() {
    return this.isShow
  }

  handleCancle() {
    this.$emit('close-modal')
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
