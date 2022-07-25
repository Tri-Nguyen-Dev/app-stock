<template lang="pug">
  .grid.flex.grid-nogutter.stock
    StockTakeNoteInfo(:info='stockTakeInfo' :homeItem='homeItem' :breadcrumbItem='breadcrumbItem')
    div.flex-1( class=' col-12  md:col-12  lg:col-7 xl:col-9' )
      .stock-takeItem.flex.flex-column
        .stock-takeItem__header
          div
            h1.text-heading Stock-take Note
            span.text-subheading All ({{ boxShow.length }})
          .stock-takeItem__header--action.flex
            Button.btn.btn-primary.border-0(@click='addBox' v-if='!disabledAddBox' :disabled="boxShow.length == 0" ) Add Box
            Button.btn.btn-primary.border-0(@click='saveStockTake') Save
        .stock-takeItem__content
          DataTable(
          :value='boxShow',
          responsiveLayout='scroll',
          dataKey='id',
          @sort='sortData($event)',
          :rows="10"
        )
            Column(field='no', header='NO'  :styles="{'width': '6%'}")
              template(#body='slotProps')
                .align-items-center
                  span.font-semibold {{ slotProps.index + 1 }}
            Column(
              field='id',
              header='BOX CODE',
              :sortable='true',
              bodyClass='font-semibold',
              sortField='_id'
            )
            Column(
              field='location',
              header='LOCATION',
              sortField='location'
            )
              template(#body="{data}")
                div(v-if="data.location")
                  .flex.align-items-center.cursor-pointer
                    span.text-primary.font-bold.font-sm.text-white-active {{ data.location }}
                    .icon.icon-arrow-up-right.bg-primary.bg-white-active
            Column(
              field='id',
              header='ACTION',
              :styles="{'width': '2%'}"
            )
              template(#body='{ data}')
                .table__action.justify-content-center
                  span.action-item(@click.stop="removeBox(data)")
                    .icon.icon-btn-delete
            template(#footer)
                .grid.grid-nogutter.stock-takeItem__footer
                  .col
                    div(style="padding-left: 10.5px") Note:
                    InputText.inputSearchCode.w-full(v-model='note' rows="1" cols="40" placeholder='Write something...')
            template(#empty)
              .flex.align-items-center.justify-content-center.flex-column
                img(:srcset='`${require("~/assets/images/table-notfound.png")} 2x`')
                p.text-900.font-bold.mt-3 Add box!
    Dialog.item-list-dialog(
      :visible.sync='showModal'
      :modal='true'
      :showHeader='false'
      :contentStyle='{"background-color": "#E8EAEF;", "width": "80vw", "padding-bottom":"5px"}'
      @hide='hideDialog()')
        BoxDataTable(@selectBox='selectBox($event)' :box='boxShow')
        template(#footer)
          Button.p-button-secondary(label="Close" icon="pi pi-times" @click="showModal = false;disabledApply = true")
          Button.p-button-primary(:label="prepareLableBtnAddStock" icon="pi pi-check" @click="applyBox()" v-if="boxSelected.length>0")
</template>

<script lang="ts">
import { Component, namespace, Prop, Vue } from 'nuxt-property-decorator'
import ItemList from '~/components/stock-out/item/ItemList.vue'
import StockTakeNoteInfo from '~/components/stock-take/GeneralInfo.vue'
import BoxDataTable from '~/components/box/BoxDataTable.vue'
import { Paging } from '~/models/common/Paging'
import Pagination from '~/components/common/Pagination.vue'
import { User } from '~/models/User'
import { STOCK_TAKE_STATUS } from '~/utils'
import StockUnit from '~/components/stock/StockUnit.vue'
const nsStoreUser = namespace('user-auth/store-user')
const nsStoreCreateStockTake = namespace('stock-take/create-stock-take')
const nsStoreReportList = namespace('report/report-list')
const nsStoreWarehouse = namespace('warehouse/warehouse-list')

@Component({
  components: {
    ItemList,
    StockTakeNoteInfo,
    BoxDataTable,
    Pagination,
    StockUnit
  }
})
class DeliveryOrder extends Vue {
  @Prop() id!: string
  boxShow : any[] = []
  boxSelected: any[] = []
  disabledApply = true
  paging: Paging.Model = { pageNumber:0, pageSize:10, first: 0 }
  note = ''
  disabledAddBox = false
  reportList: any[] | undefined
  stockTakeInfo: {
    user: User.Model | undefined,
    totalBox?: number,
    wareHouse?: any,
    status:string
  } = { user: undefined ,totalBox:0,wareHouse: undefined, status: 'NEW' }

  @nsStoreCreateStockTake.State
  stockTakeCreated!: any

  @nsStoreCreateStockTake.Action
  actCreateStockTake!: (params?: any) => Promise<void>

  @nsStoreUser.State
  user: User.Model | undefined

  @nsStoreReportList.State
  listBoxTakeNote!: any

  @nsStoreWarehouse.State
  warehouseSelected!: any

  @nsStoreReportList.Action
  actResetStockTake

  showModal = false
  addBox() {
    this.showModal = true
  }

  async saveStockTake() {
    const warehouse =  this.boxShow.find((element)=> {return element.warehouseId}  )
    const listBox = this.boxShow.map(element =>{
      return {
        boxCode: element.id
      }
    })
    if(listBox.length === 0) {
      return
    }
    const data = {
      note: this.note.trim(),
      checkType: 0,
      stockTakeBox: listBox,
      warehouse: { id: warehouse.warehouseId },
      status: STOCK_TAKE_STATUS.NEW,
      reportList: this.reportList
    }
    await this.actCreateStockTake(data)
    if(this.stockTakeCreated.id){
      this.$toast.add({
        severity: 'success',
        summary: 'Success Message',
        detail: 'Successfully create stock take',
        life: 3000
      })
      this.actResetStockTake()
      this.$router.push(`/stock-take/box/${this.stockTakeCreated.id}/note-detail`)
    }
  }

  selectBox(event){
    this.boxSelected = _.cloneDeep(event)
  }

  hideDialog(){
    this.showModal = false
    this.stockTakeInfo.totalBox = this.boxShow.length
    this.boxSelected = _.cloneDeep(this.boxShow)
  }

  removeBox(data){
    this.boxShow.splice(this.boxShow.indexOf(data),1)
    this.stockTakeInfo.totalBox = this.boxShow.length
    this.boxSelected = _.cloneDeep(this.boxShow)
  }

  applyBox(){
    if(_.size(this.boxSelected) > 1) {
      const warehouseFirstItem = _.get(this.boxSelected[0], 'warehouseId', null)
      const unsatisfactoryItem =  _.find(this.boxSelected, function(box) {
        return box?.warehouseId !== warehouseFirstItem
      })
      if(unsatisfactoryItem) {
        this.$toast.add({
          severity: 'error',
          summary: 'Error Message',
          detail: 'Item in different warehouse could not be added',
          life: 3000
        })
        return
      }
    }
    this.showModal = false
    this.boxShow = _.cloneDeep(this.boxSelected)
  }

  mounted() {
    this.stockTakeInfo.totalBox = 0
    this.stockTakeInfo.user = this.user
    this.stockTakeInfo.wareHouse = this.warehouseSelected?.name
    if(this.listBoxTakeNote && this.listBoxTakeNote.length > 0){
      this.stockTakeInfo.totalBox = this.listBoxTakeNote.length
      this.boxShow = this.listBoxTakeNote.map(element => {
        return {
          id:element.boxNote.box.id,
          sellerEmail: element.boxNote.box.request?.seller.email,
          location: element.boxNote.box.rackLocation.name,
          warehouseId: element.boxNote.box.request?.warehouse.id
        }
      })
      this.reportList = this.listBoxTakeNote.map(element => {
        return {
          id:element.id
        }
      })
      _.uniqBy(this.reportList, 'id')
      this.disabledAddBox = true
      this.$forceUpdate()
    }
  }

  get homeItem() {
    return { label: '', to: '/stock-take', icon: 'pi pi-list' }
  }

  get breadcrumbItem() {
    return [
      { label: 'Add new note', to: '/stock-take/box/create' }
    ]
  }

  get prepareLableBtnAddStock() {
    const length = _.size(this.boxSelected)
    let stockQuantity = ''
    if(length === 1 ) {
      stockQuantity = length + ' box'
    } else if(length > 1) {
      stockQuantity = length + ' boxes'
    }
    return `Add ${stockQuantity || 'stock'} to stock-take note`
  }
}

export default DeliveryOrder
</script>
<style lang="sass" scoped>
.stock
  @include tablet
  ::v-deep.sub-tab
    height: calc(100vh - 150px)
    overflow: hidden
    display: flex
    flex-direction: column
    @include desktop
      height: calc(100vh - 32px)
      max-width: 23rem
      overflow: hidden
    .sub--scroll
      display: flex
      align-items: center
      flex-direction: column
      flex: 1
      overflow: auto
      @include desktop
        overflow: auto
      @include tablet
        flex-direction: row
        justify-content: center
        align-items: baseline
        overflow: hidden

  ::-webkit-input-placeholder
    font-weight: normal

  ::-webkit-scrollbar
    width: 7px
    height: 7px
    background-color: #F5F5F5

  ::-webkit-scrollbar-track
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3)
    border-radius: 10px
    background-color: #F5F5F5

  ::-webkit-scrollbar-thumb
    border-radius: 10px
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3)
    background-color: #979AA4

.wrap-unit
  width: 300px
  margin-bottom: 16px

::v-deep.stock-takeItem
  min-height: calc(100vh - 32px)
  margin-top: 3rem
  @include desktop
    margin-top: 0px
    margin-left: 2rem
    height: calc(100vh - 32px)
  &__header
    flex-direction: column
    flex-wrap: wrap
    margin-bottom: 16px
    @include desktop
      flex-direction: row
      @include flex-center-space-between
    &--action
      margin-top: 12px
      display: flex
      @include flex-column
      flex-wrap:  wrap
      gap: 10px 16px
      @include desktop
        @include flex-center
        flex-direction: row
        margin-top: 0
  &__filter
    margin-bottom: $space-size-24
  &__content
    flex: 1
    border-radius: 4px
    position: relative
    overflow: hidden
  &__footer
    background: $color-white
    display: flex
    justify-content: space-between
    padding: 6px 8px
    align-items: center
.item-list-dialog
  ::v-deep.p-dialog-content
    background-color: #E8EAEF
    width: 80vw
    padding-bottom: 5px
    height: 85vh
    .pagination
      padding: 8px
  ::v-deep.pi-calendar:before
    content: url('~/assets/icons/calendar.svg')
  ::v-deep.p-calendar-w-btn
    .p-button
      background: none
      border: none
</style>
