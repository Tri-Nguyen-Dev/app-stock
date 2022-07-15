<template lang="pug">
  .box-size
    .box-size__header
      div 
        h1.text-heading Box Size
        span.text-subheading 4 types found
      .header__action
        .header__search
          .icon.icon--left.icon-search
          InputText(type='text' placeholder='Search')
        Button.btn.btn-primary
          span Add Box Size
    .grid.grid-nogutter.flex-1.relative.overflow-hidden.m-h-700
      .col.h-full.absolute.top-0.left-0.right-0.bg-white
        DataTable(
          dataKey='id'
          :rowHover='true'
          responsiveLayout='scroll'
          :value='boxSizeList'
        )
          Column(
            selectionMode='multiple'
            :styles="{'width': '1%'}"
          )
          Column(field='no' header='NO' :styles="{'width': '1%'}" )
            template(#body='{ index }')
              span.grid-cell-center.warehouse__table-no.text-white-active.text-900.font-bold {{ getIndexPaginate(index) }}
          Column(header='Name' field='name' headerClass="grid-header-center")
            template(#body='{ data }')
              div.grid-cell-left {{ data.name }}
          Column(header='Height'  field='height' headerClass="grid-header-center")
            template(#body='{ data }')
              div.grid-cell-left {{ data.height }}
          Column(header='Width'  field='width' headerClass="grid-header-center")
            template(#body='{ data }')
              div.grid-cell-left {{ data.width }}
          Column(header='Length'  field='length' headerClass="grid-header-center")
            template(#body='{ data }')
              div.grid-cell-left {{ data.length }}
          Column(field='action' header="action" :styles="{'width': '2%'}")
            template(#body='{ data }')
              .table__action(:class="{'action-disabled': data.stockStatus === 'STOCK_STATUS_DISABLE'}")
                span.action-item(@click.stop="handleEditWarehouse([data])")
                  .icon.icon-edit-btn
                span.action-item(@click.stop="showModalDelete([data])" )
                  .icon.icon-btn-delete
          template(#footer)
            Pagination(
              type="items selected"
              :paging="paging"
              :total="total"
              :deleted-list="selectedItem"
              @onDelete="showModalDelete"
              @onPage="onPage")
          template(#empty)
            div.table__empty
              img(:srcset="`${require('~/assets/images/table-empty.png')} 2x`" v-if="!boxSizeList")
              img(:srcset="`${require('~/assets/images/table-notfound.png')} 2x`" v-else)
              p.empty__text(v-if="!boxSizeList") List is empty!, Click
                span &nbsp;here
                span(@click="") &nbsp;to add item.
              p.notfound__text(v-else) Item not found!
    ConfirmDialogCustom(
      title="Confirm delete"
      image="confirm-delete"
      :isShow="isModalDelete"
      :onOk="handleDeleteWarehouse"
      :onCancel="handleCancel"
      :deleted-list="selectedItem"
      :loading="loadingSubmit"
    )
      template(v-slot:message)
        p {{ deleteMessage }}
    Toast
</template>
<script lang="ts">
import { Component, Vue, namespace } from 'nuxt-property-decorator'
import ConfirmDialogCustom from '~/components/dialog/ConfirmDialog.vue'
import { BoxSize as BoxSizeModel } from '~/models/BoxSize'
import {
  LIMIT_PAGE_OPTIONS,
  PAGINATE_DEFAULT
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
class BoxSize extends Vue {
  loading: boolean = false
  isModalDelete: boolean = false
  loadingSubmit: boolean = false
  limitOptions = LIMIT_PAGE_OPTIONS
  enablePack = false
  selectedItem: any[] = []
  paging: Paging.Model = { ...PAGINATE_DEFAULT, first: 0 }

  // -- [ state ]---------------------------------------------
  @nsStoreBoxSize.State
  boxSizeList!: BoxSizeModel.Model[]

  @nsStoreBoxSize.Action
  actBoxSizeList!: () => Promise<void>
  // --[ getter ] --------------------------------------------

  // -- [functions] ------------------------------------------
  async getBoxSizeList() {
    await this.actBoxSizeList()
    // eslint-disable-next-line no-console
    console.log(this.boxSizeList)
    
  }
}
export default BoxSize
</script>
<style lang="sass" scoped>
.box-size
  @include flex-column
  @include desktop
    height: calc(100vh - 32px)
  &__header
    flex-direction: column
    flex-wrap: wrap
    margin-bottom: 24px
    @include desktop
      flex-direction: row
      @include flex-center-space-between
  .header__action
    display: flex
    margin-top: 12px
    @include flex-column
    flex-wrap:  wrap
    gap: 10px 16px
    @include desktop
      @include flex-center
      flex-direction: row
      margin-top: 0
</style>