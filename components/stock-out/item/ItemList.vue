<template lang="pug">
  DataTable.w-full.flex.flex-column.table__sort-icon.bg-white.box-page-container(
    :resizableColumns='true',
    :value='dataRenderItems',
    dataKey='id',
    :row-hover='true',
    responsiveLayout='scroll',
    columnResizeMode='fit',
    :selection.sync='selectedItem'
  )
    template(#empty)
      .flex.align-items-center.justify-content-center.flex-column
        img(:srcset='`${require("~/assets/images/table-empty.png")} 2x`')
        p.text-900.font-bold.mt-3 List is empty!
    column(
      selectionMode='multiple',
      styles='width: 3rem',
      v-if='checkActionPick()'
    )
    column(field='no', header='NO')
      template(#body='slotProps')
        span.font-bold {{ slotProps.index + 1 }}
    column(
      field='stock.imageUrl',
      header='IMAGE',
      :sortable='true',
      filter-match-mode='contains'
    )
      template(#body='slotProps')
        img(
          :src='slotProps.data.stock.imageUrl',
          :alt='slotProps.data.stock.image',
          style='width: 3rem; height: 3rem'
        )
    column.text-overflow-ellipsis(
      field='stock.barCode',
      header='BARCODE',
      :sortable='true',
      :show-filter-match-modes='false'
    )
      template(#body='{ data }')
        span.text-primary.font-bold {{ data.stock.barCode }}
    column(field='sku', header='SKU', sortable='', data-type='numeric')
      template(#body='{ data }')
        span.uppercase {{ data.sku }}
    column(field='stock.name', header='NAME', :sortable='true')
      template(#body='{ data }')
        span.font-bold.text-right {{ data.stock.name }}
    column(
      field='location.name',
      header='LOCATION',
      :sortable='true',
      v-if='checkActionPick()'
    )
      template(#body='{ data }')
        span.font-bold.text-primary.text-right {{ data.location.name }}
    column(field='box.barCode', header='BOXCODE', :sortable='true')
      template(#body='{ data }')
        span.font-bold.text-right {{ data.box.barCode }}
    column(
      field='amount',
      header='QUANTITY',
      :sortable='true',
      headerClass='grid-header-right'
    )
      template(#body='{ data }')
        .font-bold.grid-cell-right {{ data.amount }}
    column(field='tag', header='TAG', headerClass='grid-header-center')
      template(#body='{ data }')
        .grid-cell-center
          Checkbox(v-model='data.tag', :binary='true', :disabled='isDetail')
    Column(
      :exportable='false',
      header='ACTION',
      className='p-text-right',
      v-if='action === "CREATE"'
    )
      template(#body='{ data }')
        Button.border-0.p-0.h-2rem.w-2rem.justify-content-center.surface-200(
          :disabled='data.itemStatus == "ITEM_STATUS_DISABLE"',
          @click='editItemDetail(data.id)'
        )
          .icon--small.icon-btn-edit
        Button.border-0.p-0.ml-1.h-2rem.w-2rem.justify-content-center.surface-200(
          @click='showModalDelete(data.id)',
          :disabled='data.itemStatus === "ITEM_STATUS_DISABLE"'
        )
          .icon--small.icon-btn-delete
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
class ItemList extends Vue {
  @Prop() listItems!: any[]
  @Prop() getParam: () => any
  @Prop({ default: false }) isShow!: boolean
  @Prop({ default: 'STAFT' }) role: string
  @Prop({ default: 'DETAIL' }) action: string
  selectedItem: any[] = []

  get dataRenderItems() {
    if (!this.listItems) {
      return [
        {
          id: '1231234312',
          amount: 100,
          tag: true,
          picked: true,
          sku: 'SKU',
          location: {
            name: 'ABC-123'
          },
          box: {
            barCode: '123521312'
          },
          stock: {
            imageUrl: '12312321',
            barCode: '12311',
            name: 'IP12 pro'
          }
        },
        {
          id: '1234312',
          amount: 100,
          tag: false,
          picked: true,
          sku: 'SKU',
          location: {
            name: 'ABC-123'
          },
          box: {
            barCode: '123521312'
          },
          stock: {
            imageUrl: '12312321',
            barCode: '12311',
            name: 'IP12 pro'
          }
        }
      ]
    } else {
      return this.listItems
    }
  }

  editItemDetail() {}

  showModalDelete() {}

  checkActionPick() {
    return this.action === 'PICK'
  }
}

export default ItemList
</script>

<style lang="sass" scoped>
.box-page-container
  height: calc(100vh - 18rem)
.p-column-header-content
  .p-column-title
    color: #464D64
    font-weight: 700
    text-transform: uppercase
    letter-spacing: 1px
.p-datatable
  .p-datatable-thead
    tr
      th
        background: var(--surface-300)
.p-paginator
  justify-content: end
  .p-paginator-first , .p-paginator-last
    display: none
  .p-paginator-element
    border: none
    color: var(--surface-900)
  .p-paginator-pages
    .p-paginator-page.p-highlight
      background-color: var(--surface-0)
      box-shadow: none
      color: var(--primary-color) !important
    .p-paginator-page.p-paginator-element
      font-weight: bold
      border: none
      color: var(--surface-500)
</style>
