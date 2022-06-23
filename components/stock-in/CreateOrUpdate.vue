          <template lang="pug">
.receipt-note
  card.mb-5
    template(#title='')
      .d-flex
        i.pi.pi-info-circle.mr-3
        span.font-semibold.text-base GENERAL INFORMATION
    template(#content='')
      .grid
        .col
          .filter__item.item--disabled
            .filter__title ID receipt note
            .filter__text(v-if='id') {{ id }}
            .filter__text(v-else)
              i.filter__title auto generate...
        .col
          .filter__item.item--disabled
            .filter__title ID Creator
            .filter__text(v-if='user') {{ user.email }}
        .col
          .filter__item.item--disabled
            .filter__title Creator name
            .filter__text(v-if='user') {{ user.displayName }}
        .col
          .filter__item.item--disabled
            .filter__title Create time
            .filter__text(v-if='generalInfo.createdAt') {{ generalInfo.createdAt | dateTimeHour12 }}
            .filter__text(v-else)
              i.filter__title auto generate...
        .col
          .filter__item
            .filter__title.required__title Warehouse
            Dropdown.general__dropdown(
              v-model='warehouse',
              :options='warehouseList',
              optionLabel='name',
              placeholder='Select'
            )
            .input-errors
              .error-message(v-if='$v.warehouse.$dirty && $v.warehouse.$invalid') Please enter warehouse!
        .col
          .filter__item
            .filter__title.required__title Seller email
            AutoComplete(
              v-model='generalInfo.seller',
              :suggestions='sellerList',
              @complete='handleChangeSeller($event)',
              @item-select='selectedItem($event)',
              field='email',
              @clear='clearItem($event)'
              :delay='500'
            )
            .input-errors(
              v-if='$v.generalInfo.seller.$dirty && $v.generalInfo.seller.$invalid'
            )
              .error-message Please enter email!
            .input-errors(
              v-if='emailInvalid'
            )
              .error-message Email invalid
        .col
          .filter__item.item--disabled
            .filter__title Seller phone
            .filter__text(v-if='generalInfo.seller') {{ generalInfo.seller.phoneNumber }}
        .col
          .filter__item.item--disabled
            .filter__title Seller name
            .filter__text(v-if='generalInfo.seller') {{ generalInfo.seller.displayName }}
  card.card-custom
    template(#content='')
      .grid
        .col-12.pl-3.border__top(class='md:col-3 lg:col-2')
          .grid.mb-2
            .col.flex.align-items-center.justify-content-center.mb-1.pt-4.pb-5
              Button.text-primary(
                type='button',
                icon='pi pi-plus',
                style='width: 90%; background-color: #f1f3ff; border: none',
                @click='addBox',
                label='Add box'
              )
          .overflow-y-auto(style='height: 53vh', v-if='listBox')
            .grid.box-card.m-2(
              v-for='box in listBox',
              @click='selectBox(box)',
              :class='{ "box-card-active": box.index == activeIndex }'
            )
              .col-6.flex.align-items-center
                .icon--large.icon-box-view.bg-blue-700
              .col-6.flex.align-items-center.justify-content-end
                Button.p-button-default.p-button-rounded.p-button-text(
                  type='button',
                  icon='pi pi-times',
                  @click.stop='activeIndex = box.index; checkDeleteBox()'
                )
              .col-12.flex.align-items-center
                .grid
                  .col-12.pb-0
                    span.uppercase.font-semibold.mr-1 box {{ box.index + 1 }}
                  .col-12.pb-0(v-if='checkEnableLocation(box)')
                    AutoComplete.edit-location(
                      v-model='listBox[box.index].location',
                      field='name',
                      :suggestions='locationList',
                      @complete='searchLocation($event)',
                      @item-select='changeItem($event)',
                      :dropdown='true',
                      :minLength='3'
                    )
                      template(#item='slotProps')
                        .grid.align-items-center.grid-nogutter
                          span.font-bold.text-small {{ slotProps.item.name }}
                          .icon-arrow-up-right.icon
        .col-12.p-0(class='md:col-9 lg:col-10')
          .grid.border__grid(v-if='boxSizeList && listBox[activeIndex]')
            .col-12.pt-4.pb-4.border__right(class='md:col-6 lg:col-4')
              .grid
                .col-12.content-center
                  span.font-semibold.text-base.mr-3.ml-3.required__title Size
                  Dropdown.box-input(
                    style='width: 70%',
                    :options='boxSizeList',
                    optionLabel='name',
                    optionValue='id',
                    placeholder='Select size',
                    v-model='listBox[activeIndex].boxSize.id',
                    :filter='true',
                    :showClear='true'
                  )
                  span.font-semibold.text-base.ml-3 (cm)
                  .input-errors( v-if='listBox[activeIndex] && $v.listBox.$each[activeIndex].boxSize.id.$dirty && $v.listBox.$each[activeIndex].boxSize.id.$invalid' style='text-align: center')
                    .error-message Please enter select box size Fee!
            .col-12.border__right.pt-4.pb-4(class='md:col-6 lg:col-4') 
              .grid
                .col-12.content-center(class='md:col-6 lg:col-6') 
                  span.font-semibold.text-base.mr-3.ml-2.required__title Estimate Inventory Fee
                .col-12(class='md:col-6 lg:col-6')   
                  InputNumber.number-input(
                    v-model='listBox[activeIndex].inventoryFee',
                    mode='currency',
                    currency='USD',
                    locale='en-US'
                    style='width:60%'
                  ) 
                  span.font-semibold.text-base.ml-3 / day
              .input-errors()
                .error-message(v-if='$v.listBox.$each[activeIndex].inventoryFee.$dirty && $v.listBox.$each[activeIndex].inventoryFee.$invalid' style='text-align: center') Please enter Inventory Fee!
            .col-12.pt-4.pb-4.content-center(class='md:col-6 lg:col-3')
              span.font-semibold.text-base.mr-2.ml-2 Barcode
              InputText.box-input.mr-2(
                placeholder='Enter barcode',
                style='width: 60%',
                v-model='boxQrCode'
                @keyup.enter='changeBarcode($event)'
              )
          .grid.border__left.border__right.mt-0.pb-3(
            style='margin-right: 0px',
            v-if='listBox && listBox[activeIndex]'
          )
            ItemDataTable(:listItemInBox='listBox[activeIndex].listItemInBox' :activeInputSku='activeInputSku')
    template(#footer='')
      .grid
        .d-flex.pt-2.col-12(class='md:col-4 lg:col-4')
          .grid.w-full
            //- .col.align-items-center.ml-4
            .col-2.flex.align-items-center.justify-content-center.pl-4
              img(src='~/assets/icons/note.svg')
            .col-10
              span.font-semibold.text-base.mr-1 Note:
              br
              InputText.pt-0.pl-0(
                placeholder='Write something...',
                style='border: none',
                v-model='note'
              )
        .d-flex.col-12(class='md:col-4 lg:col-2')
          .grid.w-full.border__right
            .col-3.flex.align-items-center.justify-content-end
              img(src='~/assets/icons/box-border.svg')
            .col-9
              span.font-semibold.text-base.mr-1 Total boxes:
              br
              span.font-semibold.text-primary {{ listBox.length }}
        .d-flex.col-12(class='md:col-4 lg:col-2')
          .grid.w-full.border__right
            .col-3.flex.align-items-center.justify-content-end
              img(src='~/assets/icons/total-items-border.svg')
            .col-9
              span.font-semibold.text-base.mr-1 Total items:
              br
              span.font-semibold.text-primary {{ totalItem() }}
        .d-flex.col-12(class='md:col-4 lg:col-2')
          .grid.w-full.border__right
            .col-3.flex.align-items-center.justify-content-end
              img(src='~/assets/icons/total-fee.svg')
            .col-9
              span.font-semibold.text-base.mr-1 Total fee:
              br
              span.font-semibold.text-primary $ {{ Number(totalFee()).toLocaleString() }} /day
        .d-flex.justify-content-center.col-12(class='md:col-4 lg:col-2')
          Button.p-button-secondary.mr-2(
            label='Save draft',
            icon='pi pi-file-o',
            @click='saveReceipt(0)',
            :disabled='!activeAction',
            :class='{ "button-disabled": !activeAction }'
          )
          Button.p-button-secondary.mr-2(
            label='Back',
            @click='clearLocation()',
            v-if='activeSave'
          )
          Button(
            label='Next',
            @click='getLocationSuggest()',
            v-if='!activeSave',
            :disabled='!activeAction',
            :class='{ "button-disabled": !activeAction }'
          )
          Button(
            label='Save',
            @click='saveReceipt(1)',
            v-if='activeSave && activeAction'
          )
  Sidebar(
    :visible='isShowModalAddStock',
    :baseZIndex='1000',
    position='right',
    ariaCloseLabel='to'
  )
    StockAdd(
      @cancelAddStock='cancelAddStock',
      @addItem='addItem',
      :barcode='boxQrCode'
    )
  Sidebar(
    :visible='isShowFormAddSeller',
    :baseZIndex='1000',
    position='right',
    ariaCloseLabel='to'
  )
    FormAddSeller(
        @cancelCreateSeller='cancelCreateSeller',
        @createSeller='createSeller($event)',
        :email='generalInfo.seller'
    )
  Dialog(:visible.sync='isModalDelete', :modal='true')
    .confirm-dialog__content
      img(:srcset='"~/assets/images/confirm-delete.png"')
      h3.confirm-dialog__title Confirm delete box
      p.confirm-dialog__des
        slot(name='message')
      .confirm-dialog__footer
        Button.confirm-dialog__btn.btn--discard(@click='handleCancel') No
        Button.confirm-dialog__btn.btn--agree(@click='deleteBox()') Yes
</template>
<script lang="ts">
import { Component, namespace, Prop, Vue } from 'nuxt-property-decorator'
import { required } from 'vuelidate/lib/validators'
import ConfirmDialogCustom from '~/components/dialog/ConfirmDialog.vue'
import ItemDataTable from '~/components/stock-in/ItemDatatable.vue'
import FormAddSeller from '~/components/stock-in/FormAddSeller.vue'
import { Receipt as ReceiptModel } from '~/models/Receipt'
import { Stock as StockModel } from '~/models/Stock'
import { RECEIPT_ACTION, RECEIPT_STATUS } from '~/utils/constants/rececipt'
import { User } from '~/models/User'
const nsStoreStock = namespace('stock/stock-detail')
const nsStoreStockIn = namespace('stock-in/create-receipt')
const nsStoreWarehouse = namespace('warehouse/warehouse-list')
const nsStoreSeller = namespace('seller/seller-list')
const nsStoreBoxSize = namespace('box/box-size-list')
const nsStoreLocationList = namespace('location/location-list')
const nsStoreUser = namespace('user-auth/store-user')

@Component({
  components: {
    ConfirmDialogCustom,
    ItemDataTable,
    FormAddSeller
  },
  validations: {
    listBox: {
      $each: {
        inventoryFee: { required },
        boxSize: {
          id: { required }
        }
      }
    },
    generalInfo: {
      seller: { required }  
    },
    warehouse: { required }
  }
})
class CreateOrUpdateReceipt extends Vue {
  boxSize: number = 0
  listBox: ReceiptModel.Box[] = []
  isShowModalAddStock: boolean = false
  activeIndex = 0
  activeAction = false
  activeSave = false
  boxQrCode: string = ''
  isModalDelete = false
  note: string = ''
  receiptId = 0
  invalidBoxsize = false
  invalidInventoryFee = false
  generalInfo: {
    createdAt?: string
    seller?: any
  } = {
    createdAt: undefined,
    seller: undefined
  }

  activeInputSku: string = ''
  emailInvalid = false
  isSuggested = false

  @Prop() id?: string
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

  @nsStoreStockIn.State
  receiptDetail!: any

  @nsStoreUser.State
  user: User.Model | undefined

  warehouse: any = null
  seller: any = null
  sellerEmailError: any = null
  isShowFormAddSeller: boolean = false

  @nsStoreStock.State
  newStockDetail!: StockModel.CreateStock

  @nsStoreStock.State
  stockDetail!: any

  @nsStoreStockIn.State
  newReceipt!: any

  @nsStoreStockIn.State
  boxLocation!: ReceiptModel.BoxLocation[]

  @nsStoreLocationList.State
  locationList: {}

  @nsStoreStock.Action
  actGetStockByBarcode

  @nsStoreStockIn.Action
  actGetReceiptDetail

  @nsStoreStock.Action
  actCreateNewStock

  @nsStoreStockIn.Action
  actCreateNewReceipt

  @nsStoreStockIn.Action
  actUpdateReceipt

  @nsStoreStockIn.Action
  actLocationSuggestion

  @nsStoreLocationList.Action
  actLocationList!: (params: any) => Promise<void>

  addBox() {
    if (!this.checkActiveAction()) return
    const item: ReceiptModel.Box = new ReceiptModel.Box()
    item.index = this.listBox[this.listBox.length - 1].index + 1
    if (this.listBox.length < 10) {
      this.listBox.push(item)
      this.activeAction = false
    }
    this.activeIndex = this.listBox[this.listBox.length - 1].index
  }

  deleteBox() {
    if (this.listBox.length > 1) {
      this.listBox.splice(this.activeIndex, 1)
      this.selectBox(this.listBox[this.listBox.length - 1])
      this.isModalDelete = false
      this.checkActiveAction()
    }
  }

  async handleChangeSeller(e) {
    const params = { email: e.query }
    await this.actSellerList(params)
    if (this.sellerList.length === 0) {
      if(this.validateEmail()){
        this.isShowFormAddSeller = true
      } else {
        this.isShowFormAddSeller = false
      }
    }
  }

  showModalAddStock() {
    this.isShowModalAddStock = true
  }

  cancelAddStock() {
    this.isShowModalAddStock = false
  }

  cancelCreateSeller(){
    this.isShowFormAddSeller = false
  }

  createSeller(event){
    if(event){
      this.generalInfo.seller = {
        email : event.email,
        phoneNumber: event.phoneNumber,
        displayName: `${event.firstName} ${event.lastName}`,
        id: event.id
      }
    }

  }

  validateEmail() {
    if(this.generalInfo.seller.length>0)
    {
      if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(this.generalInfo.seller)) {
        this.emailInvalid = false
      } else {
        this.emailInvalid = true
      }
    }
    return !this.emailInvalid
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
        value: stockInformation.value,
        sku: stockInformation.sku,
        itemStatus: ''
      }
    ]
    this.listBox[this.activeIndex].listItemInBox?.push(...itemInBox)
    this.checkActiveAction()
    this.checkLocation()
    this.activeInputSku = stockInformation.barCode
  }

  selectBox(box) {
    this.activeIndex = box.index
  }

  handleCancel() {
    this.isModalDelete = false
  }

  // type=1: saved; type=0: save draft
  async saveReceipt(type) {
    if (!this.checkActiveAction()) return
    if (type === 1) {
      if (!this.checkValidateInput()) {
        return
      }
    }
    const receiptDraft: ReceiptModel.CreateReceiptDraft =
      new ReceiptModel.CreateReceiptDraft()
    receiptDraft.action = RECEIPT_ACTION.REQUEST_ACTION_TO_IMPORT_BOX
    receiptDraft.status =
      type === 0
        ? RECEIPT_STATUS.REQUEST_STATUS_DRAFT
        : RECEIPT_STATUS.REQUEST_STATUS_SAVED
    receiptDraft.note = this.note

    this.listBox.forEach((element) => {
      const box: ReceiptModel.BoxDraft = new ReceiptModel.BoxDraft()
      box.inventoryFee = element.inventoryFee
      if (element.boxSize!.id) {
        box.boxSize = {
          id: element.boxSize!.id
        }
      }
      element.listItemInBox?.forEach((item) => {
        const itemDraft: ReceiptModel.ItemDraft = new ReceiptModel.ItemDraft()
        itemDraft.stock.id = item.stock.id
        itemDraft.value = item.value
        itemDraft.sku = item.sku
        itemDraft.amount = item.amount
        box.listStockWithAmount?.push(itemDraft)
      })
      box.rackLocation.id = element.location!.id
      receiptDraft.seller.id = this.generalInfo.seller?.id
      if (this.warehouse) {
        receiptDraft.warehouse = {
          id: this.warehouse.id
        }
      }
      receiptDraft.boxList?.push(box)
    })
    if (this.id) {
      receiptDraft.id = this.id
      await this.actUpdateReceipt(receiptDraft)
      this.$toast.add({
        severity: 'success',
        summary: 'Success Message',
        detail:
          type === 0
            ? 'Successfully save draft receipt'
            : 'Successfully save receipt',
        life: 3000
      })
    } else {
      await this.actCreateNewReceipt(receiptDraft)
      if (this.newReceipt) {
        this.$toast.add({
          severity: 'success',
          summary: 'Success Message',
          detail:
            type === 0
              ? 'Successfully save draft receipt'
              : 'Successfully save receipt',
          life: 3000
        })
        this.generalInfo.createdAt = this.newReceipt.createdAt
      }
    }
    if (type === 1 && this.newReceipt.id) {
      await this.$router.push(`/stock-in/${this.newReceipt.id}/detail`)
    }
  }

  checkActiveAction() {
    this.activeAction = true
    this.activeAction = !!this.generalInfo.seller && !this.listBox.find(e => !e.listItemInBox.length)
    return this.activeAction
  }

  async getLocationSuggest() {
    if (!this.checkValidateBoxsize()) {
      return
    }
    const listBoxSize = this.listBox.map((element) => {
      return '' + element.boxSize?.id
    })
    await this.actLocationSuggestion(listBoxSize)
    this.isSuggested = true
    this.boxLocation.forEach((element) => {
      if (!this.listBox[element.index].location?.id) {
        this.listBox[element.index].location = { ...element }
      }
    })
    this.$toast.add({
      severity: 'success',
      summary: 'Success Message',
      detail: 'Location suggested',
      life: 3000
    })
    this.checkLocation()
  }

  async mounted() {
    await this.actWarehouseList()
    await this.actGetBoxSizeList()
    if (this.id) {
      await this.actGetReceiptDetail({ id: this.id })
      this.prepareListBox()
      this.checkActiveAction()
      this.checkLocation()
    } else {
      this.listBox = [new ReceiptModel.Box()]
    }
  }

  checkLocation() {
    this.listBox.forEach((element) => {
      this.activeSave = !(!element.location?.id || element.location.id === 0)
    })
  }

  clearLocation() {
    this.listBox.forEach((element, index) => {
      element.location = {
        id: 0,
        name: '',
        index
      }
    })
    this.activeSave = false
  }

  totalItem() {
    let total = 0
    this.listBox.forEach((element) => {
      total += element.listItemInBox.length
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

  async changeBarcode(event) {
    if (event.target.value.length === 13) {
      const item = this.listBox[this.activeIndex].listItemInBox.findIndex(
        (element) => {
          return element.stock.barCode === event.target.value
        }
      )
      if (item >= 0) {
        this.listBox[this.activeIndex].listItemInBox[item].amount++
        this.boxQrCode = ''
      } else {
        await this.actGetStockByBarcode({ barcode: event.target.value })
        const stock = this.stockDetail.data
        if (this.stockDetail.data) {
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
          this.activeInputSku = stockInformation.barCode
          this.boxQrCode = ''
        } else {
          this.boxQrCode = event.target.value
          this.showModalAddStock()
        }
      }
    }
  }

  async searchLocation(e) {
    await this.actLocationList({
      location: e.query
    })
  }

  changeItem(event) {
    if (event) {
      this.checkLocation()
    }
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
    this.note = this.receiptDetail.data.note
    this.activeIndex = 0
    this.seller = this.receiptDetail.data.seller
    this.generalInfo.seller = this.receiptDetail.data.seller
    this.generalInfo.createdAt = this.receiptDetail.data.createdAt
    this.warehouse = this.receiptDetail.warehouse
  }

  checkEnableLocation(box) {
    if (this.isSuggested && this.listBox[box.index].listItemInBox.length > 0) {
      return true
    } else return box.location?.id > 0
  }

  checkDeleteBox() {
    if (this.listBox.length < 2) {
      this.isModalDelete = false
    } else if (this.listBox[this.activeIndex].listItemInBox.length === 0) {
      this.deleteBox()
    } else {
      this.isModalDelete = true
    }
  }

  checkValidateBoxsize() {
    let isValid = true
    this.listBox.forEach((element, index) => {
      if (!element.boxSize!.id) {
        isValid = false
        this.activeIndex = index
      }
    })
    if (!isValid) {
      this.$toast.add({
        severity: 'error',
        summary: 'Error Message',
        detail: 'You must select box size',
        life: 3000
      })
    }
    return isValid
  }

  selectedItem() {
    this.checkActiveAction()
  }

  checkValidateInput() {
    this.$v.generalInfo.seller?.$touch()
    this.$v.warehouse?.$touch()
    this.$v.listBox.$each?.$touch()
    if (this.$v.listBox.$invalid) {
      this.activeIndex = this.listBox.find((element) =>{
        return this.$v.listBox.$each![element.index]?.$invalid
      })!.index
      return false
    }
    return true
  }

  clearItem() {
    this.generalInfo.seller = undefined
    this.emailInvalid = false
    this.checkActiveAction()
  }
}

export default CreateOrUpdateReceipt
</script>
<style lang="sass" scoped>
.receipt-note
  .p-inputtext
    box-shadow: none
  .pi
    color: #1838BD !important
  .d-flex
    @include flex-center-vert
  .box-input
    background-color: $text-color-300 !important
  .number-input
    width: 30%
    ::v-deep.p-inputnumber-input
      background: $text-color-300 !important
      width: 30%
  .box-retangle
    background: $color-white
    border-radius: 3px
    width: 1px
  .border
    &__grid
      border: solid 1px $text-color-400
      border-right: none
    &__right
      border-right: solid 1px $text-color-400
    &__left
      border-left: solid 1px $text-color-400
    &__top
      border-top: solid 1px $text-color-400
    &__bot
      border-bottom: solid 1px $text-color-400
  .card-custom
    ::v-deep.p-datatable
      height: 53vh
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
    background: $primary
    color: $color-white !important
    button
      color: $color-white !important
  .box-card-active .icon
    background-color: $color-white !important
  .box-card-active .icon--large
    background-color: $color-white !important
  .box-card:hover
    @extend .box-card-active
.confirm-dialog
  ::v-deep.p-dialog
    font-family: $font-family-primary !important
    border-radius: 8px !important
    overflow: hidden
    border: none
    max-width: 300px
  ::v-deep.p-dialog-header
    display: none !important
  ::v-deep.p-dialog-content
    padding: 0
  &__content
    text-align: center
    padding: 48px 16px 16px 16px
    img
      object-fit: contain
      max-width: 100%
  &__title
    margin-top: 16px
    margin-bottom: 0
    color: $text-color-900
    font-weight: $font-weight-bold
    font-size: $font-size-medium !important
    line-height: calc(24 / 16)
  &__des
    margin-top: 12px
    margin-bottom: 0
    color: $text-color-700
    font-weight: $font-weight-regular
    font-size: $font-size-small !important
    line-height: calc(20 / 12)
  &__footer
    margin-top: 32px
    display: flex
    gap: 0 8px
    justify-content: center
  &__btn
    padding: 12px 32px
    color: $text-color-900
    font-size: 14px
    font-weight: 400
    line-height: calc(24 / 14)
    border-radius: 4px
    cursor: pointer
    min-width: 130px
    outline: none
    border: none
    display: flex
    align-items: center
    justify-content: center
  &__btn:focus
    box-shadow: none !important
  &__btn:hover
    background-color: $primary !important
  &__btn.btn--discard
    background-color: $bg-body-base
  &__btn.btn--agree
    background-color: $primary
    color: #fff
.error-message
  color: #ff0000
.button-disabled
  background-color: #979AA4 !important
  border-color: #979AA4 !important
::v-deep.filter__item .p-autocomplete-input
  width: 150px !important
::v-deep.grid
  margin: 0 !important
</style>
