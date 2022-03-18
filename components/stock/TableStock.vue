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
            img(:src="require('~/assets/icons/arrow-up-right.svg')")
      Column(field='warehouse' header='Warehouse' sortable)
        template(#body='{ data }')
          .table-box-code
            span {{ data.warehouse }}
            img(:src="require('~/assets/icons/arrow-up-right.svg')")
      Column(field='localtion' header='Localtion' sortable)
        template(#body='{ data }')
          .table-box-code
            span {{ data.warehouse }}
            img(:src="require('~/assets/icons/arrow-up-right.svg')")
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
    .table-footer.bg-white
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
    color: #fff
    path
      fill: #fff


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
  background: $primary


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
    color: $primary
    font-size: 12px
    line-height: calc(24 / 12)
    font-weight: 700
    gap: 0 4px
    cursor: pointer

  &-btn-delete
    padding: 5px 10px
    display: flex
    background: #ff7171

    border: 1.5px solid #fff
    box-sizing: border-box
    border-radius: 4px
    color: #fff
    font-weight: 400
    font-size: 14px
    line-height: calc(24 / 14)
    gap: 0 19px
    cursor: pointer

.p-paginator .p-paginator-pages .p-paginator-page.p-highlight
  background: $primary
  border-color: $primary

.p-paginator .p-paginator-pages .p-paginator-page
  color: $primary

.pi-sort-alt:before
  content: url('~/assets/icons/sort-alt.svg')

.pi-sort-amount-up-alt:before
  content: url('~/assets/icons/sort-alt-up.svg')

.pi-sort-amount-down
  transform: rotate(180deg) !important
  &:before
    content: url('~/assets/icons/sort-alt-up.svg')
</style>
