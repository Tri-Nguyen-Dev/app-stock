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
	:class="{ 'table-wrapper-empty': !listItemInBox || listItemInBox.length <= 0 }"
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
			filter-match-mode='contains'
		)
			template(#body="slotProps")
				//- img(:src='process.env.BASE_IMAGE_URL + `thumbnail/${slotProps.data.stock.imagePath}`' :alt="slotProps.data.image" style="width:3rem; height: 3rem")
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
      className="font-bold"
		)
			template(#editor="{ data, field }")
				InputText(v-model='data.sku' autofocus)
		column(
			field='stock.name'
			header='NAME'
			)
				template(#body='{data}')
					span.font-bold.text-right {{data.stock.name}}
		column(
			field='amount'
			header='QUANTITY'
			:show-filter-match-modes='false'
			className="text-right font-bold"
			style='width:10%'
		)
			template(#editor="{ data, field }").font-bold
				InputNumber(v-model='data.amount' autofocus)
					//- span.font-bold.text-right {{data.amount}}
		column(
			field='unit.name',
			header='UNIT',
			:show-filter-match-modes='false'
			className="text-right font-bold"
		)
			template(#body='{data}')
				span.font-bold {{data.stock.unit.name}}
		column(
			field='size',
			header='SIZE',
			:show-filter-match-modes='false'
		)
			template(#body='{data}')
				span.font-bold {{data.stock.length}}*{{data.stock.width}}*{{data.stock.height}}
		column(
			field='weight',
			header='WEIGHT(KG)',
			:show-filter-match-modes='false'
			className="text-right"
		)
			template(#body='{data}')
				span.font-bold {{data.stock.weight}}
		column(
			field='value',
			header='VALUE',
			:show-filter-match-modes='false'
			className="text-right font-bold"
		)
			template(#editor="{ data, field }")
				InputNumber(v-model='data.stock.value' autofocus)
		column(
			field='category.name',
			header='CATEGORY',
			:show-filter-match-modes='false'
			className="text-right"
		)
			template(#body='{data}')
				span.font-bold.text-right {{data.stock.name}}
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
  selectedItem: ItemModel.Model[] = []
  deleteItemList = []
  isModalDelete: boolean = false
  ids: string[] = []
  sort: any = {
    sortByColumn: null,
    sortDescending: null
  }

  // listItemInBox = [
  //   {
  //     stock: {
  //       id: '65rt4u4qldua8lesz4yomaw9o',
  //       name: 'test 2',
  //       sku: 'test test',
  //       height: 89,
  //       width: 89,
  //       length: 89,
  //       value: 69,
  //       description: null,
  //       imagePath: null,
  //       barCode: '3135515655388',
  //       amount: 12,
  //       unit: {
  //         id: 1,
  //         name: 'piece'
  //       },
  //       weight: 89,
  //       category: {
  //         id: 1,
  //         name: 'warehouse1',
  //         icon: null,
  //         displayOrder: null,
  //         deleted: null
  //       },
  //       stockStatus: 'STOCK_STATUS_DISABLE',
  //       attributeValue: [],
  //       deleted: false
  //     }
  //   }
  // ]

  @Prop() listItemInBox!: ItemModel.Model[]
  @Prop() getParam: () => any

  isPositiveInteger(val) {
    let str = String(val)
    str = str.trim()
    if (!str) {
      return false
    }
    str = str.replace(/^0+/, '') || '0'
    const n = Math.floor(Number(str))
    return n !== Infinity && String(n) === str && n >= 0
  }
}
export default ItemDataTable
</script>
<style lang="sass" scoped>
::v-deep.box-page-container
	height: calc(100vh - 18rem)
	.p-inputtext,
  .p-inputtext.p-inputnumber-input
		box-shadow: none
		width: 6rem !important
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
