<template>
  <div>
    <div class="sidebar"></div>
    <div class="main">
      <div class="stock">
        <div class="stock-header">
          <div class="header-left">
            <h1 class="header-title">Stock list</h1>
            <span class="header-info">1280 product found</span>
          </div>
          <div class="header-right">
            <div class="header-search">
              <img
                class="header-search-icon"
                :src="require('~/assets/icon/search.svg')"
                alt=""
              />
              <input
                class="header-search-input"
                type="text"
                placeholder="Search"
              />
            </div>
            <div class="header-toggle-filter">
              <img :src="require('~/assets/icon/filter.svg')" alt="" />
              <span>Filter</span>
            </div>
            <div class="header-add">
              <img :src="require('~/assets/icon/plus.svg')" alt="" />
              <span>Add Items</span>
            </div>
          </div>
        </div>

        <div class="filter">
          <div class="filter-item filter-warehouse">
            <div class="filter-title">Warehouse</div>
            <Dropdown
              v-model="selectedCity"
              :options="cities"
              optionLabel="name"
              placeholder="Select"
            />
          </div>
          <div class="filter-item filter-category">
            <div class="filter-title">Category</div>
            <MultiSelect
              v-model="selectedCars"
              :options="cars"
              optionLabel="brand"
              placeholder="Select Brands"
              :filter="true"
            />
          </div>
          <div class="filter-item filter-code">
            <div class="filter-title">Code</div>
            <span class="p-input-icon-right">
              <InputText type="text" v-model="value2" />
              <i class="pi pi-search" />
            </span>
          </div>
          <div class="filter-item filter-status">
            <div class="filter-title">Status</div>
            <Dropdown
              v-model="selectedCity"
              :options="cities"
              optionLabel="name"
              placeholder="Select"
            />
          </div>
        </div>

        <div class="stock-table">
          <DataTable
            :scrollable="true"
            :selection.sync="selectedStock"
            :value="dataTable"
            dataKey="id"
            responsiveLayout="scroll"
            :rows="10"
          >
            <Column
              selectionMode="multiple"
              :headerStyle="{ width: '3em' }"
            ></Column>
            <Column field="no" header="NO" :sortable="true"></Column>
            <Column field="name" header="NAME" :sortable="true"></Column>
            <Column
              field="inventory_level"
              header="INVENTORY LEVEL"
              :sortable="true"
            ></Column>

            <Column field="code" header="Code" :sortable="true"></Column>
            <Column field="sku" header="Sku" :sortable="true"></Column>
            <Column
              field="category"
              header="Category"
              :sortable="true"
            ></Column>
            <Column field="sender" header="Sender" :sortable="true"></Column>
            <Column field="status" header="Status" :sortable="true">
              <template #body="{ data }">
                <div class="table-status">
                  <Tag value="New" severity="success"></Tag>
                </div>
              </template>
            </Column>
            <Column field="action" header="Action">
              <template #body="{ data }">
                <div class="table-action">
                  <span>
                    <img :src="require('~/assets/icon/pencil.svg')" alt="" />
                  </span>
                  <span>
                    <img :src="require('~/assets/icon/trash.svg')" alt="" />
                  </span>
                </div>
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
@Component
class Stock extends Vue {
  selectedStock: any = null

  selectedCity: any = null

  cities: any = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' },
  ]

  selectedCars: any = null

  cars: any = [
    { brand: 'Audi', value: 'Audi' },
    { brand: 'BMW', value: 'BMW' },
    { brand: 'Fiat', value: 'Fiat' },
    { brand: 'Honda', value: 'Honda' },
    { brand: 'Jaguar', value: 'Jaguar' },
    { brand: 'Mercedes', value: 'Mercedes' },
    { brand: 'Renault', value: 'Renault' },
    { brand: 'Volkswagen', value: 'Volkswagen' },
    { brand: 'Volvo', value: 'Volvo' },
  ]

  dataTable: any = [
    {
      id: 1,
      no: '1',
      name: 'Apple',
      inventory_level: '0',
      box_code: 'AB1358',
      warehouse: 'NTH001',
      code: 'AB1358',
      sku: 'ADIWHIS40M',
      category: 'Technology',
      sender: 'Hungnk@gmail.com',
      status: 'New',
    },
    {
      id: 2,
      no: '1',
      name: 'Apple',
      inventory_level: '0',
      box_code: 'AB1358',
      warehouse: 'NTH001',
      code: 'AB1358',
      sku: 'ADIWHIS40M',
      category: 'Technology',
      sender: 'Hungnk@gmail.com',
      status: 'New',
    },
    {
      id: 3,
      no: '1',
      name: 'Apple',
      inventory_level: '0',
      box_code: 'AB1358',
      warehouse: 'NTH001',
      code: 'AB1358',
      sku: 'ADIWHIS40M',
      category: 'Technology',
      sender: 'Hungnk@gmail.com',
      status: 'New',
    },
  ]

  value2: any = ''
}
export default Stock
</script>

<style lang="scss">
body,
html {
  padding: 0px;
  margin: 0px;
}
.sidebar {
  width: 270px;
}
.main {
  padding: 32px;
  margin-left: 270px;
  background: #e8eaef;
}

// table > thead > tr {
//   height: 56px;
//   background: #f9f9fc;
// }

// table > thead > tr > th {
//   font-weight: 700 !important;
//   font-size: 12px;
//   line-height: calc(24px / 12px);
//   letter-spacing: 1px;
//   text-transform: uppercase;
//   color: #464d64 !important;
// }

// table > tbody > tr {
//   max-height: 66px;
// }

// table > tbody > tr > td {
//   font-weight: 400;
//   font-size: 14px;
//   line-height: calc(24px / 14px);
//   color: #151622;
//   max-width: 130px;
//   overflow: hidden;
// }

// .p-datatable.p-datatable-hoverable-rows
//   .p-datatable-tbody
//   > tr:not(.p-highlight):hover {
//   background: #e8eaef;
// }

// .p-datatable .p-datatable-tbody > tr.p-highlight {
//   background: #486ae2;
// }

// .p-datatable .p-datatable-thead > tr > th {
//   border: none;
// }

.table {
  &-action {
    display: flex;
    align-items: center;
    gap: 0 8px;

    span {
      cursor: pointer;
      width: 34px;
      height: 34px;
      background: #f1f3f6;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

.stock-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 31px;

  .header {
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
      display: flex;
      align-items: center;
      background: #ffffff;
      border-radius: 4px;
      width: 300px;
      padding-left: 18px;
      overflow: hidden;
      height: 48px;
    }

    &-search-icon {
      cursor: pointer;
    }

    &-search-input {
      height: 100%;
      width: 100%;
      padding-left: 18px;
      outline: none;
      border: none;
    }

    &-search-input::placeholder {
      color: #d2d2e0;
      font-weight: 400;
      font-size: 14px;
      line-height: calc(24 / 14);
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
      }
    }

    &-add {
      display: flex;
      align-items: center;
      gap: 0 19px;
      background: #486ae2;
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
}

.filter {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  margin-bottom: 24px;
  grid-gap: 0 16px;

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
    background-color: #486ae2 !important;
  }

  .p-dropdown-item,
  .p-multiselect-item {
    padding: 12px 0 16px 12px !important;
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
    padding: 12px !important;
    background-color: #fff;
  }

  .p-multiselect-close {
    display: none;
  }
}
</style>
