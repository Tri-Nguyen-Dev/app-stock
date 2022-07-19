<template lang="pug">
  .grid.grid-nogutter.packing__detail--container
    .packing__detail--left.col-3.surface-0.border-round.h-full.overflow-y-auto
      .order__packing--detail
      .packing__detail--header.border-bottom-1.border-gray-300
        Breadcrumb(:home='homeItem', :model='breadcrumbItem')
      .packing__detail--content.pl-4.pr-4
        .my-3.font-bold.flex.align-items-center
          span.uppercase.ml-1 note detail
        span.uppercase.font-bold.pl-1.mr-1(style='background-color: #00A469; color: #FFFFFF') new &nbsp;
      .grid.m-0.p-4(v-if='user')
        .col-12(className='lg:col-12 md:col-12 sm:col-12 py-3 px-2')
          StockUnit(title="Creator ID" :value="user.displayName" icon="icon-user-octagon")
        .col-12(className='lg:col-12 md:col-12 sm:col-12 py-3 px-2')
          StockUnit(title="Warehouse" :value="user.displayName" icon="icon-warehouse-info")
        .col-12(className='lg:col-12 md:col-12 sm:col-12 py-3 px-2')
          StockUnit(title="Total box" :value="100" icon="icon-total-inventory")
    .col-9.packing__detail--left.pl-4.pr-1.flex-1
      .grid
        .col-4
          h2.text-heading List box
        .col-8.btn-right
          Button.p-button-outlined.p-button-primary.bg-white.w-25(
            type='button',
            label='Add box',
            @click='addBox'
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
            sortField='_request.seller.email'
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
    Dialog(
      :visible.sync='showModal'
      :modal='true'
      :contentStyle='{"background-color": "#E8EAEF;", "width": "80vw", "padding-bottom":"5px"}'
      @hide='hideDialog()')
        template(#header)
          h1.text-heading Select Box
        BoxDataTable(@selectBox='selectBox($event)' :box='boxShow')
        template(#footer)
          Button.p-button-secondary(label="Close" icon="pi pi-times" @click="showModal = false;disabledApply = true")
          Button.p-button-primary(label="Apply" icon="pi pi-check" :disabled='disabledApply'  @click="applyBox()")
</template>

<script lang="ts">
import { Component, namespace, Vue } from 'nuxt-property-decorator'
import ItemList from '~/components/stock-out/item/ItemList.vue'
import StockTakeNoteInfo from '~/components/stock-take/GeneralInfo.vue'
import BoxDataTable from '~/components/box/BoxDataTable.vue'
import { Paging } from '~/models/common/Paging'
import Pagination from '~/components/common/Pagination.vue'
import { User } from '~/models/User'
const nsStoreCreateStockTake = namespace('stock-take/create-stock-take')
const nsStoreUser = namespace('user-auth/store-user')
@Component({
  components: {
    ItemList,
    StockTakeNoteInfo,
    BoxDataTable,
    Pagination
  }
})
class DeliveryOrder extends Vue {
  boxShow : any[] = []
  boxSelected: any
  disabledApply = true
  paging: Paging.Model = { pageNumber:0, pageSize:10, first: 0 }
  stockTakeInfo: {
    user?: any,
    totalBox?: number,
    wareHouse?: any
  } = { user: undefined,totalBox:0,wareHouse: undefined }

  @nsStoreCreateStockTake.State
  stockTakeCreated!: any

  @nsStoreCreateStockTake.Action
  actCreateStockTake!: (params?: any) => Promise<void>

  @nsStoreUser.State
  user: User.Model | undefined

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
        id: element.id
      }
    })
    if(listBox.length===0) {
      return
    }
    const data = {
      note: 'Note',
      checkType: 'BOX',
      boxList: listBox
    }
    await this.actCreateStockTake(data)
    if(this.stockTakeCreated.id){
      this.$toast.add({
        severity: 'success',
        summary: 'Success Message',
        detail: 'Successfully create stock take',
        life: 3000
      })
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
    this.boxShow = [...this.boxSelected]
    this.$forceUpdate()
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
::v-deep.order__packing--detail
  .p-breadcrumb
    .p-menuitem-link
      display: flex
      align-items: center
      .p-menuitem-icon
        display: block !important
        height: 100%
      .p-menuitem-text
        margin-left: 4px
  .packing__detail--content

    .p-tabview .p-tabview-nav li
      .p-tabview-nav-link
        background: #fff
        border: none
        box-shadow: none !important

    .p-tabview .p-tabview-panels
      background: #fff
      padding: 1.25rem 0 0 0

    .p-highlight .p-tabview-nav-link
      color: #000 !important
      border-bottom: 2px solid #486AE2 !important
</style>
