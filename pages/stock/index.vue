<template lang="pug">
  .stock
    .stock__header
      div
        h1.text-heading Stock list
        span.text-subheading 1280 product found
      div.stock__header-action
        div.stock__search
          span.p-input-icon-left
            .icon.icon--left.icon-search
            InputText#inputSearch(type='text' placeholder='Search' v-model="filter.name")
        .stock__btn-filter.flex.align-items-center.bg-white.border-round.cursor-pointer(@click="toggleShowFilter" :class="{'active': isShowFilter}")
          .icon-btn.icon-filter( v-if="!isShowFilter")
          .icon-btn.icon-chevron-up.bg-primary(v-else)
          span Filter
        .stock__btn-add.flex.align-items-center.bg-primary.border-round.cursor-pointer
          .icon-btn.icon-add-items.bg-white
          span Add Stock
    .stock__filter(:class='{ "active": isShowFilter }')
      .stock__filter-item.bg-white.border-round
        .stock__filter-title Warehouse
        Dropdown.stock__filter-action.w-full.border-0(v-model="filter.warehouse" :options="warehouseList" optionLabel="name" placeholder="Select")
      .stock__filter-item.bg-white.border-round
        .text-sm.stock__filter-title Catagory
        MultiSelect#MultiSelectCatagory.stock__filter-action.w-full.border-0(v-model='filter.categories' :options='categoryList' optionLabel="name" placeholder='Select' :filter='true')
      .stock__filter-item.bg-white.border-round
        .text-sm.stock__filter-title Code
        span.p-input-icon-right.w-full
            InputText#inputSearchCode.w-full(type="text" v-model="filter.barcode" placeholder="Search code" )
            i.icon.icon-search.mt-0
      .stock__filter-item.bg-white.border-round
        .text-sm.stock__filter-title Status
        Dropdown.w-full.border-0(v-model="filter.status"  :options="statusList" optionLabel="name" placeholder="Select")
    .stock__table.bg-white.flex-1.relative.overflow-hidden
        DataTable.h-full.flex.flex-column(@row-click='redirectToDetail' :rowClass="rowClass" :value='stockList' responsiveLayout="scroll" :selection.sync='selectedStock' dataKey='id' :rows='10' :rowHover='true' :resizableColumns='true')
          Column(selectionMode='multiple')
          Column(field='no' header='NO')
            template(#body='{ index }')
              span.stock__table-no.text-white-active.text-900.font-bold {{ (index + 1) + (paginate.pageNumber - 1) * paginate.pageSize  }}
          Column(field='imageUrl' header='Image')
            template(#body='{ data }')
              .stock__table__image.w-2rem.h-2rem.overflow-hidden
                img.w-full.h-full.border-round(:src='data.imageUrl' alt='' width='100%' style="object-fit: cover;")
          Column(field='name' header='Name' sortable)
            template(#body='{ data }')
              .stock__table-name.text-white-active.text-base.text-900.text-overflow-ellipsis.overflow-hidden {{ data.name }}
          Column(field='barcode' header='Code' sortable)
            template(#body='{ data }')
              .stock__table-barcode {{ data.barcode }}
          Column(field='category' header='Category' sortable)
              template(#body='{ data }') {{ data.category.name }}
          Column(field='status' header='Status')
            template(#body='{ data }')
              span.table__status.table__status--available(v-if="data.deleted") Available
              span.table__status.table__status--disable(v-else) Disable
          Column(field='action' header='Action')
            template(#body='{ data }')
              .table__action(:class="{'action-disabled': !data.deleted}")
                span(@click='editStockDetail(data.id)')
                  .icon-btn.icon-btn-edit
                span(@click="showModalDelete(data.id)")
                  .icon-btn.icon-btn-delete
          template(#footer)
            .pagination
              div.pagination__info(v-if='!selectedStockFilter.length > 0')
                img(:src="require('~/assets/icons/filter-left.svg')")
                span.pagination__total {{ getInfoPaginate }}
              div.pagination__delete(v-else @click="showModalDelete()")
                img(:src="require('~/assets/icons/trash-white.svg')")
                span Delete {{ selectedStockFilter.length }} items selected
              Paginator(v-model:first="paginate.pageNumber" :rows="paginate.pageSize" :totalRecords="total" @page="onPage($event)")
          template(#empty)
            div.flex.align-items-center.justify-content-center.flex-column
              img(:srcset="`${require('~/assets/images/table-empty.png')} 2x`" v-if="!checkIsFilter")
              img(:srcset="`${require('~/assets/images/table-notfound.png')} 2x`" v-else)
              p.text-900.font-bold.mt-3(v-if="!checkIsFilter") List is empty!, Click
                span.text-primary.underline here
                span to add item.
              p.text-900.font-bold.mt-3(v-else) Item not found!

    ConfirmDialogCustom(
      title="Confirm delete"
      :message="`Are you sure you want to delete ${ids.length} in this list stock?`"
      image="confirm-delete"
      :isShow="isModalDelete"
      :onOk="handleDeleteStock"
      :onCancel="handleCancel"
      :loading="loadingSubmit"
    )

    Toast
</template>
<script lang="ts">
import { Component, Vue, namespace, Watch} from 'nuxt-property-decorator'
import ConfirmDialogCustom from '~/components/dialog/ConfirmDialog.vue'
import { Stock as StockModel } from '~/models/Stock'
const nsCategoryStock = namespace('category/category-list')
const nsWarehouseStock = namespace('warehouse/warehouse-list')
const nsStoreStock = namespace('stock/stock-list')

@Component({
  components: {
    ConfirmDialogCustom
  }
})

class Stock extends Vue {
  @nsStoreStock.State
  total!: number

  @nsStoreStock.State
  stockList!: StockModel.Model[]

  @nsCategoryStock.State
  categoryList!: any

  @nsWarehouseStock.State
  warehouseList!: any

  @nsStoreStock.Action
  actGetStockList!: (params?: any) => Promise<void>

  @nsStoreStock.Action
  actDeleteStockByIds!: (ids: string[]) => Promise<void>

  @nsCategoryStock.Action
  actCategoryList!: () => Promise<void>

  @nsWarehouseStock.Action
  actWarehouseList!: () => Promise<void>

  isEditStockDetail: any

  paginate: any = {
    pageNumber: 1,
    pageSize: 10
  }

  filter: any = {
    name: null,
    warehouse: null,
    categories: null,
    barcode: null,
    status: null
  }

  statusList: any = [
    { name: 'Disable', value: false },
    { name: 'Available', value: true }
  ]

  selectedStock: StockModel.Model[] = []

  get selectedStockFilter() {
    return this.selectedStock.filter(item => item.delete)
  }

  get getInfoPaginate() {
    const { pageNumber, pageSize } = this.paginate

    const start = (pageNumber * pageSize) - (pageSize - 1)

    const convertStart = ('0' + start).slice(-2)

    const end = Math.min(start + pageSize - 1, this.total)

    return `Showing ${convertStart} - ${end} of ${this.total}`
  }

  isShowFilter: boolean = false

  loading: boolean = false

  isModalDelete: boolean = false

  ids: string[] = []

  loadingSubmit: boolean = false

  isFilter: boolean = false

  get checkIsFilter () {
    return Object.values(this.filter).some(item => item)
  }

  rowClass(data: any) {
    return !data.deleted ? 'row-disable': ''
  }

  toggleShowFilter() {
    this.isShowFilter = !this.isShowFilter

    if(this.checkIsFilter) this.filter = {
      name: null,
      warehouse: null,
      categories: null,
      barcode: null,
      status: null
    }
  }

  redirectToDetail({ data }) {
    this.$router.push(`stock/${data.id}`)
  }

  editStockDetail(id:any) {
    this.$router.push(`stock/${id}`)
  }

  mounted() {
    this.getProductList()
    this.actCategoryList()
    this.actWarehouseList()
  }

  async getProductList() {
    const filter = {
      name: this.filter.name,
      warehouseId: this.filter.warehouse?.id,
      categoryIds: this.filter.categories && this.filter.categories.map((item: any) => item?.id),
      barcode: this.filter.barcode,
      delete: this.filter.status?.value
    }

    const params = {
      ...this.paginate,
      ...filter
    }

    await this.actGetStockList(params)
  }

  @Watch('filter', { deep: true })
  getNewStock() {
    this.getProductList()
  }

  getProductSelected(data: any[]) {
    this.selectedStock = data
  }

  onPage(event: any) {
    this.paginate.pageNumber = event.page + 1
    this.getProductList()
  }

  showModalDelete(id?: string) {
    if (id) {
      this.ids = [id]
    } else {
      this.ids = this.selectedStockFilter.map((item: any) => {
        return item.id
      })
    }
    this.isModalDelete = true
  }

  async handleDeleteStock() {
    try {
      this.loadingSubmit = true
      await this.actDeleteStockByIds(this.ids)
      this.getProductList()
      this.loadingSubmit = false
      this.isModalDelete = false

      this.$toast.add({severity:'success', summary: 'Success Message', detail:'Successfully deleted stock', life: 3000})
    } catch (error) {
      this.loadingSubmit = false
    }
  }

  handleCancel() {
    this.isModalDelete = false
  }
}
export default Stock
</script>

<style lang="sass" scoped>

.stock
  display: flex
  flex-direction: column
  height: 100%

  &__header
    display: flex
    align-items: center
    justify-content: space-between
    margin-bottom: 31px

    &-action
      display: flex
      align-items: center
      gap: 0 16px

  &__btn-filter, &__btn-add
    gap: 18px
    height: 48px
    padding: 0 32px 0 20px
    white-space: nowrap

    span
      line-height: calc(24 / 14)

  &__btn-filter.active
    color: $primary,
    border: 1.5px solid $primary

  &__filter
    visibility: hidden
    max-height: 0
    transition: all 0.25s ease-in-out
    display: grid
    grid-template-columns: repeat(4, 1fr)
    grid-gap: 0 16px

    &.active
      visibility: visible
      max-height: 200px
      margin-bottom: 24px

    &-item
      padding: 13px 5.5px

    &-title
      font-size: 12px
      color: $text-color-700
      line-height: calc(16 / 12)
      margin-bottom: 5px
      padding-left: 10.5px

.stock__table
  border-radius: 4px

  &-name
    max-width: 138px

  &-no
    font-size: $font-size-medium

  &-barcode
    text-transform: uppercase

</style>
