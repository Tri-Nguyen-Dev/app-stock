<template lang="pug">
  .stock
    h1.text-heading Delivery order list
    .stock__header 
      TabView(:activeIndex.sync="active")
        TabPanel
          template(#header)
            .icon.icon-truck.mr-2.surface-600
            span New
        TabPanel
          template(#header)
            .icon.icon-truck.mr-2.surface-600
            span Delivery setting
        TabPanel
          template(#header)
            .icon.icon-truck.mr-2.surface-600
            span Delivered
      div
      .header__action
        .header__search
          .icon.icon--left.icon-search
          InputText(type='text' placeholder='Search' v-model="filter.name" v-on:input="debounceSearchName")
        .btn__filter(:class="{'active': isShowFilter}")
          .btn-toggle(@click="isShowFilter = !isShowFilter")
            .icon.icon-filter(v-if="!isShowFilter")
            .icon.icon-chevron-up.bg-primary(v-else)
            span Filter
          .btn-refresh(@click="handleRefreshFilter")
            .icon.icon-rotate-left.bg-white
        .btn.btn-primary(@click="handleAddStock")
          .icon.icon-add-items
          span Add Stock
    .grid.header__filter(:class='{ "active": isShowFilter }')
      .col
        FilterTable(title="Catagory" name="categories" :value="filter.categories"  @updateFilter="handleFilter")
          template(v-slot:multi-select)
            MultiSelect.filter__multiselect(v-model='filter.categories' @change="handleChangeFilter" :options='categoryList' optionLabel="name" placeholder='Select' :filter='true')
      .col
        FilterTable(title="Barcode" placeholder="Search barcode" name="barCode" :value="filter.barCode" :searchText="true" @updateFilter="handleFilter")
      .col
        FilterTable(title="Status" :value="filter.status" :options="statusList" name="status" @updateFilter="handleFilter")
    .stock__table
        DataTable(
          @sort="sortData($event)"
          :class="{ 'table-wrapper-empty': !stockList || stockList.length <= 0 }"
          :rowClass="rowClass" :value='stockList' responsiveLayout="scroll"
          @row-click='rowdbClick'
          :selection='selectedStock'
          dataKey='id'
          :rows='10'
          :rowHover='true'
          @row-select-all="rowSelectAll"
          @row-unselect-all="rowUnSelectAll"
          @row-select="rowSelect"
          @row-unselect="rowUnselect"
        )
          Column(
            selectionMode='multiple'
            :styles="{'width': '1%'}"
            :headerClass="classHeaderMuti")
          Column(field='no' header='NO' :styles="{'width': '1%'}" )
            template(#body='{ index }')
              span.grid-cell-center.stock__table-no.text-white-active.text-900.font-bold {{ getIndexPaginate(index) }}
          Column(field='imageUrl' header='Image' headerClass="grid-header-center")
            template(#body='{ data }')
              .stock__table__image.overflow-hidden.grid-cell-center
                img.h-2rem.w-2rem.border-round(
                  :src="data.imagePath | getThumbnailUrl" alt='' width='100%' style="object-fit: cover;")
          Column(header='Name' field='name' :sortable="true" sortField="_name")
            template(#body='{ data }')
              .stock__table-name.text-white-active.text-base.text-900.text-overflow-ellipsis.overflow-hidden {{ data.name }}
          Column(header='Barcode' field='barCode' :sortable="true" sortField="_barCode" headerClass="grid-header-right")
            template(#body='{ data }')
              .stock__table-barcode.grid-cell-right {{ data.barCode }}
          Column(header='Category' :sortable="true" field='category' sortField="_category" headerClass="grid-header-right")
              template(#body='{ data }')
                div.grid-cell-right {{ data.categoryName }}
          Column(header='Type' :sortable="true" field='type' sortField="_type" headerClass="grid-header-right")
              template(#body='{ data }')
                div.grid-cell-right {{ data.typeName }}
          Column(field='status' header="Status" headerClass="grid-header-right")
            template(#body='{ data }')
              div.grid-cell-right
                span.table__status.table__status--available(v-if="data.stockStatus === 'STOCK_STATUS_AVAILABLE'") Available
                span.table__status.table__status--disable(v-if="data.stockStatus === 'STOCK_STATUS_DISABLE' ") Disable
          Column(field='action' header="action" :styles="{'width': '2%'}")
            template(#body='{ data }')
              .table__action(:class="{'action-disabled': data.stockStatus === 'STOCK_STATUS_DISABLE'}")
                span(@click="handleEditStock(data.id)")
                  .icon.icon-edit-btn
                span(@click="showModalDelete([data])" :class="{'disable-button': selectedStockFilter.length > 0}")
                  .icon.icon-btn-delete
          template(#footer)
            //- Pagination(
              :paging="paging"
              :total="total"
              :deleted-list="selectedStockFilter"
              @onDelete="showModalDelete"
              @onPage="onPage")
        //-   template(#empty)
            div.table__empty
              img(:srcset="`${require('~/assets/images/table-empty.png')} 2x`" v-if="!checkIsFilter")
              img(:srcset="`${require('~/assets/images/table-notfound.png')} 2x`" v-else)
              p.empty__text(v-if="!checkIsFilter") List is empty!, Click
                span &nbsp;here
                span(@click="handleAddStock") &nbsp;to add item.
              p.notfound__text(v-else) Item not found!
</template>
<script lang="ts">
import { Vue } from 'nuxt-property-decorator'

class Delivery extends Vue { 
  isShowFilter: boolean = false
  loading: boolean = false
  active: 0
  filter: any = {
    name: null,
    barCode: null,
    warehouse: null,
    categories: null,
    status: null,
    sortBy: null,
    desc: null
  }

  debounceSearchName = _.debounce((value) => {
    this.filter.name = value
    // this.getProductList()
  }, 500)

  handleRefreshFilter() {
    this.filter.name = null
    this.filter.barCode = null
    this.filter.categories = null
    this.filter.status = null
    // this.getProductList()
  }
}
export default Delivery
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
  ::v-deep.disable-button
    pointer-events: none
    background-color: $text-color-300
    .icon
      background-color: $text-color-500
.filter__dropdown, .filter__multiselect
  @include size(100%, 40px)
  border: none
</style>