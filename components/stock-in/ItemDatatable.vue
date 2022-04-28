<template lang="pug">
DataTable.w-full.flex.flex-column.table__sort-icon.bg-white.box-page-container(
	:value='listItemInBox'
	dataKey='stock.barCode'
	:paginator='false'
	:row-hover='true'
	responsiveLayout="scroll"
	columnResizeMode="fit"
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
				img(
					:src="slotProps.data.stock.imagePath | getThumbnailUrl"
					:alt="slotProps.data.image"
				)
		column.text-overflow-ellipsis(
			field='stock.barCode'
			header='BARCODE',
			:sortable='true',
			sort-field='representative.name',
		)
			template(#body='{data}')
				span.text-primary.font-bold {{data.stock.barCode}}
		Column(
			field='sku',
			header='SKU'
			className="font-bold text-center"
			:styles="{'width': '10%'}"
		)
			template(#body="{ data }")
				span(v-if="isActive !== data.stock.barCode").text-center {{data.sku}}
				InputText(v-model='data.sku' autofocus v-else)
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
			className="font-bold text-center"
			:styles="{'width': '10%'}"
		)
			template(#body="{ data }").font-bold
				span(v-if="isActive !== data.stock.barCode").text-center {{data.amount}}
				InputNumber(v-model='data.amount' autofocus v-else)
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
			className="font-bold text-center"
			:styles="{'width': '10%'}"
		)
			template(#body="{ data }")
				span(v-if="isActive !== data.stock.barCode") {{data.value}}
				InputNumber(v-model='data.value' autofocus v-else)
		column(
			field='category.name',
			header='CATEGORY',
			:show-filter-match-modes='false'
			className="text-right"
		)
			template(#body='{data}')
				span.font-bold.text-right {{data.stock.category.name}}
		column
			template(#body="{data}")
				.table__action(v-if='isActive !== data.stock.barCode')
					span(@click='editItemValue(data)')
						.icon.icon-edit-btn
					span(@click='deleteItem(data)')
						.icon.icon-btn-delete
				.table__action(v-else)
					span(@click='saveItemValue(data.stock.barCode)')
						.icon.pi.pi-check
					span(@click='cancelItemValue(data.stock.barCode)')
						.icon.pi.pi-times
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
  @Prop() listItemInBox!: ItemModel.Model[]
  @Prop() getParam: () => any
  selectedItem: ItemModel.Model[] = []
  deleteItemList = []
  isModalDelete: boolean = false
  ids: string[] = []
  sort: any = {
    sortByColumn: null,
    sortDescending: null
  }

  onEventEditItem: {
    stock: any,
    sku: ''
    amount: '',
    value: ''
  }

  isActive: string = ''

  editItemValue(data:any) {
    this.isActive = data.stock.barCode
    this.onEventEditItem = { ...data }
  }

  saveItemValue() {
    this.isActive = ''
  }

  cancelItemValue() {
    this.isActive = ''
    const valueItemCancel = this.onEventEditItem
    const _array = [...this.listItemInBox]
    _.forEach(_array, function(item) {
      if (item.stock.barCode === valueItemCancel.stock.barCode) {
        item.value = valueItemCancel.value
        item.amount = valueItemCancel.amount
        item.sku = valueItemCancel.sku
      }
    })
  }

  deleteItem(data:any) {
    this.listItemInBox.splice(this.listItemInBox.indexOf(data),1)
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
