<template lang="pug">
  .table
    DataTable(:value='stockList' :selection.sync='selectedProduct' dataKey='id' responsiveLayout='scroll' :rows='10' :rowHover='true' :resizableColumns='true' columnResizeMode="expand")
      Column(selectionMode='multiple' :headerStyle="{ width: '3em' }")
      Column(field='no' header='NO')
        template(#body='{ index }')  {{ index + 1 }}
      Column(field='image' header='Image')
        template(#body='{ data }')
          .table-image
            img(:src='data.image' alt='' width='100%')
      Column(field='name' header='Name' sortable)
        template(#body='{ data }')
          .table-name
            | {{ data.name }}
      Column(field='inventory_level' header='Inventory Level' sortable)
        template(#body='{ data }')
          .flex.align-items-center.justify-content-end {{ data.inventory_level }}
      Column(field='box_code' header='Box code' sortable)
        template(#body='{ data }')
          .table-box-code
            span {{ data.box_code }}
            svg(width='16' height='16' viewbox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg')
              path(d='M9.21877 5.94271H5.49544C5.31863 5.94271 5.14906 5.87247 5.02404 5.74745C4.89901 5.62242 4.82877 5.45286 4.82877 5.27604C4.82877 5.09923 4.89901 4.92966 5.02404 4.80464C5.14906 4.67962 5.31863 4.60938 5.49544 4.60938H10.8288C10.9164 4.60911 11.0032 4.62618 11.0842 4.65959C11.1652 4.693 11.2388 4.74209 11.3008 4.80405C11.3627 4.86601 11.4118 4.93961 11.4452 5.02061C11.4786 5.10161 11.4957 5.18842 11.4954 5.27604V10.6094C11.4954 10.7862 11.4252 10.9558 11.3002 11.0808C11.1752 11.2058 11.0056 11.276 10.8288 11.276C10.652 11.276 10.4824 11.2058 10.3574 11.0808C10.2323 10.9558 10.1621 10.7862 10.1621 10.6094V6.88538L5.64277 11.4047C5.51768 11.5297 5.34805 11.5999 5.1712 11.5998C4.99436 11.5998 4.82478 11.5295 4.69977 11.4044C4.57477 11.2793 4.50458 11.1097 4.50464 10.9328C4.5047 10.756 4.57501 10.5864 4.70011 10.4614L9.21877 5.94271V5.94271Z' fill='#1838BD')
      Column(field='warehouse' header='Warehouse' sortable)
        template(#body='{ data }')
          .table-box-code
            span {{ data.warehouse }}
            svg(width='16' height='16' viewbox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg')
              path(d='M9.21877 5.94271H5.49544C5.31863 5.94271 5.14906 5.87247 5.02404 5.74745C4.89901 5.62242 4.82877 5.45286 4.82877 5.27604C4.82877 5.09923 4.89901 4.92966 5.02404 4.80464C5.14906 4.67962 5.31863 4.60938 5.49544 4.60938H10.8288C10.9164 4.60911 11.0032 4.62618 11.0842 4.65959C11.1652 4.693 11.2388 4.74209 11.3008 4.80405C11.3627 4.86601 11.4118 4.93961 11.4452 5.02061C11.4786 5.10161 11.4957 5.18842 11.4954 5.27604V10.6094C11.4954 10.7862 11.4252 10.9558 11.3002 11.0808C11.1752 11.2058 11.0056 11.276 10.8288 11.276C10.652 11.276 10.4824 11.2058 10.3574 11.0808C10.2323 10.9558 10.1621 10.7862 10.1621 10.6094V6.88538L5.64277 11.4047C5.51768 11.5297 5.34805 11.5999 5.1712 11.5998C4.99436 11.5998 4.82478 11.5295 4.69977 11.4044C4.57477 11.2793 4.50458 11.1097 4.50464 10.9328C4.5047 10.756 4.57501 10.5864 4.70011 10.4614L9.21877 5.94271V5.94271Z' fill='#1838BD')
      Column(field='localtion' header='Localtion' sortable)
        template(#body='{ data }')
          .table-box-code
            span {{ data.warehouse }}
            svg(width='16' height='16' viewbox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg')
              path(d='M9.21877 5.94271H5.49544C5.31863 5.94271 5.14906 5.87247 5.02404 5.74745C4.89901 5.62242 4.82877 5.45286 4.82877 5.27604C4.82877 5.09923 4.89901 4.92966 5.02404 4.80464C5.14906 4.67962 5.31863 4.60938 5.49544 4.60938H10.8288C10.9164 4.60911 11.0032 4.62618 11.0842 4.65959C11.1652 4.693 11.2388 4.74209 11.3008 4.80405C11.3627 4.86601 11.4118 4.93961 11.4452 5.02061C11.4786 5.10161 11.4957 5.18842 11.4954 5.27604V10.6094C11.4954 10.7862 11.4252 10.9558 11.3002 11.0808C11.1752 11.2058 11.0056 11.276 10.8288 11.276C10.652 11.276 10.4824 11.2058 10.3574 11.0808C10.2323 10.9558 10.1621 10.7862 10.1621 10.6094V6.88538L5.64277 11.4047C5.51768 11.5297 5.34805 11.5999 5.1712 11.5998C4.99436 11.5998 4.82478 11.5295 4.69977 11.4044C4.57477 11.2793 4.50458 11.1097 4.50464 10.9328C4.5047 10.756 4.57501 10.5864 4.70011 10.4614L9.21877 5.94271V5.94271Z' fill='#1838BD')
      Column(field='code' header='Code' sortable)
      Column(field='sku' header='Sku' sortable)
      Column(field='category' header='Category' sortable)
      Column(field='sender' header='Quantity' sortable)
      Column(field='status' header='Status' sortable)
        template(#body='{ data }')
          tag(:value='data.status' success='')
      Column(field='action' header='Action')
        template(#body='{ data }')
          .table-action
            span
              img(:src="require('~/assets/icons/pencil.svg')" alt='')
            span(@click="handleDeleteStock(data)")
              img(:src="require('~/assets/icons/trash.svg')" alt='')
    .table-footer
      .table-footer-info(v-if='!selectedProduct.length > 0')
        img(:src="require('~/assets/icons/filter-left.svg')" alt='')
        span Showing 01 - 100 of 1280
      .table-btn-delete(v-else='')
        img(:src="require('~/assets/icons/trash-white.svg')" alt='')
        span Delete {{ selectedProduct.length }} items selected
      .table-footer-paginate
        Paginator(:rows='10' :totalRecords='totalRecords' @page="onPage($event)")
    ConfirmDialog
</template>

<script lang="ts">
import { Component, Vue, namespace } from 'nuxt-property-decorator'
const nsStoreStock = namespace('stock')

@Component
class Table extends Vue {
  @nsStoreStock.State
  stockList!: any

  @nsStoreStock.Action
  actGetProductList!: () => Promise<void>

  selectedProduct: any = []

  currentPage: number = 1
  totalRecords: number = 50

  mounted() {
    this.actGetProductList()
  }

  onPage(event: any) {
    this.currentPage = event.page + 1
  }

  handleDeleteStock() {}
}
export default Table
</script>

<style lang="sass">
$primary-color: #486ae2
$white-color: #fff

.p-datatable-wrapper
  &::-webkit-scrollbar
    height: 6px
  &::-webkit-scrollbar-thumb
    background: #979aa4
    border-radius: 10px
    min-height: 40px

table thead tr
  height: 56px
  background: #f9f9fc

table tbody tr.p-highlight
  .table-name
    color: #fff
  .table-box-code
    color: $white-color
    path
      fill: $white-color


table thead tr th
  font-weight: 700 !important
  font-size: 12px
  line-height: calc(24 / 12)
  letter-spacing: 1px
  text-transform: uppercase
  color: $text-color-800 !important
  white-space: nowrap
  border: none !important
  padding: 14px 26px !important

table tbody tr td
  white-space: nowrap
  border: 1px solid rgba(21, 22, 34, 0.05)
  padding: 14px 26px !important

.p-datatable-resizable > .p-datatable-wrapper
  &::-webkit-scrollbar
    width: 6px

  &::-webkit-scrollbar-thumb
    background: #979aa4
    border-radius: 10px
    min-height: 40px


.p-datatable .p-datatable-tbody > tr.p-highlight
  background: $primary-color


table > tbody > tr
  max-height: 66px

.p-datatable.p-datatable-hoverable-rows  .p-datatable-tbody > tr:not(.p-highlight):hover
  background: #e8eaef

.table

  &-name
    font-weight: 400
    font-size: 14px
    line-height: calc(24 / 12)
    color: #151622
    overflow: hidden
    text-overflow: ellipsis
    width: 138px

  &-action
    display: flex
    align-items: center
    gap: 0 8px

    span
      cursor: pointer
      width: 34px
      height: 34px
      background: #f1f3f6
      border-radius: 4px
      display: flex
      align-items: center
      justify-content: center

  &-image
    img
      width: 34px
      height: 34px
      object-fit: cover
      border-radius: 4px

  &-footer
    left: 0
    display: flex
    align-items: center
    justify-content: space-between
    height: 66px
    background-color: $white-color
    padding: 0 24px

  &-footer-info
    display: flex
    align-items: center
    justify-content: center
    gap: 0 19px

    span
      font-weight: 400
      font-size: 12px
      line-height: calc(24 / 12)
      color: $text-color-500

  &-box-code
    display: flex
    align-items: center
    color: $primary-color
    font-size: 12px
    line-height: calc(24 / 12)
    font-weight: 700
    gap: 0 4px
    cursor: pointer

    img
      width: 16px
      height: 16px

  &-btn-delete
    padding: 5px 10px
    display: flex
    background: #ff7171

    border: 1.5px solid $white-color
    box-sizing: border-box
    border-radius: 4px
    color: $white-color
    font-weight: 400
    font-size: 14px
    line-height: calc(24 / 14)
    gap: 0 19px
    cursor: pointer

.p-paginator .p-paginator-pages .p-paginator-page.p-highlight
  background: $primary-color
  border-color: $primary-color

.p-paginator .p-paginator-pages .p-paginator-page
  color: $primary-color

.pi-sort-alt:before
  content: url('~/assets/icons/sort-alt.svg')

.pi-sort-amount-up-alt:before
  content: url('~/assets/icons/sort-alt-up.svg')

.pi-sort-amount-down
  transform: rotate(180deg) !important
  &:before
    content: url('~/assets/icons/sort-alt-up.svg')
</style>
