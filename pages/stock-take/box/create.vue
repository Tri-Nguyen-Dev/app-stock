<template lang="pug">
  .grid.grid-nogutter.packing__detail--container
    .packing__detail--left.col-3.surface-0.border-round.h-full.overflow-y-auto
      StockTakeNoteInfo(:info='stockTakeInfo')
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
      .col-12
        DataTable(
        :value='boxShow',
        responsiveLayout='scroll',
        dataKey='id',
        :rows='10',
        @sort='sortData($event)',
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
          template(#footer)
            Pagination(
              :paging='paging',
              :total='boxShow.length',
            )
          //- template(#empty)
          //-   .flex.align-items-center.justify-content-center.flex-column
          //-     img(:srcset='`${require("~/assets/images/table-notfound.png")} 2x`')
          //-     p.text-900.font-bold.mt-3 Add box!
    Dialog(:visible.sync='showModal', :modal='true' :contentStyle='{"background-color": "#E8EAEF;", "width": "80vw"}' @hide='hideDialog()')
        template(#header)
          h1.text-heading Select Box
        BoxDataTable(@selectBox='selectBox($event)' :box='boxShow')
        template(#footer)
          Button.p-button-secondary(label="Close" icon="pi pi-times" @click="showModal = false;disabledApply = true")
          Button.p-button-primary(label="Apply" icon="pi pi-check" :disabled='disabledApply'  @click="applyBox()")
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import ItemList from '~/components/stock-out/item/ItemList.vue'
import StockTakeNoteInfo from '~/components/stock-take/GeneralInfo.vue'
import BoxDataTable from '~/components/box/BoxDataTable.vue'
import { Paging } from '~/models/common/Paging'
import Pagination from '~/components/common/Pagination.vue'
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

  get breadcrumbItem() {
    return [
      { label: 'Stock take Box', to: '/stock-take/box/create', icon: 'pi pi-info-circle' }
    ]
  }

  showModal = false
  addBox() {
    this.showModal = true  
  }

  saveStockTake() {}

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
  height: calc( 100% - 32px) !important
.w-25
  width: 25%
  margin-left: 7px
</style>
