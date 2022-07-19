<template lang="pug">
Dialog(header="" :visible.sync='visibleVue', :modal='true' :showHeader='false')
  .modal
    .text-heading.modal-header {{modalHeader}}
    .formgrid.grid
        .field.col-12()
          label.required__title(for='name') Name :
          InputText#name.surface-overlay.p-2.border-1.border-solid.surface-border.border-round.appearance-none.outline-none.w-full(
            @change='onChange'
            v-model='categoryInformation.name'
            type='text'
            class='focus:border-primary'
            :class="{'name--error' : $v.categoryInformation.name.$error}")
        .field.col-12(class='md:col-6')
          label(for='icon') Icon :
          InputText#icon.surface-overlay.p-2.border-1.border-solid.surface-border.border-round.appearance-none.outline-none.w-full(
            type='text'
            v-model='categoryInformation.icon')
        .field.col-12(class='md:col-6')
          label(for='displayOrder') DisplayOrder :
          // eslint-disable-next-line max-len
          InputText#displayOrder.surface-overlay.p-2.border-1.border-solid.surface-border.border-round.appearance-none.outline-none.w-full(
            type='number'
            v-model='categoryInformation.displayOrder')
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
    categoryInformation: {
      name: {
        required
      },
      icon: {},
      displayOrder: {},
      deleted: Boolean
    }
  }
})
class UpdateCategory extends Vue {
  @Prop() categoryData!: any
  @Prop({ default: false }) isShow!: boolean
  @Prop() modalHeader!: any

  categoryName: any = []
  duplicatedItem: any = []
  categoryInformation: any = {
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

  async getOtherCategoryName() {
    await this.actCategoryList()
    this.categoryName = _.cloneDeep(this.categoryList)
    this.categoryName = this.categoryName.map((item) => {
      return item.name
    })
    this.categoryName = this.categoryName.filter((item) => {
      return item !== this.categoryData.name
    })
    return this.categoryName
  }

  async checkDuplicate() {
    await this.getOtherCategoryName()
    for (const element of this.categoryName) {
      if (this.categoryInformation.name === element) {
        this.duplicatedItem.push(this.categoryInformation.name)
      }
    }
    return this.duplicatedItem
  }

  async onChange() {
    this.duplicatedItem = []
    await this.checkDuplicate()
  }

  @Watch('categoryData')
  updateData() {
    this.categoryInformation.id = this.categoryData.id
    this.categoryInformation.name = this.categoryData.name
    this.categoryInformation.icon = this.categoryData.icon
    this.categoryInformation.displayOrder = this.categoryData.displayOrder
    this.categoryInformation.deleted = this.categoryData.deleted
  }

  async UpdateItem() {
    await this.checkDuplicate()
    if (this.duplicatedItem.length > 0) {
      this.$toast.add({
        severity: 'error',
        summary: 'Error Message',
        detail: 'category name dupicated !',
        life: 3000
      })
    } else if (this.categoryInformation.name === this.categoryData.name) {
      const result = await this.actUpdateCategory({
        id: this.categoryInformation.id,
        icon: this.categoryInformation.icon,
        displayOrder: this.categoryInformation.displayOrder,
        deleted: this.categoryInformation.deleted
      })
      if (result) {
        await this.actCategoryList()
        this.$emit('close-modal', this.categoryInformation)
        this.categoryInformation = []
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
    } else {
      const result = await this.actUpdateCategory({
        id: this.categoryInformation.id,
        name: this.categoryInformation.name,
        icon: this.categoryInformation.icon,
        displayOrder: this.categoryInformation.displayOrder,
        deleted: this.categoryInformation.deleted
      })
      if (result) {
        await this.actCategoryList()
        this.$emit('close-modal', this.categoryInformation)
        this.categoryInformation = []
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
  }

  async addItem() {
    await this.checkDuplicate()
    if (this.duplicatedItem.length > 0) {
      this.$toast.add({
        severity: 'error',
        summary: 'Error Message',
        detail: 'category name dupicated !',
        life: 3000
      })
    } else {
      this.$v.categoryInformation.name?.$touch()
      if (this.$v.$invalid) {
        return
      }
      await this.actCreateNewCategory({
        name: this.categoryInformation.name,
        icon: this.categoryInformation.icon,
        displayOrder: this.categoryInformation.displayOrder
      })
      await this.actCategoryList()
      if (this.newCategoryDetail) {
        this.$emit('close-modal', this.categoryInformation)
        this.categoryInformation = []
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
  }

  get visibleVue() {
    return this.isShow
  }

  handleCancle() {
    this.$emit('close-modal')
    this.categoryInformation = []
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
