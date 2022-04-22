<template lang="pug">
.receipt-note
		card.mb-5
				template(#title='')
					div.d-flex
						i.pi.pi-info-circle.mr-3
						span.font-semibold.text-base GENERAL INFORMATION
				template(#content='')
					div.grid
						.col
							.filter__item.item--disabled
								.filter__title ID receipt note
								.filter__text 030133333
						.col
							.filter__item.item--disabled
								.filter__title ID Creator
								.filter__text NVN030133
						.col
							.filter__item.item--disabled
								.filter__title Creator name
								.filter__text Nguyen Khanh Hung
						.col
							.filter__item.item--disabled
								.filter__title Create time
								.filter__text 19-09-2022 9:24AM
						.col
							.filter__item
								.filter__title Warehouse
								Dropdown.general__dropdown(v-model="warehouse" :options="warehouseList" optionLabel="name" placeholder="Select")
						.col
							.filter__item
								.filter__title Seller email
								.filter__autocomplete
									AutoComplete(v-model="seller" :suggestions="sellerList" @complete="handleChangeSeller($event)" field="email" placeholder="Enter seller email")
									.icon.icon--right.icon-add-items(@click="handleAddSeller")
								span {{ sellerEmailError }}
						.col
							.filter__item.item--disabled
								.filter__title Seller phone
								.filter__text {{ sellerPhone }}
						.col
							.filter__item.item--disabled
								.filter__title Seller name
								.filter__text {{ sellerName }}
		card.card-custom
			template(#content='')
				.grid
					.col-2.border-top.pl-3
						.grid.mb-2
							.col.flex.align-items-center.justify-content-center.mb-1.pt-4
								Button.text-primary(type='button' icon='pi pi-plus' style='width: 90%; background-color: #F1F3FF; border: none' @click='addBox' label='Add box')
								//- Button.p-button-primary.p-button-rounded.p-button-text(
								//- 	type='button',
								//- 	icon='pi pi-plus',
								//- 	@click='addBox()'
								//- )
								//- Button.p-button-danger.p-button-rounded.p-button-text(
								//- 	type='button',
								//- 	icon='pi pi-trash',
								//- 	@click='deleteBox()'
								//- )
						.overflow-y-auto(style='height: 55vh', v-if='listBox')
							.grid.box-card.m-2(
								v-for='box in listBox',
								@click='selectBox(box)'
								:class='{ "box-card-active": box.index == activeIndex }'
							)
								.col-6.flex.align-items-center
									.icon--large.icon-box-view.bg-blue-700
								.col-6.flex.align-items-center.justify-content-end
									Button.p-button-default.p-button-rounded.p-button-text(
										type='button',
										icon='pi pi-ellipsis-h',
										@click.stop='deleteBox(box.index)'
									)
								.col-12.flex.align-items-center
									.grid
										.col-12.pb-0
											span.uppercase.font-semibold.mr-1 box {{ box.index + 1 }}
										.col-12.pb-0(v-if='box.location.name!=""')
											span.uppercase.mr-1  {{ box.location.name }}
					.col-10
						.grid.border__grid(v-if ='boxSizeList && listBox[activeIndex]')
							//- div(class='d-flex col-4 md:col-2 lg:col-1 d-flex border-right')
							//- 	span.uppercase.mr-1 item in box 1
							//- 	i.pi.pi-refresh
							.d-flex.col-12.border__right(class='md:col-5 lg:col-4')
								span.font-semibold.text-base.mr-3.ml-3 Size
								Dropdown.box-input(
									style='width: 70%',
									:options='boxSizeList',
									optionLabel='name',
									optionValue='id',
									placeholder='Select size',
									v-model='listBox[activeIndex].boxSize.id'
								)
								span.font-semibold.text-base.ml-3 (cm)
							.d-flex.col-12.border__right.pt-4.pb-4(class='md:col-5 lg:col-4')
								span.font-semibold.text-base.mr-3.ml-2 Estimate Inventory Fee
								InputNumber.number-input(
									v-model='listBox[activeIndex].inventoryFee'
								)
								span.font-semibold.text-base.ml-3 /day
							.d-flex.col-6(class='md:col-5 lg:col-4')
								span.font-semibold.text-base.mr-2.ml-2 Barcode
								InputText.mr-2(placeholder='Enter barcode' style='width:40%' @change='changeBarcode($event)')
								//- span.font-semibold.text-base.mr-2 Or Scan
								//- Button(
								//- 	type='button',
								//- 	label='--'
								//- 	style='width:10%'
								//- 	@click='showModalAddStock'
								//- )
						.grid.border__left.border__right.mt-0.pb-3(
							style='margin-right: 0px',
							v-if='listBox && listBox[activeIndex]'
						)
							ItemDataTable(:listItemInBox='listBox[activeIndex].listItemInBox')
			template(#footer='')
				.grid(v-if='listBox && listBox[activeIndex]')
					.d-flex.pt-2(class='col-12 md:col-4 lg:col-4')
						.grid.w-full
							//- .col.align-items-center.ml-4
							.col-2.flex.align-items-center.justify-content-center.pl-4
								img(src='~/assets/icons/note.svg')
							.col-10
								span.font-semibold.text-base.mr-1 Note:
								br
								InputText.pt-0.pl-0(placeholder='Write something...' style='border:none')
					.d-flex(class='col-6 md:col-2 lg:col-2')
						.grid.w-full.border__right
							.col-3.flex.align-items-center.justify-content-end
								img(src='~/assets/icons/box-border.svg')
							.col-9
								span.font-semibold.text-base.mr-1 Total boxs:
								br
								span.font-semibold.text-primary  {{listBox.length}}
					.d-flex(class='col-6 md:col-2 lg:col-2')
						.grid.w-full.border__right
							.col-3.flex.align-items-center.justify-content-end
								img(src='~/assets/icons/total-items-border.svg')
							.col-9
								span.font-semibold.text-base.mr-1 Total items:
								br
								span.font-semibold.text-primary {{listBox[activeIndex].listItemInBox.length}}
					.d-flex(class='col-6 md:col-2 lg:col-2')
						.grid.w-full.border__right
							.col-3.flex.align-items-center.justify-content-end
								img(src='~/assets/icons/total-fee.svg')
							.col-9
								span.font-semibold.text-base.mr-1 Total fee:
								br
								span.font-semibold.text-primary 3$/day
					.d-flex.justify-content-center(class='col-6 md:col-2 lg:col-2')
						Button.p-button-secondary.mr-2(label='Save draft' icon="pi pi-file-o" @click='saveReceipt(0)')
						Button.p-button-secondary.mr-2(label='Back' @click='clearLocation()' v-if='activeSave')
						Button(label='Next' @click='getLocationSuggest()' v-if='!activeSave' :disabled='!activeAction')
						Button(label='Save' @click='saveReceipt(1)' v-if='activeSave && activeAction')
		Toast
		Sidebar(
			:visible='isShowModalAddStock',
			:baseZIndex='1000',
			position='right',
			ariaCloseLabel='to'
		)
			StockAdd(@cancelAddStock='cancelAddStock' @addItem='addItem')
			FormAddSeller(:isShowForm="isShowFormAddSeller")
</template>
<script lang="ts">
import { Component, namespace, Vue } from 'nuxt-property-decorator'
import ConfirmDialogCustom from '~/components/dialog/ConfirmDialog.vue'
import ItemDataTable from '~/components/stock-in/ItemDatatable.vue'
import FormAddSeller from '~/components/stock-in/FormAddSeller.vue'
import { Item as ItemModel } from '~/models/Item'
import { validateEmail } from '~/utils'
import { Receipt as ReceiptModel } from '~/models/Receipt'
import { Stock as StockModel } from '~/models/Stock'
import { RECEIPT_ACTION, RECEIPT_STATUS } from '~/utils/constants/rececipt'
const nsStoreStock = namespace('stock/stock-detail')
const nsStoreStockIn = namespace('stock-in/create-receipt')
const nsStoreWarehouse = namespace('warehouse/warehouse-list')
const nsStoreSeller = namespace('seller/seller-list')
const nsStoreBoxSize = namespace('box/box-size-list')

@Component({
  components: {
    ConfirmDialogCustom,
    ItemDataTable,
    FormAddSeller
  }
})
class CreateReceipt extends Vue {

  boxSize: number = 0
  listBox: ReceiptModel.Box[] = [new ReceiptModel.Box()]
  itemInBox: ItemModel.Model
  isShowModalAddStock: boolean = false
  activeIndex = 0
  activeAction = false
  activeSave = false
  receiptNoteId:string
  @nsStoreWarehouse.Action
  actWarehouseList!: (params?: any) => Promise<void>

  @nsStoreSeller.Action
  actSellerList!: (params?: any) => Promise<void>

  @nsStoreBoxSize.Action
  actGetBoxSizeList!: (params?: any) => Promise<void>

  @nsStoreWarehouse.State
  warehouseList!: any

  @nsStoreSeller.State
  sellerList!: any

  @nsStoreBoxSize.State
  boxSizeList!: any

  warehouse: any = null
  seller: any = null
  sellerEmailError: any = null
  isShowFormAddSeller: boolean = false

  get sellerName() {
    return (this.seller && this.seller.name) ? this.seller.name : 'name'
  }

  get sellerPhone() {
    return (this.seller && this.seller.phone) ? this.seller.phone : 'phone'
  }

  @nsStoreStock.State
  newStockDetail!: StockModel.CreateStock

  @nsStoreStock.State
  stockDetail!: any

  @nsStoreStockIn.State
  newReceipt!: any

  @nsStoreStockIn.State
  boxLocation!: ReceiptModel.BoxLocation[]
	
  @nsStoreStock.Action
  actGetStockByBarcode

  @nsStoreStockIn.Action
  actGetReceiptDetail

  @nsStoreStock.Action
  actCreateNewStock

  @nsStoreStockIn.Action
  actCreateNewReceipt

  @nsStoreStockIn.Action
  actLocationSuggestion

  addBox() {
    if (!this.checkActiveAction()) return
    const item: ReceiptModel.Box = {
      index: this.listBox[this.listBox.length - 1].index + 1,
      listItemInBox: [],
      boxSize: {
        id:0
      },
      status: RECEIPT_STATUS.REQUEST_STATUS_DRAFT,
      location:{
        id:'',
        name:'',
        index:0
      }
    }
    if (this.listBox.length < 10) {
      this.listBox.push(item)
    }
    this.activeIndex = this.listBox[this.listBox.length - 1].index
  }

  deleteBox(index) {
    if (this.listBox.length > 1) {
      this.listBox.splice(index, 1)
      this.selectBox(this.listBox[index-1])
    }
  }

  handleChangeSeller(e) {
    if(!validateEmail(e.query) && this.sellerList.length <= 0 && !this.seller?.email) {
      this.sellerEmailError = 'Incorrect email format.'
    }
    else if(e.query === '') {
      this.sellerEmailError = null
    }
    else {
      this.sellerEmailError = null
    }
    const params = { email: e.query }
    this.actSellerList(params)
  }

  handleAddSeller() {
    this.isShowFormAddSeller = !this.isShowFormAddSeller
  }

  showModalAddStock() {
    this.isShowModalAddStock = true
  }

  cancelAddStock() {
    this.isShowModalAddStock = false
  }

  addItem(stockInformation: any) {
    this.isShowModalAddStock = false
    const itemInBox = [
      {
        id: '',
        stock: {
          id: stockInformation.id,
          name: stockInformation.name,
          barCode: stockInformation.barCode,
          imagePath: stockInformation.imagePath,
          unit: {
            id: stockInformation.unit.code,
            name: stockInformation.unit.name
          },
          height: stockInformation.height,
          width: stockInformation.width,
          length: stockInformation.length,
          weight: stockInformation.weight,
          category: {
            id: stockInformation.category.code,
            name: stockInformation.category.name,
            icon: '',
            displayOrder: 0,
            deleted: false
          },
          attributeValue: undefined,
          deleted: false
        },
        box: '',
        amount: stockInformation.quantity,
        value: 0,
        sku: stockInformation.sku,
        itemStatus: ''
      }
    ]
    this.listBox[this.activeIndex].listItemInBox?.push(...itemInBox)
    this.checkActiveAction()
    this.checkLocation()
  }

  selectBox(box) {
    this.activeIndex = box.index
  }

  async saveReceipt(type) {
    if (!this.checkActiveAction()) return
    const receiptDraft: ReceiptModel.CreateReceiptDraft =
      new ReceiptModel.CreateReceiptDraft()
    receiptDraft.action = RECEIPT_ACTION.REQUEST_ACTION_TO_IMPORT_BOX
    receiptDraft.status = type===0?RECEIPT_STATUS.REQUEST_STATUS_DRAFT:RECEIPT_STATUS.REQUEST_STATUS_SAVED
    this.listBox.forEach((element) => {
      const box: ReceiptModel.BoxDraft = new ReceiptModel.BoxDraft()
      box.inventoryFee = element.inventoryFee
      box.boxSize.id = element.boxSize.id
      element.listItemInBox?.forEach((item) => {
        const itemDraft: ReceiptModel.ItemDraft = new ReceiptModel.ItemDraft()
        itemDraft.stock.id = item.stock.id
        itemDraft.value = item.value
        itemDraft.sku = item.sku
        itemDraft.amount = item.amount
        box.listStockWithAmount?.push(itemDraft)
      })
      box.rackLocation.id = element.location.id
      receiptDraft.boxList?.push(box)
    })
    await this.actCreateNewReceipt(receiptDraft)
  }

  checkActiveAction() {
    this.activeAction = this.listBox[this.activeIndex].listItemInBox.length > 0
    return this.activeAction
  }

  async getLocationSuggest(){
    const	listBoxSize = this.listBox.map(element=>{
      return ''+element.boxSize
    })
    await this.actLocationSuggestion(listBoxSize)
    this.boxLocation.forEach(element => {
      this.listBox[element.index].location.name = element.name
      this.listBox[element.index].location.id = element.id
    })
    this.checkLocation()
  }

  mounted() {
    this.actWarehouseList()
    this.actGetBoxSizeList()
  }

  checkLocation(){
    this.listBox.forEach(element => {
      if(!element.location.id || element.location.id===''){
        this.activeSave = false

      }else{
        this.activeSave = true
      }
    })
  }

  clearLocation(){
    this.listBox.forEach((element,index)=>{
      element.location= {
        id:'',
        name:'',
        index
      }
    })
    this.activeSave=false
  }

  async	changeBarcode(event){
    if(event.target.value.length===13){
      const item = this.listBox[this.activeIndex].listItemInBox.findIndex(element=>{
        return element.stock.barCode === event.target.value
      })
      if(item>=0){
        this.listBox[this.activeIndex].listItemInBox[item].amount++
      } else {
        await this.actGetStockByBarcode({ barcode: event.target.value })
        const	stock = this.stockDetail.data
        if(this.stockDetail.data){
          const stockInformation: any = {
            barCode: stock.barCode,
            sku: stock.sku,
            name: stock.name,
            category: stock.category,
            quantity: 1,
            weight: stock.weight,
            unit: stock.unit,
            length: stock.length,
            width: stock.width,
            height: stock.height,
            imagePath: stock.imagePath,
            id: stock.id
          }
          this.addItem(stockInformation)
        } else {
          this.showModalAddStock()
        }	
      }
    }
  }
}

export default CreateReceipt
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
	.icon--large
		background-color: $color-white !important
.box-card:hover
	@extend .box-card-active
</style>
