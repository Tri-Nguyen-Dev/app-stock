<template lang="pug">
  .receipt-note
    card.mb-5
      template(#title='')
        div.d-flex
          i.pi.pi-info-circle.mr-3
          span.font-semibold.text-base GENERAL INFORMATION
      template(#content='') GENERAL INFORMATION
    card
      template(#title='')
        div.grid
          .col-10.d-flex
            i.pi.pi-list.mr-2
            span.font-semibold.text-base LIST BOX
          .col-2.d-flex.justify-content-end
              Button.p-button-primary.p-button-rounded.p-button-text(type ='button' icon="pi pi-plus" @click='addBox()')
              Button.p-button-danger.p-button-rounded.p-button-text(type ='button' icon="pi pi-trash" @click='deleteBox()')
      template(#content='')
        TabView(:active-index="activeIndex" @tab-click='tabClick($event)')
          TabPanel(
            v-for='(attr, index) in listBox' v-bind:data='attr'  v-bind:key='attr.id'
          )
            template(#header='')
              .icon.icon-box-view.bg-blue-700.mr-2
              span.font-semibold.text-base {{attr.title}}
            .grid.background-primary.text-white
              .col-fixed.col-fixed-pading(style="width:60px")
                Button.bacground-input.refresh-padding(type='button' icon='pi pi-refresh')
              .col.d-flex
                label.mr-1 Size
                InputText.box-input(style='width = 20%')
                InputText.box-input(style='width = 20%' value="L:")
                InputText.box-input(style='width = 20%')
                InputText.box-input(style='width = 20%')
                Button.bacground-input(type='button' icon='pi pi-plus' @click='showModalAddStock')
    Toast
    Sidebar(:visible='isShowModalAddStock' :baseZIndex="1000" position="right" ariaCloseLabel='to')
      StockAdd(@cancelAddStock='cancelAddStock' @addStock='addStock')
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import ConfirmDialogCustom from '~/components/dialog/ConfirmDialog.vue'
@Component({
  components: {
    ConfirmDialogCustom
  }
})
class Stock extends Vue {
  tabItem :{
    id: number,
    index: number
    header: string
  }

  listBox=[{
    id: 0,
    index: 0,
    title:'Box 1'
  }
  ];

  isShowModalAddStock: boolean = false
  activeIndex = 0;

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

  addStock() {
    this.isShowModalAddStock = false
  }
}
export default Stock
</script>
<style lang="sass" scoped>
.pi
  color: #1838BD !important
.d-flex
  @include flex-center-vert
::v-deep.p-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link
  background: #ffffff
  border-color: #486AE2
::v-deep.p-tabview .p-tabview-nav li .p-tabview-nav-link
  border: solid #dee2e6
  border-width: 0 0 2px 0
  border-color: transparent transparent #dee2e6 transparent
  background: #ffffff
  padding: 1.25rem
  font-weight: 700
  border-top-right-radius: 6px
  border-top-left-radius: 6px
  transition: box-shadow 0.2s
  margin: 0 0 -2px 0
.box-input
  background: rgba(255, 255, 255, 0.15)
  color: $color-white
  margin-right: 7px
  border: 0
.bacground-input
  background: rgba(255, 255, 255, 0.15)
.refresh-padding
  padding-top: 14px
  padding-bottom: 17px
  padding-left: 23px
  padding-right: 23px
.col-fixed-pading
  padding: 0
::v-deep.p-sidebar.p-sidebar-active
  width: 25rem
  display: flex
  .p-sidebar-header
    display: none
  .p-sidebar-content
    flex: 1
    padding: 0
</style>
