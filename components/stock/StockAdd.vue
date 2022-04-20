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
      InputText(v-model='stockInformation.name' :class="{'name--error' : $v.stockInformation.name.$error}").w-full
      .error-message(v-if='$v.stockInformation.name.$dirty && !$v.stockInformation.name.required') Name cannot be empty!
      h5.mb-1 Category
      Dropdown(v-model='stockInformation.category' :options="warehouseList" optionLabel="name" :filter="true" placeholder="Select a category" :showClear="true" :class="{'category--error' : $v.stockInformation.category.$error}").w-full
        template(#value='slotProps')
      .error-message(v-if='$v.stockInformation.category.$dirty && !$v.stockInformation.category.required') Please choose category!
      .grid
        .col-6
          h5.mb-1 Quantity
          InputText(type="number" :min="1" v-model='stockInformation.quantity' :class="{'quantity--error' : $v.stockInformation.quantity.$error}").w-full
          .error-message(v-if='($v.stockInformation.quantity.$dirty && !$v.stockInformation.quantity.required) || stockInformation.quantity < 0') Please enter quantity!
        .col-6
          h5.mb-1 Unit
          Dropdown(v-model='stockInformation.unit' :options="unitList" optionLabel="name" :class="{'unit--error' : $v.stockInformation.unit.$error}").w-full
          .error-message(v-if='$v.stockInformation.unit.$dirty && !$v.stockInformation.unit.required') Please choose unit!
      h5.mb-1 Weight
          .p-input-icon-right.w-full
            .icon.icon--right Kg
            InputText(type="number" :min="1" v-model='stockInformation.weight').w-full
            .error-message(v-if='stockInformation.weight < 0') Weight cannot be negative!
      .grid.mb-3
        .col
          h5.mb-1 Length
          .p-input-icon-right.w-full
            .icon.icon--right cm
            InputText(type="number" :min="1" v-model='stockInformation.length').w-full
            .error-message(v-if='stockInformation.length < 0') Length cannot be negative!
        .col
          h5.mb-1 Width
          .p-input-icon-right.w-full
            .icon.icon--right cm
            InputText(type="number" :min="1" v-model='stockInformation.width').w-full
            .error-message(v-if='stockInformation.width < 0') Width cannot be negative!
        .col
          h5.mb-1 Height
          .p-input-icon-right.w-full
            .icon.icon--right cm
            InputText(type="number" :min="1" v-model='stockInformation.height').w-full
            .error-message(v-if='stockInformation.height < 0') Height cannot be negative!
      FileUpload(accept="image/*" :maxFileSize="1000000" :fileLimit="1" :showCancelButton='false' :showUploadButton='false' @select='getGenerateUrl')
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
    Toast(:baseZIndex='99999')
</template>
<script lang="ts">
import axios from 'axios'
import { Component, Vue, namespace } from 'nuxt-property-decorator'
import { required } from 'vuelidate/lib/validators'
import { GenerateUploadUrl } from '~/models/common/UploadImage'
import { Stock as StockModel } from '~/models/Stock'
const nsStoreWarehouse = namespace('warehouse/warehouse-list')
const nsStoreUnit = namespace('stock/unit')
const nsStoreUploadImage = namespace('upload-image/aws-upload')
const nsStoreStock = namespace('stock/stock-detail')

@Component({
  validations: {
    stockInformation: {
      name: {
        required
      },
      quantity: {
        required
      },
      unit: {
        required
      },
      category: {
        required
      }
    }
  }
})
class AddNewStock extends Vue {
  stockInformation: any = {
    barCode: '',
    sku: '',
    name: '',
    category: '',
    quantity: 1,
    weight: null,
    unit: '',
    length: null,
    width: null,
    height: null,
    imageUrl: ''
  }

  extension!: string

  @nsStoreWarehouse.State
  warehouseList!: any

  @nsStoreUnit.State
  unitList!: any

  @nsStoreStock.State
  newStockDetail!: StockModel.CreateStock

  @nsStoreUploadImage.State
  generateUploadUrl!: {
    key: ''
    url: ''
  }

  @nsStoreWarehouse.Action
  actWarehouseList!: () => Promise<void>

  @nsStoreUnit.Action
  actUnitList!: () => Promise<void>

  @nsStoreStock.Action
  actCreateNewStock

  @nsStoreUploadImage.Action
  actGetGenerateUrl!: (params: GenerateUploadUrl) => Promise<void>

  cancelAddStock() {
    this.$emit('cancelAddStock')
  }

  async addItem() {
    this.$v.stockInformation.name?.$touch()
    this.$v.stockInformation.unit?.$touch()
    this.$v.stockInformation.category?.$touch()
    this.$v.stockInformation.quantity?.$touch()
    if (this.$v.$invalid) {
      return
    }
    await this.actCreateNewStock(this.stockInformation)
    if(this.newStockDetail){
      this.$emit('addItem', this.stockInformation)
    } else {
      this.$toast.add({severity:'error', summary: 'Error Message', detail:'Create stock', life: 3000})
    }
  }

  getGenerateUrl(file: any) {
    if (file.files[0].type.includes('image/jpeg')) {
      this.extension = 'jpg'
    }
    if (file.files[0].type.includes('image/png')) {
      this.extension = 'png'
    }
    this.actGetGenerateUrl({
      contentType: file.files[0].type,
      expiration: 300000,
      extension: this.extension
    }).then(() => {
      axios.create().put(this.generateUploadUrl.url,file.files[0], {
        headers: {
          'Content-Type': file.files[0].type
        }
      })
    })
  }

  async mounted() {
    await Promise.all([this.actUnitList(), this.actWarehouseList()])
  }
}
export default AddNewStock
</script>
<style lang="sass" scoped>
::v-deep.addStock
  display: flex
  flex-direction: column
  height: 100%
  .p-inputtext
    box-shadow: none
  .addStockHeader
    border-bottom: 1px solid #E8EAEF
  .addStockContent
    flex: 1
    .error-message
      color: #ff0000
  .addStockFooter
    border-top: 1px solid #E8EAEF
  .p-fileupload-content
    padding: 0 1rem !important
</style>
