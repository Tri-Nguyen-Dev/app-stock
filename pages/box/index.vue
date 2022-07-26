<template lang="pug">
.box-page-container.flex.flex-column
  .box__header
    div
      h1.text-heading Box list
      span.text-subheading(v-if="boxList") {{ totalItem }}
    .header__action
      .header__search
        .icon.icon--left.icon-search
        InputText(type="text" placeholder="Enter seller email" v-model="filter.sellerEmail" v-on:input="validateText")
      .btn__filter
        .btn-toggle(@click="isShowFilter = !isShowFilter")
          .icon(:class="isShowFilter ? 'icon-chevron-up' : 'icon-filter'")
          span Filter
        Button.btn-refresh(@click="handleRefeshFilter")
          .icon.icon-rotate-left.bg-white
      Button.btn.btn-primary(@click='routeLinkAddBox')
        .icon.icon-add-items
        span Add box
      Button.btn.btn-primary(@click='handleTransferBox')
        span Transfer box
  .grid.header__filter(:class='{ "active": isShowFilter }')
    div(class="col-12 md:col-3")
      FilterTable(
        title="Location"
        :value="filter.location"
        placeholder="Enter location"
        name="location"
        :searchText="true"
        @updateFilter="handleFilterBox"
      )
    div(class="col-12 md:col-3")
      FilterTable(
        title="Box Code"
        :value="filter.barCode"
        placeholder="Enter code"
        name="barCode"
        :searchText="true"
        @updateFilter="handleFilterBox"
        :isShowFilter="isShowFilter"
      )
    div(class="col-12 md:col-3")
      FilterCalendar(
        title="From"
        :value="filter.dateFrom"
        name="dateFrom"
        inputClass="border-0"
        dateFormat="dd-mm-yy"
        :showIcon="true"
        @updateFilter="handleFilterBox"
      )
    div(class="col-12 md:col-3")
      FilterCalendar(
        title="To"
        border="right"
        :value="filter.dateTo"
        name="dateTo"
        inputClass="border-0"
        dateFormat="dd-mm-yy"
        :showIcon="true"
        @updateFilter="handleFilterBox"
      )
  .grid.grid-nogutter.flex-1.relative.overflow-hidden.m-h-700
    .col.h-full.absolute.top-0.left-0.right-0.bg-white
      DataTable.w-full.table__sort-icon.h-full.flex.flex-column(v-if="boxList" :value="boxList" responsiveLayout="scroll"
      :selection="selectedBoxes" removableSort dataKey="id" :resizableColumns="true" :rows="20" :scrollable="false"
      :rowClass="rowClass" @sort="sortData($event)"
      :class="{ 'table-wrapper-empty': !boxList || boxList.length <= 0 }" @row-select-all="rowSelectAll"
      @row-unselect-all="rowUnSelectAll" @row-select="rowSelect" @row-unselect="rowUnselect")
        Column(selectionMode="multiple" :styles="{width: '3rem'}" :exportable="false" :headerClass="classHeaderMuti")
        Column(field="no" header="NO")
          template(#body="slotProps")
            span.font-semibold {{ (paging.pageNumber) * paging.pageSize + slotProps.index + 1 }}
        Column(field="id" header="BOX CODE" :sortable="true" bodyClass="font-semibold" sortField="_id")
          template(#body="{data}")
            NuxtLink.stock__table-name.text-white-active.text-base.text-900.text-overflow-ellipsis.overflow-hidden(:to="`/box/${data.id}`"
            class="no-underline hover:underline") {{ data.id }}
        Column(field="sellerEmail" header="SELLER EMAIL" :sortable="true" className="w-3" sortField="_request.seller.email")
        Column(field="createdAt" header="CREATED TIME" :sortable="true" className="text-right" sortField="_createdAt")
          template(#body="{data}") {{ data.createdAt | dateTime }}
        Column(field="usedCapacity" header="USED CAPACITY" className="text-right")
          template(#body="{data}") {{ data.usedCapacity | capacityPercent}}
        Column(field="attributes" header="SIZE(CM)" className="text-right" bodyClass="font-semibold" )
          template(#body="{data}")
            div(v-if='data.boxSize') {{ data.boxSize.length }} * {{ data.boxSize.width }} * {{ data.boxSize.height }}
        Column(field="TYPE" header="TYPE" className="text-right" bodyClass="font-semibold" )
          template(#body="{data}")
            div(v-if='data.boxSize') {{ data.boxSize.name }}
        Column(field="weight" header="WEIGHT(KG)" className="text-right" bodyClass="font-semibold")
          template(#body="{data}") {{ data.weight }}
        Column(field="rackLocation.name" header="LOCATION" :sortable="true" className="text-right" sortField="_rackLocation.name")
          template(#body="{data}")
            div(v-if="data.location")
              .flex.align-items-center.cursor-pointer.justify-content-end
                span.text-primary.font-bold.font-sm.text-white-active {{ data.location }}
                .icon.icon-arrow-up-right.bg-primary.bg-white-active
        Column(field="status" header="STATUS" className="text-right")
          template(#body="{data}")
            .flex.justify-content-end
              span.table__status.table__status--available(
                v-if="data.status === 'BOX_STATUS_AVAILABLE'"
              ) {{ data.status | boxStatus }}
              span.table__status.table__status--disable(
                v-else-if="data.status === 'BOX_STATUS_DISABLE'"
              ) {{ data.status | boxStatus }}
              span.table__status.table__status--draft(
                v-else-if="data.status === 'BOX_STATUS_DRAFT'"
                ) {{ data.status | boxStatus }}
              span.table__status.table__status--outgoing(v-else) {{ data.status | boxStatus }}
        Column(:exportable="false" header="ACTION" className="text-right")
          template(#body="{data}")
            .table__action(:class="{'action-disabled': (data.status === 'BOX_STATUS_DISABLE' || data.status === 'BOX_STATUS_OUTGOING')}")
              span.action-item(@click="handleEditBox(data.id)")
                .icon.icon-edit-btn
              span.action-item(:class="{'disable-button': selectedBoxFilter.length > 0}" @click="showModalDelete([data])")
                .icon.icon-btn-delete
        template(#footer)
          Pagination(
            type="boxes selected"
            :paging="paging"
            :total="totalBoxRecords"
            :deleted-list="selectedBoxFilter"
            @onDelete="showModalDelete"
            @onPage="onPage")
        template(#empty)
          div.flex.align-items-center.justify-content-center.flex-column
            img(:srcset="`${require('~/assets/images/table-empty.png')} 2x`" v-if="!isFilter")
            img(:srcset="`${require('~/assets/images/table-notfound.png')} 2x`" v-else)
            p.text-900.font-bold.mt-3(v-if="!isFilter") List is empty!, Click
              span.text-primary.underline.cursor-pointer(@click='routeLinkAddBox') &nbsp;here
              span &nbsp;to add item.
            p.text-900.font-bold.mt-3(v-else) Item not found!

    ConfirmDialogCustom(
      title="Confirm delete"
      image="confirm-delete"
      :isShow="isModalDelete"
      :onOk="handleDeleteStock"
      :onCancel="handleCancel"
      :loading="loadingSubmit"
    )
      template(v-slot:message)
        p {{ deleteMessage }}
    Toast
</template>

<script lang="ts">
import { Component, namespace, Vue } from 'nuxt-property-decorator'
import { Box } from '~/models/Box'
import ConfirmDialogCustom from '~/components/dialog/ConfirmDialog.vue'
import Pagination from '~/components/common/Pagination.vue'
import { Paging } from '~/models/common/Paging'
import { getDeleteMessage, PAGINATE_DEFAULT, resetScrollTable, getTotalQuantityLabel } from '~/utils'
const nsStoreBox = namespace('box/box-list')
const nsStoreWarehouse = namespace('warehouse/warehouse-list')
const nsStoreUser = namespace('user-auth/store-user')
const dayjs = require('dayjs')

@Component({
  components: {
    ConfirmDialogCustom,
    Pagination
  }
})
class BoxList extends Vue {
  selectedBoxes: Box.Model[] = []
  isModalDelete: boolean = false
  loadingSubmit: boolean = false
  onEventDeleteList: any = []
  isShowFilter = false
  paging: Paging.Model = { ...PAGINATE_DEFAULT, first: 0 }
  sortByColumn: string = ''
  isDescending: boolean|null = null
  boxCodeDelete: string = ''
  warehouseOption: any = []
  filter: any = {
    sellerEmail:  '',
    location: '',
    barCode: '',
    dateFrom: null,
    dateTo: null
  }

  @nsStoreBox.State
  boxList!: Box.Model[]

  @nsStoreBox.State
  totalBoxRecords!: number

  @nsStoreUser.State
  user: any | undefined

  @nsStoreWarehouse.State
  warehouseSelected!: any

  @nsStoreBox.Action
  actGetBoxList!: (params: any) => Promise<void>

  @nsStoreBox.Action
  actDeleteBoxById!: (params: {ids: string[]}) => Promise<any>

  @nsStoreBox.Action
  actAddTransferBox!: (params: {ids: string[]}) => Promise<any>

  async mounted() {
    if(this.warehouseSelected) {
      await this.actGetBoxList(this.getParamAPi())
    }
  }

  // -- [ Getters ] -------------------------------------------------------------
  get isFilter(){
    const params = _.omit(this.getParamAPi(), ['pageNumber', 'pageSize', 'warehouseId'])
    return Object.values(params).some((item) => item)
  }

  get selectedBoxFilter() {
    return  _.filter(this.selectedBoxes, ({ status }) => {
      return status !== 'BOX_STATUS_DISABLE' && status !== 'BOX_STATUS_OUTGOING'
    })
  }

  get deleteMessage() {
    return getDeleteMessage(this.onEventDeleteList, 'box')
  }

  get classHeaderMuti() {
    return !this.boxList ||
      this.boxList.length <= 0
      ? 'checkbox-disable'
      : ''
  }

  get totalItem() {
    return getTotalQuantityLabel(this.totalBoxRecords, 'result', '<%= quantity%> found')
  }

  // -- [ Functions ] ------------------------------------------------------------
  getParamAPi() {
    return {
      pageNumber: this.paging.pageNumber, pageSize: this.paging.pageSize,
      'sellerEmail': this.filter.sellerEmail || null,
      'barCode': this.filter.barCode || null,
      'warehouseId': this.warehouseSelected?.id,
      'locationName': this.filter.location || null,
      'from': this.filter.dateFrom ? dayjs(new Date(this.filter.dateFrom)).format('YYYY-MM-DD') : null,
      'to': this.filter.dateTo ? dayjs(new Date(this.filter.dateTo)).format('YYYY-MM-DD') : null,
      'sortBy': this.sortByColumn || null,
      'desc': this.isDescending
    }
  }

  async handleFilterBox(e: any, name: string){
    this.filter[name] = e
    await this.actGetBoxList(this.getParamAPi())
    this.selectedBoxes = []
  }

  async onPage(event: any) {
    resetScrollTable()
    this.paging.pageSize = event.rows
    this.paging.pageNumber = event.page
    await this.actGetBoxList(this.getParamAPi())
  }

  async handleDeleteStock() {
    const ids = _.map(this.onEventDeleteList, 'id')
    const result = await this.actDeleteBoxById({ ids })
    if(result) {
      this.isModalDelete = false
      this.selectedBoxes = []
      this.$toast.add({
        severity: 'success',
        summary: 'Success Message',
        detail: 'Successfully deleted box',
        life: 3000
      })
      this.paging.first = 0
      this.paging.pageNumber = 0
      await this.actGetBoxList({ pageNumber: this.paging.pageNumber , pageSize: this.paging.pageSize })
    }
  }

  handleCancel() {
    this.isModalDelete = false
  }

  showModalDelete(data?: any) {
    this.onEventDeleteList = data || this.selectedBoxFilter
    this.isModalDelete = true
  }

  rowClass({ status }) {
    if(status === 'BOX_STATUS_DISABLE' || status === 'BOX_STATUS_OUTGOING') {
      return 'row-disable'
    }
  }

  validateText =  _.debounce(this.handleFilter, 500);

  async sortData(e: any) {
    resetScrollTable()
    const { sortField, sortOrder } = e
    if(sortOrder){
      this.isDescending = sortOrder !== 1
      this.sortByColumn = sortField.replace('_', '')
    }else{
      this.isDescending = null
      this.sortByColumn = ''
    }
    await this.actGetBoxList(this.getParamAPi())
  }

  handleEditBox(id: any) {
    this.$router.push({ path: `/box/${id}`, query: { plan: 'edit' } })
  }

  async handleFilter() {
    await this.actGetBoxList(this.getParamAPi())
    this.selectedBoxes = []
  }

  async handleRefeshFilter() {
    this.filter.location = ''
    this.filter.sellerEmail = ''
    this.filter.barCode = ''
    this.filter.dateFrom = null
    this.filter.dateTo = null
    await this.actGetBoxList(this.getParamAPi())
  }

  rowSelectAll({ data }) {
    this.selectedBoxes = _.unionWith(this.selectedBoxes, data, _.isEqual)
  }

  rowUnSelectAll() {
    this.selectedBoxes = _.differenceWith(this.selectedBoxes, this.boxList, _.isEqual)
  }

  rowSelect({ data }) {
    this.selectedBoxes.push(data)
  }

  rowUnselect({ originalEvent, data }) {
    originalEvent.originalEvent.stopPropagation()
    this.selectedBoxes = _.filter(this.selectedBoxes, (box: Box.Model) => box.id !== data.id)
  }

  routeLinkAddBox() {
    this.$router.push({ path: '/stock-in/create-receipt' })
  }

  handleTransferBox() {
    const selectedBox = [...this.selectedBoxFilter]
    if(!_.size(selectedBox)) return
    const firstSelect = selectedBox[0]
    const satisfyBox =_.filter(selectedBox, ({ status, sellerEmail  }) => {
      return sellerEmail && status === 'BOX_STATUS_AVAILABLE' && sellerEmail === firstSelect.sellerEmail
    })
    if(_.size(selectedBox) === _.size(satisfyBox)) {
      this.actAddTransferBox(_.map(satisfyBox, 'id'))
      this.$router.push({ path: '/box/transferring' })
    } else {
      this.$toast.add({
        severity: 'error',
        summary: 'Error Message',
        detail: 'Boxes of diffrent sellers can not be transferred',
        life: 3000
      })
    }
  }
}
export default BoxList
</script>

<style lang="sass" scoped>
.box-page-container
  @include mobile
    min-height: calc(100vh - 32px)
  @include tablet
    min-height: calc(100vh - 32px)
  @include desktop
    height: calc(100vh - 32px)
  ::v-deep.p-component
    font-family: $font-family-primary
  ::v-deep.pi-calendar:before
    content: url('~/assets/icons/calendar.svg')
  ::v-deep.p-calendar-w-btn
    .p-button
      background: none
      border: none
  ::v-deep.text-right
    text-align: right !important
    .p-column-header-content
      justify-content: end !important
  ::v-deep.disable-button
    pointer-events: none
    background-color: $text-color-300
    .icon
      background-color: $text-color-500
.box__header
  flex-direction: column
  flex-wrap: wrap
  margin-bottom: 16px
  @include desktop
    flex-direction: row
    @include flex-center-space-between
.header__action
    margin-top: 12px
    display: flex
    @include flex-column
    flex-wrap:  wrap
    gap: 10px 16px
    @include desktop
      @include flex-center
      flex-direction: row
      margin-top: 0
    .btn__filter
      .btn-refresh
        border-top-left-radius: 0 !important
        border-bottom-left-radius: 0 !important
        border: none
</style>
