<template lang="pug">
Dialog.item-list-dialog(:visible.sync='showModal', :showHeader='false' :modal='true' :contentStyle='{"overflow-y": "none !important"}')
  .warehouse__header
    div
      h1.text-heading Warehouse List BoxSize
  .grid.grid-nogutter.flex-1.relative.overflow-hidden.m-h-700
    .dataTable-container
      .col.h-full.absolute.top-0.left-0.right-0.bg-white
      DataTable(
        dataKey='id'
        :rows='10'
        :rowHover='true'
        responsiveLayout='scroll'
        :value='dataRenderItems'
      )
        Column(field='no' header='NO' :styles="{'width': '1%'}" )
          template(#body='{ index }')
            span.grid-cell-center.warehouse__table-no.text-white-active.text-900.font-bold {{ getIndexPaginate(index) }}
        Column(header='Name' field='name'  )
          template(#body='{ data }')
            div.grid-cell-left {{ data.name }}
        Column(header='Height'  field='height' headerClass="grid-header-center")
          template(#body='{ data }')
            div.grid-cell-left {{ data.height }}
        Column(header='Width'  field='width' headerClass="grid-header-center")
          template(#body='{ data }')
            div.grid-cell-center {{ data.width }}
        Column(header='Length'  field='length' headerClass="grid-header-center")
          template(#body='{ data }')
            div.grid-cell-center {{ data.length }}
        Column(header='Set BoxSize'  field='setBoxSize' headerClass="grid-header-center")
          template(#body='{ data }')
            div.grid-cell-right 
              InputNumber.number-input( mode='decimal' showbuttons='' :min='0' :max='100')
        template(#footer)
          Pagination(
            type="items selected"
            :paging="paging"
            :total="total"
            @onPage="onPage")
  template(#footer)
    .field.col-12.modal-btn(class='md:col-9')
      Button.btn.btn-cancel(@click="$emit('close-modal')") Cancel
        span
      Button.btn.btn-primary
        span Save

</template>

<script lang="ts">
import { Component, namespace, Vue, Prop, Watch } from 'nuxt-property-decorator'
import ConfirmDialogCustom from '~/components/dialog/ConfirmDialog.vue'
import { BoxSize as BoxSizeModel } from '~/models/BoxSize'
import {
  PAGINATE_DEFAULT,
  calculateIndex
} from '~/utils'
import { Paging } from '~/models/common/Paging'
import Pagination from '~/components/common/Pagination.vue'
const nsStoreBoxSize = namespace('box-size/box-size')
@Component({
  components: {
    ConfirmDialogCustom,
    Pagination
  }
})

class SetBoxSize extends Vue {
  @Prop() isShowSetBoxSize!: any
  showModal = false
  paging: Paging.Model = { ...PAGINATE_DEFAULT, first: 0 }

  // -- [ state ]---------------------------------------------
  @nsStoreBoxSize.State
  boxSizeList!: BoxSizeModel.Model[]

  @nsStoreBoxSize.Action
  actBoxSizeList!: () => Promise<void>

  // --[ getter ] -----------------------------------------------
  get total() {
    return this.boxSizeList.length
  }

  getIndexPaginate(index: number) {
    return calculateIndex(
      index,
      this.paging.pageNumber,
      this.paging.pageSize
    )
  }

  onPage(event: any) {
    this.paging.pageSize = event.rows
    this.paging.pageNumber = event.page
  }

  get dataRenderItems() {
    const start = this.paging.pageSize * this.paging.pageNumber
    const end = start + this.paging.pageSize
    const result = this.boxSizeList.slice(start, end)
    return result
  }

  @Watch('isShowSetBoxSize')
  setShowModal(){
    this.showModal = this.isShowSetBoxSize
  }

  // -- [functions] ------------------------------------------
  async getBoxSizeList() {
    await this.actBoxSizeList()
  }

  async mounted() {
    await this.getBoxSizeList()
  }
}

export default SetBoxSize
</script>

<style lang="sass" scoped>
.item-list-dialog
  ::v-deep.p-dialog-content
    background-color: #E8EAEF
    width: 45vw
    padding-bottom: 5px
    overflow: hidden !important
    max-height: 100%
.warehouse__table
  border-radius: 4px
  flex: 1
  position: relative
  overflow: hidden
  &-no
    font-size: $font-size-medium
  &-barcode
    text-transform: uppercase
  ::v-deep.disable-button
    pointer-events: none
    background-color: $text-color-300
    .icon
      background-color: $text-color-500
.dataTable-container
  width: 100%
  height: 700px !important
.btn
  cursor: pointer
  border: none
.btn-cancel
  background-color: #5a6268
  color: $color-white
  padding-right: 0
.btn-cancel :hover
  background-color: $primary
  color: $text-color-100
.btn-primary
  width: 85px
.modal-btn
  display: flex
  align-items: flex-end
  justify-content: flex-end
  gap: 15px
  width: 100%
  margin-top: 5px
</style>