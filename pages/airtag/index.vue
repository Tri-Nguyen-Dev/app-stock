<template lang="pug">
.airtag
  .airtag__header
    div
      h1.text-heading Airtag
      span.text-subheading Total {{ airtagTotal }} Airtags
    .header__action
      Button.btn.btn-primary()
        .icon.icon-add-items
        span Add Airtag

  .grid.grid-nogutter.flex-1.relative.overflow-hidden.m-h-700
    .col.h-full.absolute.top-0.left-0.right-0.bg-white
      DataTable(
        @sort='sortData($event)',
        :value='airtagList',
        :rowClass="rowClass"
        responsiveLayout='scroll',
        :class='{ "table-wrapper-empty": !airtagList || airtagList.length <= 0 }',
        dataKey='id',
        :rowHover='true'
      )
        Column(
          selectionMode='multiple',
          :styles='{ width: "1%" }',
          :headerClass='classHeaderMuti'
        )
        Column(field='displayOrder', header='NO', :styles='{ width: "1%" }')
          template(#body='{ index }')
            span.grid-cell-center.airtag__table-no.text-white-active.text-900.font-bold {{ getIndexPaginate(index) }}
        Column(header='Barcode' field='barCode' :sortable="true" headerClass="grid-header-left")
            template(#body='{ data }')
              .airtag__table-barcode.grid-cell-left {{ data.barCode }}
        Column(field='status' header="Status" headerClass="grid-header-right")
            template(#body='{ data }')
              div.grid-cell-right
                span.table__status.table__status--available(v-if="data.status === 'AIRTAG_STATUS_AVAILABLE'") Available
                span.table__status.table__status--disable(v-if="data.status === 'AIRTAG_STATUS_DISABLE' ") Disable
        Column(field='action', header='action', :styles='{ width: "5%" }')
          template(#body='{ data }')
            .table__action(:class="{'action-disabled': data.status === 'AIRTAG_STATUS_DISABLE'}")
              span.action-item(@click='')
                .icon.icon-edit-btn
              span.action-item(@click.stop='')
                .icon.icon-btn-delete
        template(#footer)
          Pagination(
            type='items selected',
            :paging='paging',
            :total='Number(airtagTotal)',
            @onPage='onPage'
          )
        template(#empty)
          .table__empty
            img(:srcset='`${require("~/assets/images/table-empty.png")} 2x`')
            p.empty__text List is empty!, Click
              span &nbsp;here
              span() &nbsp;to add item.

</template>

<script lang="ts">
import { Component, Vue, namespace } from 'nuxt-property-decorator'
import ConfirmDialogCustom from '~/components/dialog/ConfirmDialog.vue'
import { Paging } from '~/models/common/Paging'
import Pagination from '~/components/common/Pagination.vue'
import {
  PAGINATE_DEFAULT,
  calculateIndex,
  resetScrollTable
} from '~/utils'
const nsAirtagList = namespace('airtag/Airtag')

@Component({
  components: {
    ConfirmDialogCustom,
    Pagination
  }
})
class Airtag extends Vue {
  paging: Paging.Model = { ...PAGINATE_DEFAULT, first: 0 }
  onEventDeleteList: any = []
  desc: boolean | null = null
  isModalDelete: boolean = false
  showModalCreate: boolean = false
  showModalUpdate: boolean = false
  airtagData: any = []

  @nsAirtagList.State
  airtagList!: any

  @nsAirtagList.State
  airtagTotal!: any

  @nsAirtagList.Action
  actAirtagList!: (params: any) => Promise<void>

  @nsAirtagList.Action
  actDeleteairtagByIds!: (params: any) => Promise<any>

  get checkAirtagDisable() {
    return this.airtagList.every(
      (item) => item.status === 'AIRTAG_STATUS_DISABLE'
    )
  }

  getParamAPi() {
    return {
      pageNumber: this.paging.pageNumber,
      pageSize: this.paging.pageSize,
      desc: this.desc
    }
  }

  async getAirtagList() {
    await this.actAirtagList(
      this.getParamAPi() )
  }

  get classHeaderMuti() {
    return !this.airtagList ||
      this.airtagList.length <= 0 ||
      this.checkAirtagDisable
      ? 'checkbox-disable'
      : ''
  }

  getIndexPaginate(index: number) {
    return calculateIndex(index, this.paging.pageNumber, this.paging.pageSize)
  }

  rowClass(data: any) {
    return data.status === 'STOCK_STATUS_DISABLE' ? 'row-disable' : ''
  }

  sortData(e: any) {
    resetScrollTable()
    const { sortOrder } = e
    if (sortOrder) {
      this.desc = sortOrder !== 1
    } else {
      this.desc = null
    }
    this.getAirtagList()
  }

  async onPage(event: any) {
    resetScrollTable()
    this.paging.pageSize = event.rows
    this.paging.pageNumber = event.page
    await this.getAirtagList()
  }

  mounted() {
    this.getAirtagList()
  }
}
export default Airtag
</script>

<style lang="sass">
.airtag
  @include flex-column
  @include mobile
    min-height: calc(100vh - 32px)
  @include tablet
    min-height: calc(100vh - 32px)
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
    flex-wrap: wrap
    gap: 10px 16px
    @include desktop
      @include flex-center
      flex-direction: row
      margin-top: 0
.airtag__table
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
</style>
