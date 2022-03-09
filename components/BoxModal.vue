<template lang="pug">
div
  .mt-3
    b-modal#modal-prevent-closing(ref='modal' title='Submit Your Name'   @show='resetModal' @hidden='resetModal' @ok='handleOk')
        b-form(@submit.stop.prevent='onSubmit')
            b-form-group#example-input-group-1(label='Name' label-for='example-input-1')
                b-form-input#example-input-1(
                name='example-input-1' 
                v-model='dataForm.name' 
                :state="validateState('name')" 
                aria-describedby='input-1-live-feedback' 
                 ) 
                b-form-invalid-feedback#input-1-live-feedback This is a required field and must be at least 8 characters.
            .row
                .col-md-6.mb-3
                    b-form-group#example-input-group-1(label='category' label-for='weight-input')
                        b-form-input#weight-input(name='weight-input' v-model='dataForm.code' :state="validateState('code')" aria-describedby='weight-live-feedback')
                        b-form-invalid-feedback#weight-live-feedback This is a required field weight
                .col-md-6.mb-3
                    b-form-group#example-input-group-1(label='height' label-for='weight-input')
                        b-form-input#height-input(name='height-input' v-model='dataForm.category' :state="validateState('category')" aria-describedby='height-live-feedback')
                        b-form-invalid-feedback#height-live-feedback This is a required field height
            .row
                .col-md-6.mb-3
                    b-form-group#example-input-group-1(label='row' label-for='row-input')
                        b-form-input#row-input(name='row-input' v-model='dataForm.supplier' :state="validateState('supplier')" aria-describedby='row-live-feedback')
                        b-form-invalid-feedback#row-live-feedback This is a required field row
                .col-md-6.mb-3
                    b-form-group#example-input-group-1(label='column' label-for='weight-input')
                        b-form-input#column-input(name='column-input' v-model='dataForm.status' :state="validateState('status')" aria-describedby='column-live-feedback')
                        b-form-invalid-feedback#row-live-feedback This is a required field column
                      
</template>

<script lang="ts">
import { Vue, Component, Prop, Provide, Watch } from 'nuxt-property-decorator'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

@Component({
  validations: {
    dataForm: {
      name: {
        required,
      },
      code: {
        required,
      },
      category: {
        required,
      },
      supplier: {
        required,
      },
      status: {
        required,
      },
    },
  },
})
export default class BoxModal extends Vue {
  @Provide()
  dataForm: any = {
    name: '',
    code: null,
    category: '',
    supplier: '',
    status: null,
  }

  mixins: any = [validationMixin]
  @Prop({
    default: {
    },
  })
  box!: any

  validateState(name: any) {
    const { $dirty, $error }: any = this.$v.dataForm[name]
    return $dirty ? !$error : null
  }

  handleOk(bvModalEvt: any) {
    // Prevent modal from closing
    bvModalEvt.preventDefault()
    // Trigger submit handler
    this.onSubmit()
  }

  @Watch('box') 
  onPropertyChanged() {
    this.dataForm = {...this.box}  
  }

  resetModal() {
    this.dataForm = {
      name: null,
      code: null,
      category: null,
      supplier: null,
      status: null,
    }

    this.$nextTick(() => {
      this.$v.$reset()
    })
  }

  onSubmit() {
    this.$v.dataForm.$touch()
    if (this.$v.$invalid) {
      return
    }
    this.resetModal()
    alert('dataForm submitted!')
  }
}
</script>
