<template lang="pug">
.receipt-note(v-if='receiptDetail')
	card.mb-5
		template(#title='')
			.d-flex
				i.pi.pi-info-circle.mr-3
				span.font-semibold.text-base  GENERAL INFO
		template(#content='')
			.grid(v-if='receiptDetail.data')
				.col
					.filter__item.item--disabled
						.filter__title ID receipt note
						.filter__text {{ receiptDetail.data.id }}
				.col
					.filter__item.item--disabled
						.filter__title ID Creator
						.filter__text {{ receiptDetail.data.createdBy.email }}
				.col
					.filter__item.item--disabled
						.filter__title Creator name
						.filter__text {{ receiptDetail.data.createdBy.displayName }}
				.col
					.filter__item.item--disabled
						.filter__title Created time
						.filter__text {{ receiptDetail.data.createdAt | dateTime }}
				.col
					.filter__item
						.filter__title.item--disabled Warehouse
						.filter__text(v-if='receiptDetail.data.warehouse' ) {{ receiptDetail.data.warehouse.name }}
				.col
					.filter__item
						.filter__title.item--disabled Seller email
						.filter__autocomplete
						.filter__text {{ receiptDetail.data.seller.email }}
				.col
					.filter__item.item--disabled
						.filter__title Seller phone
						.filter__text {{ receiptDetail.data.seller.phoneNumber }}
				.col
					.filter__item.item--disabled
						.filter__title Seller name
						.filter__text {{ receiptDetail.data.seller.displayName }}
	card.card-custom
		template(#content='')
			.grid
				.col-2.border-top.pl-3
					.overflow-y-auto(style='height: 55vh', v-if='listBox')
						.grid.box-card.m-2(
							v-for='box in listBox',
							@click='selectBox(box)',
							:class='{ "box-card-active": box.index == activeIndex }'
						)
							.col-6.flex.align-items-center
								.icon--large.icon-box-view(
									:class='{ "bg-blue-700": box.index !== activeIndex }'
								)
							.col-6.flex.align-items-center.justify-content-end
							.col-12.flex.align-items-center
								.grid
									.col-12.pb-0
										span.uppercase.font-semibold.mr-1 box {{ box.index + 1 }}
									.col-12.pb-0(v-if='box.location && box.location.name != ""')
										.icon.icon-map-pin(
											:class='{ "bg-blue-700": box.index !== activeIndex }'
										)
										span.uppercase.mr-1 {{ box.location.name }}
				.col-10(v-if='listBox[activeIndex]')
					.grid.border__grid
						.d-flex.col-12.border__right(class='md:col-5 lg:col-4')
							span.font-semibold.text-base.mr-3.ml-3 Size:
							span {{ getSize(activeIndex) }}
							span.font-semibold.text-base.ml-3 (cm)
						.d-flex.col-12.border__right.pt-4.pb-4(class='md:col-5 lg:col-4')
							span.font-semibold.text-base.mr-3.ml-2 Storage Fee:
							span ${{ listBox[activeIndex].inventoryFee }}
							span.font-semibold.text-base.ml-3 /day
						.d-flex.col-6(class='md:col-5 lg:col-4')
							span.font-semibold.text-base.mr-2.ml-2 Box Code:
							span {{ listBox[activeIndex].id }}
					.grid.border__left.border__right.mt-0.pb-3(
						style='margin-right: 0px',
						v-if='listBox[activeIndex]'
					)
						DataTable.w-full.flex.flex-column.table__sort-icon.bg-white.box-page-container(
							:value='listBox[activeIndex].listItemInBox',
							:paginator='false',
							:row-hover='true',
							responsiveLayout='scroll',
							columnResizeMode='fit'
						)
							template(#empty)
								.flex.align-items-center.justify-content-center.flex-column
									img(:srcset='`${require("~/assets/images/table-empty.png")} 2x`')
									p.text-900.font-bold.mt-3 List is empty!
							column(field='no', header='NO')
								template(#body='slotProps')
									span.font-bold {{ slotProps.index + 1 }}
							column(field='', header='IMAGE', filter-match-mode='contains')
								template(#body='slotProps')
									img(
										:src='slotProps.data.stock.imagePath | getThumbnailUrl',
										:alt='slotProps.data.image',
										style='width: 3rem; height: 3rem'
									)
							column.text-overflow-ellipsis(
								field='stock.barCode',
								header='BARCODE',
								:sortable='true',
								sort-field='representative.name'
							)
								template(#body='{ data }')
									span.text-primary.font-bold {{ data.stock.barCode }}
							column(field='sku', header='SKU')
								template(#body='{ data }')
									span.text-primary.font-bold {{ data.sku }}
							column(field='stock.name', header='NAME')
								template(#body='{ data }')
									span.font-bold.text-right {{ data.stock.name }}
							column(
								field='originalAmount',
								header='QUANTITY',
								:show-filter-match-modes='false',
								className='p-text-right',
								style='width: 10%'
							)
								template(#body='{ data }')
									span.text-primary.font-bold.text-right {{ data.originalAmount }}
							column(
								field='unit.name',
								header='UNIT',
								:show-filter-match-modes='false',
								className='p-text-right'
							)
								template(#body='{ data }')
									span.font-bold {{ data.stock.unit.name }}
							column(
								field='size',
								header='SIZE',
								:show-filter-match-modes='false',
								className='p-text-right'
							)
								template(#body='{ data }')
									span.font-bold {{ data.stock.length }}*{{ data.stock.width }}*{{ data.stock.height }}
							column(
								field='weight',
								header='WEIGHT(KG)',
								:show-filter-match-modes='false',
								className='p-text-right'
							)
								template(#body='{ data }')
									span.font-bold {{ data.stock.weight }}
							column(
								field='value',
								header='VALUE',
								:show-filter-match-modes='false',
								className='p-text-right'
							)
								template(#body='{ data }')
									span.font-bold {{ data.value }}
							column(
								field='category.name',
								header='CATEGORY',
								:show-filter-match-modes='false',
								className='p-text-right'
							)
								template(#body='{ data }')
									span.font-bold.text-right {{ data.stock.name }}
		template(#footer='')
			.grid(v-if='listBox')
				.d-flex.pt-2.col-12(class='md:col-4 lg:col-4')
					.grid.w-full
						//- .col.align-items-center.ml-4
						.col-2.flex.align-items-center.justify-content-center.pl-4
							img(src='~/assets/icons/note.svg')
						.col-10
							span.font-semibold.text-base.mr-1 Note:
							br
							span {{ note }}
				.d-flex.col-6(class='md:col-2 lg:col-2')
					.grid.w-full.border__right
						.col-3.flex.align-items-center.justify-content-end
							img(src='~/assets/icons/box-border.svg')
						.col-9
							span.font-semibold.text-base.mr-1 Total boxes:
							br
							span.font-semibold.text-primary {{ listBox.length }}
				.d-flex.col-6(class='md:col-2 lg:col-2')
					.grid.w-full.border__right
						.col-3.flex.align-items-center.justify-content-end
							img(src='~/assets/icons/total-items-border.svg')
						.col-9
							span.font-semibold.text-base.mr-1 Total items:
							br
							span.font-semibold.text-primary {{ totalItem() }}
				.d-flex.col-6(class='md:col-2 lg:col-2')
					.grid.w-full.border__right
						.col-3.flex.align-items-center.justify-content-end
							img(src='~/assets/icons/total-fee.svg')
						.col-9
							span.font-semibold.text-base.mr-1 Total fee:
							br
							span.font-semibold.text-primary {{ totalFee() }} $/day
				.d-flex.justify-content-center.col-6(class='md:col-2 lg:col-2')
					Button.p-button-secondary.mr-2(
						label='Export file',
						icon='pi pi-download',
						@click='handleExportReceipt'
					)
					Button.p-button-primary.mr-2(
						label='Print Preview',
						@click='isShowLabel = true'
					)
	PrintLabel(
		:displayLable='isShowLabel',
		@setShow='setShowLabel',
		:requestId='receiptDetail.data.id',
		v-if='receiptDetail.data && listBox[activeIndex]',
		:boxId='listBox[activeIndex].id'
	)
</template>
<script lang="ts">
import { Component, namespace, Vue } from 'nuxt-property-decorator'
import ConfirmDialogCustom from '~/components/dialog/ConfirmDialog.vue'
import ItemDataTable from '~/components/stock-in/ItemDatatable.vue'
import FormAddSeller from '~/components/stock-in/FormAddSeller.vue'
import { Item as ItemModel } from '~/models/Item'
import { Receipt as ReceiptModel } from '~/models/Receipt'
import PrintLabel from '~/components/pdf/PrintLabel.vue'
import { exportFileTypePdf } from '~/utils'
const nsStoreStockIn = namespace('stock-in/create-receipt')
const nsStoreExportReceipt = namespace('stock-in/export-receipt')

@Component({
  components: {
    ConfirmDialogCustom,
    ItemDataTable,
    FormAddSeller,
    PrintLabel
  }
})
class DetailReceipt extends Vue {
  listBox: ReceiptModel.Box[] = []
  itemInBox: ItemModel.Model
  isShowModalAddStock: boolean = false
  activeIndex = 0
  activeAction = false
  activeSave = false
  receiptNoteId: string
  note: string = ''
  warehouse: any = null
  seller: any = null
  isShowLabel: boolean = false

  get sellerName() {
    return this.seller && this.seller.name ? this.seller.name : 'name'
  }

  get sellerPhone() {
    return this.seller && this.seller.phone ? this.seller.phone : 'phone'
  }

  get id() {
    return this.$route.params.id || ''
  }

  @nsStoreStockIn.State
  receiptDetail!: any

  @nsStoreStockIn.Action
  actGetReceiptDetail

  @nsStoreExportReceipt.Action
  actGetReceiptLable!: (params: any) => Promise<string>

  selectBox(box) {
    this.activeIndex = box.index
  }

  export() {}

  setShowLabel(value: any) {
    this.isShowLabel = value
  }

  async mounted() {
    this.$nextTick(() => {
      this.$nuxt.$loading.start()
      setTimeout(() => this.$nuxt.$loading.finish(), 500)
    })
    await this.actGetReceiptDetail({ id: this.$route.params.id })
    this.prepareListBox()
  }

  prepareListBox() {
    this.receiptDetail.data.boxList.forEach((element, index) => {
      const box = new ReceiptModel.Box()
      box.index = index
      box.inventoryFee = element.inventoryFee
      box.boxSize = element.boxSize
      box.location = element.rackLocation
      box.qrCode = element.qrCode
      box.id = element.id
      box.listItemInBox.push(...element.listStockWithAmount)
      this.listBox.push(box)
    })
    this.activeIndex = 0
    this.note = this.receiptDetail.data.note
  }

  async handleExportReceipt() {
    const result = await this.actGetReceiptLable({ id: this.id })
    if (result) {
      exportFileTypePdf(result, `receipt-${this.id}`)
    }
  }

  getSize(activeIndex) {
    return `${this.listBox[activeIndex].boxSize?.name}
			(${this.listBox[activeIndex].boxSize?.length}
			*${this.listBox[activeIndex].boxSize?.width}
			*${this.listBox[activeIndex].boxSize?.height})`
  }

  totalItem() {
    let total = 0
    this.listBox.forEach((element) => {
      total += _.sumBy(element.listItemInBox, function(o) { return o.originalAmount })
    })
    return total
  }

  totalFee() {
    let totalFee = 0
    this.listBox.forEach((element) => {
      if (element.inventoryFee! > 0) {
        totalFee += element.inventoryFee!
      }
    })
    return totalFee
  }
}

export default DetailReceipt
</script>
<style lang="sass" scoped>
.pi
	color: #1838BD !important
.d-flex
	@include flex-center-vert
.box-input
	background-color: #F1F3F6 !important
.number-input
	width: 30%
	::v-deep.p-inputnumber-input
		background: #F1F3F6 !important
		width: 30%
.box-retangle
	background: #FFFFFF
	border-radius: 3px
	width: 1px
.border
	&__grid
		border: solid 1px #E8EAEF
		border-right: none
	&__right
		border-right: solid 1px #E8EAEF
	&__left
		border-left: solid 1px #E8EAEF
	&__top
		border-top: solid 1px #E8EAEF
	&__bot
		border-bottom: solid 1px #E8EAEF
.card-custom
	::v-deep.p-datatable
		height: 55vh
	::v-deep.p-card-body
		padding: 0 !important
		.p-card-content
			padding: 0 !important
	::v-deep.p-card-footer
		box-shadow: 0px 10px 45px rgba(0, 10, 24, 0.1)
		border-radius: 8px 8px 0px 0px
		padding-top: 0
i:hover
	cursor: pointer
::v-deep.p-sidebar.p-sidebar-active
	width: 25rem
	display: flex
	.p-sidebar-header
		display: none
	.p-sidebar-content
		flex: 1
		padding: 0
.general__filter
	display: flex
	.p-sidebar-header
		display: none
	.p-sidebar-content
		flex: 1
		padding: 0
.general__dropdown
	@include size(100%, 40px)
	border: none
.justify-content-right
	justify-content: right
.box-card
	background: #F1F3FF
	border-radius: 4px
	color: var(--primary-color) !important
.box-card-active
	cursor: pointer
	background: #486AE2
	color: $color-white !important
	button
		color: $color-white !important
.box-card-active .icon
	background-color: $color-white !important
.box-card-active .icon--large
	background-color: $color-white !important
.box-card:hover
	@extend .box-card-active
</style>
