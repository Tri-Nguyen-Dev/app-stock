<template lang="pug">
  .stock
    .stock__header
      div
        h1.text-heading Stock list
        span.text-subheading {{ total }} product found
      .header__action
        .header__search
          .icon.icon--left.icon-search
          InputText(type='text' placeholder='Search' v-model="name" v-on:input="debounceSearchName")
        .btn__filter(:class="{'active': isShowFilter}")
          .btn-toggle(@click="toggleShowFilter")
            .icon.icon-filter(v-if="!isShowFilter")
            .icon.icon-chevron-up.bg-primary(v-else)
            span Filter
          .btn-refresh(@click="handleRefreshFilter")
            .icon.icon-rotate-left.bg-white
        .btn.btn-primary
          .icon.icon-add-items
          span Add Stock
    .grid.header__filter(:class='{ "active": isShowFilter }')
      .col
        .filter__item
          .filter__title Catagory
          MultiSelect.filter__multiselect(v-model='categories' @change="handleChangeFilter" :options='categoryList' optionLabel="name" placeholder='Select' :filter='true')
      .col
        .filter__item
          .filter__title Code
          .filter__search
              InputText(type="text" placeholder="Search code" v-model="barCode" v-on:input="debounceSearchCode" )
              .icon.icon--right.icon-search
      .col
        .filter__item
          .filter__title Status
          Dropdown.filter__dropdown(v-model="status" @change="handleChangeFilter"  :options="statusList" optionLabel="name" placeholder="Select")
    .stock__table
        DataTable(
          @sort="sortData($event)" 
          :class="{ 'table-wrapper-empty': !stockList || stockList.length <= 0 }" 
          :rowClass="rowClass" :value='stockList' responsiveLayout="scroll"
          @row-dblclick='rowdbClick' 
          :selection.sync='selectedStock[`${paginate.pageNumber}`]' 
          dataKey='id' 
          :rows='10' 
          :rowHover='true'
        )
          Column(selectionMode='multiple' :styles="{'width': '1%'}" :headerClass="`${!stockList || stockList.length <= 0 || checkStockDisable ? 'checkbox-disable' : ''}`")
          Column(field='no' header='NO' :styles="{'width': '1%'}" )
            template(#body='{ index }')
              span.grid-cell-center.stock__table-no.text-white-active.text-900.font-bold {{ getIndexPaginate(index) }}
          Column(field='imageUrl' header='Image')
            template(#body='{ data }')
              .stock__table__image.overflow-hidden
                img.h-2rem.w-2rem.border-round(:src='data.imageUrl' alt='' width='100%' style="object-fit: cover;")
          Column(header='Name' field='name' :sortable="true" sortField="_name")
            template(#body='{ data }')
              .stock__table-name.text-white-active.text-base.text-900.text-overflow-ellipsis.overflow-hidden {{ data.name }}
          Column(header='Code' field='barCode' :sortable="true" sortField="_barCode" headerClass="grid-header-right")
            template(#body='{ data }')
              .stock__table-barcode.grid-cell-right {{ data.barCode }}
          Column(header='Category' :sortable="true" field='category' sortField="_category" headerClass="grid-header-right")
              template(#body='{ data }')
                div.grid-cell-right {{ data.category.name }}
          Column(field='status' header="Status" headerClass="grid-header-right")
            template(#body='{ data }')
              div.grid-cell-right
                span.table__status.table__status--available(v-if="!data.deleted") Available
                span.table__status.table__status--disable(v-else) Disable
          Column(field='action' header="action" :styles="{'width': '2%'}")
            template(#body='{ data }')
              .table__action(:class="{'action-disabled': data.deleted}")
                span(@click="handleEditStock(data.id)")
                  .icon.icon-edit-btn
                span(@click="showModalDelete(data)")
                  .icon.icon-btn-delete
          template(#footer)
            .pagination
              .pagination__info(v-if='!selectedStockFilter.length > 0')
                .icon.icon-filter-left
                span.pagination__total {{ getInfoPaginate }}
              .pagination__delete(v-else @click="showModalDelete()")
                .icon.icon-btn-delete
                span Delete {{ selectedStockFilter.length }} items selected
              Paginator(:first.sync="firstPage" :rows="paginate.pageSize" :totalRecords="total" @page="onPage($event)" :rowsPerPageOptions="limitOptions")
          template(#empty)
            div.table__empty
              img(:srcset="`${require('~/assets/images/table-empty.png')} 2x`" v-if="!checkIsFilter")
              img(:srcset="`${require('~/assets/images/table-notfound.png')} 2x`" v-else)
              p.empty__text(v-if="!checkIsFilter") List is empty!, Click
                span &nbsp;here
                span &nbsp;to add item.
              p.notfound__text(v-else) Item not found!
    ConfirmDialogCustom(
      title="Confirm delete"
      image="confirm-delete"
      :isShow="isModalDelete"
      :onOk="handleDeleteStock"
      :onCancel="handleCancel"
      :loading="loadingSubmit"
    )
      template(slot="message")
        p Are you sure you want to delete <span style="font-weight: 700">{{ ids.length > 1 ? ids.length : stockNameDelete }}</span> in this list stock?
    Toast
</template>
<script lang="ts">
import { Component, Vue, namespace } from 'nuxt-property-decorator'
import  _ from 'lodash'
import ConfirmDialogCustom from '~/components/dialog/ConfirmDialog.vue'
import { Stock as StockModel } from '~/models/Stock'
import { STOCK_STATUS_LIST, LIMIT_PAGE_OPTIONS, PAGINATE_DEFAULT, calculateInfoPaginate, calculateIndex } from '~/utils'
const nsCategoryStock = namespace('category/category-list')
const nsStoreStock = namespace('stock/stock-list')
@Component({
  components: {
    ConfirmDialogCustom
  }
})
class Stock extends Vue {
  firstPage:any = 0
  selectedStock: StockModel.Model[] = []
  isShowFilter: boolean = false
  loading: boolean = false
  isModalDelete: boolean = false
  ids: string[] = []
  loadingSubmit: boolean = false
  isFilter: boolean = false
  paginate = PAGINATE_DEFAULT
  statusList = STOCK_STATUS_LIST
  limitOptions = LIMIT_PAGE_OPTIONS
  name: any = null
  barCode: any = null
  warehouse: any = null
  categories: any = null
  status: any = null
  sortByColumn: string|null = null
  isDescending: boolean|null = null
  stockNameDelete: string = ''
  @nsStoreStock.State
  total!: number

  @nsStoreStock.State
  stockList!: StockModel.Model[]

  @nsCategoryStock.State
  categoryList!: any

  @nsStoreStock.Action
  actGetStockList!: (params?: any) => Promise<void>

  @nsStoreStock.Action
  actDeleteStockByIds!: (ids: string[]) => Promise<any>

  @nsCategoryStock.Action
  actCategoryList!: () => Promise<void>

  getParamApi(){
    const categoryIds = this.categories ? this.categories.map((item: any) => item?.id).toString() : null
    return {
      name: this.name || null,
      barCode: this.barCode || null,
      warehouseId: this.warehouse?.id,
      categoryIds: categoryIds || null,
      deleted: this.status?.value,
      sortByColumn: this.sortByColumn || null,
      sortDescending: this.isDescending || null
    }
  }
 
  get selectedStockFilter() {
    const newArray = this.selectedStock.flat()
    return newArray.filter((item) => !item.deleted)
  }

  get checkStockDisable () {
    return this.stockList.every((item) => item.deleted)
  }

  get checkIsFilter() {
    const params = _.omit(this.getParamApi(), ['pageNumber', 'pageSize'])
    return Object.values(params).some((item) => item)
  }

  get getInfoPaginate() {
    return calculateInfoPaginate(this.paginate.pageNumber, this.paginate.pageSize, this.total)
  }

  getIndexPaginate(index: number) {
    return calculateIndex(index, this.paginate.pageNumber, this.paginate.pageSize)
  }

  rowClass(data: any) {
    return data.deleted ? 'row-disable' : ''
  }

  toggleShowFilter() {
    this.isShowFilter = !this.isShowFilter
  }

  mounted() {
    this.getProductList()
    this.actCategoryList()
  }

  async getProductList() {
    await this.actGetStockList({ ...this.getParamApi(), ...this.paginate })
  }

  handleChangeFilter() {
    this.getProductList()
  }

  getProductSelected(data: any[]) {
    this.selectedStock = data
  }

  onPage(event: any) {
    this.paginate.pageSize = event.rows
    this.paginate.pageNumber = event.page
    this.getProductList()
  }

  showModalDelete(data: any) {
    if(data) {
      this.stockNameDelete = data.name
      this.ids = [data.id]
    }
    else {
      this.ids = this.selectedStockFilter.map((item: any) => {
        return item.id
      })
    }
    this.isModalDelete = true
  }

  async handleDeleteStock() {
    try {
      this.loadingSubmit = true
      const data = await this.actDeleteStockByIds(this.ids)
      if(data) {
        this.loadingSubmit = false
        this.isModalDelete = false
        this.$toast.add({
          severity: 'success',
          summary: 'Success Message',
          detail: 'Successfully deleted stock',
          life: 3000
        })
        this.paginate.pageNumber = 0
        this.getProductList()
      }
    } catch (error) {
      this.loadingSubmit = false
    }
  }

  handleCancel() {
    this.isModalDelete = false
  }

  handleEditStock(id: any) {
    this.$router.push({ path: `/stock/${id}`, query: { plan: 'edit' }})
  }

  rowdbClick({ data }) {
    this.$router.push(`/stock/${data.id}`)
  }

  sortData(e: any){
    const { sortField, sortOrder } = e
    if(sortOrder) {
      this.isDescending = sortOrder !== 1
      this.sortByColumn = sortField.replace('_', '')
    } else {
      this.isDescending = null
      this.sortByColumn = null
    }
    this.getProductList()
  }

  debounceSearchName =  _.debounce((value) => {
    this.name = value
    this.getProductList()
  }, 500)

  debounceSearchCode =  _.debounce((value) => {
    this.barCode = value
    this.getProductList()
  }, 500)

  handleRefreshFilter () {
    this.name = null
    this.barCode = null
    this.categories = null
    this.status = null
    this.getProductList()
  }
}
export default Stock
</script>
<style lang="sass" scoped>
.stock
  @include flex-column
  height: 100%
  &__header
    @include flex-center-space-between
    margin-bottom: 24px
  .header__action
      @include flex-center
      gap: 0 16px    
.stock__table
  border-radius: 4px
  flex: 1
  position: relative
  overflow: hidden
  &-no
    font-size: $font-size-medium
  &-barcode
    text-transform: uppercase
.filter__dropdown, .filter__multiselect
  width: 100%
  height: 40px
  border: none
</style>
