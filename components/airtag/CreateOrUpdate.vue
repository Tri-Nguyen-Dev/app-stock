<template lang="pug">
Dialog(header=`` :visible.sync='visibleVue', :modal='true' :showHeader='false')
  .modal
    .text-heading.modal-header {{modalHeader}} 
    .formgrid.grid
        .field.col-12(class='md:col-6')
          label(for='status') Status :
          Dropdown.w-full(v-model='airtagInfo.status' :options="statusList" optionLabel="name" optionValue='value')
        .field.col-12(class='md:col-6')
          label(for='Barcode') Barcode :
          InputText#Barcode.w-full(type='text' v-model='airtagInfo.barCode')
        .field.col-12(v-if="modalHeader === 'Create Category'")
          label.required__title(for='id') AirTagAttribute id:
          InputText#id.w-full(
            type='number' v-model='TagAttribute.id'
            :class="{'id--error' : $v.TagAttribute.id.$error}")
          .error-message(v-if='$v.TagAttribute.id.$dirty && !$v.TagAttribute.id.required') id cannot be empty!
        .div.col-12(v-if="modalHeader === 'Update Category'")
          .w-full.attribute-input
            label(for='model') model : 
            InputText#model.w-full(type='text' v-model='TagAttribute.model')
          .w-full.attribute-input
            label(for='productionBatch') productionBatch :
            InputText#productionBatch.w-full(type='text' v-model='TagAttribute.productionBatch')
          .w-full.attribute-input
            label(for='costPrice') costPrice :
            InputText#costPrice.w-full(type='number' v-model='TagAttribute.costPrice')
          .w-full.attribute-input
            label(for='retailPrice') retailPrice :
            InputText#retailPrice.w-full(type='number' v-model='TagAttribute.retailPrice')
          .w-full.attribute-input
            label(for='size') size :
            InputText#size.w-full(type='text' v-model='TagAttribute.size')
          .w-full.attribute-input
            label(for='color') color :
            InputText#color.w-full(type='text' v-model='TagAttribute.color')
          .w-full.attribute-input
            label(for='connectivity') connectivity :
            InputText#connectivity.w-full(type='text' v-model='TagAttribute.connectivity')
          .w-full.attribute-input
            label(for='speaker') speaker :
            InputText#speaker.w-full(type='text' v-model='TagAttribute.speaker')
          .w-full.attribute-input
            label(for='batteryLife') batteryLife :
            InputText#batteryLife.w-full(type='text' v-model='TagAttribute.batteryLife')
          .w-full.attribute-input
            label(for='sensorTechnology') sensorTechnology :
            InputText#sensorTechnology.w-full(type='text' v-model='TagAttribute.sensorTechnology')
          .w-full.attribute-input
            label(for='accelerometer') accelerometer :
            InputText#accelerometer.w-full(type='text' v-model='TagAttribute.accelerometer')
          .w-full.attribute-input
            label(for='accessibility') accessibility :
            InputText#accessibility.w-full(type='text' v-model='TagAttribute.accessibility')
          .w-full.attribute-input
            label(for='brandName') brandName :
            InputText#brandName.w-full(type='text' v-model='TagAttribute.brandName')
          .w-full.attribute-input
            label(for='manufacturingDate') manufacturingDate :
            InputText#manufacturingDate.w-full(type='date' v-model='TagAttribute.manufacturingDate')
  template(#footer)    
    .field.col-12.modal-btn(class='md:col-12')
      Button.btn.btn-outline(@click="handleCancle")
        span Cancel
      Button.btn.btn-primary(@click='createOrUpdateItem' v-if="modalHeader === 'Create Category'" )
        span Create Category 
      Button.btn.btn-primary(@click='createOrUpdateItem' v-if="modalHeader === 'Update Category'")
        span Update Category
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch, namespace } from 'nuxt-property-decorator'
import { required } from 'vuelidate/lib/validators'
import { AirtagConstants } from '~/utils'
const nsAirtag = namespace('airtag/Airtag')

@Component({
  validations: {
    airtagInfo: {
      barCode: {},
      Status: {},
      airTagAttribute: {
        id: {
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
    },
    TagAttribute: {
      id: { required }
    }
  }
})
class CreateOrUpdate extends Vue {
  @Prop() airtagData!: any
  @Prop({ default: false }) isShow!: boolean
  @Prop() modalHeader!: any

  statusList: any = AirtagConstants.AIRTAG_STATUS_OPTIONS
  isShowInputs: any = false
  airtagInfo: any = {
    airTagAttribute: {
      id: ''
    },
    status: 'AIRTAG_STATUS_AVAILABLE',
    barCode: ''
  }

  TagAttribute: any ={}

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
    if (this.modalHeader === 'Update Category') {
      this.airtagInfo.id = this.airtagData.id
      this.airtagInfo.barCode = this.airtagData.barCode
      this.airtagInfo.status = this.airtagData.status
      this.TagAttribute = {
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
    }
  }

  get visibleVue() {
    return this.isShow
  }

  handleCancle() {
    this.$emit('close-modal')
    this.airtagInfo = {
      status: 'AIRTAG_STATUS_AVAILABLE',
      barCode: ''
    }
    this.TagAttribute = {
      id:''
    }
  }

  async createOrUpdateItem() {
    if (this.modalHeader === 'Update Category') {
      const result = await this.actUpdateAirtag({
        id: this.airtagInfo.id,
        barCode: this.airtagInfo.barCode,
        airTagAttribute: {
          model: this.TagAttribute.model,
          productionBatch:
            this.TagAttribute.productionBatch,
          costPrice: this.TagAttribute.costPrice,
          retailPrice: this.TagAttribute.retailPrice,
          size: this.TagAttribute.size,
          color: this.TagAttribute.color,
          connectivity: this.TagAttribute.connectivity,
          speaker: this.TagAttribute.speaker,
          batteryLife: this.TagAttribute.batteryLife,
          sensorTechnology:
            this.TagAttribute.sensorTechnology,
          accelerometer: this.TagAttribute.accelerometer,
          accessibility: this.TagAttribute.accessibility,
          systemRequirement:
            this.TagAttribute.systemRequirement,
          brandName: this.TagAttribute.brandName,
          manufacturingDate:
            this.TagAttribute.manufacturingDate
        }
      })
      if (result) {
        this.$emit('close-modal', this.airtagInfo)
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
    } else {
      this.$v.TagAttribute.id?.$touch()
      if (this.$v.$invalid) {
        return
      }
      const result = await this.actCreateNewAirtag({
        status: this.airtagInfo.status,
        barCode: this.airtagInfo.barCode,
        airTagAttribute: {
          id: this.TagAttribute.id
        }
      })
      if (result) {
        this.$emit('close-modal', this.airtagInfo)
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
    this.airtagInfo = {
      status: 'AIRTAG_STATUS_AVAILABLE',
      barCode: ''
    }
    this.TagAttribute = {
      id:''
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
