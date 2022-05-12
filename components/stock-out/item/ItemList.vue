<template lang="pug">
DataTable#custom-table.w-full.flex.flex-column.table__sort-icon.bg-white.box-page-container(
	:resizableColumns='true',
	:value='dataRenderItems',
	dataKey='id',
	:row-hover='true',
	responsiveLayout='scroll',
	columnResizeMode='fit',
	v-if='dataRenderItems',
	:selection.sync='selectedItem',
	@row-select='selectRow()',
	@row-unselect='unSelectRow'
)
	template(#empty)
		.flex.align-items-center.justify-content-center.flex-column
			img(:srcset='`${require("~/assets/images/table-empty.png")} 2x`')
			p.text-900.font-bold.mt-3 List is empty!
	column(field='no', header='NO')
		template(#body='slotProps')
			span.font-bold {{ slotProps.index + 1 }}
	column(
		field='picked',
		header='PICKED',
		selectionMode='multiple',
		styles='width: 3rem',
		:hidden='!isPack',
		headerClass='grid-header-center'
	)
	column(
		field='stock.imagePath',
		header='IMAGE',
		:sortable='true',
		filter-match-mode='contains'
	)
		template(#body='slotProps')
			img(:src='slotProps.data.stockBox.stock.imagePath | getThumbnailUrl')
	column.text-overflow-ellipsis(
		field='stock.barCode',
		header='BARCODE',
		:sortable='true',
		:show-filter-match-modes='false'
	)
		template(#body='{ data }')
			span.text-primary.font-bold {{ data.stockBox.stock.barCode }}
	column(field='sku', header='SKU', sortable='', data-type='numeric')
		template(#body='{ data }')
			span.uppercase {{ data.stockBox.sku }}
	column(field='stock.name', header='NAME', :sortable='true')
		template(#body='{ data }')
			span.font-bold.text-right {{ data.stockBox.stock.name }}
	column(
		field='location.name',
		:header='isPack ? "LOCATION" : ""',
		:sortable='isPack',
		:rendered='false',
		:hidden='!isPack'
	)
		template(#body='{ data }')
			span.font-bold.text-primary.text-right {{ data.stockBox.box.rackLocation.name }}
	column(field='box.qrCode', header='BOXCODE', :sortable='true')
		template(#body='{ data }')
			span.font-bold.text-right {{ data.stockBox.box.qrCode }}
	column(
		field='amount',
		header='QUANTITY',
		:sortable='true',
		headerClass='grid-header-right'
	)
		template(#body='{ data }')
			.font-bold.grid-cell-right {{ data.stockBox.amount }}
	column(field='airtag', header='TAG', headerClass='grid-header-center')
		template(#body='{ data }')
			.grid-cell-center
				Checkbox(v-model='data.hasAirtag', :binary='true', :disabled='isDetail')
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator'
import { STOCK_OUT_ACTION } from '~/utils/constants/stock-out'
@Component
class ItemList extends Vue {
  @Prop() listItems!: any[]
  @Prop() getParam: () => any
  @Prop({ default: false }) isDetail!: boolean
  @Prop({ default: STOCK_OUT_ACTION.ORDER_DETAIL }) action: string
  isPack = false
  selectedItem: any[] = []
  enablePack = false

  get dataRenderItems() {
    return this.listItems
  }

  @Watch('action')
  changePack() {
    this.isPack = true
  }

  editItemDetail() {}

  showModalDelete() {}

  selectRow() {
    this.$emit('selectRow', this.selectedItem)
    if (this.selectedItem.length === this.dataRenderItems.length) {
      this.$emit('enablePack', true)
    }
  }

  unSelectRow() {
    this.$emit('enablePack', false)
  }
}

export default ItemList
</script>

<style lang="sass" scoped>
.box-page-container
	height: calc(100vh - 18rem)
::v-deep.p-datatable .p-column-header-content .p-checkbox-box.p-component
	display: none !important
::v-deep.p-datatable .p-datatable-tbody > tr.p-highlight
	background-color: $color-white !important
	color: var(--surface-900) !important
::v-deep.p-datatable
	height: 92% !important
</style>
