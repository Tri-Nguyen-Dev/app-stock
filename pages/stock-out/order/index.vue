<template lang="pug">
.h-full.flex
  .bg-white.sub__tab
    Breadcrumb(:home="homeItem" :model="breadcrumbItem")
    div.sub__tab--scroll
      StockOutLabelCreate
  .ml-5.flex-1.overflow-hidden
    .grid.grid-nogutter.h-full.flex.flex-column
      .col-12.justify-content-between.flex
        div
          h1.text-heading Item list
          span.text-subheading {{ listItemsAdd.length }} product found
        div
          .btn.btn-primary(@click='handleSubmit')
            .icon.icon-add-items.surface-900.bg-white
            span.text-900.text-white.mr-3 Add Items For Delivery
      .col-12.flex-1
        DataTable.w-full.flex.flex-column.table__sort-icon.bg-white(
          :resizableColumns='true',
          :value='listItemsAdd',
          dataKey='id',
          :row-hover='true',
          responsiveLayout='scroll',
          :scrollable="false"
        )
          template(#empty)
            .flex.align-items-center.justify-content-center.flex-column
              img(:srcset='`${require("~/assets/images/table-empty.png")} 2x`')
              p.text-900.font-bold.mt-3 List is empty!
          column(field='no', header='NO')
            template(#body='slotProps')
              span.font-bold {{ slotProps.index + 1 }}
          column(field='image' header='IMAGE' :sortable='true' sortField='_id')
            template(#body='{data}')
              .stock__table__image.overflow-hidden
                img.h-2rem.w-2rem.border-round(
                  :src='data.image | getThumbnailUrl' alt='' width='100%' style='object-fit: cover;')
          column(field='barCode' header='BARCODE' :sortable='true' sortField='_stock.barCode')
            template(#body='{data}')
              span.text-primary {{ data.stock.barCode }}
          column(field='sku', header='SKU', sortable='', data-type='numeric')
            template(#body='{ data }')
              span.uppercase {{ data.sku }}
          column(field='stock.name', header='STOCK NAME', :sortable='true')
            template(#body='{ data }')
              span.font-bold.text-right {{ data.stock.name }}
          column(field='box.id', header='BOXCODE', :sortable='true')
            template(#body='{ data }')
              span.font-bold.text-right {{ data.stock.barCode }}
          column(field='amount' header='INVENTORY QUANTITY' bodyClass='text-bold' :sortable='true' :styles="{'width': '3%'}" sortField='_id')
          column(field='delivery' header='DELIVERY QUANTITY' bodyClass='text-bold' :sortable='true' :styles="{'width': '3%'}" sortField='_id')
            template(#body='{data}')
              span(v-if='isActive !== data.id ') {{ data.delivery }}
              InputNumber(
              v-model="data.delivery" 
              mode="decimal" 
              :min="0" 
              :max="data.inventory" 
              inputClass="w-full" 
              v-else ).w-7rem
          column(field='tag', header='TAG', headerClass='grid-header-center')
            template(#body='{ data }')
              .grid-cell-center
                Checkbox(v-model='data.tag', :binary='true', )
          column(
            :exportable='false',
            header='ACTION',
            className='p-text-right',
          )
            template(#body='{ data }')
              .table__action(v-if='isActive !== data.id')
                  Button.btn-action(
                    @click='editItem(data)'
                  )
                    .icon--small.icon-btn-edit
                  Button.btn-action(
                    @click='showModalDelete(data.id)',
                  )
                    .icon--small.icon-btn-delete
              .table__action(v-else)
                Button.btn-action(
                  @click='saveEditItem()'
                )
                  .icon--small.pi.pi-check.text-primary
                Button.btn-action(
                  @click='handleCancelEdit( data )'
                )
                  .icon--small.pi.pi-times.text-primary
          template( #footer  )
            .mr-4.flex.justify-content-end( v-if="listItemsAdd.length > 0" )
              Button( label='Cancel' @click='handleCancel' ).btn.btn__default.flex-initial
              Button( label='Submit' @click='handleSubmit' ).btn.btn__priamry.flex-initial
            .grid.grid-nogutter.ml-3( v-else )
              .flex.align-items-center.justify-content-center.pl-3
                img(src='~/assets/icons/note.svg')
              div.ml-4
                span.font-semibold.text-base.mr-1 Note:
                br
                InputText.pt-0.pl-0(
                  placeholder='Write something...',
                  style='border: none'
                  v-model='noteBox'
                )
</template>

<script lang="ts">
import { Component, Vue, namespace } from 'nuxt-property-decorator'
import { INFORMATION } from '~/utils'
import ConfirmDialogCustom from '~/components/dialog/ConfirmDialog.vue'
const nsStoreCreateOrder = namespace('stock-out/create-order')

@Component({
  components: { ConfirmDialogCustom }

})
class createOrder extends Vue {
  listItemsAdd: any = []
  isActive: string = ''
  tag: boolean
  delivery: string = ''
  noteBox: any = null 
  infomation = INFORMATION
  oldItem: any = null

  @nsStoreCreateOrder.State
  listInfor:any

  @nsStoreCreateOrder.State
  outGoingListStore:any

  @nsStoreCreateOrder.Action
  actGetCreateOrder!: (obj: any) => Promise<void>

  @nsStoreCreateOrder.Action
  actOutGoingList!: (obj: any) => Promise<void>

  @nsStoreCreateOrder.Action
  actDeliveryOrder!: (params: any) => Promise<void>

  get homeItem() {
    return { to: '/stock-out', icon: 'pi pi-list' }
  }

  get breadcrumbItem() {
    return [
      {
        label: 'Add new order',
        to: '/stock-out/create-order',
        icon: 'pi pi-info-circle'
      }
    ]
  }

  mounted() {
    this.listItemsAdd = _.cloneDeep(this.outGoingListStore)
    if(this.listItemsAdd.length > 0 ){
      _.forEach(this.infomation, function(obj){
        _.forEach(obj, function(o){
          if(_.has(o, 'disabled')) {
            _.set(o, 'disabled' , !o.disabled)
          }
        })
      })
    }
  }

  async createStockIn() {
    const note = this.noteBox
    const listInfoAdd = { ...this.infomation , note }
    this.$router.push('/stock-out/order/add-items')
    await this.actGetCreateOrder(
      _.cloneDeep(listInfoAdd)
    )
  }  

  editItem(data: any ) {
    this.isActive = data.id
    this.oldItem = _.cloneDeep(data)
  }

  async saveEditItem( ) {
    await this.actGetCreateOrder(
      _.cloneDeep(this.listItemsAdd))
    this.isActive = ''
  }

  async showModalDelete( data:any ) {
    this.listItemsAdd.splice(this.listItemsAdd.indexOf(data),1)
    await this.actGetCreateOrder(this.listItemsAdd)
  }

  async handleSubmit(){
    await this.createStockIn()
    const listReceiver = this.listInfor.receiver
    await this.actDeliveryOrder({
      seller: {
        id: this.listInfor.seller[1].value
      },
      receiverAddress: listReceiver[0].value,
      receiverEmail: listReceiver[1].value,
      receiverName: listReceiver[2].value,
      receiverPhone: listReceiver[3].value,
      dueDeliveryDate: null,
      estimatedDeliveryTime: null,
      warehouse: {
        id: this.listInfor.warehouse[0].warehouseId
      },
      driver: {
        id: null
      },
      deliveryItemList: []
    })
  }

  handleCancelEdit(data : any ){
    data.delivery = this.oldItem.delivery
    this.isActive = ''
  }

  async handleCancel(){
    await this.actGetCreateOrder(null)
    await  this.actOutGoingList(null)
  }

}

export default createOrder
</script>

<style lang="sass" scoped>
.sub__tab
  height: 100%
  min-width: 20rem
  border-radius: var(--border-radius)
.sub__tab--scroll
  background-color: #ffffff
  height: calc(100vh - 110px)
  overflow: auto
.btn-action
  border: none
  padding: 0
  height: 2rem 
  width: 2rem 
  justify-content: center
  background: var(--surface-200)
::v-deep.p-datatable
  .p-datatable-footer
    box-shadow: 0px 10px 45px rgba(0, 10, 24, 0.1)
    background-color: #ffffff
    border: none
    padding: 15px 0px
    width: 100%
  .btn
    border: none
    padding: 0px 25px 
    margin: 5px 10px 0px 
    &__priamry
      background-color: $primary
      font-weight: 700
    &__default
      background-color: var(--surface-200)
      color: $text-color-900
      font-weight: 700

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
</style>
