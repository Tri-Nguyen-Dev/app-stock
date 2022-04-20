<template lang="pug">
  .receipt-note
    card.mb-5
      template(#title='')
        div.d-flex
          i.pi.pi-info-circle.mr-3
          span.font-semibold.text-base GENERAL INFORMATION
      template(#content='') GENERAL INFORMATION
    card.card-custom
      template(#content='')
        .grid
          .col-1
            span Listbox
          .col-11
            .grid.border-grid
              div(class='d-flex col-4 md:col-2 lg:col-1 d-flex border-right')
                span.uppercase.mr-1 item in box 1
                i.pi.pi-refresh
              div(class='d-flex col-12 md:col-5 lg:col-4 border-right')
                span.font-semibold.text-base.mr-3.ml-3 Size
                Dropdown.box-input(style='width:70%' :options ='listSizes'  optionLabel="text" placeholder="Select size" v-model='boxSize' )
                span.font-semibold.text-base.ml-3 (cm)
              div(class='d-flex col-12 md:col-5 lg:col-4 border-right pt-4 pb-4')
                span.font-semibold.text-base.mr-1.ml-2 Estimate Inventory Fee:
                InputNumber.number-input
                span.font-semibold.text-base.ml-3 /day
              div(class='d-flex col-12 md:col-5 lg:col-3 justify-content-center' )
                Button(type='button' icon='pi pi-refresh' style = 'width: 80%' @click='showModalAddStock') Scan Barcode
            .grid.border-grid.border-right.mt-0(style='border-top:none; margin-right:0px')
              ItemDataTable()
    Toast
    Sidebar(:visible='isShowModalAddStock' :baseZIndex="1000" position="right" ariaCloseLabel='to')
      StockAdd(@cancelAddStock='cancelAddStock' @addItem='addItem')
</template>
<script lang="ts">
import { Component, namespace, Vue } from 'nuxt-property-decorator'
import ConfirmDialogCustom from '~/components/dialog/ConfirmDialog.vue'
import ItemDataTable from '~/components/stock-in/ItemDatatable.vue'
const nsStoreStockIn = namespace('stock-in/create-receipt')

@Component({
  components: {
    ConfirmDialogCustom,
    ItemDataTable
  }
})
class Stock extends Vue {
  tabItem :{
    id: number,
    index: number
    header: string
  }

  boxSize: number = 0;
  listBox=[{
    id: 0,
    index: 0,
    title:'Box 1'
  }];

  listItemInBox: any[] = []
  isShowModalAddStock: boolean = false
  activeIndex = 0

  @nsStoreStockIn.Action
  actGetReceiptDetail

  addBox(){
    const item = {
      id:this.listBox[this.listBox.length-1].id+1,
      index: this.listBox[this.listBox.length-1].id+1,
      title: 'Box ' + (this.listBox.length+1)
    }
    this.listBox.push(item)
    this.activeIndex = this.listBox[this.listBox.length-1].id
  }

  deleteBox(){
    if(this.listBox.length>1){
      this.listBox.splice(this.listBox.length-1,1)
      this.activeIndex = this.listBox[this.listBox.length-1].id
    }
  }

  showModalAddStock() {
    this.isShowModalAddStock = true
  }

  cancelAddStock() {
    this.isShowModalAddStock = false
  }

  addItem(stockInformation:any) {
    this.isShowModalAddStock = false
    this.listItemInBox.push(stockInformation)
  }

  //  async mounted() {
  //   await this.actGetReceiptDetail({ id: this.$route.params.sid })
  // }
}
export default Stock
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
    background:  #F1F3F6 !important
    width: 30%
.box-retangle
  background: #FFFFFF
  border-radius: 3px
  width: 1px
.border-grid
  border: solid 1px #E8EAEF
  border-right: none
.border-right
  border-right: solid 1px #E8EAEF
.border-left
  border-left: solid 1px #E8EAEF
.border-top
  border-top: solid 1px #E8EAEF
.border-bot
  border-bottom: solid 1px #E8EAEF
.card-custom
  ::v-deep.p-card-body
    padding: 0 !important
    .p-card-content
      padding: 0 !important
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
</style>
