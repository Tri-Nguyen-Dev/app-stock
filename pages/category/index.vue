<template lang="pug">
.category
  .category__header
    div
      h1.text-heading Categories
      span.text-subheading Total {{ categoriesTotal }} categories
    .header__action
      Button.btn.btn-primary(@click='handleCreate')
        .icon.icon-add-items
        span Add Category

  .grid.grid-nogutter.flex-1.relative.overflow-hidden.m-h-700
    .col.h-full.absolute.top-0.left-0.right-0.bg-white
      DataTable(
        @sort='sortData($event)',
        :value='categoryList',
        responsiveLayout='scroll',
        :class='{ "table-wrapper-empty": !categoryList || categoryList.length <= 0 }',
        dataKey='id',
        :rowHover='true'
      )
        Column(
          selectionMode='multiple',
          :styles='{ width: "1%" }',
          :headerClass='classHeaderMuti'
        )
        Column(field='displayOrder', header='NO', :styles='{ width: "1%" }')
          template(#body='{ index }')
            span.grid-cell-center.category__table-no.text-white-active.text-900.font-bold {{ getIndexPaginate(index) }}
        Column(
          header='Name',
          field='name',
          :sortable='true',
          sortField='_name'
        )
          template(#body='{ data }')
            NuxtLink.category__table-name.text-white-active.text-base.text-900.text-overflow-ellipsis.overflow-hidden.no-underline(
              :to='`/category/${data.id}`',
              class='hover:underline'
            ) {{ data.name }}
        Column(field='action', header='action', :styles='{ width: "5%" }')
          template(#body='{ data }')
            .table__action
              span.action-item(@click='handleUpdate(data)')
                .icon.icon-edit-btn
              span.action-item(@click.stop='showModalDelete([data])')
                .icon.icon-btn-delete
        template(#footer)
          Pagination(
            type='items selected',
            :paging='paging',
            :total='Number(categoriesTotal)',
            @onDelete='showModalDelete',
            @onPage='onPage'
          )
        template(#empty)
          .table__empty
            img(:srcset='`${require("~/assets/images/table-empty.png")} 2x`')
            p.empty__text List is empty!, Click
              span &nbsp;here
              span(@click='showModalCreate = true') &nbsp;to add item.

  ConfirmDialogCustom(
    title='Confirm delete',
    image='confirm-delete',
    :isShow='isModalDelete',
    :onOk='handleDeleteCategory',
    :onCancel='handleCancel'
  )
    template(v-slot:message)
      p {{ deleteMessage }}
  Toast
  CreateOrUpdate(
    :isShow="showModal"
    :modalHeader ='modalHeader'
    :categoryData='categoryData'
    @close-modal='showModal = false',
  )
  
</template>

<script lang="ts">
import { Component, Vue, namespace } from 'nuxt-property-decorator'
import ConfirmDialogCustom from '~/components/dialog/ConfirmDialog.vue'
import { Paging } from '~/models/common/Paging'
import Pagination from '~/components/common/Pagination.vue'
import CreateOrUpdate from '~/components/category/CreateOrUpdate.vue'
import {
  PAGINATE_DEFAULT,
  calculateIndex,
  getDeleteMessage,
  resetScrollTable
} from '~/utils'
const nsCategoryList = namespace('category/category-list')

@Component({
  components: {
    ConfirmDialogCustom,
    Pagination,
    CreateOrUpdate
  }
})
class Categories extends Vue {
  paging: Paging.Model = { ...PAGINATE_DEFAULT, first: 0 }
  onEventDeleteList: any = []
  sortByColumn: string = ''
  sortDescending: boolean | null = null
  isModalDelete: boolean = false
  showModal: boolean = false
  categoryData: any = []
  modalHeader: string = ''

  @nsCategoryList.State
  categoryList!: any

  @nsCategoryList.State
  categoriesTotal!: any

  @nsCategoryList.Action
  actCategoryList!: (params: any) => Promise<void>

  @nsCategoryList.Action
  actDeleteCategoryByIds!: (params: any) => Promise<any>

  getParamAPi() {
    return {
      page: this.paging.pageNumber,
      size: this.paging.pageSize,
      sortByColumn: this.sortByColumn || null,
      sortDescending: this.sortDescending
    }
  }

  async getCategoryList() {
    await this.actCategoryList(
      this.getParamAPi() )
  }

  get classHeaderMuti() {
    return !this.categoryList || this.categoryList.length <= 0
      ? 'checkbox-disable'
      : ''
  }

  getIndexPaginate(index: number) {
    return calculateIndex(index, this.paging.pageNumber, this.paging.pageSize)
  }

  sortData(e: any) {
    resetScrollTable()
    const { sortField, sortOrder } = e
    if (sortOrder) {
      this.sortDescending = sortOrder !== 1
      this.sortByColumn = sortField.replace('_', '')

    } else {
      this.sortDescending = null
      this.sortByColumn = ''
    }

    this.getCategoryList()
  }

  showModalDelete(data?: any) {
    this.onEventDeleteList = data
    this.isModalDelete = true
  }

  get deleteMessage() {
    return getDeleteMessage(this.onEventDeleteList, 'category list')
  }

  async handleDeleteCategory() {
    const id = _.map(this.onEventDeleteList, 'id')
    const result = await this.actDeleteCategoryByIds(id[0])
    if (result) {
      this.isModalDelete = false
      this.$toast.add({
        severity: 'success',
        summary: 'Success Message',
        detail: 'Successfully deleted box',
        life: 3000
      })
      this.paging.first = 0
      this.paging.pageNumber = 0
      await this.actCategoryList({
        pageNumber: this.paging.pageNumber,
        pageSize: this.paging.pageSize
      })
    }
  }

  handleCancel() {
    this.isModalDelete = false
  }

  async onPage(event: any) {
    resetScrollTable()
    this.paging.pageSize = event.rows
    this.paging.pageNumber = event.page
    await this.getCategoryList()
  }

  mounted() {
    this.getCategoryList()
  }

  hideDialog(){
    this.showModal = false
  }

  handleCreate(){
    this.modalHeader ='Create Category'
    this.showModal = true
  }

  handleUpdate(categoryData) {
    this.categoryData = categoryData
    this.showModal = true
    this.modalHeader = 'Update Category'
  }

}
export default Categories
</script>

<style lang="sass">
.category
  @include flex-column
  @include mobile
    min-height: calc(100vh - 32px)
  @include tablet
    min-height: calc(100vh - 32px)
  @include desktop
    height: calc(100vh - 32px)
  &__header
    flex-direction: column
    flex-wrap: wrap
    margin-bottom: 24px
    @include desktop
      flex-direction: row
      @include flex-center-space-between
  .header__action
    display: flex
    margin-top: 12px
    @include flex-column
    flex-wrap: wrap
    gap: 10px 16px
    @include desktop
      @include flex-center
      flex-direction: row
      margin-top: 0
.category__table
  border-radius: 4px
  flex: 1
  position: relative
  overflow: hidden
  &-no
    font-size: $font-size-medium
  &-barcode
    text-transform: uppercase
  ::v-deep.disable-button
    pointer-events: none
    background-color: $text-color-300
    .icon
      background-color: $text-color-500
</style>
