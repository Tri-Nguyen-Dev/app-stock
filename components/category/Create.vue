<template lang="pug">
.modal 
  .card
    .formgrid.grid
      .field.col-12()
        label.required__title(for='name') Name :
        InputText#name.text-base.text-color.surface-overlay.p-2.border-1.border-solid.surface-border.border-round.appearance-none.outline-none.w-full(@change='onChange' v-model='categoryInformation.name' type='text' class='focus:border-primary' :class="{'name--error' : $v.categoryInformation.name.$error}")
        .error-message(v-if='$v.categoryInformation.name.$dirty && !$v.categoryInformation.name.required') Name cannot be empty! 
      .field.col-12(class='md:col-6')
        label(for='icon') Icon :
        InputText#icon.text-base.text-color.surface-overlay.p-2.border-1.border-solid.surface-border.border-round.appearance-none.outline-none.w-full(type='text' v-model='categoryInformation.icon' )
      .field.col-12(class='md:col-6')
        label(for='displayOrder') DisplayOrder :
        InputText#displayOrder.text-base.text-color.surface-overlay.p-2.border-1.border-solid.surface-border.border-round.appearance-none.outline-none.w-full(type='number' v-model='categoryInformation.displayOrder')
      .field.col-12(class='md:col-3')
        label(for='delete') Deleted :
        select#delete.w-full.text-base.text-color.surface-overlay.p-2.border-1.border-solid.surface-border.border-round.outline-none( style='appearance: auto' v-model='categoryInformation.deleted')
          option false
          option true
      .field.col-12.modal-btn(class='md:col-9')
        Button.btn.btn-cancel(@click="$emit('close-modal')")
          span Cancel
        Button.btn.btn-primary(@click="addItem()")
          .icon.icon-add-items
          span Add Category
</template>
<script lang="ts">
import { Component, Vue, namespace } from 'nuxt-property-decorator'
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
class AddNewCategory extends Vue {
  duplicatedItem: any = []
  categoryName: any = []
  categoryInformation: any = {
    name: '',
    icon: '',
    displayOrder: '',
    deleted: false
  }
  
  @nsStoreCategory.State
  categoryList!: any

  @nsStoreCategory.State
  newCategoryDetail!: CategoryModel.CreateCategory

  @nsStoreCategory.Action
  actCategoryList!: () => Promise<void>

  @nsStoreCategory.Action
  actCreateNewCategory!: (param: any) => Promise<void>

  async getOtherCategoryName() {
    await this.actCategoryList()
    this.categoryName = _.cloneDeep(this.categoryList)
    this.categoryName = this.categoryName.map((item) =>{return item.name})
    return this.categoryName
  }

  async checkDuplicate() {
    await this.getOtherCategoryName()
    for(let i=0; i < this.categoryName.length; i++){
      if(this.categoryInformation.name === this.categoryName[i]){
        this.duplicatedItem.push(this.categoryInformation.name)
      }
    }
    return this.duplicatedItem
  }

  async onChange() {
    this.duplicatedItem = []
    await this.checkDuplicate()
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
    }
    else{
      this.$v.categoryInformation.name?.$touch()
      if (this.$v.$invalid) {
        return
      }
      await this.actCreateNewCategory({
        name: this.categoryInformation.name,
        icon: this.categoryInformation.icon,
        displayOrder: this.categoryInformation.displayOrder,
        deleted: this.categoryInformation.deleted
      })
      await this.actCategoryList()
      if (this.newCategoryDetail) {
        this.$emit('close-modal', this.categoryInformation)
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
}
export default AddNewCategory
</script>
<style lang="sass" scoped>
.modal
  background-color: #fff
  padding: 50px
  border-radius: 10px
  width: 750px

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
