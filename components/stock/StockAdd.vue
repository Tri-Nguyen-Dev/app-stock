<template lang="pug">
  .addStock
    .addStockHeader
      h3.px-3 Add item
    .addStockContent.p-3
      h5.my-1 Barcode
      .p-input-icon-right.w-full
        .icon.icon--right.icon-scan
        InputText.w-full
      h5.mb-1 SKU
      InputText.w-full
      h5.mb-1 Name
      InputText.w-full
      h5.mb-1 Category
      .p-input-icon-left.w-full
        .icon.icon--left.icon-search
        InputText.w-full
      .grid
        .col-6
          h5.mb-1 Quantity
          InputNumber(v-model="value18" showButtons buttonLayout="horizontal" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus").w-3
        .col-6
          h5.mb-1 Unit
          Dropdown(v-model="selectedCity1" :options="cities" optionLabel="name")
      h5.mb-1 Weight
      .p-input-icon-right.w-full
        .icon.icon--right Kg
        InputText(type="number").w-full
      .grid.mb-3
        .col
          h5.mb-1 Length
          .p-input-icon-right.w-full
            .icon.icon--right cm
            InputText(type="number").w-full
        .col
          h5.mb-1 Width
          .p-input-icon-right.w-full
            .icon.icon--right cm
            InputText(type="number").w-full
        .col
          h5.mb-1 Height
          .p-input-icon-right.w-full
            .icon.icon--right cm
            InputText(type="number").w-full
      FileUpload(accept="image/*" :maxFileSize="1000000" :fileLimit="1" :showCancelButton='false')
    .addStockFooter.mt-2
      .text-center.surface-hover.cursor-pointer.border-round.p-1(@click='cancelAddStock')
        span.uppercase.font-semibold cancel
      .text-center.bg-blue-500.cursor-pointer.border-round.text-white.p-1(@click='addStock')
        span.uppercase save
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
class AddNewStock extends Vue {
  selectedCity1: null
  value18: null
  cities = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
  ]
}
export default AddNewStock
</script>
<style lang="sass">
.addStock
  .addStockHeader
    border-bottom: 1px solid #E8EAEF
  .addStockFooter
    border-top: 5px solid #E8EAEF
</style>
