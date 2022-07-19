<template lang="pug">
.airtag
  .airtag__header
    div
      h1.text-heading Airtag
      span.text-subheading Total {{ airtagTotal }} Airtags
    .header__action
      .btn__filter(:class="{'active': isShowFilter}")
          .btn-toggle(@click="isShowFilter = !isShowFilter")
            .icon.icon-filter(v-if="!isShowFilter")
            .icon.icon-chevron-up.bg-primary(v-else)
            span Filter
          .btn-refresh(@click="handleRefreshFilter")
            .icon.icon-rotate-left.bg-white
      Button.btn.btn-primary()
        .icon.icon-add-items
        span Add Airtag
  .grid.header__filter(:class='{ "active": isShowFilter }')
    .div(class="col-0 md:col-6")
    .div(class="col-12 md:col-3")
      FilterTable(
        title="Barcode"
        placeholder="Search barcode"
        name="barCode"
        :value="filter.barCode"
        :searchText="true"
        @updateFilter="handleFilter"
        :isShowFilter="isShowFilter"
      )
    .div(class="col-12 md:col-3")
        FilterTable(title="Status" :value="filter.status" :options="statusList" name="status" @updateFilter="handleFilter")

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
        :selection='selectedAirtag'
        @row-select-all="rowSelectAll"
        @row-unselect-all="rowUnSelectAll"
        @row-select="rowSelect"
        @row-unselect="rowUnselect"
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
              span.action-item(@click='showModalDelete([data])')
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
      ConfirmDialogCustom(
        title="Confirm delete"
        image="confirm-delete"
        :isShow="isModalDelete"
        :onOk="handleDeleteAirtag"
        :onCancel="handleCancel"
      )
        template(v-slot:message)
          p {{ deleteMessage }}
      Toast
</template>

<script lang="ts">
import { Component, Vue, namespace } from 'nuxt-property-decorator'
import ConfirmDialogCustom from '~/components/dialog/ConfirmDialog.vue'
import { Paging } from '~/models/common/Paging'
import Pagination from '~/components/common/Pagination.vue'
import { Airtag as AirtagModel } from '~/models/AirTag'
import {
  PAGINATE_DEFAULT,
  calculateIndex,
  resetScrollTable,
  getDeleteMessage,
  AirtagConstants
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
  isModalDelete: boolean = false
  showModalCreate: boolean = false
  showModalUpdate: boolean = false
  airtagData: any = []
  isShowFilter: boolean = false
  selectedAirtag: AirtagModel.Model[] = []
  statusList = AirtagConstants.AIRTAG_STATUS_OPTIONS
  filter: any = {
    name: null,
    barCode: null,
    status: null,
    desc: null
  }

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
      desc: this.filter.desc,
      barCode: this.filter.barCode,
      status: this.filter.status?.value
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
    return data.status === 'AIRTAG_STATUS_DISABLE' ? 'row-disable' : ''
  }

  sortData(e: any) {
    resetScrollTable()
    const { sortOrder } = e
    if (sortOrder) {
      this.filter.desc = sortOrder !== 1
    } else {
      this.filter.desc = null
    }
    this.getAirtagList()
  }

  async onPage(event: any) {
    resetScrollTable()
    this.paging.pageSize = event.rows
    this.paging.pageNumber = event.page
    await this.getAirtagList()
  }

  handleRefreshFilter() {
    const adminFilter = _.omit(_.cloneDeep(this.filter))
    for (const items in adminFilter) this.filter[items] = null
    this.getAirtagList()
  }

  handleFilter(e: any, name: string){
    this.filter[name] = e
    this.getAirtagList()
    this.selectedAirtag = []
  }

  debounceSearchCode = _.debounce((value) => {
    this.filter.barCode = value
    this.getAirtagList()
  }, 500)

  rowSelectAll({ data }) {
    this.selectedAirtag = _.union(this.selectedAirtag, data)
  }

  rowUnSelectAll() {
    this.selectedAirtag = _.differenceWith(
      this.selectedAirtag,
      this.airtagList,
      _.isEqual
    )
  }

  rowSelect({ data }) {
    this.selectedAirtag.push(data)
  }

  rowUnselect({ originalEvent, data }) {
    originalEvent.originalEvent.stopPropagation()
    this.selectedAirtag = _.filter(
      this.selectedAirtag,
      (AirTag: any) => AirTag.id !== data.id
    )
  }

  handleCancel() {
    this.isModalDelete = false
  }

  showModalDelete(data?: any) {
    this.onEventDeleteList = data
    this.isModalDelete = true
  }

  get deleteMessage() {
    return getDeleteMessage(this.onEventDeleteList, 'Airtag list')
  }

  async handleDeleteAirtag() {
    const id = _.map(this.onEventDeleteList, 'id')
    const result = await this.actDeleteairtagByIds(id[0])
    if (result) {
      this.isModalDelete = false
      this.$toast.add({
        severity: 'success',
        summary: 'Success Message',
        detail: 'Successfully deleted box',
        life: 3000
      })
      this.paging.first = 0
      this.paging.pageNumber = 0
      await this.actAirtagList({
        pageNumber: this.paging.pageNumber,
        pageSize: this.paging.pageSize
      })
    }
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
