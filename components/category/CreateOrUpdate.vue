<template lang="pug">
Dialog(header="" :visible.sync='visibleVue', :modal='true' :showHeader='false')
  .modal
    .text-heading.modal-header {{modalHeader}}
    .formgrid.grid
        .field.col-12()
          label.required__title(for='name') Name :
          InputText#name.w-full(
            v-model='categoryInfo.name'
            type='text'
            class='focus:border-primary'
            :class="{'name--error' : $v.categoryInfo.name.$error}")
          .error-message(v-if='$v.categoryInfo.name.$dirty && $v.categoryInfo.name.$invalid') name cannot be empty!
        .field.col-12(class='md:col-6')
          label(for='icon') Icon :
          InputText#icon.w-full(
            type='text'
            v-model='categoryInfo.icon')
        .field.col-12(class='md:col-6')
          label(for='displayOrder') DisplayOrder :
          // eslint-disable-next-line max-len
          InputText#displayOrder.w-full(
            type='number'
            v-model='categoryInfo.displayOrder')
  template(#footer)
    .field.col-12.modal-btn(class='md:col-12')
      Button.btn.btn-outline(@click="handleCancle")
        span Cancel
      Button.btn.btn-primary(v-if="modalHeader === 'Create Category'" @click='addItem')
        span Create Category
      Button.btn.btn-primary(v-if="modalHeader === 'Update Category'" @click='UpdateItem')
        span Update Category
</template>
<script lang="ts">
import { Component, Vue, namespace, Prop, Watch } from 'nuxt-property-decorator'
import { required } from 'vuelidate/lib/validators'
import { Category as CategoryModel } from '~/models/Category'
const nsStoreCategory = namespace('category/category-list')

@Component({
  validations: {
    categoryInfo: {
      name: {
        required
      },
      icon: {},
      displayOrder: {}
    }
  }
})
class UpdateCategory extends Vue {
  @Prop() categoryData!: any
  @Prop({ default: false }) isShow!: boolean
  @Prop() modalHeader!: any

  categoryInfo: any = {
    name: '',
    icon: '',
    displayOrder: ''
  }

  @nsStoreCategory.State
  categoryList!: any

  @nsStoreCategory.State
  newCategoryDetail!: CategoryModel.CreateCategory

  @nsStoreCategory.Action
  actCategoryList!: () => Promise<void>

  @nsStoreCategory.Action
  actUpdateCategory!: (param: any) => Promise<any>

  @nsStoreCategory.Action
  actCreateNewCategory!: (param: any) => Promise<void>

  @Watch('categoryData')
  updateData() {
    this.categoryInfo.id = this.categoryData.id
    this.categoryInfo.name = this.categoryData.name
    this.categoryInfo.icon = this.categoryData.icon
    this.categoryInfo.displayOrder = this.categoryData.displayOrder
    this.categoryInfo.deleted = this.categoryData.deleted
  }

  async UpdateItem() {
    const result = await this.actUpdateCategory({
      id: this.categoryInfo.id,
      name: this.categoryInfo.name,
      icon: this.categoryInfo.icon,
      displayOrder: this.categoryInfo.displayOrder,
      deleted: this.categoryInfo.deleted
    })
    if (result) {
      await this.actCategoryList()
      this.$emit('close-modal', this.categoryInfo)
      this.categoryInfo = []
      this.$toast.add({
        severity: 'success',
        summary: 'Success Message',
        detail: 'Successfully update category',
        life: 3000
      })
    } else {
      this.$toast.add({
        severity: 'error',
        summary: 'Error Message',
        detail: 'Update category failed!',
        life: 3000
      })
    }
  }

  async addItem() {
    this.$v.categoryInfo.name?.$touch()
    if (this.$v.$invalid) {
      return
    }
    await this.actCreateNewCategory({
      name: this.categoryInfo.name,
      icon: this.categoryInfo.icon,
      displayOrder: this.categoryInfo.displayOrder
    })
    await this.actCategoryList()
    if (this.newCategoryDetail) {
      this.$emit('close-modal', this.categoryInfo)
      this.categoryInfo = []
      this.$toast.add({
        severity: 'success',
        summary: 'Success Message',
        detail: 'Successfully create new category',
        life: 3000
      })
    } else {
      this.$toast.add({
        severity: 'error',
        summary: 'Error Message',
        detail: 'Create category failed!',
        life: 3000
      })
    }
  }

  get visibleVue() {
    return this.isShow
  }

  handleCancle() {
    this.$emit('close-modal')
    this.categoryInfo = []
  }
}
export default UpdateCategory
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
