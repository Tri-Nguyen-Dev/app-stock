<template lang="pug">
  .wapper
    .sidebar
    .main
      .stock
        .stock__header
          .stock__header-left
            h1.stock__header-title Stock list
            span.stock__header-info 1280 product found
          .stock__header-right
            .stock__header-search
              span.p-input-icon-left
                i.pi.pi-search
                InputText(type='text' v-model='filter.search' placeholder='Search')
            div(:class="{active: isShowFilter, 'stock__header-toggle-filter': true,}" @click='toggleShowFilter')
              img(v-if='!isShowFilter' :src="require('~/assets/icon/filter.svg')" alt='')
              img(v-else='' :src="require('~/assets/icon/arrow-up.svg')" alt='')
              span Filter
            .stock__header-add
              img(:src="require('~/assets/icon/plus.svg')" alt='')
              span Add Items
        div(:class='{ active: isShowFilter, stock__filter: true }')
          .stock__filter-item.filter-warehouse
            .stock__filter-title Warehouse
            Dropdown(v-model='filter.warehouse' :options='warehouseList' optionLabel="name" placeholder='Select')
          .stock__filter-item.filter-category
            .stock__filter-title Category
            MultiSelect(v-model='filter.category' :options='categoryList' optionLabel="name" placeholder='Select Brands' :filter='true')
          .stock__filter-item.filter-code
            .stock__filter-title Code
            span.p-input-icon-right
              InputText(type='text' v-model='filter.code')
              i.pi.pi-search
          .stock__filter-item.filter-status
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

<style lang="scss">
$primary-color: #486ae2;

body {
  background: #e8eaef;
}

.sidebar {
  width: 270px;
}
.main {
  padding: 32px;
  margin-left: 270px;
}

.stock__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 31px;

  &-title {
    color: #151622;
    font-weight: 700;
    font-size: 30px;
    line-height: calc(38 / 30);
    margin: 0;
  }

  &-info {
    font-weight: 400;
    font-size: 12px;
    line-height: calc(24 / 12);
    color: #979aa4;
  }

  &-right {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0 16px;
  }

  &-search {
    background: #ffffff;
    width: 300px;

    border-radius: 4px;
    .p-input-icon-left {
      width: 100%;
      height: 48px;
    }

    i {
      left: 17px !important;
    }

    input {
      height: 100%;
      padding: 12px 0 12px 48px !important;
      width: inherit;
      height: inherit;
      outline: none;
      border: none;
    }

    input::placeholder {
      font-weight: 400;
      font-size: 14px;
      line-height: calc(24 / 14);
      color: #d2d2e0;
    }
  }

  &-search-icon {
    cursor: pointer;
  }

  &-toggle-filter {
    padding: 12px 16px;
    background: #ffffff;
    border-radius: 4px;
    display: flex;
    align-items: center;
    gap: 0 19px;
    cursor: pointer;

    span {
      font-weight: 400;
      font-size: 14px;
      line-height: calc(24 / 14);
      color: #151622;
      white-space: nowrap;
    }
  }

  &-toggle-filter.active {
    border: 1.5px solid $primary-color;
  }

  &-add {
    display: flex;
    align-items: center;
    gap: 0 19px;
    background: $primary-color;
    border-radius: 4px;
    padding: 12px 32px 12px 20px;
    cursor: pointer;

    span {
      font-weight: 400;
      font-size: 14px;
      line-height: calc(24 / 14);
      color: #ffffff;
    }
  }
}

.stock__filter {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  margin-bottom: 0;
  grid-gap: 0 16px;
  visibility: hidden;
  opacity: 0;
  max-height: 0;
  transition: all 0.25s ease-in-out;

  .p-multiselect-panel .p-multiselect-header .p-checkbox {
    position: absolute !important;
    z-index: 1;
    margin-left: 18px;
    margin-right: 0;
  }

  .p-multiselect-filter-container {
    input {
      padding: 14px 0 14px 56px;
    }
  }

  .p-dropdown {
    width: 100%;
    border: none;
  }

  .p-dropdown-trigger {
    justify-content: end;
  }

  .p-inputwrapper-focus {
    box-shadow: none;
    border: none;
  }

  .p-dropdown-label,
  .p-multiselect-label {
    padding: 8px 0;
    color: #151622;
    font-weight: 400;
    font-size: 14px;
    line-height: calc(24 / 14);
  }

  .p-multiselect-label {
    max-width: 240px;
  }

  .p-dropdown:not(.p-disable).p-focus,
  .p-multiselect:not(.p-disable).p-focus {
    box-shadow: none;
    border-color: none;
  }

  .p-dropdown-items-wrapper,
  .p-multiselect-items-wrapper {
    max-height: 288px !important;
    border-radius: 4px;
    box-shadow: none;

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-thumb {
      background: #979aa4;
      border-radius: 10px;
      width: 6px;
      height: 160px;
    }
  }

  .p-dropdown-items-wrapper .p-dropdown-items,
  .p-multiselect-items {
    border: none !important;
    padding: 0;
    box-shadow: none;
  }

  .p-dropdown-panel
    .p-dropdown-items
    .p-dropdown-item:not(.p-highlight):not(.p-disabled):hover,
  .p-multiselect-panel
    .p-multiselect-items
    .p-multiselect-item:not(.p-highlight):not(.p-disabled):hover {
    color: #151622;
    background: #e8eaef;
  }

  .p-dropdown-item.p-highlight,
  .p-multiselect-item.p-highlight {
    background-color: $primary-color !important;
  }

  .p-dropdown,
  .p-multiselect {
    width: 100%;
    border: none;
  }

  .p-input-icon-right,
  .p-inputtext {
    width: 100%;
  }

  .p-multiselect-panel .p-multiselect-items .p-multiselect-item .p-checkbox {
    margin-right: 18px;
  }

  .p-multiselect-header {
    padding: 0 !important;
    background-color: #fff;
  }

  .p-multiselect-close {
    display: none;
  }

  &.active {
    max-height: 80px;
    opacity: 1;
    visibility: visible;
    margin-bottom: 24px;
  }

  &-item {
    padding: 12px 16px;
    border-radius: 4px;
    background: #ffffff;
  }

  &-title {
    margin-bottom: 6px;
    color: #979aa4;
    font-size: 12px;
  }
}

.p-checkbox .p-checkbox-box {
  border: 1.5px solid #d2d2e0;
  border-radius: 2px;
}

.p-dropdown-trigger-icon,
.p-multiselect-trigger-icon {
  &:before {
    content: url('~/assets/icon/arrow-down.svg');
  }
}

.p-dropdown-item,
.p-multiselect-item {
  padding: 12px 0 16px 18px !important;
}

.filter .p-multiselect-header {
  padding: 0 !important;
}

.p-inputtext:enabled:focus {
  outline: none;
  outline-offset: 0;
  box-shadow: none;
  border-color: $primary-color;
}

.p-inputtext:enabled:focus + .p-multiselect-filter-icon {
  color: $primary-color !important;
}

.p-inputtext:enabled:focus + .pi-search {
  color: $primary-color !important;
}

.filter-code .p-inputtext {
  padding: 8px;
}
</style>
