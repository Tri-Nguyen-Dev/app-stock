<template lang="pug">
  .addStock
    .addStockHeader
      h3.px-3 Add item
    .addStockContent.p-3
      h5.my-1 Barcode
      .p-input-icon-right.w-full
        .icon.icon--right.icon-scan
        InputText(v-model='stockInformation.barCode').w-full
      h5.mb-1 SKU
      InputText(v-model='stockInformation.sku').w-full
      h5.mb-1 Name
      InputText(v-model='stockInformation.name').w-full
      h5.mb-1 Category
      Dropdown(v-model='stockInformation.category' :options="cities" optionLabel="name" :filter="true" placeholder="Select a category" :showClear="true").w-full
        template(#value='slotProps')
      .grid
        .col-6
          h5.mb-1 Quantity
          InputText(v-model='stockInformation.quantity').w-full
        .col-6
          h5.mb-1 Unit
          Dropdown(v-model='stockInformation.unit' :options="cities" optionLabel="name")
      h5.mb-1 Weight
        .p-input-icon-right.w-full
          .icon.icon--right Kg
          InputText(type="number" v-model='stockInformation.weight').w-full
      .grid.mb-3
        .col
          h5.mb-1 Length
          .p-input-icon-right.w-full
            .icon.icon--right cm
            InputText(type="number" v-model='stockInformation.length').w-full
        .col
          h5.mb-1 Width
          .p-input-icon-right.w-full
            .icon.icon--right cm
            InputText(type="number" v-model='stockInformation.width').w-full
        .col
          h5.mb-1 Height
          .p-input-icon-right.w-full
            .icon.icon--right cm
            InputText(type="number" v-model='stockInformation.height').w-full
      FileUpload(accept="image/*" :maxFileSize="1000000" :fileLimit="1" :showCancelButton='false' @upload="onUpload")
        template(#empty)
          .grid
            .col-3.align-items-center.flex
              img(:src='require("~/assets/images/image-upload.png")')
            .col
              p.uppercase.text-500 image
              p.font-bold Upload item image
    .addStockFooter.p-3
      .grid
        .col
          .text-center.surface-hover.cursor-pointer.border-round.p-1(@click='cancelAddStock')
            span.uppercase.font-semibold cancel
        .col
          .text-center.bg-blue-500.cursor-pointer.border-round.text-white.p-1(@click='addItem')
            span.uppercase save
    Toast
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
class AddNewStock extends Vue {
  cities = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
  ]

  stockInformation: any = {
    barCode: '',
    sku: '',
    name: '',
    category: '',
    quantity: 0,
    weight: 0,
    unit: '',
    length: '',
    width: '',
    height: '',
    imageUrl: ''
  }

  cancelAddStock() {
    this.$emit('cancelAddStock')
  }

  addItem() {
    this.$emit('addItem', this.stockInformation)
  }

  onUpload() {
    this.$toast.add({
      severity: 'info',
      summary: 'Success',
      detail: 'File Uploaded',
      life: 3000
    })
  }
}
export default AddNewStock
</script>
<style lang="sass" scoped>
::v-deep.addStock
  display: flex
  flex-direction: column
  height: 100%
  .addStockHeader
    border-bottom: 1px solid #E8EAEF
  .addStockContent
    flex: 1
  .addStockFooter
    border-top: 1px solid #E8EAEF
  .p-fileupload-content
    padding: 0 1rem !important
</style>
