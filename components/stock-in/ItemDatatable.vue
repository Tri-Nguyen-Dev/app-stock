<template lang="pug">
	DataTable.w-full.flex.flex-column.table__sort-icon.bg-white.box-page-container(
		:value='listItemInBox'
		dataKey='stock.barCode'
		:paginator='false'
		:row-hover='true'
		responsiveLayout="scroll"
		columnResizeMode="fit"
		editMode="cell"
		class="editable-cells-table" 
	)
		template(#empty)
				div.flex.align-items-center.justify-content-center.flex-column
						img(:srcset="`${require('~/assets/images/table-empty.png')} 2x`")
						p.text-900.font-bold.mt-3 List is empty!
		column(field='no', header='NO')
			template(#body="slotProps")
				span.font-bold {{slotProps.index + 1 }}
		column(
			field='',
			header='IMAGE',
			:sortable='true',
			filter-match-mode='contains'
		)
			template(#body="slotProps")
				img(:src="slotProps.data.imageUrl" :alt="slotProps.data.image" style="width:3rem; height: 3rem")
		column.text-overflow-ellipsis(
			field='stock.barCode'
			header='BARCODE',
			:sortable='true',
			sort-field='representative.name',
		)
			template(#body='{data}')
				span.text-primary.font-bold {{data.stock.barCode}}
		column(
			field='sku',
			header='SKU'
		)
			template(#body='{data}')
				span.uppercase {{data.sku}}
		column(
			field='stock.name',
			header='NAME',
			)
				template(#body='{data}')
					span.font-bold.text-right {{data.stock.name}}
		column(
			field='quantity',
			header='QUANTITY',       
			:show-filter-match-modes='false'
			className="p-text-right"
			style='width:10%'
		)
			template(#body='{data,field}')
				InputNumber(v-model='data.amount' autofocus)
					//- span.font-bold.text-right {{data.amount}}
		column(
			field='unit.name',
			header='UNIT',
			:show-filter-match-modes='false'
			className="p-text-right"
		)
			template(#body='{data}')
				span.font-bold {{data.stock.unit.name}}
		column(
			field='size',
			header='SIZE',
			:show-filter-match-modes='false'
			className="p-text-right"
		)
			template(#body='{data}')
				span.font-bold {{data.stock.length}}*{{data.stock.width}}*{{data.stock.height}}
		column(
			field='weight',
			header='WEIGHT(KG)',
			:show-filter-match-modes='false'
			className="p-text-right"
		)
			template(#body='{data}')
				span.font-bold {{data.stock.weight}}
		column(
			field='value',
			header='VALUE',
			:show-filter-match-modes='false'
			className="p-text-right"
		)
			template(#body='{data}')
				span.font-bold {{data.value}}
		column(
			field='category.name',
			header='CATEGORY',     
			:show-filter-match-modes='false'
			className="p-text-right"
		)
			template(#body='{data}')
				span.font-bold {{data.stock.category.name}}
		column( header="ACTION" className="text-right")
			template(#body="{data}")
				.grid.table__action
					//- span(@click="handleEditBox(data.id)")
					span
						.icon.icon-edit-btn
					//- span(:class="{'disable-button': itemsBoxDelete.length > 0}" @click="showModalDelete(data.id)")
					span
						.icon.icon-btn-delete
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import ConfirmDialogCustom from '~/components/dialog/ConfirmDialog.vue'
import { Item as ItemModel } from '~/models/Item'
@Component({
  components: { ConfirmDialogCustom }
})
class ItemDataTable extends Vue {

  @Prop() sku!: string
  selectedItem :ItemModel.Model[] = []
  deleteItemList = []
  isModalDelete: boolean = false
  ids: string[] = []

  sort: any = {
    sortByColumn: null,
    sortDescending: null
  }

  @Prop() listItemInBox!: ItemModel.Model[]
  @Prop() getParam: () => any
				
}
export default ItemDataTable
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
				font-weight:  bold
				border: none
				color: var(--surface-500)
</style>
