<template lang="pug">
Dialog(header=`` :visible.sync='visibleVue', :modal='true' :showHeader='false')
  .modal
    .text-heading.modal-header {{modalHeader}} 
    .formgrid.grid
        .field.col-12()
          label(for='attribute') AirTagAttribute :
          Dropdown.w-full(v-model='selectedCity' :options='hasAttribute' optionlabel='name')
        .field.col-12(class='md:col-6')
          label(for='status') Status :
          Dropdown.w-full(:options='statusList' optionlabel='name')
        .field.col-12(class='md:col-6')
          label(for='Barcode') Barcode :
          InputText#Barcode.appearance-none.outline-none.w-full(type='number')
        .field.col-12.modal-btn(class='md:col-12')
          Button.btn.btn-outline(@click="handleCancle")
            span Cancel
          Button.btn.btn-primary(v-if="modalHeader === 'Create Category'" )
            span Create Category 
          Button.btn.btn-primary(v-if="modalHeader === 'Update Category'")
            span Update Category  {{hasAttribute[0].name}}
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

import {
  AirtagConstants
} from '~/utils'

@Component({})
class CreateOrUpdate extends Vue {
  @Prop({ default: false }) isShow!: boolean
  @Prop() modalHeader!: any
  statusList = AirtagConstants.AIRTAG_STATUS_OPTIONS
  isShowInputs: boolean = false
  selectedCity: null
  hasAttribute: any = [
    { name: 'null' , value: 'null' },
    { name: 'not null' , value: '' }
  ]

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
</style>
