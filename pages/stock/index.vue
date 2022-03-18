<template lang="pug">
  .wapper
    .sidebar
    .main
      .stock
        .stock__header.flex.align-items-center.justify-content-between
          .stock__header-left
            h1.text-900.font-bold.text-header.m-0 Stock list
            span.text-700.font-normal.stock__header-info 1280 product found
          .stock__header-right.flex.align-items-center.justify-content-between
            .stock__header-search.h-3rem.w-18rem
              span.p-input-icon-left.h-full.w-full
                .icon.icon--left.icon-search
                InputText.h-full.border-0.w-full.stock__header-search(type='text' v-model='filter.search' placeholder='Search')
            div.flex.align-items-center.bg-white.h-3rem.stock__header-filter(:class="{active: isShowFilter}" @click='toggleShowFilter')
              img(v-if='!isShowFilter' :src="require('~/assets/icons/filter.svg')" alt='')
              img(v-else='' :src="require('~/assets/icons/chevron-up.svg')" alt='')
              span Filter
            .stock__header-add.bg-primary.h-3rem.flex.align-items-center
              img(:src="require('~/assets/icons/plus.svg')" alt='')
              span.text-white Add Items
        div(:class='{ active: isShowFilter, stock__filter: true }')
          .stock__filter-item.bg-white
            .stock__filter-title Warehouse
            Dropdown(v-model='filter.warehouse' :options='warehouseList' optionLabel="name" placeholder='Select')
          .stock__filter-item.bg-white
            .stock__filter-title Category
            MultiSelect(v-model='filter.category' :options='categoryList' optionLabel="name" placeholder='Select' :filter='true')
          .stock__filter-item.bg-white
            .stock__filter-title Code
            span.p-input-icon-right
              InputText(type='text' v-model='filter.code')
              i.pi.pi-search
          .stock__filter-item.bg-white
            .stock__filter-title Status
            Dropdown(v-model='filter.status' :options='statusList' optionLabel="name" placeholder='Select')
        .stock-table
          TableStock
</template>
<script lang="ts">
import { Component, Vue, namespace } from 'nuxt-property-decorator'
import TableStock from '~/components/stock/TableStock.vue'
const nsCategoryStock = namespace('category')
const nsWarehouseStock = namespace('warehouse')

@Component({
  components: {
    TableStock,
  },
})
class Stock extends Vue {
  @nsCategoryStock.State
  categoryList!: any

  @nsWarehouseStock.State
  warehouseList!: any

  @nsCategoryStock.Action
  actCategoryList!: () => Promise<void>

  @nsWarehouseStock.Action
  actWarehouseList!: () => Promise<void>

  filter: any = {
    warehouse: null,
    category: null,
    code: null,
    status: null,
    search: null,
  }

  statusList: any = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' },
  ]

  warehouse: any = null

  selectedStock: any = null

  isShowFilter: boolean = false

  toggleShowFilter() {
    this.isShowFilter = !this.isShowFilter
  }

  mounted() {
    this.actCategoryList()
    this.actWarehouseList()
  }
}
export default Stock
</script>

<style lang="sass">

body
  background: #e8eaef


.sidebar
  width: 270px

.main
  padding: 32px
  margin-left: 270px

.stock__header
  margin-bottom: 31px
  &-info
    font-size: $font-size-small
    line-height: calc(24 / 12)

  &-right
    gap: 0 16px

  &-search::placeholder
    color: #D2D2E0
    font-size: 14px
    font-weight: 400
    line-height: calc(24 / 14)

  &-filter, &-add
    padding: 0 32px 0 16px
    gap: 0 18px
    cursor: pointer
    border-radius: 4px

  &-filter.active
    border: 1.5px solid $primary
    color: $primary


.stock__filter
  display: grid
  grid-template-columns: 1fr 1fr 1fr 1fr
  margin-bottom: 0
  grid-gap: 0 16px
  visibility: hidden
  opacity: 0
  max-height: 0
  transition: all 0.25s ease-in-out

  &-title
    padding-left: 8px
    margin-bottom: 6px
    color: $text-color-secondary
    font-size: 12px

  &-item
    padding: 8px
    .p-dropdown-label.p-placeholder, .p-multiselect-label.p-placeholder, .p-dropdown-label .p-inputtext
      padding-left: 8px !important

    .p-dropdown .p-dropdown-label.p-placeholder, .p-multiselect .p-multiselect-label.p-placeholder
      color: $text-color-secondary
      font-weight: 400
      font-size: 14px
      line-height: calc(24 / 14)

  &-item
   .p-dropdown-trigger-icon:before, .p-multiselect-trigger-icon::before
      content: url('~/assets/icons/chevron-down.svg')

   .p-multiselect-panel .p-multiselect-header .p-checkbox
      position: absolute !important
      z-index: 1
      margin-left: 18px
      margin-right: 0

  .p-multiselect-filter-container
    input
      padding: 14px 0 14px 56px

  .p-dropdown
    width: 100%
    border: none

  .p-inputwrapper-focus
    box-shadow: none
    border: none


  .p-dropdown-label,
  .p-multiselect-label
    padding: 8px 0
    color: $text-color-base
    font-weight: 400
    font-size: 14px
    line-height: calc(24 / 14)


  .p-multiselect-label
    max-width: 240px


  .p-dropdown:not(.p-disable).p-focus,
  .p-multiselect:not(.p-disable).p-focus
    box-shadow: none
    border-color: none


  .p-dropdown-items-wrapper,
  .p-multiselect-items-wrapper
    max-height: 288px !important
    border-radius: 4px
    box-shadow: none

    &::-webkit-scrollbar
      width: 6px


    &::-webkit-scrollbar-thumb
      background: $text-color-secondary
      border-radius: 10px
      width: 6px
      height: 160px


  .p-dropdown-items-wrapper .p-dropdown-items,
  .p-multiselect-items
    border: none !important
    padding: 0
    box-shadow: none


  .p-dropdown-panel.p-dropdown-items.p-dropdown-item:not(.p-highlight):not(.p-disabled):hover, .p-multiselect-panel.p-multiselect-items.p-multiselect-item:not(.p-highlight):not(.p-disabled):hover
    color: $text-color-base
      background: #e8eaef

  .p-dropdown-item.p-highlight,
  .p-multiselect-item.p-highlight
    background-color: $primary !important


  .p-dropdown,
  .p-multiselect
    width: 100%
    border: none


  .p-input-icon-right,
  .p-inputtext
    width: 100%


  .p-multiselect-panel .p-multiselect-items .p-multiselect-item .p-checkbox
    margin-right: 18px


  .p-multiselect-header
    padding: 0 !important
    background-color: #fff


  .p-multiselect-close
    display: none


  &.active
    max-height: 80px
    opacity: 1
    visibility: visible
    margin-bottom: 24px

.p-checkbox .p-checkbox-box
  border: 1.5px solid #d2d2e0
  border-radius: 2px


.p-dropdown-trigger-icon,
.p-multiselect-trigger-icon
  &:before
    content: url('~/assets/icons/arrow-down.svg')


.filter .p-multiselect-header
  padding: 0 !important


.p-inputtext:enabled:focus
  outline: none
  outline-offset: 0
  box-shadow: none
  border-color: $primary


.p-inputtext:enabled:focus + .p-multiselect-filter-icon
  color: $primary !important


.p-inputtext:enabled:focus + .pi-search
  color: $primary !important


.filter-code .p-inputtext
  padding: 8px
</style>
