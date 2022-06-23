<template lang="pug">
  .grid.grid-nogutter.packing__detail--container
    .packing__detail--left.col-3.surface-0.border-round.h-full.overflow-y-auto
      StockTakeNoteInfo(:info='stockTakeInfo')
      .grid.wapprer-unit.ml-4.mr-4
        .col-2.flex.align-items-center.justify-content-center
          .icon--large.bg-blue-700(class='icon-note')
        .col-10.flex.flex-column.justify-content-center
          div.font-normal.text-700.text-base Note
          Textarea.text-lg(:value='note' placeholder='Write something...' rows='2' cols=30)
    .col-9.packing__detail--left.pl-4.pr-1.flex-1
      .grid
        .col-4
          h2.text-heading List box
        .col-8.btn-right
          Button.p-button-outlined.p-button-primary.bg-white.w-25(
            type='button',
            label='Add box',
            @click='addBox'
            :disabled ='disabledAddBox'
          )
          Button.p-button-outlined.p-button-primary.bg-white.w-25(
            type='button',
            label='Save',
            @click='saveStockTake'
          )
      .col-12(style='height: 90vh')
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
            field='sellerEmail',
            header='SELLER EMAIL',
            className='w-3',
          )
          Column(
            field='rackLocation.name',
            header='LOCATION',
            :sortable='true',
            sortField='_rackLocation.name'
          )
            template(#body='{ data }')
              div(v-if='data.location')
                .flex.align-items-center.cursor-pointer
                  span.font-bold {{ data.location }}
          Column(
            field='id',
            header='ACTION',
            :styles="{'width': '2%'}"
          )
            template(#body='{ data}')
              .table__action.justify-content-center
                span.action-item(@click.stop="removeBox(data)")
                  .icon.icon-btn-delete
          template(#empty)
            .flex.align-items-center.justify-content-center.flex-column
              img(:srcset='`${require("~/assets/images/table-notfound.png")} 2x`')
              p.text-900.font-bold.mt-3 Add box!
    Dialog(:visible.sync='showModal', :modal='true' :contentStyle='{"background-color": "#E8EAEF;", "width": "80vw", "padding-bottom":"5px"}' @hide='hideDialog()')
        template(#header)
          h1.text-heading Select Box
        BoxDataTable(@selectBox='selectBox($event)' :box='boxShow')
        template(#footer)
          Button.p-button-secondary(label="Close" icon="pi pi-times" @click="showModal = false;disabledApply = true")
          Button.p-button-primary(label="Apply" icon="pi pi-check" :disabled='disabledApply'  @click="applyBox()")
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
  boxSelected: any
  disabledApply = true
  paging: Paging.Model = { pageNumber:0, pageSize:10, first: 0 }
  note = ''
  disabledAddBox= false
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

  get breadcrumbItem() {
    return [
      { label: 'Stock take Box', to: '/stock-take/box/create', icon: 'pi pi-info-circle' }
    ]
  }

  showModal = false
  addBox() {
    this.showModal = true
  }

  async  saveStockTake() {
    const listBox = this.boxShow.map(element =>{
      return {
        boxCode: element.id
      }
    })
    if(listBox.length===0) {
      return
    }
    const data = {
      note: this.note,
      checkType: 'BOX',
      stockTakeBox: listBox,
      wareHouse: this.user?.warehouse? { id: this.user?.warehouse.id } : undefined,
      status: STOCK_TAKE_STATUS.NEW
    }
    await this.actCreateStockTake(data)
    if(this.stockTakeCreated.id){
      this.$toast.add({
        severity: 'success',
        summary: 'Success Message',
        detail: 'Successfully create stock take',
        life: 3000
      })
      this.$router.push(`/stock-take/box/${this.stockTakeCreated.id}/note-detail`)
    }
  }

  selectBox(event){
    this.boxSelected = event
    if(this.boxSelected.length>0){
      this.disabledApply = false
    } else {
      this.disabledApply = true
    }
  }

  hideDialog(){
    this.showModal = false
    this.stockTakeInfo.totalBox = this.boxShow.length
  }

  removeBox(data){
    this.boxShow.splice(this.boxShow.indexOf(data),1)
    this.stockTakeInfo.totalBox = this.boxShow.length
  }

  applyBox(){
    this.showModal = false
    this.boxShow = _.cloneDeep(this.boxSelected)
    this.$forceUpdate()
  }

  mounted() {
    this.stockTakeInfo.totalBox = 0
    this.stockTakeInfo.user = this.user
    if(this.listBoxTakeNote){
      this.stockTakeInfo.totalBox = this.listBoxTakeNote.length
      this.boxShow = this.listBoxTakeNote.map(element => {
        return {
          id:element.boxNote.box.id,
          sellerEmail: element.boxNote.box.request?.seller.email,
          rackLocation: element.boxNote.box.rackLocation
        }
      })
      this.disabledAddBox = true
    }
  }
}

export default DeliveryOrder
</script>
<style lang="sass" scoped>
.btn-right
  height: 70%
  text-align: right
.packing__detail--container
  height: calc(100vh - 32px)
.packing__detail--left
  height: calc( 100vh - 32px) !important
.w-25
  width: 25%
  margin-left: 7px
.wapprer-unit
  min-height: 72px
  border-radius: 4px
  background-color: $text-color-200
  .text-wrap
    word-break: break-all
  ::v-deep.p-inputtext
    border: none
    background: transparent
    padding: 0
    color: #000
    font-weight: 600
    box-shadow: none !important
    max-width: 100%
</style>
